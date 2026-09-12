import { Check, Circle, PencilLine, X } from "lucide-react";

import { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { createVoteCorrection } from "../../api/corrections";

import { Button } from "../../components/ui/Button";

import type { Candidate } from "../../types/candidates";

import type { SuperAdminVote } from "../../types/corrections";

import type { Election } from "../../types/elections";

export function VoteCorrectionDialog({
  vote,
  election,
  candidates,
  onClose,
  onCorrected,
}: {
  vote: SuperAdminVote;

  election: Election;

  candidates: Candidate[];

  onClose: () => void;

  onCorrected: () => Promise<void>;
}) {
  const { t } = useTranslation();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    vote.effective_candidate_ids,
  );

  const [blankBallot, setBlankBallot] = useState(vote.effective_is_blank);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableCandidates = useMemo(
    () =>
      [...candidates]
        .filter((candidate) => candidate.is_active)
        .sort(
          (first, second) =>
            first.display_order - second.display_order ||
            first.candidate_number - second.candidate_number,
        ),
    [candidates],
  );

  const minimum = election.voting_rules.min_selections;

  const maximum = election.voting_rules.max_selections;

  const blankAllowed = election.voting_rules.allow_blank_ballot;

  function toggleCandidate(candidateId: string) {
    setErrorMessage(null);

    if (blankBallot) {
      setBlankBallot(false);
    }

    setSelectedIds((current) => {
      if (current.includes(candidateId)) {
        return current.filter((id) => id !== candidateId);
      }

      if (current.length >= maximum) {
        setErrorMessage(
          t("corrections.maximumSelections", {
            count: maximum,
          }),
        );

        return current;
      }

      return [...current, candidateId];
    });
  }

  function chooseBlank() {
    if (!blankAllowed) {
      return;
    }

    setBlankBallot(true);

    setSelectedIds([]);

    setErrorMessage(null);
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    if (!blankBallot && selectedIds.length < minimum) {
      setErrorMessage(
        t("corrections.minimumSelections", {
          count: minimum,
        }),
      );

      return;
    }

    if (!blankBallot && selectedIds.length > maximum) {
      setErrorMessage(
        t("corrections.maximumSelections", {
          count: maximum,
        }),
      );

      return;
    }

    const sameBlank = blankBallot === vote.effective_is_blank;

    const sameCandidates = sameCandidateSet(
      selectedIds,
      vote.effective_candidate_ids,
    );

    if (sameBlank && sameCandidates) {
      setErrorMessage(t("corrections.noChange"));

      return;
    }

    const confirmed = window.confirm(t("corrections.confirmCorrection"));

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      await createVoteCorrection(vote.vote_id, {
        candidate_ids: blankBallot ? [] : selectedIds,
      });

      await onCorrected();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("corrections.saveError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="correction-dialog correction-dialog-simple"
        role="dialog"
        aria-modal="true"
      >
        <div className="correction-dialog-header">
          <div className="correction-dialog-title">
            <div className="correction-dialog-icon correction-edit-icon">
              <PencilLine size={19} />
            </div>

            <div>
              <h2>{t("corrections.editVote")}</h2>

              <p>{vote.vote_id}</p>
            </div>
          </div>

          <button
            type="button"
            className="icon-action"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X size={16} />
          </button>
        </div>

        <div className="correction-dialog-body">
          <div className="current-vote-summary">
            <span>{t("corrections.currentSelection")}</span>

            <div>
              {vote.effective_is_blank ? (
                <strong>{t("corrections.blankBallot")}</strong>
              ) : (
                vote.effective_candidate_ids.map((candidateId) => (
                  <span className="ballot-chip" key={candidateId}>
                    {candidateLabel(candidateId, candidates)}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="correction-section-heading">
            <div>
              <h3>{t("corrections.changeSelection")}</h3>

              <p>
                {minimum === maximum
                  ? t("corrections.selectExact", {
                      count: minimum,
                    })
                  : t("corrections.selectRange", {
                      min: minimum,

                      max: maximum,
                    })}
              </p>
            </div>

            <span className="correction-selection-counter">
              {selectedIds.length}
              {" / "}
              {maximum}
            </span>
          </div>

          <div className="correction-candidate-grid">
            {availableCandidates.map((candidate) => {
              const selected = selectedIds.includes(candidate.id);

              return (
                <button
                  key={candidate.id}
                  type="button"
                  className={
                    selected
                      ? "correction-candidate selected"
                      : "correction-candidate"
                  }
                  onClick={() => toggleCandidate(candidate.id)}
                >
                  <span className="correction-candidate-check">
                    {selected ? <Check size={15} /> : <Circle size={15} />}
                  </span>

                  <div>
                    <span>
                      {t("corrections.candidateNumber", {
                        number: candidate.candidate_number,
                      })}
                    </span>

                    <strong>{candidateName(candidate)}</strong>

                    {candidate.from && <small>{candidate.from}</small>}
                  </div>
                </button>
              );
            })}
          </div>

          {blankAllowed && (
            <button
              type="button"
              className={
                blankBallot ? "correction-blank selected" : "correction-blank"
              }
              onClick={chooseBlank}
            >
              {blankBallot ? <Check size={16} /> : <Circle size={16} />}

              <div>
                <strong>{t("corrections.blankBallot")}</strong>

                <span>{t("corrections.blankBallotDescription")}</span>
              </div>
            </button>
          )}

          {errorMessage && (
            <div
              className="alert alert-error correction-form-error"
              role="alert"
            >
              {errorMessage}
            </div>
          )}
        </div>

        <div className="correction-dialog-footer">
          <Button variant="secondary" type="button" onClick={onClose}>
            {t("common.cancel")}
          </Button>

          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit()}
          >
            <Check size={16} />

            {isSubmitting
              ? t("corrections.saving")
              : t("corrections.saveChange")}
          </Button>
        </div>
      </section>
    </div>
  );
}

function candidateLabel(candidateId: string, candidates: Candidate[]) {
  const candidate = candidates.find((item) => item.id === candidateId);

  if (!candidate) {
    return candidateId;
  }

  return `#${candidate.candidate_number} ${candidateName(candidate)}`;
}

function candidateName(candidate: Candidate) {
  return [candidate.title, candidate.first_name, candidate.last_name]
    .filter(Boolean)
    .join(" ");
}

function sameCandidateSet(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  const left = [...first].sort();

  const right = [...second].sort();

  return left.every((candidateId, index) => candidateId === right[index]);
}

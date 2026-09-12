import { ArrowLeft, Check, CheckCircle2, Circle, Vote } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import {
  getPublicCandidates,
  getPublicElection,
  getPublicVoteStatus,
  initializePublicDevice,
  submitPublicVote,
} from "../../api/public";

import { EmptyState } from "../../components/ui/EmptyState";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type {
  PublicCandidate,
  PublicElection,
  PublicVoteStatus,
} from "../../types/public";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

export function VotingPage() {
  const { electionId } = useParams();

  const { t, i18n } = useTranslation();

  const [election, setElection] = useState<PublicElection | null>(null);

  const [candidates, setCandidates] = useState<PublicCandidate[]>([]);

  const [voteStatus, setVoteStatus] = useState<PublicVoteStatus | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [blankBallot, setBlankBallot] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!electionId) {
        setErrorMessage(t("publicVoting.missingElectionId"));

        setIsLoading(false);

        return;
      }

      try {
        await initializePublicDevice();

        const [electionResponse, candidateResponse, voteStatusResponse] =
          await Promise.all([
            getPublicElection(electionId),

            getPublicCandidates(electionId),

            getPublicVoteStatus(electionId),
          ]);

        if (!active) {
          return;
        }

        setElection(electionResponse);

        setCandidates(candidateResponse);

        setVoteStatus(voteStatusResponse);

        setErrorMessage(null);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : t("publicVoting.loadError"),
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [electionId, t]);

  const maxSelections = election?.voting_rules.max_selections ?? 0;

  const minSelections = election?.voting_rules.min_selections ?? 0;

  const canSubmit = useMemo(() => {
    if (!election || election.status !== "live" || isSubmitting) {
      return false;
    }

    if (blankBallot) {
      return Boolean(election.voting_rules.allow_blank_ballot);
    }

    return (
      selectedIds.length >= minSelections && selectedIds.length <= maxSelections
    );
  }, [
    election,
    selectedIds.length,
    blankBallot,
    minSelections,
    maxSelections,
    isSubmitting,
  ]);

  function toggleCandidate(candidateId: string) {
    if (blankBallot) {
      setBlankBallot(false);
    }

    setSelectedIds((current) => {
      if (current.includes(candidateId)) {
        return current.filter((id) => id !== candidateId);
      }

      if (current.length >= maxSelections) {
        setErrorMessage(
          t("publicVoting.maximumSelectionError", {
            count: maxSelections,
          }),
        );

        return current;
      }

      setErrorMessage(null);

      return [...current, candidateId];
    });
  }

  function toggleBlankBallot() {
    if (!election?.voting_rules.allow_blank_ballot) {
      return;
    }

    setBlankBallot((current) => {
      const next = !current;

      if (next) {
        setSelectedIds([]);
      }

      return next;
    });

    setErrorMessage(null);
  }

  async function handleSubmit() {
    if (!election || !electionId || !canSubmit) {
      return;
    }

    const confirmed = window.confirm(
      blankBallot
        ? t("publicVoting.confirmBlankMessage")
        : t("publicVoting.confirmMessage"),
    );

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    setErrorMessage(null);

    try {
      await submitPublicVote(electionId, {
        candidate_ids: blankBallot ? [] : selectedIds,

        is_blank: blankBallot,
      });

      setSuccess(true);

      const status = await getPublicVoteStatus(electionId);

      setVoteStatus(status);
    } catch (error) {
      /*
       * A 409 may mean duplicate device OR that
       * election state changed while this page
       * was open. Verify vote-status first.
       */
      if (error instanceof ApiError && error.status === 409) {
        try {
          const status = await getPublicVoteStatus(electionId);

          setVoteStatus(status);

          if (status.has_voted) {
            setErrorMessage(t("publicVoting.alreadyVoted"));

            return;
          }

          const refreshed = await getPublicElection(electionId);

          setElection(refreshed);

          if (refreshed.status !== "live") {
            setErrorMessage(t("publicVoting.electionClosed"));

            return;
          }
        } catch {
          // Continue to the original error below.
        }
      }

      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : t("publicVoting.submitError"),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="public-voting-loading">{t("publicVoting.preparing")}</div>
    );
  }

  if (!election) {
    return (
      <EmptyState
        title={t("publicVoting.unavailable")}
        description={errorMessage || t("publicVoting.electionNotFound")}
        action={
          <Link to="/" className="ui-button ui-button-secondary ui-button-md">
            <ArrowLeft size={16} />

            {t("publicVoting.backHome")}
          </Link>
        }
      />
    );
  }

  if (success || voteStatus?.has_voted) {
    return (
      <VoteCompleted
        election={election}
        submittedAt={voteStatus?.submitted_at}
        language={language}
        success={success}
      />
    );
  }

  return (
    <div className="voting-page">
      <Link to="/" className="public-back-link">
        <ArrowLeft size={15} />

        {t("publicVoting.backHome")}
      </Link>

      <section className="voting-heading">
        <div>
          <div className="voting-status-line">
            <StatusBadge
              tone={election.status === "live" ? "success" : "neutral"}
            >
              {election.status === "live" ? t("common.live") : election.status}
            </StatusBadge>

            <span>{t("publicVoting.liveElection")}</span>
          </div>

          <h1>{election.title}</h1>

          {election.description && <p>{election.description}</p>}
        </div>
      </section>

      <div className="voting-rules-banner">
        <Vote size={20} />

        <div>
          <strong>{t("publicVoting.votingRules")}</strong>

          <span>
            {formatVotingInstruction(minSelections, maxSelections, t)}

            {election.voting_rules.allow_blank_ballot &&
              ` • ${t("publicVoting.blankAllowed")}`}
          </span>
        </div>

        <div className="selection-counter">
          <strong>{selectedIds.length}</strong>

          <span>/{maxSelections}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="alert alert-error voting-message" role="alert">
          {errorMessage}
        </div>
      )}

      {candidates.length === 0 ? (
        <EmptyState title={t("publicVoting.noCandidates")} />
      ) : (
        <div className="voting-candidate-grid">
          {candidates.map((candidate) => (
            <CandidateChoice
              key={candidate.id}
              candidate={candidate}
              selected={selectedIds.includes(candidate.id)}
              onClick={() => toggleCandidate(candidate.id)}
            />
          ))}
        </div>
      )}

      {election.voting_rules.allow_blank_ballot && (
        <button
          type="button"
          className={
            blankBallot ? "blank-ballot-option selected" : "blank-ballot-option"
          }
          onClick={toggleBlankBallot}
        >
          <span className="blank-ballot-check">
            {blankBallot ? <Check size={17} /> : <Circle size={17} />}
          </span>

          <div>
            <strong>{t("publicVoting.submitBlankBallot")}</strong>

            <span>{t("publicVoting.blankDescription")}</span>
          </div>
        </button>
      )}

      <div className="voting-submit-bar">
        <div>
          <strong>
            {t("publicVoting.selectedCount", {
              count: selectedIds.length,
            })}
          </strong>

          <span>{t("publicVoting.reviewBeforeSubmit")}</span>
        </div>

        <button
          type="button"
          className="public-submit-vote"
          disabled={!canSubmit}
          onClick={() => void handleSubmit()}
        >
          <Vote size={17} />

          {isSubmitting
            ? t("publicVoting.submitting")
            : t("publicVoting.submitVote")}
        </button>
      </div>
    </div>
  );
}

function CandidateChoice({
  candidate,
  selected,
  onClick,
}: {
  candidate: PublicCandidate;

  selected: boolean;

  onClick: () => void;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className={
        selected ? "voting-candidate-card selected" : "voting-candidate-card"
      }
      onClick={onClick}
    >
      <div className="voting-candidate-image">
        {candidate.image_url ? (
          <img src={candidate.image_url} alt={candidateName(candidate)} />
        ) : (
          <span>{candidate.candidate_number}</span>
        )}

        <span className="candidate-selection-indicator">
          {selected ? <Check size={17} /> : <Circle size={17} />}
        </span>
      </div>

      <div className="voting-candidate-content">
        <span className="candidate-number">
          {t("publicVoting.candidateNumber", {
            number: candidate.candidate_number,
          })}
        </span>

        <h3>{candidateName(candidate)}</h3>

        {candidate.from && <strong>{candidate.from}</strong>}

        {candidate.description && <p>{candidate.description}</p>}
      </div>
    </button>
  );
}

function VoteCompleted({
  election,
  submittedAt,
  language,
  success,
}: {
  election: PublicElection;

  submittedAt?: string | null;

  language: "km" | "en";

  success: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="vote-completed-page">
      <div className="vote-success-icon">
        <CheckCircle2 size={34} />
      </div>

      <span className="page-eyebrow">{t("publicVoting.votingStatus")}</span>

      <h1>
        {success ? t("publicVoting.thankYou") : t("publicVoting.alreadyVoted")}
      </h1>

      <p>
        {success
          ? t("publicVoting.successMessage")
          : t("publicVoting.alreadyVotedMessage")}
      </p>

      <div className="vote-success-election">
        <strong>{election.title}</strong>

        {submittedAt && (
          <span>
            {t("publicVoting.submittedAt", {
              date: formatDateTime(submittedAt, language),
            })}
          </span>
        )}
      </div>

      <Link to="/" className="ui-button ui-button-primary ui-button-md">
        {t("publicVoting.backHome")}
      </Link>
    </div>
  );
}

function candidateName(candidate: PublicCandidate) {
  return [candidate.title, candidate.first_name, candidate.last_name]
    .filter(Boolean)
    .join(" ");
}

function formatVotingInstruction(
  minimum: number,
  maximum: number,
  t: ReturnType<typeof useTranslation>["t"],
) {
  if (minimum === maximum) {
    return t("publicVoting.selectExact", {
      count: minimum,
    });
  }

  return t("publicVoting.selectRange", {
    min: minimum,

    max: maximum,
  });
}

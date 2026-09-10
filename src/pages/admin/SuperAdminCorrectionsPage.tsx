import { PencilLine, Search } from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { getCandidates } from "../../api/candidates";

import { getSuperAdminVotes } from "../../api/corrections";

import { getElections } from "../../api/elections";

import { Card, CardBody } from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";

import { EmptyState } from "../../components/ui/EmptyState";

import { PageHeader } from "../../components/ui/PageHeader";

import { VoteCorrectionDialog } from "../../features/corrections/VoteCorrectionDialog";

import type { Candidate } from "../../types/candidates";

import type { SuperAdminVote } from "../../types/corrections";

import type { Election } from "../../types/elections";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

export function SuperAdminCorrectionsPage() {
  const { t, i18n } = useTranslation();

  const [elections, setElections] = useState<Election[]>([]);

  const [selectedElectionId, setSelectedElectionId] = useState("");

  const [votes, setVotes] = useState<SuperAdminVote[]>([]);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [search, setSearch] = useState("");

  const [isLoadingElections, setIsLoadingElections] = useState(true);

  const [isLoadingVotes, setIsLoadingVotes] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingVote, setEditingVote] = useState<SuperAdminVote | null>(null);

  const language = normalizeLanguage(i18n.language);

  const selectedElection = useMemo(
    () =>
      elections.find((election) => election.id === selectedElectionId) ?? null,
    [elections, selectedElectionId],
  );

  useEffect(() => {
    let active = true;

    async function loadElections() {
      try {
        const response = await getElections({
          page: 1,
          perPage: 100,
          status: "live",
        });

        if (!active) {
          return;
        }

        setElections(response.items);

        if (response.items.length > 0) {
          setSelectedElectionId((current) => current || response.items[0].id);
        }
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : t("corrections.loadElectionsError"),
        );
      } finally {
        if (active) {
          setIsLoadingElections(false);
        }
      }
    }

    void loadElections();

    return () => {
      active = false;
    };
  }, [t]);

  const loadVotes = useCallback(async () => {
    if (!selectedElectionId) {
      setVotes([]);

      setCandidates([]);

      return;
    }

    setIsLoadingVotes(true);

    setErrorMessage(null);

    try {
      const [voteResponse, candidateResponse] = await Promise.all([
        getSuperAdminVotes(selectedElectionId),

        getCandidates(selectedElectionId),
      ]);

      setVotes(voteResponse);

      setCandidates(candidateResponse.items);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : t("corrections.loadVotesError"),
      );
    } finally {
      setIsLoadingVotes(false);
    }
  }, [selectedElectionId, t]);

  useEffect(() => {
    void loadVotes();
  }, [loadVotes]);

  const filteredVotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return votes;
    }

    return votes.filter((vote) => vote.vote_id.toLowerCase().includes(query));
  }, [votes, search]);

  async function handleCorrected() {
    setEditingVote(null);

    setSuccessMessage(t("corrections.saveSuccess"));

    await loadVotes();
  }

  return (
    <div>
      <PageHeader
        eyebrow={t("corrections.superAdmin")}
        title={t("corrections.title")}
        description={t("corrections.description")}
      />

      {successMessage && (
        <div className="alert alert-success corrections-message" role="status">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error corrections-message" role="alert">
          {errorMessage}
        </div>
      )}

      <Card>
        <CardBody>
          <div className="correction-toolbar">
            <label className="correction-election-select">
              <span>{t("corrections.liveElection")}</span>

              <select
                value={selectedElectionId}
                disabled={isLoadingElections}
                onChange={(event) => {
                  setSelectedElectionId(event.target.value);

                  setSuccessMessage(null);
                }}
              >
                {elections.length === 0 && (
                  <option value="">{t("corrections.noLiveElections")}</option>
                )}

                {elections.map((election) => (
                  <option key={election.id} value={election.id}>
                    {election.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="correction-search">
              <Search size={15} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("corrections.searchVote")}
              />
            </div>

            <div className="correction-count">
              {t("corrections.voteCount", {
                count: filteredVotes.length,
              })}
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="corrections-table-section">
        {isLoadingElections || isLoadingVotes ? (
          <div className="corrections-loading">{t("corrections.loading")}</div>
        ) : !selectedElection ? (
          <EmptyState
            title={t("corrections.noLiveElections")}
            description={t("corrections.noLiveDescription")}
          />
        ) : filteredVotes.length === 0 ? (
          <EmptyState
            title={t("corrections.noVotes")}
            description={t("corrections.noVotesDescription")}
          />
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>{t("corrections.voteId")}</th>

                <th>{t("corrections.currentSelection")}</th>

                <th>{t("corrections.voteTime")}</th>

                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {filteredVotes.map((vote) => (
                <tr key={vote.vote_id}>
                  <td>
                    <code className="correction-vote-id">{vote.vote_id}</code>
                  </td>

                  <td>
                    <CurrentBallot vote={vote} candidates={candidates} />
                  </td>

                  <td>
                    <span className="correction-submitted">
                      {formatDateTime(vote.submitted_at, language)}
                    </span>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="admin-result-view-button"
                        onClick={() => setEditingVote(vote)}
                      >
                        <PencilLine size={14} />

                        {t("corrections.edit")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>

      {editingVote && selectedElection && (
        <VoteCorrectionDialog
          vote={editingVote}
          election={selectedElection}
          candidates={candidates}
          onClose={() => setEditingVote(null)}
          onCorrected={handleCorrected}
        />
      )}
    </div>
  );
}

function CurrentBallot({
  vote,
  candidates,
}: {
  vote: SuperAdminVote;

  candidates: Candidate[];
}) {
  const { t } = useTranslation();

  if (vote.effective_is_blank) {
    return (
      <div className="ballot-cell">
        <span className="ballot-chip">{t("corrections.blankBallot")}</span>
      </div>
    );
  }

  return (
    <div className="ballot-cell">
      {vote.effective_candidate_ids.map((candidateId) => (
        <span className="ballot-chip" key={candidateId}>
          {candidateLabel(candidateId, candidates)}
        </span>
      ))}
    </div>
  );
}

function candidateLabel(candidateId: string, candidates: Candidate[]) {
  const candidate = candidates.find((item) => item.id === candidateId);

  if (!candidate) {
    return candidateId.slice(0, 8);
  }

  return `#${candidate.candidate_number} ${[
    candidate.title,
    candidate.first_name,
    candidate.last_name,
  ]
    .filter(Boolean)
    .join(" ")}`;
}

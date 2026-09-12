import {
  ArrowLeft,
  BarChart3,
  RefreshCw,
  Trophy,
  Users,
  Vote,
} from "lucide-react";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import type { TFunction } from "i18next";

import { ApiError } from "../../api/client";

import { getPublicResults } from "../../api/results";

import { EmptyState } from "../../components/ui/EmptyState";

import { StatCard } from "../../components/ui/StatCard";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { CandidateResult, ElectionResult } from "../../types/results";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import { electionStatusTone, formatElectionStatus } from "../../utils/election";

export function ResultsPage() {
  const { electionId } = useParams();

  const { t, i18n } = useTranslation();

  const [result, setResult] = useState<ElectionResult | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  const loadResults = useCallback(
    async (initial = false) => {
      if (!electionId) {
        setErrorMessage(t("publicResults.missingElectionId"));

        setIsLoading(false);

        return;
      }

      if (!initial) {
        setIsRefreshing(true);
      }

      try {
        const response = await getPublicResults(electionId);

        setResult(response);

        setUnavailableMessage(null);

        setErrorMessage(null);
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.status === 403) {
            setUnavailableMessage(translateResultError(error, t));

            setResult(null);

            setErrorMessage(null);
          } else if (error.status === 404) {
            setErrorMessage(t("publicResults.electionNotFound"));
          } else {
            setErrorMessage(translateResultError(error, t));
          }
        } else {
          setErrorMessage(t("publicResults.loadError"));
        }
      } finally {
        if (initial) {
          setIsLoading(false);
        }

        setIsRefreshing(false);
      }
    },
    [electionId, t],
  );

  useEffect(() => {
    void loadResults(true);
  }, [loadResults]);

  /*
   * Live public results refresh every
   * five seconds.
   */
  useEffect(() => {
    if (result?.status !== "live" || result.result_visibility !== "live") {
      return;
    }

    const interval = window.setInterval(
      () => {
        void loadResults();
      },
      3 * 60 * 1000,
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [result?.status, result?.result_visibility, loadResults]);

  const leader = useMemo(() => {
    if (!result || result.candidates.length === 0) {
      return null;
    }

    return result.candidates[0];
  }, [result]);

  if (isLoading) {
    return (
      <div className="public-results-loading">{t("publicResults.loading")}</div>
    );
  }

  if (unavailableMessage) {
    return <ResultsUnavailable message={unavailableMessage} />;
  }

  if (errorMessage || !result) {
    return (
      <EmptyState
        title={t("publicResults.unavailable")}
        description={errorMessage || t("publicResults.displayError")}
        action={
          <Link to="/" className="ui-button ui-button-secondary ui-button-md">
            <ArrowLeft size={16} />

            {t("publicResults.backHome")}
          </Link>
        }
      />
    );
  }

  return (
    <div className="public-results-page">
      <Link to="/" className="public-back-link">
        <ArrowLeft size={15} />

        {t("publicResults.backElections")}
      </Link>

      <div className="public-results-heading">
        <div>
          <span className="page-eyebrow">{t("publicResults.title")}</span>

          <h1>{result.title}</h1>

          <div className="public-results-meta">
            <StatusBadge tone={electionStatusTone(result.status)}>
              {formatElectionStatus(result.status, t)}
            </StatusBadge>

            {result.status === "live" &&
              result.result_visibility === "live" && (
                <span className="live-results-indicator">
                  <span />

                  {t("publicResults.liveResults")}
                </span>
              )}
          </div>
        </div>

        <div className="public-results-refresh">
          <span>
            {t("publicResults.updatedAt", {
              date: formatDateTime(result.calculated_at, language),
            })}
          </span>

          <button
            type="button"
            className="ui-button ui-button-secondary ui-button-sm"
            onClick={() => void loadResults(false)}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} />

            {isRefreshing
              ? t("publicResults.refreshing")
              : t("publicResults.refresh")}
          </button>
        </div>
      </div>

      <div className="stat-grid public-result-stats">
        <StatCard
          label={t("publicResults.turnout")}
          value={`${result.turnout_percentage}%`}
          detail={t("publicResults.turnoutDetail", {
            ballots: result.total_ballots,

            expected: result.expected_voters,
          })}
          icon={<Users size={18} />}
        />

        <StatCard
          label={t("publicResults.ballotsCast")}
          value={result.total_ballots}
          detail={t("publicResults.nonBlankDetail", {
            count: result.non_blank_ballots,
          })}
          icon={<Vote size={18} />}
        />

        <StatCard
          label={t("publicResults.blankBallots")}
          value={result.blank_ballots}
          detail={t("publicResults.blankDetail")}
          icon={<BarChart3 size={18} />}
        />

        <StatCard
          label={t("publicResults.candidateSelections")}
          value={result.total_candidate_selections}
          detail={t("publicResults.selectionDetail")}
          icon={<CheckIcon />}
        />
      </div>

      {leader && result.total_ballots > 0 && (
        <section className="result-leader-card">
          <div className="result-leader-icon">
            <Trophy size={24} />
          </div>

          <div className="result-leader-copy">
            <span>{t("publicResults.currentLeader")}</span>

            <h2>{candidateName(leader)}</h2>

            {leader.from && <p>{leader.from}</p>}
          </div>

          <div className="leader-votes">
            <strong>{leader.vote_count}</strong>

            <span>
              {t("publicResults.voteCount", {
                count: leader.vote_count,
              })}
            </span>
          </div>
        </section>
      )}

      <section className="results-ranking-section">
        <div className="public-section-heading">
          <div>
            <span>{t("publicResults.ranking")}</span>

            <h2>{t("publicResults.candidateResults")}</h2>
          </div>

          <span className="public-election-count">
            {t("publicResults.candidateCount", {
              count: result.candidates.length,
            })}
          </span>
        </div>

        {result.candidates.length === 0 ? (
          <EmptyState title={t("publicResults.noCandidates")} />
        ) : (
          <div className="result-list">
            {result.candidates.map((candidate, index) => (
              <CandidateResultRow
                key={candidate.candidate_id}
                candidate={candidate}
                rank={index + 1}
                totalBallots={result.total_ballots}
              />
            ))}
          </div>
        )}
      </section>

      <section className="percentage-explanation">
        <h3>{t("publicResults.aboutPercentages")}</h3>

        <p>
          <strong>{t("publicResults.ballotPercentage")}</strong>{" "}
          {t("publicResults.ballotPercentageExplanation")}
        </p>

        <p>
          <strong>{t("publicResults.selectionPercentage")}</strong>{" "}
          {t("publicResults.selectionPercentageExplanation")}
        </p>

        <p className="result-muted-note">
          {t("publicResults.multipleSelectionNote")}
        </p>
      </section>
    </div>
  );
}

function CandidateResultRow({
  candidate,
  rank,
  totalBallots,
}: {
  candidate: CandidateResult;

  rank: number;

  totalBallots: number;
}) {
  const { t } = useTranslation();

  return (
    <article className="candidate-result-row">
      <div className="result-rank">{rank}</div>

      <div className="result-candidate-info">
        <span>
          {t("publicResults.candidateNumber", {
            number: candidate.candidate_number,
          })}
        </span>

        <h3>{candidateName(candidate)}</h3>

        {candidate.from && <p>{candidate.from}</p>}
      </div>

      <div className="result-progress-area">
        <div className="result-progress-labels">
          <span>{t("publicResults.ballotPercentageShort")}</span>

          <strong>{candidate.ballot_percentage}%</strong>
        </div>

        <div className="result-progress-track">
          <div
            className="result-progress-value"
            style={{
              width: `${Math.min(candidate.ballot_percentage, 100)}%`,
            }}
          />
        </div>

        <div className="selection-percentage">
          {t("publicResults.selectionShare")}:{" "}
          <strong>{candidate.selection_percentage}%</strong>
        </div>
      </div>

      <div className="result-vote-count">
        <strong>{candidate.vote_count}</strong>

        <span>
          {t("publicResults.voteCount", {
            count: candidate.vote_count,
          })}
        </span>

        {totalBallots > 0 && (
          <small>
            {t("publicResults.ofBallots", {
              count: totalBallots,
            })}
          </small>
        )}
      </div>
    </article>
  );
}

function ResultsUnavailable({ message }: { message: string }) {
  const { t } = useTranslation();

  return (
    <div className="results-unavailable">
      <BarChart3 size={34} />

      <span className="page-eyebrow">{t("publicResults.title")}</span>

      <h1>{t("publicResults.notAvailableYet")}</h1>

      <p>{message}</p>

      <Link to="/" className="ui-button ui-button-secondary ui-button-md">
        {t("publicResults.backHome")}
      </Link>
    </div>
  );
}

function candidateName(candidate: {
  title: string | null;

  first_name: string;

  last_name: string;
}) {
  return [candidate.title, candidate.first_name, candidate.last_name]
    .filter(Boolean)
    .join(" ");
}

function translateResultError(error: ApiError, t: TFunction) {
  const message = error.message.toLowerCase();

  if (
    message.includes("not available") ||
    message.includes("not visible") ||
    message.includes("hidden")
  ) {
    return t("publicResults.notPublicYet");
  }

  if (message.includes("not found")) {
    return t("publicResults.electionNotFound");
  }

  return error.message;
}

function CheckIcon() {
  return <BarChart3 size={18} />;
}

import {
  ArrowLeft,
  BarChart3,
  Download,
  FileJson,
  FileSpreadsheet,
  FileText,
  Users,
  Vote,
} from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import {
  exportElectionResultsExcel,
  exportRawVotesJson,
  getAdminResults,
} from "../../api/results";

import { useAuth } from "../../auth/useAuth";

import { Button, ButtonLink } from "../../components/ui/Button";

import { EmptyState } from "../../components/ui/EmptyState";

import { PageHeader } from "../../components/ui/PageHeader";

import { StatCard } from "../../components/ui/StatCard";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { CandidateResult, ElectionResult } from "../../types/results";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import { saveBlob } from "../../utils/download";

import { electionStatusTone, formatElectionStatus } from "../../utils/election";

import {
  RESULTS_REFRESH_INTERVAL,
  getNextResultsRefreshDelay,
} from "../../utils/resultRefresh";

type ExportType = "excel" | "pdf" | "json" | null;

const ADMIN_RESULT_CACHE_PREFIX = "casa-admin-election-result";

interface CachedAdminResult {
  fetchedAt: number;
  result: ElectionResult;
}

function getAdminResultCacheKey(electionId: string) {
  return `${ADMIN_RESULT_CACHE_PREFIX}:` + electionId;
}

function readAdminResultCache(electionId: string): CachedAdminResult | null {
  try {
    const raw = sessionStorage.getItem(getAdminResultCacheKey(electionId));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as CachedAdminResult;

    if (!parsed || typeof parsed.fetchedAt !== "number" || !parsed.result) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveAdminResultCache(electionId: string, result: ElectionResult) {
  try {
    sessionStorage.setItem(
      getAdminResultCacheKey(electionId),
      JSON.stringify({
        fetchedAt: Date.now(),
        result,
      }),
    );
  } catch {
    // Ignore sessionStorage failure.
  }
}

/*
 * Cached result is valid only inside
 * the current synchronized 2-minute
 * refresh window.
 *
 * Example:
 *
 * 14:00:00 - 14:01:59
 * 14:02:00 - 14:03:59
 */
function isCacheCurrentWindow(fetchedAt: number) {
  const currentWindow = Math.floor(Date.now() / RESULTS_REFRESH_INTERVAL);

  const cachedWindow = Math.floor(fetchedAt / RESULTS_REFRESH_INTERVAL);

  return currentWindow === cachedWindow;
}

export function AdminElectionResultsPage() {
  const { electionId } = useParams();

  const { t, i18n } = useTranslation();

  const { hasPermission } = useAuth();

  const [result, setResult] = useState<ElectionResult | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [exporting, setExporting] = useState<ExportType>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  const canExport =
    result?.status === "closed" || result?.status === "archived";

  /*
   * Fetch latest admin result
   * directly from API.
   */
  const fetchLatestResults = useCallback(
    async (background = false) => {
      if (!electionId) {
        setErrorMessage(t("adminResults.missingElectionId"));

        setIsLoading(false);

        return;
      }

      const currentElectionId = electionId;

      try {
        const response = await getAdminResults(currentElectionId);

        setResult(response);

        saveAdminResultCache(currentElectionId, response);

        setErrorMessage(null);
      } catch (error) {
        if (!background) {
          setErrorMessage(
            error instanceof ApiError
              ? error.message
              : t("adminResults.loadResultError"),
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [electionId, t],
  );

  /*
   * INITIAL LOAD
   *
   * Browser F5 does not force a new
   * result request during the same
   * synchronized 2-minute window.
   */
  useEffect(() => {
    if (!electionId) {
      setErrorMessage(t("adminResults.missingElectionId"));

      setIsLoading(false);

      return;
    }

    const currentElectionId = electionId;

    const cached = readAdminResultCache(currentElectionId);

    if (cached && isCacheCurrentWindow(cached.fetchedAt)) {
      setResult(cached.result);

      setErrorMessage(null);

      setIsLoading(false);

      return;
    }

    void fetchLatestResults(false);
  }, [electionId, fetchLatestResults, t]);

  /*
   * SYNCHRONIZED ADMIN RESULT REFRESH
   *
   * Uses the exact same global
   * 2-minute boundaries as public:
   *
   * 14:00
   * 14:02
   * 14:04
   * 14:06
   *
   * Page opening time does not control
   * the automatic refresh schedule.
   */
  useEffect(() => {
    if (!electionId || result?.status !== "live") {
      return;
    }

    let firstTimer: number | undefined;

    let intervalTimer: number | undefined;

    let cancelled = false;

    async function refresh() {
      if (cancelled) {
        return;
      }

      await fetchLatestResults(true);
    }

    const delay = getNextResultsRefreshDelay();

    /*
     * First refresh waits for the
     * next global 2-minute boundary.
     */
    firstTimer = window.setTimeout(async () => {
      await refresh();

      if (cancelled) {
        return;
      }

      /*
       * Continue every 2 minutes
       * from that synchronized point.
       */
      intervalTimer = window.setInterval(() => {
        void refresh();
      }, RESULTS_REFRESH_INTERVAL);
    }, delay);

    return () => {
      cancelled = true;

      if (firstTimer !== undefined) {
        window.clearTimeout(firstTimer);
      }

      if (intervalTimer !== undefined) {
        window.clearInterval(intervalTimer);
      }
    };
  }, [electionId, result?.status, fetchLatestResults]);

  async function handleExport(type: "excel" | "pdf" | "json") {
    if (!electionId || exporting || !canExport) {
      return;
    }

    if (type === "pdf") {
      window.alert(t("adminResults.pdfUnderDevelopment"));

      return;
    }

    setExporting(type);

    setErrorMessage(null);

    try {
      const response =
        type === "excel"
          ? await exportElectionResultsExcel(electionId, language)
          : await exportRawVotesJson(electionId);

      const fallbackName =
        type === "excel"
          ? `election-results-${electionId}.xlsx`
          : `raw-votes-${electionId}.json`;

      saveBlob(response.blob, response.filename || fallbackName);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError
          ? error.message
          : t("adminResults.exportError"),
      );
    } finally {
      setExporting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="admin-results-loading">
        {t("adminResults.loadingResults")}
      </div>
    );
  }

  if (!result) {
    return (
      <EmptyState
        title={t("adminResults.resultsUnavailable")}
        description={errorMessage || t("adminResults.loadResultError")}
        action={
          <ButtonLink to="/admin/results" variant="secondary">
            <ArrowLeft size={16} />

            {t("adminResults.backResults")}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="admin-election-results-page">
      <PageHeader
        eyebrow={t("adminResults.electionResults")}
        title={result.title}
        description={t("adminResults.resultDescription")}
        actions={
          <ButtonLink to="/admin/results" variant="secondary">
            <ArrowLeft size={15} />

            {t("common.back")}
          </ButtonLink>
        }
      />

      {errorMessage && (
        <div className="alert alert-error admin-results-message" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="admin-result-status-row">
        <StatusBadge tone={electionStatusTone(result.status)}>
          {formatElectionStatus(result.status, t)}
        </StatusBadge>

        <span>
          {t("adminResults.calculatedAt", {
            date: formatDateTime(result.calculated_at, language),
          })}
        </span>
      </div>

      <div className="stat-grid admin-results-stat-grid">
        <StatCard
          label={t("adminResults.turnout")}
          value={`${result.turnout_percentage}%`}
          detail={t("adminResults.turnoutDetail", {
            ballots: result.total_ballots,

            expected: result.expected_voters,
          })}
          icon={<Users size={18} />}
        />

        <StatCard
          label={t("adminResults.totalBallots")}
          value={result.total_ballots}
          detail={t("adminResults.nonBlankBallots", {
            count: result.non_blank_ballots,
          })}
          icon={<Vote size={18} />}
        />

        <StatCard
          label={t("adminResults.blankBallots")}
          value={result.blank_ballots}
          detail={t("adminResults.blankBallotDetail")}
          icon={<BarChart3 size={18} />}
        />

        <StatCard
          label={t("adminResults.selections")}
          value={result.total_candidate_selections}
          detail={t("adminResults.selectionDetail")}
          icon={<BarChart3 size={18} />}
        />
      </div>

      {hasPermission("results.export") && (
        <section className="admin-result-export-card">
          <div className="admin-result-export-copy">
            <div className="admin-result-export-icon">
              <Download size={19} />
            </div>

            <div>
              <h2>{t("adminResults.exportTitle")}</h2>

              <p>{t("adminResults.exportDescription")}</p>

              {!canExport && (
                <p className="admin-result-export-note">
                  {t("adminResults.exportAfterClose")}
                </p>
              )}
            </div>
          </div>

          <div className="admin-result-export-actions">
            <Button
              type="button"
              variant="secondary"
              disabled={!canExport || exporting !== null}
              onClick={() => void handleExport("excel")}
            >
              <FileSpreadsheet size={16} />

              {exporting === "excel"
                ? t("adminResults.exporting")
                : t("adminResults.exportExcel")}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!canExport || exporting !== null}
              onClick={() => void handleExport("pdf")}
            >
              <FileText size={16} />

              {exporting === "pdf"
                ? t("adminResults.exporting")
                : t("adminResults.exportPdf")}
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!canExport || exporting !== null}
              onClick={() => void handleExport("json")}
            >
              <FileJson size={16} />

              {exporting === "json"
                ? t("adminResults.exporting")
                : t("adminResults.exportRawJson")}
            </Button>
          </div>
        </section>
      )}

      <section className="admin-ranking-section">
        <div className="admin-result-section-heading">
          <div>
            <span>{t("adminResults.ranking")}</span>

            <h2>{t("adminResults.candidateResults")}</h2>
          </div>

          <span>
            {t("adminResults.candidateCount", {
              count: result.candidates.length,
            })}
          </span>
        </div>

        {result.candidates.length === 0 ? (
          <EmptyState title={t("adminResults.noCandidateResults")} />
        ) : (
          <div className="admin-result-list">
            {result.candidates.map((candidate, index) => (
              <AdminCandidateResult
                key={candidate.candidate_id}
                candidate={candidate}
                rank={index + 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AdminCandidateResult({
  candidate,
  rank,
}: {
  candidate: CandidateResult;
  rank: number;
}) {
  const { t } = useTranslation();

  return (
    <article className="admin-candidate-result">
      <div className="admin-result-rank">{rank}</div>

      <div className="admin-result-candidate-main">
        <div className="admin-result-candidate-photo">
          {candidate.image_url ? (
            <img src={candidate.image_url} alt={candidateName(candidate)} />
          ) : (
            <span>{candidate.candidate_number}</span>
          )}
        </div>

        <div className="admin-result-candidate">
          <span>
            {t("adminResults.candidateNumber", {
              number: candidate.candidate_number,
            })}
          </span>

          <h3>{candidateName(candidate)}</h3>

          {candidate.from && <p>{candidate.from}</p>}
        </div>
      </div>

      <div className="admin-result-bar-area">
        <div className="admin-result-bar-heading">
          <span>{t("adminResults.ballotPercentage")}</span>

          <strong>{candidate.ballot_percentage}%</strong>
        </div>

        <div className="admin-result-bar">
          <div
            style={{
              width: `${Math.min(candidate.ballot_percentage, 100)}%`,
            }}
          />
        </div>

        <small>
          {t("adminResults.selectionPercentage", {
            percentage: candidate.selection_percentage,
          })}
        </small>
      </div>

      <div className="admin-result-votes">
        <strong>{candidate.vote_count}</strong>

        <span>{t("adminResults.votes")}</span>
      </div>
    </article>
  );
}

function candidateName(candidate: {
  title: string | null;
  first_name: string;
  last_name: string;
}) {
  return [candidate.title, candidate.last_name, candidate.first_name]
    .filter(Boolean)
    .join(" ");
}

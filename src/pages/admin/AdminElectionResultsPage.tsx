import {
  ArrowLeft,
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Users,
  Vote,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ApiError } from "../../api/client";
import {
  exportElectionResultsExcel,
  getAdminResults,
  exportRawVotesJson,
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

type ExportType = "excel" | "pdf" | "json" | null;

export function AdminElectionResultsPage() {
  const { electionId } = useParams();

  const { t, i18n } = useTranslation();

  const { hasPermission } = useAuth();

  const [result, setResult] = useState<ElectionResult | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [, setIsRefreshing] = useState(false);

  const [exporting, setExporting] = useState<ExportType>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  const loadResults = useCallback(
    async (initial = false) => {
      if (!electionId) {
        setErrorMessage(t("adminResults.missingElectionId"));

        setIsLoading(false);

        return;
      }

      if (!initial) {
        setIsRefreshing(true);
      }

      try {
        const response = await getAdminResults(electionId);

        setResult(response);

        setErrorMessage(null);
      } catch (error) {
        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : t("adminResults.loadResultError"),
        );
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

  async function handleExport(type: "excel" | "pdf" | "json") {
    if (!electionId || exporting) {
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
          <>
            <ButtonLink to="/admin/results" variant="secondary">
              <ArrowLeft size={15} />

              {t("common.back")}
            </ButtonLink>
          </>
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
            </div>
          </div>

          <div className="admin-result-export-actions">
            <Button
              variant="secondary"
              disabled={exporting !== null}
              onClick={() => void handleExport("excel")}
            >
              <FileSpreadsheet size={16} />

              {exporting === "excel"
                ? t("adminResults.exporting")
                : t("adminResults.exportExcel")}
            </Button>

            <Button
              variant="secondary"
              disabled={exporting !== null}
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
              onClick={() => void handleExport("json")}
              disabled={exporting !== null}
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

      <div className="admin-result-candidate">
        <span>
          {t("adminResults.candidateNumber", {
            number: candidate.candidate_number,
          })}
        </span>

        <h3>{candidateName(candidate)}</h3>

        {candidate.position && <p>{candidate.position}</p>}
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
  return [candidate.title, candidate.first_name, candidate.last_name]
    .filter(Boolean)
    .join(" ");
}

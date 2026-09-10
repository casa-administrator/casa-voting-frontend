import { Eye } from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { getElections } from "../../api/elections";

import { DataTable } from "../../components/ui/DataTable";

import { EmptyState } from "../../components/ui/EmptyState";

import { PageHeader } from "../../components/ui/PageHeader";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { Election } from "../../types/elections";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import {
  electionStatusTone,
  formatElectionStatus,
  formatResultVisibility,
} from "../../utils/election";

const RESULTS_REFRESH_INTERVAL = 3 * 60 * 1000;

export function AdminResultsPage() {
  const { t, i18n } = useTranslation();

  const [elections, setElections] = useState<Election[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    let active = true;

    async function load(showInitialLoading = false) {
      if (showInitialLoading) {
        setIsLoading(true);
      }

      try {
        const response = await getElections({
          page: 1,

          perPage: 100,
        });

        if (!active) {
          return;
        }

        setElections(response.items);

        setErrorMessage(null);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof ApiError
            ? error.message
            : t("adminResults.loadError"),
        );
      } finally {
        if (active && showInitialLoading) {
          setIsLoading(false);
        }
      }
    }

    /*
     * First page load:
     * fetch immediately.
     */
    void load(true);

    /*
     * Automatic refresh:
     * every 3 minutes.
     *
     * We do not show the loading screen
     * again during background refresh.
     */
    const intervalId = window.setInterval(() => {
      void load(false);
    }, RESULTS_REFRESH_INTERVAL);

    return () => {
      active = false;

      window.clearInterval(intervalId);
    };
  }, [t]);

  return (
    <div>
      <PageHeader
        eyebrow={t("adminResults.management")}
        title={t("adminResults.title")}
        description={t("adminResults.description")}
      />

      {errorMessage && (
        <div className="alert alert-error admin-results-message" role="alert">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="admin-results-loading">{t("adminResults.loading")}</div>
      ) : elections.length === 0 ? (
        <EmptyState
          title={t("adminResults.noElections")}
          description={t("adminResults.noElectionsDescription")}
        />
      ) : (
        <DataTable>
          <thead>
            <tr>
              <th>{t("adminResults.election")}</th>

              <th>{t("common.status")}</th>

              <th>{t("adminResults.resultVisibility")}</th>

              <th>{t("adminResults.expectedVoters")}</th>

              <th>{t("adminResults.lastUpdated")}</th>

              <th>{t("common.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {elections.map((election) => (
              <tr key={election.id}>
                <td>
                  <div className="table-primary">
                    {election.title}

                    {election.description && (
                      <span className="table-secondary">
                        {election.description}
                      </span>
                    )}
                  </div>
                </td>

                <td>
                  <StatusBadge tone={electionStatusTone(election.status)}>
                    {formatElectionStatus(election.status, t)}
                  </StatusBadge>
                </td>

                <td>{formatResultVisibility(election.result_visibility, t)}</td>

                <td>{election.expected_voters}</td>

                <td>{formatDateTime(election.updated_at, language)}</td>

                <td>
                  <div className="table-actions">
                    <Link
                      to={`/admin/results/${election.id}`}
                      className="admin-result-view-button"
                    >
                      <Eye size={14} />

                      {t("adminResults.viewResults")}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      )}
    </div>
  );
}

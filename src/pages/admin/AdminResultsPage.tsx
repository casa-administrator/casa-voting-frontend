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

export function AdminResultsPage() {
  const { t, i18n } = useTranslation();

  const [elections, setElections] = useState<Election[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  const RESULTS_REFRESH_INTERVAL = 2 * 60 * 1000;

  const ADMIN_RESULTS_CACHE_KEY = "casa-admin-results-list";

  interface CachedAdminResultsList {
    fetchedAt: number;
    elections: Election[];
  }

  function readAdminResultsCache(): CachedAdminResultsList | null {
    try {
      const raw = sessionStorage.getItem(ADMIN_RESULTS_CACHE_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as CachedAdminResultsList;
    } catch {
      return null;
    }
  }

  function saveAdminResultsCache(elections: Election[]) {
    try {
      sessionStorage.setItem(
        ADMIN_RESULTS_CACHE_KEY,
        JSON.stringify({
          fetchedAt: Date.now(),
          elections,
        }),
      );
    } catch {
      // Ignore storage failure.
    }
  }

  useEffect(() => {
    let active = true;

    let timer: number | undefined;

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

        saveAdminResultsCache(response.items);

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
     * Initial load:
     * use cached data if it is
     * less than 3 minutes old.
     */
    const cached = readAdminResultsCache();

    if (cached) {
      const age = Date.now() - cached.fetchedAt;

      if (age < RESULTS_REFRESH_INTERVAL) {
        setElections(cached.elections);

        setIsLoading(false);
      } else {
        void load(true);
      }
    } else {
      void load(true);
    }

    /*
     * Schedule refresh based on
     * the last real API fetch.
     *
     * Browser F5 does not reset
     * the 3-minute timer.
     */
    function scheduleNextRefresh() {
      if (!active) {
        return;
      }

      const currentCache = readAdminResultsCache();

      const fetchedAt = currentCache?.fetchedAt ?? Date.now();

      const elapsed = Date.now() - fetchedAt;

      const delay = Math.max(1000, RESULTS_REFRESH_INTERVAL - elapsed);

      timer = window.setTimeout(async () => {
        if (!active) {
          return;
        }

        await load(false);

        scheduleNextRefresh();
      }, delay);
    }

    scheduleNextRefresh();

    return () => {
      active = false;

      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
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

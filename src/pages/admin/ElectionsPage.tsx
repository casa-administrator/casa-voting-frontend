import { Plus } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { getElections } from "../../api/elections";

import { useAuth } from "../../auth/useAuth";

import { ButtonLink } from "../../components/ui/Button";

import { Card, CardBody } from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";

import { EmptyState } from "../../components/ui/EmptyState";

import { PageHeader } from "../../components/ui/PageHeader";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { Election, ElectionStatus } from "../../types/elections";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import {
  electionStatusTone,
  formatElectionStatus,
  formatVotingRule,
} from "../../utils/election";

export function ElectionsPage() {
  const { t, i18n } = useTranslation();

  const { hasPermission } = useAuth();

  const [elections, setElections] = useState<Election[]>([]);

  const [total, setTotal] = useState(0);

  const [statusFilter, setStatusFilter] = useState<ElectionStatus | "">("");

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  const statusOptions = useMemo(
    () => [
      {
        value: "",

        label: t("common.all"),
      },

      {
        value: "draft",

        label: t("common.draft"),
      },

      {
        value: "scheduled",

        label: t("common.scheduled"),
      },

      {
        value: "live",

        label: t("common.live"),
      },

      {
        value: "closed",

        label: t("common.closed"),
      },

      {
        value: "archived",

        label: t("common.archived"),
      },
    ],
    [t],
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setIsLoading(true);

      setErrorMessage(null);

      try {
        const response = await getElections({
          page: 1,

          perPage: 50,

          status: statusFilter,
        });

        if (!active) {
          return;
        }

        setElections(response.items);

        setTotal(response.total);
      } catch (error) {
        if (!active) {
          return;
        }

        setErrorMessage(
          error instanceof ApiError ? error.message : t("elections.loadError"),
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
  }, [statusFilter, t]);

  return (
    <div>
      <PageHeader
        eyebrow={t("elections.management")}
        title={t("elections.title")}
        description={t("elections.description")}
        actions={
          hasPermission("elections.create") ? (
            <ButtonLink to="/admin/elections/new">
              <Plus size={16} />

              {t("elections.createElection")}
            </ButtonLink>
          ) : undefined
        }
      />

      <Card>
        <CardBody>
          <div className="election-toolbar">
            <label className="election-filter">
              <span>{t("common.status")}</span>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ElectionStatus | "")
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <span className="election-count">
              {t("elections.count", {
                count: total,
              })}
            </span>
          </div>
        </CardBody>
      </Card>

      {errorMessage && (
        <div className="alert alert-error elections-message" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="elections-table-section">
        {isLoading ? (
          <div className="election-loading">{t("elections.loading")}</div>
        ) : elections.length === 0 ? (
          <EmptyState
            title={t("elections.noElections")}
            description={t("elections.noElectionsDescription")}
            action={
              hasPermission("elections.create") ? (
                <ButtonLink to="/admin/elections/new">
                  {t("elections.createElection")}
                </ButtonLink>
              ) : undefined
            }
          />
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>{t("elections.election")}</th>

                <th>{t("common.status")}</th>

                <th>{t("elections.expectedVoters")}</th>

                <th>{t("elections.votingRule")}</th>

                <th>{t("elections.schedule")}</th>

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

                  <td>{election.expected_voters}</td>

                  <td>
                    {formatVotingRule(
                      election.voting_rules.min_selections,

                      election.voting_rules.max_selections,

                      t,
                    )}
                  </td>

                  <td>
                    <ScheduleDisplay
                      startAt={election.start_at}
                      endAt={election.end_at}
                      language={language}
                    />
                  </td>

                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/elections/${election.id}`}
                        className="table-action-link"
                      >
                        {t("common.view")}
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>
    </div>
  );
}

function ScheduleDisplay({
  startAt,
  endAt,
  language,
}: {
  startAt: string | null;

  endAt: string | null;

  language: "km" | "en";
}) {
  const { t } = useTranslation();

  if (!startAt || !endAt) {
    return <span className="table-muted">{t("elections.notScheduled")}</span>;
  }

  return (
    <div className="schedule-cell">
      <span>{formatDateTime(startAt, language)}</span>

      <small>
        {t("elections.to")} {formatDateTime(endAt, language)}
      </small>
    </div>
  );
}

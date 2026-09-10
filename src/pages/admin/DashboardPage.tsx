import { Activity, CheckCircle2, Users, Vote } from "lucide-react";

import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { getDashboardSummary } from "../../api/dashboard";

import { Card, CardBody, CardHeader } from "../../components/ui/Card";

import { EmptyState } from "../../components/ui/EmptyState";

import { PageHeader } from "../../components/ui/PageHeader";

import { StatCard } from "../../components/ui/StatCard";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { DashboardSummary } from "../../types/dashboard";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import { electionStatusTone, formatElectionStatus } from "../../utils/election";

export function DashboardPage() {
  const { t, i18n } = useTranslation();

  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const response = await getDashboardSummary();

        if (!active) {
          return;
        }

        setDashboard(response);

        setErrorMessage(null);
      } catch (error) {
        if (!active) {
          return;
        }

        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (isLoading) {
    return <div className="dashboard-loading">{t("dashboard.loading")}</div>;
  }

  if (!dashboard) {
    return (
      <EmptyState
        title={t("dashboard.unavailable")}
        description={errorMessage || t("dashboard.loadError")}
      />
    );
  }

  const focus = dashboard.focus_election;

  return (
    <div className="dashboard-page">
      <PageHeader
        eyebrow={t("dashboard.overview")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
        actions={
          <span className="dashboard-updated">
            {t("dashboard.updated", {
              date: formatDateTime(dashboard.generated_at, language),
            })}
          </span>
        }
      />

      <div className="stat-grid">
        <StatCard
          label={t("dashboard.elections")}
          value={dashboard.elections.total}
          detail={t("dashboard.liveElections", {
            count: dashboard.elections.live,
          })}
          icon={<Vote size={18} />}
        />

        <StatCard
          label={t("dashboard.internalUsers")}
          value={dashboard.users.total}
          detail={t("dashboard.activeUsers", {
            count: dashboard.users.active,
          })}
          icon={<Users size={18} />}
        />

        <StatCard
          label={t("dashboard.totalBallots")}
          value={dashboard.voting.total_ballots}
          detail={t("dashboard.allElections")}
          icon={<CheckCircle2 size={18} />}
        />

        <StatCard
          label={t("dashboard.closedElections")}
          value={dashboard.elections.closed}
          detail={t("dashboard.scheduledElections", {
            count: dashboard.elections.scheduled,
          })}
          icon={<Activity size={18} />}
        />
      </div>

      {focus && (
        <div className="dashboard-section">
          <Card>
            <CardHeader
              title={t("dashboard.focusElection")}
              description={focus.title}
              action={
                <StatusBadge tone={electionStatusTone(focus.status)}>
                  {formatElectionStatus(focus.status, t)}
                </StatusBadge>
              }
            />

            <CardBody>
              <div className="focus-stat-grid">
                <FocusStat
                  label={t("dashboard.expectedVoters")}
                  value={focus.expected_voters}
                />

                <FocusStat
                  label={t("dashboard.ballotsCast")}
                  value={focus.ballots_cast}
                />

                <FocusStat
                  label={t("dashboard.turnout")}
                  value={`${focus.turnout_percentage}%`}
                />

                <FocusStat
                  label={t("dashboard.candidates")}
                  value={focus.candidate_count}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="dashboard-section">
        <Card>
          <CardHeader
            title={t("dashboard.recentActivity")}
            description={t("dashboard.recentActivityDescription")}
          />

          <CardBody>
            {dashboard.recent_activity.length === 0 ? (
              <div className="activity-empty">{t("dashboard.noActivity")}</div>
            ) : (
              <div className="activity-list">
                {dashboard.recent_activity.map((activity) => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-icon">
                      <Activity size={16} />
                    </div>

                    <div className="activity-content">
                      <strong>{formatActivity(activity.action, t)}</strong>

                      <span>
                        {activity.actor_email ||
                          activity.actor_name ||
                          t("dashboard.internalUser")}
                      </span>
                    </div>

                    <time>{formatDateTime(activity.created_at, language)}</time>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function FocusStat({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) {
  return (
    <div className="focus-stat">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

function formatActivity(
  action: string,
  t: ReturnType<typeof useTranslation>["t"],
) {
  const translations: Record<string, string> = {
    login: "auditActions.login",

    logout: "auditActions.logout",

    "user.create": "auditActions.userCreate",

    user_created: "auditActions.userCreate",

    "user.update": "auditActions.userUpdate",

    user_updated: "auditActions.userUpdate",

    "user.activate": "auditActions.userActivate",

    user_activated: "auditActions.userActivate",

    "user.deactivate": "auditActions.userDeactivate",

    user_deactivated: "auditActions.userDeactivate",

    "election.create": "auditActions.electionCreate",

    election_created: "auditActions.electionCreate",

    "election.update": "auditActions.electionUpdate",

    election_updated: "auditActions.electionUpdate",

    "election.schedule": "auditActions.electionSchedule",

    election_scheduled: "auditActions.electionSchedule",

    "election.start": "auditActions.electionStart",

    election_started: "auditActions.electionStart",

    "election.close": "auditActions.electionClose",

    election_closed: "auditActions.electionClose",

    "candidate.create": "auditActions.candidateCreate",

    candidate_created: "auditActions.candidateCreate",

    "candidate.update": "auditActions.candidateUpdate",

    candidate_updated: "auditActions.candidateUpdate",
  };

  const key = translations[action];

  if (key) {
    return t(key);
  }

  return action.replaceAll(".", " ").replaceAll("_", " ");
}

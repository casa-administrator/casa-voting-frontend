import {
  Archive,
  CalendarClock,
  CircleStop,
  Play,
  ShieldAlert,
} from "lucide-react";

import { useEffect, useState } from "react";

import type { SubmitEventHandler } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import {
  archiveElection,
  closeElection,
  emergencyCloseElection,
  scheduleElection,
  startElection,
} from "../../api/elections";

import { useAuth } from "../../auth/useAuth";

import { Button } from "../../components/ui/Button";

import { Card, CardBody, CardHeader } from "../../components/ui/Card";

import { FormField } from "../../components/ui/FormField";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { Election, ElectionReadiness } from "../../types/elections";

import { normalizeLanguage, formatDateTime } from "../../utils/dateTime";

import { electionStatusTone, formatElectionStatus } from "../../utils/election";

export function ElectionLifecycle({
  election,
  readiness,
  onElectionChanged,
}: {
  election: Election;

  readiness: ElectionReadiness | null;

  onElectionChanged: (election: Election) => Promise<void>;
}) {
  const { t, i18n } = useTranslation();

  const { hasPermission } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [startAt, setStartAt] = useState(toDateTimeLocal(election.start_at));

  const [endAt, setEndAt] = useState(toDateTimeLocal(election.end_at));

  const [emergencyReason, setEmergencyReason] = useState("");

  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    setStartAt(toDateTimeLocal(election.start_at));

    setEndAt(toDateTimeLocal(election.end_at));
  }, [election.start_at, election.end_at]);

  function clearMessages() {
    setErrorMessage(null);

    setSuccessMessage(null);
  }

  const handleSchedule: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    clearMessages();

    if (!startAt || !endAt) {
      setErrorMessage(t("lifecycle.scheduleRequired"));

      return;
    }

    const start = new Date(startAt);

    const end = new Date(endAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setErrorMessage(t("lifecycle.invalidDate"));

      return;
    }

    if (end.getTime() <= start.getTime()) {
      setErrorMessage(t("lifecycle.endAfterStart"));

      return;
    }

    if (!readiness?.ready) {
      setErrorMessage(t("lifecycle.notReady"));

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await scheduleElection(election.id, {
        start_at: start.toISOString(),

        end_at: end.toISOString(),
      });

      setSuccessMessage(t("lifecycle.scheduleSuccess"));

      await onElectionChanged(response.election);
    } catch (error) {
      setErrorMessage(getActionError(error, t("lifecycle.scheduleError")));
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleStart() {
    if (isSubmitting) {
      return;
    }

    if (!readiness?.ready) {
      setErrorMessage(t("lifecycle.notReady"));

      return;
    }

    const confirmed = window.confirm(t("lifecycle.startConfirm"));

    if (!confirmed) {
      return;
    }

    clearMessages();

    setIsSubmitting(true);

    try {
      const response = await startElection(election.id);

      setSuccessMessage(t("lifecycle.startSuccess"));

      await onElectionChanged(response.election);
    } catch (error) {
      setErrorMessage(getActionError(error, t("lifecycle.startError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleClose() {
    if (isSubmitting) {
      return;
    }

    const confirmed = window.confirm(t("lifecycle.closeConfirm"));

    if (!confirmed) {
      return;
    }

    clearMessages();

    setIsSubmitting(true);

    try {
      const response = await closeElection(election.id);

      setSuccessMessage(t("lifecycle.closeSuccess"));

      await onElectionChanged(response.election);
    } catch (error) {
      setErrorMessage(getActionError(error, t("lifecycle.closeError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEmergencyClose() {
    if (isSubmitting) {
      return;
    }

    const reason = emergencyReason.trim();

    if (reason.length < 5) {
      setErrorMessage(t("lifecycle.emergencyReasonMinimum"));

      return;
    }

    if (reason.length > 1000) {
      setErrorMessage(t("lifecycle.emergencyReasonMaximum"));

      return;
    }

    const confirmed = window.confirm(t("lifecycle.emergencyConfirm"));

    if (!confirmed) {
      return;
    }

    clearMessages();

    setIsSubmitting(true);

    try {
      const response = await emergencyCloseElection(election.id, {
        reason,
      });

      setEmergencyReason("");

      setSuccessMessage(t("lifecycle.emergencySuccess"));

      await onElectionChanged(response.election);
    } catch (error) {
      setErrorMessage(getActionError(error, t("lifecycle.emergencyError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    if (isSubmitting) {
      return;
    }

    const confirmed = window.confirm(t("lifecycle.archiveConfirm"));

    if (!confirmed) {
      return;
    }

    clearMessages();

    setIsSubmitting(true);

    try {
      const response = await archiveElection(election.id);

      setSuccessMessage(t("lifecycle.archiveSuccess"));

      await onElectionChanged(response.election);
    } catch (error) {
      setErrorMessage(getActionError(error, t("lifecycle.archiveError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader
        title={t("lifecycle.title")}
        description={t("lifecycle.description")}
        action={
          <StatusBadge tone={electionStatusTone(election.status)}>
            {formatElectionStatus(election.status, t)}
          </StatusBadge>
        }
      />

      <CardBody>
        {errorMessage && (
          <div className="alert alert-error lifecycle-message" role="alert">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success lifecycle-message" role="status">
            {successMessage}
          </div>
        )}

        <LifecycleTimeline election={election} language={language} />

        {election.status === "draft" && hasPermission("elections.schedule") && (
          <form className="lifecycle-action-card" onSubmit={handleSchedule}>
            <div className="lifecycle-action-heading">
              <CalendarClock size={19} />

              <div>
                <h3>{t("lifecycle.schedule")}</h3>

                <p>{t("lifecycle.scheduleDescription")}</p>
              </div>
            </div>

            <div className="form-grid">
              <FormField label={t("lifecycle.startAt")}>
                <input
                  type="datetime-local"
                  required
                  value={startAt}
                  onChange={(event) => setStartAt(event.target.value)}
                />
              </FormField>

              <FormField label={t("lifecycle.endAt")}>
                <input
                  type="datetime-local"
                  required
                  value={endAt}
                  onChange={(event) => setEndAt(event.target.value)}
                />
              </FormField>
            </div>

            {!readiness?.ready && (
              <p className="lifecycle-readiness-warning">
                {t("lifecycle.notReady")}
              </p>
            )}

            <div className="form-actions">
              <Button
                type="submit"
                disabled={isSubmitting || !readiness?.ready}
              >
                <CalendarClock size={16} />

                {isSubmitting
                  ? t("lifecycle.processing")
                  : t("lifecycle.schedule")}
              </Button>
            </div>
          </form>
        )}

        {election.status === "scheduled" && (
          <div className="lifecycle-action-grid">
            {hasPermission("elections.start") && (
              <div className="lifecycle-action-card">
                <div className="lifecycle-action-heading">
                  <Play size={19} />

                  <div>
                    <h3>{t("lifecycle.start")}</h3>

                    <p>{t("lifecycle.startDescription")}</p>
                  </div>
                </div>

                <Button
                  onClick={() => void handleStart()}
                  disabled={isSubmitting || !readiness?.ready}
                >
                  <Play size={16} />

                  {t("lifecycle.start")}
                </Button>
              </div>
            )}
          </div>
        )}

        {election.status === "live" && (
          <div className="lifecycle-action-grid">
            {hasPermission("elections.close") && (
              <div className="lifecycle-action-card">
                <div className="lifecycle-action-heading">
                  <CircleStop size={19} />

                  <div>
                    <h3>{t("lifecycle.close")}</h3>

                    <p>{t("lifecycle.closeDescription")}</p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => void handleClose()}
                  disabled={isSubmitting}
                >
                  <CircleStop size={16} />

                  {t("lifecycle.close")}
                </Button>
              </div>
            )}

            {hasPermission("elections.emergency_close") && (
              <div className="lifecycle-action-card lifecycle-danger-card">
                <div className="lifecycle-action-heading">
                  <ShieldAlert size={19} />

                  <div>
                    <h3>{t("lifecycle.emergencyClose")}</h3>

                    <p>{t("lifecycle.emergencyDescription")}</p>
                  </div>
                </div>

                <FormField label={t("lifecycle.emergencyReason")}>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={emergencyReason}
                    onChange={(event) => setEmergencyReason(event.target.value)}
                    placeholder={t("lifecycle.emergencyPlaceholder")}
                  />
                </FormField>

                <Button
                  variant="danger"
                  onClick={() => void handleEmergencyClose()}
                  disabled={isSubmitting}
                >
                  <ShieldAlert size={16} />

                  {t("lifecycle.emergencyClose")}
                </Button>
              </div>
            )}
          </div>
        )}

        {election.status === "closed" && hasPermission("elections.archive") && (
          <div className="lifecycle-action-card">
            <div className="lifecycle-action-heading">
              <Archive size={19} />

              <div>
                <h3>{t("lifecycle.archive")}</h3>

                <p>{t("lifecycle.archiveDescription")}</p>
              </div>
            </div>

            <Button
              variant="secondary"
              onClick={() => void handleArchive()}
              disabled={isSubmitting}
            >
              <Archive size={16} />

              {t("lifecycle.archive")}
            </Button>
          </div>
        )}

        {election.status === "archived" && (
          <div className="lifecycle-archived">
            <Archive size={18} />

            <div>
              <strong>{t("lifecycle.archivedTitle")}</strong>

              <span>{t("lifecycle.archivedDescription")}</span>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function LifecycleTimeline({
  election,
  language,
}: {
  election: Election;

  language: "km" | "en";
}) {
  const { t } = useTranslation();

  return (
    <div className="lifecycle-timeline">
      <TimelineItem
        label={t("lifecycle.created")}
        value={formatDateTime(election.created_at, language)}
        active
      />

      <TimelineItem
        label={t("lifecycle.scheduled")}
        value={
          election.scheduled_at
            ? formatDateTime(election.scheduled_at, language)
            : "—"
        }
        active={Boolean(election.scheduled_at)}
      />

      <TimelineItem
        label={t("lifecycle.started")}
        value={
          election.started_at
            ? formatDateTime(election.started_at, language)
            : "—"
        }
        active={Boolean(election.started_at)}
      />

      <TimelineItem
        label={t("lifecycle.closed")}
        value={
          election.closed_at
            ? formatDateTime(election.closed_at, language)
            : "—"
        }
        active={Boolean(election.closed_at)}
      />

      <TimelineItem
        label={t("lifecycle.archived")}
        value={
          election.archived_at
            ? formatDateTime(election.archived_at, language)
            : "—"
        }
        active={Boolean(election.archived_at)}
      />
    </div>
  );
}

function TimelineItem({
  label,
  value,
  active,
}: {
  label: string;

  value: string;

  active: boolean;
}) {
  return (
    <div className={active ? "timeline-item active" : "timeline-item"}>
      <div className="timeline-dot" />

      <div>
        <strong>{label}</strong>

        <span>{value}</span>
      </div>
    </div>
  );
}

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();

  const local = new Date(date.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 16);
}

function getActionError(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

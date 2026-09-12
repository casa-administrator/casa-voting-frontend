import { ArrowLeft, Save } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import {
  getElection,
  getElectionReadiness,
  updateElection,
} from "../../api/elections";

import { useAuth } from "../../auth/useAuth";
import { Button, ButtonLink } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { CandidateManager } from "../../features/elections/CandidateManager";
import { ElectionLifecycle } from "../../features/elections/ElectionLifecycle";
import { ElectionReadinessPanel } from "../../features/elections/ElectionReadiness";
import { PublicVoteShareCard } from "../../components/elections/PublicVoteShareCard";

import type {
  Election,
  ElectionReadiness,
  ResultVisibility,
} from "../../types/elections";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import {
  electionStatusTone,
  formatCloseType,
  formatElectionStatus,
  formatResultVisibility,
  formatStartType,
} from "../../utils/election";

export function ElectionDetailsPage() {
  const { electionId } = useParams();

  const { t, i18n } = useTranslation();

  const { hasPermission } = useAuth();

  const [election, setElection] = useState<Election | null>(null);

  const [readiness, setReadiness] = useState<ElectionReadiness | null>(null);

  const [resultVisibility, setResultVisibility] =
    useState<ResultVisibility>("after_close");

  const [isLoading, setIsLoading] = useState(true);

  const [readinessLoading, setReadinessLoading] = useState(true);

  const [isSavingVisibility, setIsSavingVisibility] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [visibilityError, setVisibilityError] = useState<string | null>(null);

  const [visibilitySuccess, setVisibilitySuccess] = useState<string | null>(
    null,
  );

  const language = normalizeLanguage(i18n.language);

  const loadReadiness = useCallback(async () => {
    if (!electionId) {
      return;
    }

    setReadinessLoading(true);

    try {
      const response = await getElectionReadiness(electionId);

      setReadiness(response);
    } catch {
      setReadiness(null);
    } finally {
      setReadinessLoading(false);
    }
  }, [electionId]);

  const loadElection = useCallback(async () => {
    if (!electionId) {
      setErrorMessage(t("elections.missingElectionId"));

      setIsLoading(false);

      return;
    }

    try {
      const response = await getElection(electionId);

      setElection(response);

      setResultVisibility(response.result_visibility);

      setErrorMessage(null);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setErrorMessage(t("elections.notFound"));
      } else if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage(t("elections.loadElectionError"));
      }
    } finally {
      setIsLoading(false);
    }
  }, [electionId, t]);

  useEffect(() => {
    void Promise.all([loadElection(), loadReadiness()]);
  }, [loadElection, loadReadiness]);

  async function handleCandidateChanged() {
    await loadReadiness();
  }

  async function handleElectionChanged(updatedElection: Election) {
    setElection(updatedElection);

    setResultVisibility(updatedElection.result_visibility);

    await loadReadiness();
  }

  async function handleSaveResultVisibility() {
    if (!election || isSavingVisibility) {
      return;
    }

    if (resultVisibility === election.result_visibility) {
      return;
    }

    setIsSavingVisibility(true);

    setVisibilityError(null);

    setVisibilitySuccess(null);

    try {
      const updated = await updateElection(election.id, {
        result_visibility: resultVisibility,
      });

      setElection(updated);

      setResultVisibility(updated.result_visibility);

      setVisibilitySuccess(t("elections.resultVisibilityUpdated"));
    } catch (error) {
      if (error instanceof ApiError) {
        setVisibilityError(error.message);
      } else {
        setVisibilityError(t("elections.resultVisibilityUpdateError"));
      }
    } finally {
      setIsSavingVisibility(false);
    }
  }

  if (isLoading) {
    return (
      <div className="election-detail-loading">
        {t("elections.loadingElection")}
      </div>
    );
  }

  if (!election) {
    return (
      <EmptyState
        title={t("elections.unavailable")}
        description={errorMessage || t("elections.loadElectionError")}
        action={
          <ButtonLink to="/admin/elections" variant="secondary">
            <ArrowLeft size={16} />

            {t("elections.backToElections")}
          </ButtonLink>
        }
      />
    );
  }

  const visibilityStatusEditable =
    election.status === "draft" ||
    election.status === "scheduled" ||
    election.status === "live";

  const canEditResultVisibility =
    visibilityStatusEditable && hasPermission("elections.update");

  const visibilityChanged = resultVisibility !== election.result_visibility;

  return (
    <div>
      <PageHeader
        eyebrow={t("elections.election")}
        title={election.title}
        description={election.description || t("elections.noDescription")}
        actions={
          <>
            <StatusBadge tone={electionStatusTone(election.status)}>
              {formatElectionStatus(election.status, t)}
            </StatusBadge>

            <ButtonLink to="/admin/elections" variant="secondary">
              <ArrowLeft size={16} />

              {t("common.back")}
            </ButtonLink>
          </>
        }
      />

      {errorMessage && (
        <div className="alert alert-error election-detail-message" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="election-detail-grid">
        <Card>
          <CardHeader
            title={t("elections.configuration")}
            description={t("elections.configurationDescription")}
          />

          <CardBody>
            <div className="detail-list">
              <DetailItem
                label={t("elections.expectedVoters")}
                value={election.expected_voters}
              />

              <DetailItem
                label={t("elections.minimumSelections")}
                value={election.voting_rules.min_selections}
              />

              <DetailItem
                label={t("elections.maximumSelections")}
                value={election.voting_rules.max_selections}
              />

              <DetailItem
                label={t("elections.oneVotePerDevice")}
                value={
                  election.voting_rules.one_vote_per_device
                    ? t("common.enabled")
                    : t("common.disabled")
                }
              />

              <DetailItem
                label={t("elections.allowBlankBallot")}
                value={
                  election.voting_rules.allow_blank_ballot
                    ? t("common.allowed")
                    : t("common.notAllowed")
                }
              />
            </div>

            <div className="result-visibility-setting">
              <div className="result-visibility-heading">
                <div>
                  <span className="result-visibility-label">
                    {t("elections.resultVisibility")}
                  </span>

                  <p>{t("elections.resultVisibilityDescription")}</p>
                </div>

                {!canEditResultVisibility && (
                  <StatusBadge tone="neutral">
                    {formatResultVisibility(election.result_visibility, t)}
                  </StatusBadge>
                )}
              </div>

              {canEditResultVisibility && (
                <div className="result-visibility-controls">
                  <select
                    value={resultVisibility}
                    disabled={isSavingVisibility}
                    onChange={(event) => {
                      setResultVisibility(
                        event.target.value as ResultVisibility,
                      );

                      setVisibilitySuccess(null);

                      setVisibilityError(null);
                    }}
                  >
                    <option value="hidden">
                      {formatResultVisibility("hidden", t)}
                    </option>

                    <option value="live">
                      {formatResultVisibility("live", t)}
                    </option>

                    <option value="after_close">
                      {formatResultVisibility("after_close", t)}
                    </option>
                  </select>

                  <Button
                    type="button"
                    disabled={isSavingVisibility || !visibilityChanged}
                    onClick={() => void handleSaveResultVisibility()}
                  >
                    <Save size={15} />

                    {isSavingVisibility
                      ? t("elections.savingResultVisibility")
                      : t("elections.saveResultVisibility")}
                  </Button>
                </div>
              )}

              {!visibilityStatusEditable && (
                <p className="result-visibility-locked">
                  {t("elections.resultVisibilityLocked")}
                </p>
              )}

              {visibilitySuccess && (
                <div
                  className="alert alert-success result-visibility-message"
                  role="status"
                >
                  {visibilitySuccess}
                </div>
              )}

              {visibilityError && (
                <div
                  className="alert alert-error result-visibility-message"
                  role="alert"
                >
                  {visibilityError}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t("elections.timing")}
            description={t("elections.timingDescription")}
          />

          <CardBody>
            <div className="detail-list">
              <DetailItem
                label={t("elections.start")}
                value={
                  election.start_at
                    ? formatDateTime(election.start_at, language)
                    : t("elections.notScheduled")
                }
              />

              <DetailItem
                label={t("elections.end")}
                value={
                  election.end_at
                    ? formatDateTime(election.end_at, language)
                    : t("elections.notScheduled")
                }
              />

              <DetailItem
                label={t("elections.startType")}
                value={formatStartType(election.start_type, t)}
              />

              <DetailItem
                label={t("elections.closeType")}
                value={formatCloseType(election.close_type, t)}
              />

              {election.close_reason && (
                <DetailItem
                  label={t("elections.closeReason")}
                  value={election.close_reason}
                />
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="election-workspace-section">
        <ElectionReadinessPanel
          readiness={readiness}
          isLoading={readinessLoading}
        />
      </div>

      <div className="election-workspace-section">
        <CandidateManager
          electionId={election.id}
          electionStatus={election.status}
          onChanged={handleCandidateChanged}
        />
      </div>

      <div className="election-workspace-section">
        <ElectionLifecycle
          election={election}
          readiness={readiness}
          onElectionChanged={handleElectionChanged}
        />
      </div>
      <PublicVoteShareCard
        electionId={election.id}
        electionStatus={election.status}
      />
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;

  value: string | number;
}) {
  return (
    <div className="detail-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

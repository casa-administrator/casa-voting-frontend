import { AlertTriangle, CheckCircle2, Users } from "lucide-react";

import { useTranslation } from "react-i18next";

import { Card, CardBody, CardHeader } from "../../components/ui/Card";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { ElectionReadiness } from "../../types/elections";

export function ElectionReadinessPanel({
  readiness,
  isLoading,
}: {
  readiness: ElectionReadiness | null;

  isLoading: boolean;
}) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Card>
        <CardBody>
          <div className="readiness-loading">{t("readiness.loading")}</div>
        </CardBody>
      </Card>
    );
  }

  if (!readiness) {
    return (
      <Card>
        <CardBody>
          <div className="readiness-loading">{t("readiness.unavailable")}</div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title={t("readiness.title")}
        description={t("readiness.description")}
        action={
          <StatusBadge tone={readiness.ready ? "success" : "warning"}>
            {readiness.ready ? t("readiness.ready") : t("readiness.notReady")}
          </StatusBadge>
        }
      />

      <CardBody>
        <div className="readiness-summary-grid">
          <div className="readiness-stat">
            <div className="readiness-stat-icon">
              <Users size={18} />
            </div>

            <div>
              <span>{t("readiness.activeCandidates")}</span>

              <strong>{readiness.active_candidate_count}</strong>
            </div>
          </div>

          <div className="readiness-stat">
            <div className="readiness-stat-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <span>{t("readiness.minimumSelections")}</span>

              <strong>{readiness.min_selections}</strong>
            </div>
          </div>

          <div className="readiness-stat">
            <div className="readiness-stat-icon">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <span>{t("readiness.maximumSelections")}</span>

              <strong>{readiness.max_selections}</strong>
            </div>
          </div>
        </div>

        {readiness.issues.length > 0 ? (
          <div className="readiness-issues">
            <div className="readiness-issues-title">
              <AlertTriangle size={17} />

              <strong>{t("readiness.issues")}</strong>
            </div>

            <ul>
              {readiness.issues.map((issue, index) => (
                <li key={`${issue}-${index}`}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="readiness-success">
            <CheckCircle2 size={17} />

            <span>{t("readiness.noIssues")}</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

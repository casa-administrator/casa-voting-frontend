import { Clock, Globe, Monitor, ShieldCheck, X } from "lucide-react";

import { useTranslation } from "react-i18next";

import { Button } from "../../components/ui/Button";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { AuditLog } from "../../types/audit";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import {
  formatAuditAction,
  formatAuditResourceType,
  getAuditActionTone,
} from "../../utils/audit";

export function AuditEntryDetails({
  auditLog,
  onClose,
}: {
  auditLog: AuditLog;

  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();

  const language = normalizeLanguage(i18n.language);

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="audit-detail-dialog" role="dialog" aria-modal="true">
        <div className="audit-detail-header">
          <div className="audit-detail-title">
            <div className="audit-detail-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h2>{t("audit.detailTitle")}</h2>

              <p>{auditLog.id}</p>
            </div>
          </div>

          <button
            type="button"
            className="icon-action"
            onClick={onClose}
            aria-label={t("common.cancel")}
          >
            <X size={16} />
          </button>
        </div>

        <div className="audit-detail-body">
          <div className="audit-detail-summary">
            <StatusBadge tone={getAuditActionTone(auditLog.action)}>
              {formatAuditAction(auditLog.action, t)}
            </StatusBadge>

            <span>{formatAuditResourceType(auditLog.resource_type, t)}</span>
          </div>

          <section className="audit-detail-section">
            <h3>{t("audit.actor")}</h3>

            <div className="audit-detail-grid">
              <Detail
                label={t("audit.actorName")}
                value={auditLog.actor_name || "—"}
              />

              <Detail
                label={t("audit.actorEmail")}
                value={auditLog.actor_email || "—"}
              />

              <Detail
                label={t("audit.actorRole")}
                value={auditLog.actor_role}
              />

              <Detail
                label={t("audit.actorId")}
                value={auditLog.actor_id || "—"}
              />
            </div>
          </section>

          <section className="audit-detail-section">
            <h3>{t("audit.resource")}</h3>

            <div className="audit-detail-grid">
              <Detail
                label={t("audit.resourceType")}
                value={formatAuditResourceType(auditLog.resource_type, t)}
              />

              <Detail
                label={t("audit.resourceId")}
                value={auditLog.resource_id || "—"}
              />
            </div>
          </section>

          <section className="audit-detail-section">
            <h3>{t("audit.request")}</h3>

            <div className="audit-request-list">
              <RequestRow
                icon={<Clock size={15} />}
                label={t("audit.time")}
                value={formatDateTime(auditLog.created_at, language)}
              />

              <RequestRow
                icon={<Globe size={15} />}
                label={t("audit.ipAddress")}
                value={auditLog.ip_address || "—"}
              />

              <RequestRow
                icon={<Monitor size={15} />}
                label={t("audit.request")}
                value={
                  [auditLog.request_method, auditLog.request_path]
                    .filter(Boolean)
                    .join(" ") || "—"
                }
              />
            </div>

            {auditLog.user_agent && (
              <div className="audit-user-agent">
                <span>{t("audit.userAgent")}</span>

                <p>{auditLog.user_agent}</p>
              </div>
            )}
          </section>

          <section className="audit-detail-section">
            <h3>{t("audit.details")}</h3>

            {auditLog.details && Object.keys(auditLog.details).length > 0 ? (
              <pre className="audit-json">
                {JSON.stringify(auditLog.details, null, 2)}
              </pre>
            ) : (
              <div className="audit-no-details">{t("audit.noDetails")}</div>
            )}
          </section>
        </div>

        <div className="audit-detail-footer">
          <Button variant="secondary" onClick={onClose}>
            {t("common.close")}
          </Button>
        </div>
      </section>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="audit-detail-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}

function RequestRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;

  label: string;

  value: string;
}) {
  return (
    <div className="audit-request-row">
      <div className="audit-request-icon">{icon}</div>

      <div>
        <span>{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

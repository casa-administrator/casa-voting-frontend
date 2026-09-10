import { ChevronLeft, ChevronRight, Eye, FilterX, Search } from "lucide-react";

import { useCallback, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { ApiError } from "../../api/client";

import { getAuditLogs } from "../../api/audit";

import { Button } from "../../components/ui/Button";

import { Card, CardBody } from "../../components/ui/Card";

import { DataTable } from "../../components/ui/DataTable";

import { EmptyState } from "../../components/ui/EmptyState";

import { PageHeader } from "../../components/ui/PageHeader";

import { StatusBadge } from "../../components/ui/StatusBadge";

import { AuditEntryDetails } from "../../features/audit/AuditEntryDetails";

import type {
  AuditAction,
  AuditLog,
  AuditResourceType,
  AuditableUserRole,
} from "../../types/audit";

import { formatDateTime, normalizeLanguage } from "../../utils/dateTime";

import {
  auditActions,
  auditResourceTypes,
  formatAuditAction,
  formatAuditResourceType,
  getAuditActionTone,
} from "../../utils/audit";

export function AuditLogsPage() {
  const { t, i18n } = useTranslation();

  const [items, setItems] = useState<AuditLog[]>([]);

  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");

  const [actorRole, setActorRole] = useState<AuditableUserRole | "">("");

  const [action, setAction] = useState<AuditAction | "">("");

  const [resourceType, setResourceType] = useState<AuditResourceType | "">("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const language = normalizeLanguage(i18n.language);

  const load = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await getAuditLogs({
        page,

        perPage: 20,

        search: appliedSearch,

        actorRole,

        action,

        resourceType,

        startAt: dateStartToIso(startDate),

        endAt: dateEndToIso(endDate),
      });

      setItems(response.items);

      setTotal(response.total);

      setTotalPages(Math.max(response.total_pages, 1));

      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("audit.loadError"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    page,
    appliedSearch,
    actorRole,
    action,
    resourceType,
    startDate,
    endDate,
    t,
  ]);

  useEffect(() => {
    void load();
  }, [load]);

  function applySearch() {
    setPage(1);

    setAppliedSearch(search.trim());
  }

  function clearFilters() {
    setSearch("");

    setAppliedSearch("");

    setActorRole("");

    setAction("");

    setResourceType("");

    setStartDate("");

    setEndDate("");

    setPage(1);
  }

  return (
    <div>
      <PageHeader
        eyebrow={t("audit.management")}
        title={t("audit.title")}
        description={t("audit.description")}
      />

      <Card>
        <CardBody>
          <div className="audit-filters">
            <div className="audit-search">
              <Search size={15} />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    applySearch();
                  }
                }}
                placeholder={t("audit.searchPlaceholder")}
              />

              <Button size="sm" onClick={applySearch}>
                {t("common.search")}
              </Button>
            </div>

            <label className="audit-filter-field">
              <span>{t("audit.actorRole")}</span>

              <select
                value={actorRole}
                onChange={(event) => {
                  setActorRole(event.target.value as AuditableUserRole | "");

                  setPage(1);
                }}
              >
                <option value="">{t("common.all")}</option>

                <option value="user">{t("common.user")}</option>

                <option value="admin">{t("common.admin")}</option>
              </select>
            </label>

            <label className="audit-filter-field">
              <span>{t("audit.action")}</span>

              <select
                value={action}
                onChange={(event) => {
                  setAction(event.target.value as AuditAction | "");

                  setPage(1);
                }}
              >
                <option value="">{t("common.all")}</option>

                {auditActions.map((item) => (
                  <option key={item} value={item}>
                    {formatAuditAction(item, t)}
                  </option>
                ))}
              </select>
            </label>

            <label className="audit-filter-field">
              <span>{t("audit.resourceType")}</span>

              <select
                value={resourceType}
                onChange={(event) => {
                  setResourceType(event.target.value as AuditResourceType | "");

                  setPage(1);
                }}
              >
                <option value="">{t("common.all")}</option>

                {auditResourceTypes.map((item) => (
                  <option key={item} value={item}>
                    {formatAuditResourceType(item, t)}
                  </option>
                ))}
              </select>
            </label>

            <label className="audit-filter-field">
              <span>{t("audit.fromDate")}</span>

              <input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);

                  setPage(1);
                }}
              />
            </label>

            <label className="audit-filter-field">
              <span>{t("audit.toDate")}</span>

              <input
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);

                  setPage(1);
                }}
              />
            </label>

            <Button variant="secondary" size="sm" onClick={clearFilters}>
              <FilterX size={14} />

              {t("audit.clearFilters")}
            </Button>
          </div>
        </CardBody>
      </Card>

      {errorMessage && (
        <div className="alert alert-error audit-page-message" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="audit-table-section">
        {isLoading ? (
          <div className="audit-loading">{t("audit.loading")}</div>
        ) : items.length === 0 ? (
          <EmptyState
            title={t("audit.noLogs")}
            description={t("audit.noLogsDescription")}
          />
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>{t("audit.time")}</th>

                <th>{t("audit.actor")}</th>

                <th>{t("audit.action")}</th>

                <th>{t("audit.resource")}</th>

                <th>{t("audit.request")}</th>

                <th>{t("common.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {items.map((audit) => (
                <tr key={audit.id}>
                  <td>
                    <span className="audit-time">
                      {formatDateTime(audit.created_at, language)}
                    </span>
                  </td>

                  <td>
                    <div className="audit-actor">
                      <strong>
                        {audit.actor_name || audit.actor_email || "—"}
                      </strong>

                      {audit.actor_email && audit.actor_name && (
                        <span>{audit.actor_email}</span>
                      )}

                      <small>{audit.actor_role}</small>
                    </div>
                  </td>

                  <td>
                    <StatusBadge tone={getAuditActionTone(audit.action)}>
                      {formatAuditAction(audit.action, t)}
                    </StatusBadge>
                  </td>

                  <td>
                    <div className="audit-resource">
                      <strong>
                        {formatAuditResourceType(audit.resource_type, t)}
                      </strong>

                      <span>{audit.resource_id || "—"}</span>
                    </div>
                  </td>

                  <td>
                    <div className="audit-request-summary">
                      <strong>{audit.request_method || "—"}</strong>

                      <span>{audit.request_path || "—"}</span>
                    </div>
                  </td>

                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="admin-result-view-button"
                        onClick={() => setSelectedAudit(audit)}
                      >
                        <Eye size={14} />

                        {t("audit.viewDetails")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>

      {!isLoading && total > 0 && (
        <div className="audit-pagination">
          <span>
            {t("audit.paginationSummary", {
              page,
              pages: totalPages,
              total,
            })}
          </span>

          <div>
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              <ChevronLeft size={14} />

              {t("common.previous")}
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              {t("common.next")}

              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {selectedAudit && (
        <AuditEntryDetails
          auditLog={selectedAudit}
          onClose={() => setSelectedAudit(null)}
        />
      )}
    </div>
  );
}

function dateStartToIso(value: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function dateEndToIso(value: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(`${value}T23:59:59.999`);

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

import {
  apiRequest,
} from "./client";

import type {
  AuditLog,
  AuditLogListResponse,
  AuditLogQuery,
} from "../types/audit";


export function getAuditLogs(
  query:
    AuditLogQuery = {},
) {
  const params =
    new URLSearchParams();


  params.set(
    "page",
    String(
      query.page ??
        1,
    ),
  );


  params.set(
    "per_page",
    String(
      query.perPage ??
        20,
    ),
  );


  if (
    query.search?.trim()
  ) {
    params.set(
      "search",
      query.search.trim(),
    );
  }


  if (
    query.actorRole
  ) {
    params.set(
      "actor_role",
      query.actorRole,
    );
  }


  if (
    query.actorEmail?.trim()
  ) {
    params.set(
      "actor_email",
      query.actorEmail.trim(),
    );
  }


  if (
    query.action
  ) {
    params.set(
      "action",
      query.action,
    );
  }


  if (
    query.resourceType
  ) {
    params.set(
      "resource_type",
      query.resourceType,
    );
  }


  if (
    query.resourceId?.trim()
  ) {
    params.set(
      "resource_id",
      query.resourceId.trim(),
    );
  }


  if (
    query.startAt
  ) {
    params.set(
      "start_at",
      query.startAt,
    );
  }


  if (
    query.endAt
  ) {
    params.set(
      "end_at",
      query.endAt,
    );
  }


  return apiRequest<AuditLogListResponse>(
    `/admin/audit-logs?${params.toString()}`,
  );
}


export function getAuditLog(
  auditLogId:
    string,
) {
  return apiRequest<AuditLog>(
    `/admin/audit-logs/${auditLogId}`,
  );
}
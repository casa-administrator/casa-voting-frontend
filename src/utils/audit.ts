import type {
  TFunction,
} from "i18next";

import type {
  AuditAction,
  AuditResourceType,
} from "../types/audit";


export const auditActions:
  AuditAction[] = [
  "user_login",
  "user_logout",
  "user_created",
  "user_updated",
  "user_activated",
  "user_deactivated",
  "user_deleted",
  "user_password_reset",
  "permission_updated",
  "election_created",
  "election_updated",
  "election_deleted",
  "election_scheduled",
  "election_started",
  "election_closed",
  "election_emergency_closed",
  "election_archived",
  "candidate_created",
  "candidate_updated",
  "candidate_deleted",
  "result_viewed",
  "result_exported_excel",
  "result_exported_pdf",
];


export const auditResourceTypes:
  AuditResourceType[] = [
  "user",
  "election",
  "candidate",
  "result",
  "report",
  "permission",
];


export function formatAuditAction(
  action:
    AuditAction,
  t:
    TFunction,
) {
  return t(
    `auditActions.${action}`,
  );
}


export function formatAuditResourceType(
  resourceType:
    AuditResourceType,
  t:
    TFunction,
) {
  return t(
    `auditResources.${resourceType}`,
  );
}


export function getAuditActionTone(
  action:
    AuditAction,
):
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral" {
  if (
    action.includes(
      "deleted",
    ) ||
    action.includes(
      "emergency",
    )
  ) {
    return "danger";
  }


  if (
    action.includes(
      "created",
    ) ||
    action.includes(
      "activated",
    ) ||
    action ===
      "user_login" ||
    action ===
      "election_started"
  ) {
    return "success";
  }


  if (
    action.includes(
      "updated",
    ) ||
    action.includes(
      "scheduled",
    ) ||
    action.includes(
      "password_reset",
    )
  ) {
    return "warning";
  }


  if (
    action.includes(
      "viewed",
    ) ||
    action.includes(
      "exported",
    )
  ) {
    return "info";
  }


  return "neutral";
}
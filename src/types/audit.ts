export type AuditableUserRole =
  | "user"
  | "admin";


export type AuditActorRole =
  | "user"
  | "admin"
  | "super_admin";


export type AuditAction =
  | "user_login"
  | "user_logout"
  | "user_created"
  | "user_updated"
  | "user_activated"
  | "user_deactivated"
  | "user_deleted"
  | "user_password_reset"
  | "permission_updated"
  | "election_created"
  | "election_updated"
  | "election_deleted"
  | "election_scheduled"
  | "election_started"
  | "election_closed"
  | "election_emergency_closed"
  | "election_archived"
  | "candidate_created"
  | "candidate_updated"
  | "candidate_deleted"
  | "result_viewed"
  | "result_exported_excel"
  | "result_exported_pdf";


export type AuditResourceType =
  | "user"
  | "election"
  | "candidate"
  | "result"
  | "report"
  | "permission";


export interface AuditLog {
  id: string;

  actor_id: string | null;

  actor_name: string | null;

  actor_email: string | null;

  actor_role: AuditActorRole;

  action: AuditAction;

  resource_type: AuditResourceType;

  resource_id: string | null;

  details: Record<string, unknown> | null;

  ip_address: string | null;

  user_agent: string | null;

  request_method: string | null;

  request_path: string | null;

  created_at: string;
}


export interface AuditLogListResponse {
  items: AuditLog[];

  total: number;

  page: number;

  per_page: number;

  total_pages: number;
}


export interface AuditLogQuery {
  page?: number;

  perPage?: number;

  search?: string;

  actorRole?: AuditableUserRole | "";

  actorEmail?: string;

  action?: AuditAction | "";

  resourceType?: AuditResourceType | "";

  resourceId?: string;

  startAt?: string;

  endAt?: string;
}
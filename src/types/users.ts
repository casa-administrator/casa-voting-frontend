export type UserRole =
  | "user"
  | "admin"
  | "super_admin";


export type Permission =
  | "dashboard.view"
  | "elections.view"
  | "elections.create"
  | "elections.update"
  | "elections.delete"
  | "elections.schedule"
  | "elections.start"
  | "elections.close"
  | "elections.emergency_close"
  | "elections.archive"
  | "candidates.view"
  | "candidates.create"
  | "candidates.update"
  | "candidates.delete"
  | "results.view"
  | "results.export"
  | "users.view"
  | "users.create"
  | "users.update"
  | "users.activate"
  | "users.deactivate"
  | "users.delete"
  | "users.reset_password"
  | "permissions.manage"
  | "audit_logs.view"
  | "reports.export";


export interface User {
  id: string;

  full_name: string;

  email: string;

  role: UserRole;

  permissions: Permission[];

  is_active: boolean;

  created_at: string;

  updated_at: string;

  last_login_at?: string | null;
}


export interface UserListResponse {
  items: User[];

  total: number;

  page: number;

  per_page: number;
}


export interface UserCreateRequest {
  full_name: string;

  email: string;

  password: string;

  role?: UserRole;

  permissions?: Permission[];
}


export interface UserUpdateRequest {
  full_name?: string | null;

  email?: string | null;

  role?: UserRole | null;
}


export interface PasswordResetRequest {
  new_password: string;
}


export interface UserPermissionUpdateRequest {
  permissions: Permission[];
}


export interface UserActionResponse {
  message: string;

  user: User;
}
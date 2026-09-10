export type UserRole =
  | "user"
  | "admin"
  | "super_admin";


export interface AuthUser {
  id: string;

  full_name: string;

  email: string;

  role: UserRole;

  permissions: string[];

  is_active: boolean;
}


export interface AuthMeResponse {
  user: AuthUser;
}
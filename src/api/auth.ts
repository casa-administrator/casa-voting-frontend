import {
  apiRequest,
} from "./client";

import type {
  AuthMeResponse,
  AuthUser,
} from "../types/auth";


export async function loginRequest(
  email: string,
  password: string,
) {
  await apiRequest(
    "/auth/login",
    {
      method:
        "POST",

      json: {
        email,
        password,
      },
    },
  );

  return getCurrentUser();
}


export async function getCurrentUser():
  Promise<AuthUser> {
  const response =
    await apiRequest<AuthMeResponse>(
      "/auth/me",
    );

  return response.user;
}


export async function logoutRequest() {
  await apiRequest(
    "/auth/logout",
    {
      method:
        "POST",
    },
  );
}
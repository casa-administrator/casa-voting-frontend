import {
  apiRequest,
} from "./client";

import type {
  PasswordResetRequest,
  User,
  UserActionResponse,
  UserCreateRequest,
  UserListResponse,
  UserPermissionUpdateRequest,
  UserUpdateRequest,
} from "../types/users";


export function getUsers(
  page = 1,
  perPage = 20,
) {
  const params =
    new URLSearchParams({
      page:
        String(
          page,
        ),

      per_page:
        String(
          perPage,
        ),
    });


  return apiRequest<UserListResponse>(
    `/admin/users?${params.toString()}`,
  );
}


export async function getAllUsers():
  Promise<User[]> {
  const perPage =
    100;

  let page =
    1;

  let total =
    0;

  const users:
    User[] =
    [];


  do {
    const response =
      await getUsers(
        page,
        perPage,
      );


    users.push(
      ...response.items,
    );

    total =
      response.total;


    if (
      response.items.length ===
      0
    ) {
      break;
    }


    page +=
      1;
  } while (
    users.length <
    total
  );


  return users;
}


export function getUser(
  userId: string,
) {
  return apiRequest<User>(
    `/admin/users/${userId}`,
  );
}


export function createUser(
  payload:
    UserCreateRequest,
) {
  return apiRequest<User>(
    "/admin/users",
    {
      method:
        "POST",

      json:
        payload,
    },
  );
}


export function updateUser(
  userId:
    string,
  payload:
    UserUpdateRequest,
) {
  return apiRequest<User>(
    `/admin/users/${userId}`,
    {
      method:
        "PATCH",

      json:
        payload,
    },
  );
}


export function activateUser(
  userId:
    string,
) {
  return apiRequest<UserActionResponse>(
    `/admin/users/${userId}/activate`,
    {
      method:
        "POST",
    },
  );
}


export function deactivateUser(
  userId:
    string,
) {
  return apiRequest<UserActionResponse>(
    `/admin/users/${userId}/deactivate`,
    {
      method:
        "POST",
    },
  );
}


export function deleteUser(
  userId:
    string,
) {
  return apiRequest<void>(
    `/admin/users/${userId}`,
    {
      method:
        "DELETE",
    },
  );
}


export function resetUserPassword(
  userId:
    string,
  payload:
    PasswordResetRequest,
) {
  return apiRequest<UserActionResponse>(
    `/admin/users/${userId}/reset-password`,
    {
      method:
        "POST",

      json:
        payload,
    },
  );
}


/*
 * Phase 9B will use this.
 */
export function updateUserPermissions(
  userId:
    string,
  payload:
    UserPermissionUpdateRequest,
) {
  return apiRequest<UserActionResponse>(
    `/admin/users/${userId}/permissions`,
    {
      method:
        "PUT",

      json:
        payload,
    },
  );
}
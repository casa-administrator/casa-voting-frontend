import {
  apiRequest,
} from "./client";

import type {
  CreateElectionRequest,
  Election,
  ElectionActionResponse,
  ElectionListResponse,
  ElectionReadiness,
  ElectionScheduleRequest,
  ElectionStatus,
  EmergencyCloseRequest,
  ResultVisibility,
} from "../types/elections";


interface GetElectionsOptions {
  page?: number;

  perPage?: number;

  status?:
    ElectionStatus |
    "";
}


export function getElections(
  options:
    GetElectionsOptions =
      {},
) {
  const params =
    new URLSearchParams();


  params.set(
    "page",
    String(
      options.page ??
        1,
    ),
  );

  params.set(
    "per_page",
    String(
      options.perPage ??
        50,
    ),
  );


  if (
    options.status
  ) {
    params.set(
      "status",
      options.status,
    );
  }


  return apiRequest<ElectionListResponse>(
    `/admin/elections?${params.toString()}`,
  );
}


export function getElection(
  electionId:
    string,
) {
  return apiRequest<Election>(
    `/admin/elections/${electionId}`,
  );
}


export function createElection(
  payload:
    CreateElectionRequest,
) {
  return apiRequest<Election>(
    "/admin/elections",
    {
      method:
        "POST",

      json:
        payload,
    },
  );
}

export function getElectionReadiness(
  electionId: string,
) {
  return apiRequest<ElectionReadiness>(
    `/admin/elections/${electionId}/readiness`,
  );
}


export function scheduleElection(
  electionId: string,
  payload: ElectionScheduleRequest,
) {
  return apiRequest<ElectionActionResponse>(
    `/admin/elections/${electionId}/schedule`,
    {
      method: "POST",
      json: payload,
    },
  );
}


export function startElection(
  electionId: string,
) {
  return apiRequest<ElectionActionResponse>(
    `/admin/elections/${electionId}/start`,
    {
      method: "POST",
    },
  );
}


export function closeElection(
  electionId: string,
) {
  return apiRequest<ElectionActionResponse>(
    `/admin/elections/${electionId}/close`,
    {
      method: "POST",
    },
  );
}


export function emergencyCloseElection(
  electionId: string,
  payload: EmergencyCloseRequest,
) {
  return apiRequest<ElectionActionResponse>(
    `/admin/elections/${electionId}/emergency-close`,
    {
      method: "POST",
      json: payload,
    },
  );
}


export function archiveElection(
  electionId: string,
) {
  return apiRequest<ElectionActionResponse>(
    `/admin/elections/${electionId}/archive`,
    {
      method: "POST",
    },
  );
}


export function updateElection(
  electionId: string,
  payload: {
    result_visibility?: ResultVisibility;
  },
) {
  return apiRequest<Election>(
    `/admin/elections/${electionId}`,
    {
      method: "PATCH",
      json: payload,
    },
  );
}
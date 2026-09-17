import {
  apiRequest,
} from "./client";

import type {
  Candidate,
  CandidateListResponse,
  CreateCandidateRequest,
  UpdateCandidateRequest,
} from "../types/candidates";


export function getCandidates(
  electionId: string,
) {
  return apiRequest<CandidateListResponse>(
    `/admin/elections/${electionId}/candidates`,
  );
}


export function createCandidate(
  electionId: string,
  payload: CreateCandidateRequest,
) {
  return apiRequest<Candidate>(
    `/admin/elections/${electionId}/candidates`,
    {
      method: "POST",
      json: payload,
    },
  );
}


export function updateCandidate(
  candidateId: string,
  payload: UpdateCandidateRequest,
) {
  return apiRequest<Candidate>(
    `/admin/candidates/${candidateId}`,
    {
      method: "PATCH",
      json: payload,
    },
  );
}


export function uploadCandidateImage(
  candidateId: string,
  image: File,
) {
  const formData =
    new FormData();

  formData.append(
    "image",
    image,
  );

  return apiRequest<Candidate>(
    `/admin/candidates/${candidateId}/image`,
    {
      method: "POST",
      body: formData,
    },
  );
}


export function deleteCandidateImage(
  candidateId: string,
) {
  return apiRequest<Candidate>(
    `/admin/candidates/${candidateId}/image`,
    {
      method: "DELETE",
    },
  );
}


export function activateCandidate(
  candidateId: string,
) {
  return apiRequest<Candidate>(
    `/admin/candidates/${candidateId}/activate`,
    {
      method: "POST",
    },
  );
}


export function deactivateCandidate(
  candidateId: string,
) {
  return apiRequest<Candidate>(
    `/admin/candidates/${candidateId}/deactivate`,
    {
      method: "POST",
    },
  );
}


export function deleteCandidate(
  candidateId: string,
) {
  return apiRequest<void>(
    `/admin/candidates/${candidateId}`,
    {
      method: "DELETE",
    },
  );
}
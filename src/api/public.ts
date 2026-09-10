import {
  apiRequest,
} from "./client";

import type {
  PublicCandidate,
  PublicCandidateListResponse,
  PublicElection,
  PublicElectionListResponse,
  PublicVoteStatus,
  SubmitVoteRequest,
  SubmitVoteResponse,
} from "../types/public";


export function initializePublicDevice() {
  return apiRequest<unknown>(
    "/public/device",
    {
      method: "POST",
    },
  );
}


export async function getPublicElections():
  Promise<PublicElection[]> {
  const response =
    await apiRequest<
      PublicElection[] |
      PublicElectionListResponse
    >(
      "/public/elections",
    );


  if (
    Array.isArray(
      response,
    )
  ) {
    return response;
  }


  return response.items ??
    [];
}


export function getPublicElection(
  electionId:
    string,
) {
  return apiRequest<PublicElection>(
    `/public/elections/${electionId}`,
  );
}


export async function getPublicCandidates(
  electionId:
    string,
):
  Promise<PublicCandidate[]> {
  const response =
    await apiRequest<
      PublicCandidate[] |
      PublicCandidateListResponse
    >(
      `/public/elections/${electionId}/candidates`,
    );


  const items =
    Array.isArray(
      response,
    )
      ? response
      : response.items ??
        [];


  return [
    ...items,
  ].sort(
    (
      first,
      second,
    ) =>
      first.display_order -
        second.display_order ||
      first.candidate_number -
        second.candidate_number,
  );
}


export function getPublicVoteStatus(
  electionId:
    string,
) {
  return apiRequest<PublicVoteStatus>(
    `/public/elections/${electionId}/vote-status`,
  );
}


export function submitPublicVote(
  electionId:
    string,
  payload:
    SubmitVoteRequest,
) {
  return apiRequest<SubmitVoteResponse>(
    `/public/elections/${electionId}/votes`,
    {
      method:
        "POST",

      json:
        payload,
    },
  );
}
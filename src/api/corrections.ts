import {
  apiRequest,
} from "./client";

import type {
  SuperAdminVote,
  VoteCorrection,
  VoteCorrectionCreateRequest,
} from "../types/corrections";


export function getSuperAdminVotes(
  electionId: string,
) {
  return apiRequest<SuperAdminVote[]>(
    `/super-admin/elections/${electionId}/votes`,
  );
}


export function createVoteCorrection(
  voteId: string,
  payload: VoteCorrectionCreateRequest,
) {
  return apiRequest<VoteCorrection>(
    `/super-admin/votes/${voteId}/corrections`,
    {
      method: "POST",
      json: payload,
    },
  );
}
export interface SuperAdminVote {
  vote_id: string;

  election_id: string;

  raw_candidate_ids: string[];

  effective_candidate_ids: string[];

  raw_is_blank: boolean;

  effective_is_blank: boolean;

  correction_version: number | null;

  submitted_at: string;
}


export interface VoteCorrectionCreateRequest {
  candidate_ids?: string[];
}


export interface VoteCorrection {
  id: string;

  vote_id: string;

  election_id: string;

  version: number;

  previous_candidate_ids: string[];

  corrected_candidate_ids: string[];

  previous_is_blank: boolean;

  corrected_is_blank: boolean;

  created_by: string;
}
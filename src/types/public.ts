export interface PublicVotingRules {
  min_selections: number;
  max_selections: number;
  allow_blank_ballot: boolean;
}

export interface PublicElection {
  id: string;
  title: string;
  description: string | null;
  status: string;

  expected_voters?: number;

  voting_rules: PublicVotingRules;

  start_at: string | null;
  end_at: string | null;

  result_visibility?: string;
}

export interface PublicCandidate {
  id: string;

  candidate_number: number;

  title: string | null;

  first_name: string;

  last_name: string;

  from: string | null;

  description: string | null;

  image_url: string | null;

  display_order: number;
}

export interface PublicElectionListResponse {
  items: PublicElection[];
  total?: number;
}

export interface PublicCandidateListResponse {
  items: PublicCandidate[];
  total?: number;
}

export interface PublicVoteStatus {
  has_voted: boolean;

  submitted_at?: string | null;
}

export interface SubmitVoteRequest {
  candidate_ids: string[];

  is_blank: boolean;
}

export interface SubmitVoteResponse {
  message?: string;

  submitted_at?: string;

  [key: string]: unknown;
}
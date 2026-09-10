export type ElectionStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "closed"
  | "archived";


export type ResultVisibility =
  | "hidden"
  | "live"
  | "after_close";


export type ElectionStartType =
  | "manual"
  | "automatic_timer";


export type ElectionCloseType =
  | "manual"
  | "automatic_timer"
  | "emergency";


export interface VotingRules {
  min_selections: number;

  max_selections: number;

  one_vote_per_device: boolean;

  allow_blank_ballot: boolean;
}


export interface Election {
  id: string;

  title: string;

  description: string | null;

  expected_voters: number;

  voting_rules: VotingRules;

  start_at: string | null;

  end_at: string | null;

  result_visibility: ResultVisibility;

  status: ElectionStatus;

  scheduled_at: string | null;

  scheduled_by: string | null;

  started_at: string | null;

  started_by: string | null;

  start_type: ElectionStartType | null;

  closed_at: string | null;

  closed_by: string | null;

  close_type: ElectionCloseType | null;

  close_reason: string | null;

  archived_at: string | null;

  archived_by: string | null;

  created_by: string;

  updated_by: string;

  created_at: string;

  updated_at: string;
}


export interface ElectionListResponse {
  items: Election[];

  total: number;

  page?: number;

  per_page?: number;
}


export interface CreateElectionRequest {
  title: string;

  description: string | null;

  expected_voters: number;

  voting_rules: VotingRules;

  result_visibility: ResultVisibility;
}


export interface ElectionReadiness {
  election_id: string;

  ready: boolean;

  active_candidate_count: number;

  min_selections: number;

  max_selections: number;

  issues: string[];
}


export interface ElectionScheduleRequest {
  start_at: string;

  end_at: string;
}


export interface EmergencyCloseRequest {
  reason: string;
}


export interface ElectionActionResponse {
  message: string;

  election: Election;
}
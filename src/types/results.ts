export interface CandidateResult {
  candidate_id: string;

  candidate_number: number;

  title: string | null;

  first_name: string;

  last_name: string;

  from: string | null;

  image_url: string | null;

  vote_count: number;

  ballot_percentage: number;

  selection_percentage: number;
}


export interface ElectionResult {
  election_id: string;

  title: string;

  status: string;

  result_visibility: string;

  expected_voters: number;

  total_ballots: number;

  non_blank_ballots: number;

  blank_ballots: number;

  total_candidate_selections: number;

  turnout_percentage: number;

  calculated_at: string;

  candidates: CandidateResult[];
}
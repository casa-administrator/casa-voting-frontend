export interface Candidate {
  id: string;

  election_id?: string;

  candidate_number: number;

  title: string | null;

  first_name: string;

  last_name: string;

  from: string | null;

  description: string | null;

  image_url: string | null;

  display_order: number;

  is_active: boolean;

  created_at?: string;

  updated_at?: string;
}


export interface CandidateListResponse {
  items: Candidate[];

  total?: number;
}


export interface CreateCandidateRequest {
  candidate_number: number;

  title: string | null;

  first_name: string;

  last_name: string;

  from: string | null;

  description: string | null;

  image_url: string | null;

  display_order: number;

  is_active: boolean;
}


export interface UpdateCandidateRequest {
  candidate_number: number;

  title: string | null;

  first_name: string;

  last_name: string;

  from: string | null;

  description: string | null;

  image_url: string | null;

  display_order: number;
}
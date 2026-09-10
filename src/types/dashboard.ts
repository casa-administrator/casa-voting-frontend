export interface DashboardElectionStats {
  total: number;
  live: number;
  scheduled: number;
  closed: number;
  draft?: number;
  archived?: number;
}

export interface DashboardUserStats {
  total: number;
  active: number;
}

export interface DashboardVotingStats {
  total_ballots: number;
}

export interface DashboardFocusElection {
  id?: string;
  title: string;
  status: string;
  expected_voters: number;
  ballots_cast: number;
  turnout_percentage: number;
  candidate_count: number;
}

export interface DashboardActivity {
  id: string;
  action: string;
  actor_email: string | null;
  actor_name: string | null;
  created_at: string;
}

export interface DashboardSummary {
  generated_at: string;

  elections: DashboardElectionStats;

  users: DashboardUserStats;

  voting: DashboardVotingStats;

  focus_election: DashboardFocusElection | null;

  recent_activity: DashboardActivity[];
}
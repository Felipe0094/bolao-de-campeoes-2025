export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  match_date: string;
  match_time: string;
  status: string;
  group_id: string;
  created_at: string;
  updated_at: string;
} 
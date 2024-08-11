export type User = {
  user_id: string;
  username: string;
  avatar: string;
};

export type UserDb = {
  user_id: string;
  username: string;
  avatar: string | null;
  type: string;
  updatedAt: Date;
  createdAt: Date;
};

export type LeagueDb = {
  league_id: string;
  name: string;
  avatar: string;
  season: string;
  settings: { [key: string]: string };
  scoring_settings: { [key: string]: number };
  roster_positions: string[];
  rosters: Roster[];
  updatedat: Date;
};

export type LeagueSettings = {
  taxi_slots: number;
  reserve_slots: number;
  best_ball: number;
  type: number;
  reserve_allow_na: number;
  reserve_allow_doubtful: number;
};

export type League = {
  index: number;
  league_id: string;
  name: string;
  avatar: string;
  season: string;
  settings: LeagueSettings;
  scoring_settings: { [key: string]: number };
  roster_positions: string[];
  rosters: Roster[];
  userRoster: Roster;
  updatedat: Date;
};

export type Roster = {
  roster_id: number;
  username: string;
  user_id: string;
  avatar: string | null;
  players: string[] | null;
  draftpicks: Draftpick[];
  starters: string[];
  taxi: string[];
  reserve: string[];
  wins: number;
  losses: number;
  ties: number;
  fp: number;
  fpa: number;
  proj_ros_s?: number;
  proj_ros_t?: number;
};

export type Draftpick = {
  season: number;
  round: number;
  roster_id: number;
  original_user: {
    avatar: string;
    user_id: string;
    username: string;
  };
  order?: number | null;
};

export type Leaguemate = {
  user_id: string;
  username: string;
  avatar: string | null;
  leagues: string[];
};

export type Matchup = {
  roster_id: number;
  matchup_id: number;
  league_id: string;
  players: string[];
  starters: string[];
};

export type MatchupOptimal = {
  roster_id: number;
  matchup_id: number;
  league_id: string;
  players: string[];
  starters: string[];
  optimal_starters: string[];
  optimal_proj: number;
  actual_proj: number;
  players_projections: { player_id: string; proj: number }[];
};

export type Trade = {
  transaction_id: string;
  status_updated: string;
  adds: { [key: string]: string };
  drops: { [key: string]: string };
  draft_picks: {
    season: string;
    round: number;
    order: number | null;
    original: string;
    old: string;
    new: string;
  }[];
  avatar: string;
  name: string;
  settings: { [key: string]: number };
  roster_positions: string[];
  managers: string[];
  rosters: {
    roster_id: number;
    username: string;
    user_id: string;
    avatar: string;
    players: string[];
  }[];
  league_id: string;
  tips?: {
    for: { league_id: string; leaguemate_id: string; player_id: string }[];
    away: { league_id: string; leaguemate_id: string; player_id: string }[];
  };
};

export type PlayerStat = {
  player_id: string;
  stats: { [key: string]: number };
  injury_status: string;
};

export type PlayerProjection = {
  projection: { [key: string]: number };
  injury_status: string;
};

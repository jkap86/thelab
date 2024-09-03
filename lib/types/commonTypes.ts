export type Allplayer = {
  player_id: string;
  position: string;
  team: string;
  full_name: string;
  age: number;
  fantasy_positions: string[];
  years_exp: number;
};

export type SleeperState = {
  season: string;
  season_type: string;
  leg: number;
};

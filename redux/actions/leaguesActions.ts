import { League } from "@/lib/types";
import { AppDispatch } from "../store";

interface setLeaguesColumnAction {
  type: "SET_LEAGUES_COLUMN";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    value: string;
  };
}

interface setActiveLeagueAction {
  type: "SET_ACTIVE_LEAGUE";
  payload: string;
}

interface setStandingsColumnAction {
  type: "SET_STANDINGS_COLUMN";
  payload: string;
}

interface setTeamColumnAction {
  type: "SET_TEAM_COLUMN";
  payload: string;
}

interface setSortLeaguesByAction {
  type: "SET_SORT_LEAGUES";
  payload: {
    col: 0 | 1 | 2 | 3 | 4;
    asc: boolean;
  };
}

interface setSearchedLeagueAction {
  type: "SET_SEARCHED_LEAGUE";
  payload: string | false;
}

interface setLeaguesPageAction {
  type: "SET_LEAGUES_PAGE";
  payload: number;
}

interface setStandingsTabAction {
  type: "SET_STANDINGS_TAB";
  payload: string;
}

interface setStandingsTab2Action {
  type: "SET_STANDINGS_TAB2";
  payload: string;
}

export type LeaguesActionTypes =
  | setLeaguesColumnAction
  | setActiveLeagueAction
  | setStandingsColumnAction
  | setTeamColumnAction
  | setSortLeaguesByAction
  | setSearchedLeagueAction
  | setLeaguesPageAction
  | setStandingsTabAction
  | setStandingsTab2Action;

export const setLeaguesColumn = (
  col: 0 | 1 | 2 | 3 | 4,
  value: string
): setLeaguesColumnAction => ({
  type: "SET_LEAGUES_COLUMN",
  payload: {
    col: col,
    value: value,
  },
});

export const setActiveLeague = (
  activeLeague: string
): setActiveLeagueAction => ({
  type: "SET_ACTIVE_LEAGUE",
  payload: activeLeague,
});

export const setStandingsColumn = (
  column: string
): setStandingsColumnAction => ({
  type: "SET_STANDINGS_COLUMN",
  payload: column,
});

export const setTeamColumn = (column: string): setTeamColumnAction => ({
  type: "SET_TEAM_COLUMN",
  payload: column,
});

export const setSortLeaguesBy = (
  column: 0 | 1 | 2 | 3 | 4,
  asc: boolean
): setSortLeaguesByAction => ({
  type: "SET_SORT_LEAGUES",
  payload: {
    col: column,
    asc: asc,
  },
});

export const setSearchedLeague = (
  searched: string | false
): setSearchedLeagueAction => ({
  type: "SET_SEARCHED_LEAGUE",
  payload: searched,
});

export const setLeaguesPage = (page: number): setLeaguesPageAction => ({
  type: "SET_LEAGUES_PAGE",
  payload: page,
});

export const setStandingsTab = (tab: string): setStandingsTabAction => ({
  type: "SET_STANDINGS_TAB",
  payload: tab,
});

export const setStandingsTab2 = (tab: string): setStandingsTab2Action => ({
  type: "SET_STANDINGS_TAB2",
  payload: tab,
});

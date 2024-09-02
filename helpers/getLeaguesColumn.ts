import { League, Allplayer, LeagueSettings, Roster } from "@/lib/types";
import { getTrendColor_Percentage, getTrendColor_Range } from "./getTrendColor";

/*
export const isIrEligible = (
  injury_status: string,
  settings: LeagueSettings
) => {
  switch (injury_status.toLowerCase()) {
    case "na":
      return settings.reserve_allow_na;
    case "doubtful":
      return settings.reserve_allow_doubtful;
    default:
      return 0;
  }
};
*/

export const columnOptions = [
  { text: "League ID", abbrev: "L ID" },
  { text: "Wins", abbrev: "Wins" },
  { text: "Losses", abbrev: "Losses" },
  { text: "Ties", abbrev: "Ties" },
  { text: "Fantasy Points", abbrev: "FP" },
  { text: "Fantasy Points Against", abbrev: "FPA" },
  { text: "Open Roster Spots", abbrev: "O R S" },
  { text: "Open Taxi Spots", abbrev: "O T S" },
  { text: "Open IR Spots", abbrev: "O IR S" },
  { text: "Total Projected Points Rank", abbrev: "T Proj Rk" },
  { text: "Starter Projected Points Rank", abbrev: "S Proj Rk" },
  { text: "Total KTC Rank", abbrev: "T KTC Rk" },
  { text: "Starters KTC Rank", abbrev: "S KTC Rk" },
];

export const getLeaguesColumn = (
  col: string,
  league: League,
  ktc_current: { [key: string]: number },
  fpseason: { [key: string]: { [key: string]: number } },
  allplayers: { [key: string]: Allplayer },
  lmroster?: Roster
) => {
  const wins = league.rosters.map((roster) => roster.wins);
  const min_wins = Math.min(...wins);
  const max_wins = Math.max(...wins);

  let text;
  let trendColor;

  switch (col) {
    case "S Proj Rk":
      const s_rank =
        [...(league.rosters || [])]
          .sort((a, b) => (b?.proj_ros_s || 0) - (a?.proj_ros_s || 0))
          .findIndex(
            (roster) => roster.roster_id === league.userRoster.roster_id
          ) + 1;

      text = s_rank;

      trendColor = getTrendColor_Range(s_rank, 1, league.rosters.length, true);
      break;
    case "T Proj Rk":
      const t_rank =
        [...(league.rosters || [])]
          .sort((a, b) => (b?.proj_ros_t || 0) - (a.proj_ros_t || 0))
          .findIndex(
            (roster) => roster.roster_id === league.userRoster.roster_id
          ) + 1;

      text = t_rank;

      trendColor = getTrendColor_Range(t_rank, 1, league.rosters.length, true);
      break;
    case "T KTC Rk":
      const values = league.rosters
        .map((roster) => {
          return {
            roster_id: roster.roster_id,
            value: roster.players?.reduce(
              (acc, cur) => acc + (ktc_current?.[cur] || 0),
              0
            ),
          };
        })
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      text =
        values.findIndex((v) => v.roster_id === league.userRoster.roster_id) +
        1;

      trendColor = getTrendColor_Range(text, 0, league.rosters.length, true);
      break;
    case "S KTC Rk":
      const values_s = league.rosters
        .map((roster) => {
          return {
            roster_id: roster.roster_id,
            value: roster.starters?.reduce(
              (acc, cur) => acc + ktc_current?.[cur] || 0,
              0
            ),
          };
        })
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      text =
        values_s.findIndex((v) => v.roster_id === league.userRoster.roster_id) +
        1;

      trendColor = getTrendColor_Range(text, 0, league.rosters.length, true);

      break;
    case "L ID":
      text = league.league_id;

      trendColor = { color: `rgb(255, 255, 255)` };
      break;
    case "Wins":
      text = league.userRoster.wins;

      trendColor = getTrendColor_Range(text, min_wins, max_wins);
      break;
    case "Losses":
      text = league.userRoster.losses;

      const losses = league.rosters.map((roster) => roster.losses);
      const min_losses = Math.min(...losses);
      const max_losses = Math.max(...losses);

      trendColor = getTrendColor_Range(text, min_losses, max_losses);
      break;
    case "Ties":
      text = league.userRoster.ties;

      const ties = league.rosters.map((roster) => roster.ties);
      const min_ties = Math.min(...ties);
      const max_ties = Math.max(...ties);

      trendColor = getTrendColor_Range(text, min_ties, max_ties);
      break;
    case "FP":
      text = league.userRoster.fp;

      const fp = league.rosters.map((roster) => roster.fp);

      trendColor = getTrendColor_Percentage(text, fp);
      break;
    case "FPA":
      text = league.userRoster.fpa;

      const fpa = league.rosters.map((roster) => roster.fpa);

      trendColor = getTrendColor_Percentage(text, fpa);
      break;
    case "O R S":
      text =
        league.roster_positions.length -
        (league.userRoster.players?.length || 0) +
        league.userRoster.taxi.length +
        league.userRoster.reserve.length;

      trendColor =
        text === 0 ? { color: `rgb(0, 255, 0)` } : { color: `rgb(255, 0, 0)` };
      break;
    case "O T S":
      text =
        league.settings.best_ball === 1
          ? 0
          : league.settings.taxi_slots - league.userRoster.taxi.length;

      trendColor =
        text === 0 ? { color: `rgb(0, 255, 0)` } : { color: `rgb(255, 0, 0)` };
      break;
    case "O IR S":
      text =
        league.settings.best_ball === 1
          ? 0
          : league.settings.reserve_slots - league.userRoster.reserve.length;

      trendColor =
        text === 0 ? { color: `rgb(0, 255, 0)` } : { color: `rgb(255, 0, 0)` };
      break;
    case "Lm Wins":
      text = (lmroster && lmroster.wins.toString()) || "-";

      trendColor = getTrendColor_Range(
        typeof text === "string" ? 0 : text,
        min_wins,
        max_wins
      );
      break;
    case "LmS Proj":
      const lm_s_rank =
        [...(league.rosters || [])]
          .sort((a, b) => (b?.proj_ros_s || 0) - (a?.proj_ros_s || 0))
          .findIndex((roster) => roster.roster_id === lmroster?.roster_id) + 1;

      text = lm_s_rank;

      trendColor = getTrendColor_Range(
        lm_s_rank,
        1,
        league.rosters.length,
        true
      );
      break;
    case "LmT Proj":
      const lm_t_rank =
        [...(league.rosters || [])]
          .sort((a, b) => (b?.proj_ros_t || 0) - (a.proj_ros_t || 0))
          .findIndex((roster) => roster.roster_id === lmroster?.roster_id) + 1;

      text = lm_t_rank;

      trendColor = getTrendColor_Range(
        lm_t_rank,
        1,
        league.rosters.length,
        true
      );
      break;
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      break;
  }

  return { text, trendColor };
};

export const getLeaguesSortValue = (
  sortCol: string,
  asc: boolean,
  league: League,
  ktc_current: { [key: string]: number },
  fpseason: { [key: string]: { [key: string]: number } },
  allplayers: { [key: string]: Allplayer },
  owned_by?: string,
  lmroster?: Roster
) => {
  let sortValue;

  switch (sortCol) {
    case "Owned By":
      sortValue = owned_by || league.index;
      break;
    case "S Proj Rk":
      sortValue =
        [...(league.rosters || [])]
          .sort((a, b) => (b.proj_ros_s || 0) - (a.proj_ros_s || 0))
          .findIndex(
            (roster) => roster.roster_id === league.userRoster.roster_id
          ) + 1;
      break;
    case "T Proj Rk":
      sortValue = [...(league.rosters || [])]
        .sort((a, b) => (b.proj_ros_t || 0) - (a.proj_ros_t || 0))
        .findIndex(
          (roster) => roster.roster_id === league.userRoster.roster_id
        );
      break;
    case "T KTC Rk":
      const values = league.rosters
        .map((roster) => {
          return {
            roster_id: roster.roster_id,
            value: roster.players?.reduce(
              (acc, cur) => acc + (ktc_current?.[cur] || 0),
              0
            ),
          };
        })
        .sort((a, b) => (b.value || 0) - (a.value || 0));

      sortValue =
        values.findIndex((v) => v.roster_id === league.userRoster.roster_id) +
        1;
      break;
    case "S KTC Rk":
      const values_s = league.rosters
        .map((roster) => {
          return {
            roster_id: roster.roster_id,
            value: roster.starters?.reduce(
              (acc, cur) => acc + (ktc_current?.[cur] || 0),
              0
            ),
          };
        })
        .sort((a, b) => (b.value || 0) - (a.value || 0));
      sortValue =
        values_s.findIndex((v) => v.roster_id === league.userRoster.roster_id) +
        1;
      break;
    case "LmT Proj":
      const lm_t_rank =
        [...(league.rosters || [])]
          .sort((a, b) => (b?.proj_ros_t || 0) - (a.proj_ros_t || 0))
          .findIndex((roster) => roster.roster_id === lmroster?.roster_id) + 1;

      sortValue = lm_t_rank;
      break;
    case "LmS Proj":
      const lm_s_rank =
        [...(league.rosters || [])]
          .sort((a, b) => (b?.proj_ros_s || 0) - (a?.proj_ros_s || 0))
          .findIndex((roster) => roster.roster_id === lmroster?.roster_id) + 1;

      sortValue = lm_s_rank;
      break;
    case "League":
      sortValue = asc ? league.name : league.index;
      break;
    case "L ID":
      sortValue = parseInt(league.league_id);
      break;
    case "Wins":
      sortValue = league.userRoster.wins;
      break;
    case "Losses":
      sortValue = league.userRoster.losses;
      break;
    case "Ties":
      sortValue = league.userRoster.ties;
      break;
    case "FP":
      sortValue = league.userRoster.fp;
      break;
    case "FPA":
      sortValue = league.userRoster.fpa;
      break;
    case "O R S":
      sortValue =
        league.roster_positions.length -
        (league.userRoster.players?.length || 0) +
        league.userRoster.taxi.length +
        league.userRoster.reserve.length;
      break;
    case "O T S":
      sortValue =
        league.settings.best_ball === 1
          ? 0
          : league.settings.taxi_slots - league.userRoster.taxi.length;
      break;

    case "O IR S":
      sortValue =
        league.settings.best_ball === 1
          ? 0
          : league.settings.reserve_slots - league.userRoster.reserve.length;
      break;
    default:
      sortValue = asc ? league.index : -league.index;
      break;
  }

  return sortValue;
};

import { League, MatchupOptimal } from "@/lib/types";

export const columnOptions_lc = [
  {
    text: "Optimal Projection - Current Projection",
    abbrev: "Opt-Act",
  },
  {
    text: "Move Players into FLEX",
    abbrev: "Mv to FLX",
  },
  {
    text: "Move Players out of FLEX",
    abbrev: "Mv frm FLX",
  },
  {
    text: "Initial Projected Result",
    abbrev: "Proj Result I",
  },
  {
    text: "User Live Projection",
    abbrev: "User",
  },
  {
    text: "Opponent Live Projection",
    abbrev: "Opp",
  },
  {
    text: "Median Live Projection",
    abbrev: "Median",
  },
  {
    text: "Live Projected Result",
    abbrev: "Proj Result L",
  },
];

export const getLineupcheckColumn = (
  col: string,
  asc: boolean,
  matchup: { user: MatchupOptimal; opp: MatchupOptimal; median?: number },
  league: League,
  live_stats: {
    leagues: {
      [key: string]: {
        user: {
          points_total: number;
          proj_remaining_total: number;
          players_points: { [player_id: string]: number };
          players_proj_remaining: { [player_id: string]: number };
          starters: string[];
        };
        opp: {
          points_total: number;
          proj_remaining_total: number;
          players_points: { [player_id: string]: number };
          players_proj_remaining: { [player_id: string]: number };
          starters: string[];
        };
        median: {
          current: number | undefined;
          projected: number | undefined;
        };
      };
    };
    teamGameSecLeft: { [team_id: string]: number };
  }
) => {
  const user_matchup = matchup.user;

  const delta =
    (user_matchup &&
      (user_matchup.starters.some(
        (s) =>
          !user_matchup.optimal_starters.map((os) => os.player_id).includes(s)
      ) ||
      user_matchup.optimal_starters.some(
        (os) => !user_matchup.starters.includes(os.player_id)
      )
        ? user_matchup.optimal_proj - user_matchup.actual_proj
        : "\u2713")) ||
    "-";

  const move_into_flex = league.settings.best_ball
    ? 0
    : (user_matchup?.optimal_starters || []).filter((os) => os.move_into_flex)
        .length;

  const move_outof_flex = league.settings.best_ball
    ? 0
    : (user_matchup?.optimal_starters || []).filter((os) => os.move_outof_flex)
        .length;

  const user_live_proj =
    live_stats.leagues[league.league_id]?.user?.proj_remaining_total?.toFixed(
      1
    ) || "-";

  const opp_live_proj =
    live_stats.leagues[league.league_id]?.opp?.proj_remaining_total?.toFixed(
      1
    ) || "-";

  const median_live_proj =
    live_stats.leagues[league.league_id]?.median?.projected?.toFixed(1) || "-";

  let text;
  let trendColor;
  let sortValue;

  switch (col) {
    case "Opt-Act":
      text = (typeof delta === "number" && delta.toFixed(2)) || delta;
      trendColor =
        typeof delta === "number"
          ? { color: `rgb(255, 0, 0)` }
          : { color: `rgb(0, 255, 0)` };
      break;
    case "Mv to FLX":
      text = move_into_flex > 0 ? move_into_flex : "\u2713";
      trendColor =
        move_into_flex > 0
          ? { color: `rgb(255, 0, 0)` }
          : { color: `rgb(0, 255, 0)` };
      break;
    case "Mv frm FLX":
      text = move_outof_flex > 0 ? move_outof_flex : "\u2713";
      trendColor =
        move_outof_flex > 0
          ? { color: `rgb(255, 0, 0)` }
          : { color: `rgb(0, 255, 0)` };
      break;
    case "Proj Result I":
      text = (
        <>
          {user_matchup.actual_proj > matchup.opp.actual_proj ? (
            <span className="green">W</span>
          ) : user_matchup.actual_proj < matchup.opp.actual_proj ? (
            <span className="red">L</span>
          ) : (
            <span>T</span>
          )}
          &nbsp;
          {matchup.median ? (
            user_matchup.actual_proj > matchup.median ? (
              <span className="green">W</span>
            ) : (
              <span className="red">L</span>
            )
          ) : (
            ""
          )}
        </>
      );
      break;
    case "User":
      text = user_live_proj;
      trendColor = { color: `rgb(255, 255, 255)` };
      sortValue = user_live_proj;
      break;
    case "Opp":
      text = opp_live_proj;
      trendColor =
        user_live_proj > opp_live_proj
          ? { color: `rgb(0, 255, 0)` }
          : opp_live_proj > user_live_proj
          ? { color: `rgb(255, 0, 0)` }
          : { color: `rgb(255, 255, 255)` };
      sortValue = opp_live_proj;
      break;
    case "Median":
      text = median_live_proj;
      trendColor = (live_stats.leagues[league.league_id]?.median?.projected &&
        (user_live_proj > median_live_proj
          ? { color: `rgb(0, 255, 0)` }
          : median_live_proj > user_live_proj
          ? { color: `rgb(255, 0, 0)` }
          : { color: `rgb(255, 255, 255)` })) || {
        color: `rgb(255, 255, 255)`,
      };
      sortValue = median_live_proj;
      break;
    case "Proj Result L":
      text = (
        <>
          {user_live_proj > opp_live_proj ? (
            <span className="green">W</span>
          ) : user_live_proj < opp_live_proj ? (
            <span className="red">L</span>
          ) : (
            <span>T</span>
          )}
          &nbsp;
          {median_live_proj ? (
            user_live_proj > median_live_proj ? (
              <span className="green">W</span>
            ) : (
              <span className="red">L</span>
            )
          ) : (
            ""
          )}
        </>
      );
      break;
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      sortValue = league.index;
      break;
  }

  return { text, trendColor };
};

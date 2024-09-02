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
    text: "Projected Result",
    abbrev: "Proj Result",
  },
];

export const getLineupcheckColumn = (
  col: string,
  asc: boolean,
  matchup: { user: MatchupOptimal; opp: MatchupOptimal; median?: number },
  league: League
) => {
  const user_matchup = matchup.user;

  const delta =
    user_matchup &&
    (user_matchup.starters.some(
      (s) =>
        !user_matchup.optimal_starters.map((os) => os.player_id).includes(s)
    ) ||
      user_matchup.optimal_starters.some(
        (os) => !user_matchup.starters.includes(os.player_id)
      ))
      ? user_matchup.optimal_proj - user_matchup.actual_proj
      : "\u2713" || "-";

  const move_into_flex = league.settings.best_ball
    ? 0
    : (user_matchup?.optimal_starters || []).filter((os) => os.move_into_flex)
        .length;

  const move_outof_flex = league.settings.best_ball
    ? 0
    : (user_matchup?.optimal_starters || []).filter((os) => os.move_outof_flex)
        .length;

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
    case "Proj Result":
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
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      sortValue = league.index;
      break;
  }

  return { text, trendColor };
};

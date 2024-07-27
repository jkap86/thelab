import { League } from "@/lib/types";

export const filterLeagues = (
  leagues: League[],
  type1: string,
  type2: string
) => {
  return leagues.filter((league) => {
    const condition1 =
      type1 === "All" ||
      (type1 === "Redraft" && league.settings.type !== 2) ||
      (type1 === "Dynasty" && league.settings.type === 2);

    const condition2 =
      type2 === "All" ||
      (type2 === "Bestball" && league.settings.best_ball === 1) ||
      (type2 === "Lineup" && league.settings.best_ball !== 1);

    return condition1 && condition2;
  });
};

export const filterLeagueIds = (
  league_ids: string[],
  leagues: { [key: string]: League },
  type1: string,
  type2: string
) => {
  return league_ids.filter((league_id) => {
    const condition1 =
      type1 === "All" ||
      (type1 === "Redraft" && leagues[league_id].settings.type !== 2) ||
      (type1 === "Dynasty" && leagues[league_id].settings.type === 2);

    const condition2 =
      type2 === "All" ||
      (type2 === "Bestball" && leagues[league_id].settings.best_ball === 1) ||
      (type2 === "Lineup" && leagues[league_id].settings.best_ball !== 1);

    return condition1 && condition2;
  });
};

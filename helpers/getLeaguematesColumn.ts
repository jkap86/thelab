import { League } from "@/lib/types";
import { filterLeagueIds } from "./filterLeagues";

export const getLeaguematesColumn = (
  col: string,
  commonLeagues: string[],
  leagues: { [key: string]: League },
  type1: string,
  type2: string
) => {
  let text, trendColor;

  switch (col) {
    case "# C L":
      text = filterLeagueIds(commonLeagues, leagues, type1, type2).length;

      trendColor = { color: `rgb(255, 255, 255)` };
      break;
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      break;
  }
  return { text, trendColor };
};

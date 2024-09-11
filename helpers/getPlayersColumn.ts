import { Allplayer, League, User } from "@/lib/types";
import { getTrendColor_Range } from "./getTrendColor";
import {
  filterLeagueIds,
  filterLeagues,
  filterLmLeagues,
} from "./filterLeagues";

export const getPlayersColumn = (
  col: string,
  player_obj: Allplayer,
  playershare: {
    owned: string[];
    taken: {
      lm_roster_id: number;
      lm: User;
      league: string;
    }[];
    available: string[];
  },
  leagues: { [key: string]: League } | false,
  ktc_current: {
    [key: string]: { value: number; trend_week: number; trend_month: number };
  },
  type1: string,
  type2: string
) => {
  const total =
    (leagues && filterLeagues(Object.values(leagues), type1, type2)) || [];
  const owned =
    (leagues && filterLeagueIds(playershare.owned, leagues, type1, type2)) ||
    [];
  const taken =
    (leagues && filterLmLeagues(playershare.taken, leagues, type1, type2)) ||
    [];

  const available =
    (leagues &&
      filterLeagueIds(playershare.available, leagues, type1, type2)) ||
    [];

  let text, trendColor;

  switch (col) {
    case "Age":
      text = player_obj.age;

      const min_age = 21;
      const max_age =
        player_obj?.position === "QB"
          ? 35
          : ["WR", "TE"].includes(player_obj.position)
          ? 30
          : 28;

      trendColor = getTrendColor_Range(text, min_age, max_age, true);
      break;
    case "# Own":
      text = owned.length;

      trendColor = getTrendColor_Range(text / total.length, 0, 0.25);
      break;
    case "% Own":
      text = Math.round((owned.length * 1000) / total.length) / 10;

      trendColor = getTrendColor_Range(text, 0, 25);
      break;
    case "# Taken":
      text = taken.length;

      trendColor = getTrendColor_Range(text, 0, 0.75);
      break;
    case "# Avail":
      text = available.length;

      trendColor = getTrendColor_Range(text, 0, 0.25);
      break;
    case "KTC":
      text = ktc_current[player_obj.player_id]?.value || 0;
      trendColor = getTrendColor_Range(text, 0, 10000);
      break;
    case "KTC 7":
      text =
        (ktc_current[player_obj.player_id]?.value || 0) -
        (ktc_current[player_obj.player_id]?.trend_week || 0);
      trendColor = getTrendColor_Range(text, -500, 500);
      break;
    case "KTC 30":
      text =
        (ktc_current[player_obj.player_id]?.value || 0) -
        (ktc_current[player_obj.player_id]?.trend_month || 0);
      trendColor = getTrendColor_Range(text, -1000, 1000);
      break;
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      break;
  }

  return { text, trendColor };
};

export const getPlayersSortValue = (
  sortCol: string,
  player_obj: Allplayer,
  playershare: {
    owned: string[];
    taken: {
      lm_roster_id: number;
      lm: User;
      league: string;
    }[];
    available: string[];
  },
  leagues: { [key: string]: League } | false,
  ktc_current: {
    [key: string]: { value: number; trend_week: number; trend_month: number };
  },
  type1: string,
  type2: string
) => {
  let sortValue;

  switch (sortCol) {
    case "Player":
      sortValue = player_obj.player_id;
      break;
    case "# Own":
      sortValue = (
        (leagues &&
          filterLeagueIds(playershare.owned, leagues, type1, type2)) ||
        []
      ).length;
      break;
    case "Age":
      sortValue = player_obj.age || 999;
      break;
    case "KTC":
      sortValue = ktc_current[player_obj.player_id]?.value || 0;
      break;
    case "KTC 7":
      sortValue =
        (ktc_current[player_obj.player_id]?.value || 0) -
        (ktc_current[player_obj.player_id]?.trend_week || 0);
      break;
    case "KTC 30":
      sortValue =
        (ktc_current[player_obj.player_id]?.value || 0) -
        (ktc_current[player_obj.player_id]?.trend_month || 0);
      break;
    default:
      sortValue = playershare.owned.length;
      break;
  }

  return sortValue;
};

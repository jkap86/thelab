import { Allplayer, League, User } from "@/lib/types";
import { getTrendColor_Range } from "./getTrendColor";
import { filterLeagueIds, filterLeagues } from "./filterLeagues";

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
  ktc_current: { [key: string]: number },
  type1: string,
  type2: string
) => {
  const total =
    (leagues && filterLeagues(Object.values(leagues), type1, type2)) || [];
  const owned =
    (leagues && filterLeagueIds(playershare.owned, leagues, type1, type2)) ||
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
      text =
        Math.round(
          (playershare.owned.length * 1000) / Object.keys(leagues).length
        ) / 10;

      trendColor = getTrendColor_Range(text, 0, 25);
      break;
    case "# Avail":
      text = playershare.available.length;

      trendColor = getTrendColor_Range(text, 0, 0.25);
      break;
    case "KTC":
      text = ktc_current[player_obj.player_id];
      trendColor = getTrendColor_Range(parseInt(text), 0, 10000);
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
  ktc_current: { [key: string]: number },
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
      sortValue = parseInt(ktc_current[player_obj.player_id]) || 0;
      break;
    default:
      sortValue = playershare.owned.length;
      break;
  }

  return sortValue;
};

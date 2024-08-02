import { Allplayer, Roster } from "@/lib/types";
import { getTrendColor_Percentage, getTrendColor_Range } from "./getTrendColor";
import { getPlayerProjection } from "./getPlayerShares";

export const getStandingsColumn = (
  column: string,
  roster: Roster,
  rosters: Roster[],
  ktc_current: { [key: string]: number },
  fpseason: { [key: string]: { [key: string]: number } },
  scoring_settings: { [key: string]: number },
  allplayers: { [key: string]: Allplayer }
) => {
  let text;
  let trendColor;
  let sortby;

  switch (column) {
    case "T KTC":
      sortby =
        roster.players?.reduce(
          (acc, cur) => acc + (ktc_current[cur] || 0),
          0
        ) || 0;

      text = sortby.toLocaleString("en-US");

      const ktc_values_t = rosters.map(
        (r) =>
          r.players?.reduce((acc, cur) => acc + (ktc_current[cur] || 0), 0) || 0
      );

      trendColor = getTrendColor_Range(
        sortby,
        Math.min(...ktc_values_t),
        Math.max(...ktc_values_t)
      );
      break;
    case "S KTC":
      sortby = roster.starters?.reduce(
        (acc, cur) => acc + (ktc_current[cur] || 0),
        0
      );

      text = sortby.toLocaleString("en-US");

      const ktc_values_s = rosters.map((r) =>
        r.starters?.reduce((acc, cur) => acc + (ktc_current[cur] || 0), 0)
      );

      trendColor = getTrendColor_Range(
        sortby,
        Math.min(...ktc_values_s),
        Math.max(...ktc_values_s)
      );
      break;
    case "S Proj":
      sortby = roster?.proj_ros_s || 0;

      text = Math.round(sortby).toLocaleString("en-US");

      const proj_values = rosters.map((roster) => roster?.proj_ros_s || 0);

      trendColor = getTrendColor_Range(
        sortby,
        Math.min(...proj_values),
        Math.max(...proj_values)
      );
      break;
    case "T Proj":
      sortby = roster?.proj_ros_t || 0;

      text = Math.round(sortby).toLocaleString("en-US");

      const proj_values_t = rosters.map((roster) => roster?.proj_ros_t || 0);

      trendColor = getTrendColor_Range(
        sortby,
        Math.min(...proj_values_t),
        Math.max(...proj_values_t)
      );
      break;
    case "W":
      const wins = rosters.map((r) => r.wins);
      text = roster.wins;
      trendColor = getTrendColor_Range(
        roster.wins,
        Math.min(...wins),
        Math.max(...wins)
      );

      sortby = text;
      break;
    case "L":
      const losses = rosters.map((r) => r.losses);
      text = roster.losses;
      trendColor = getTrendColor_Range(
        roster.wins,
        Math.min(...losses),
        Math.max(...losses)
      );
      sortby = text;
      break;
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      sortby = 0;
      break;
  }
  return { text, trendColor, sortby };
};

export const getTeamColumn = (
  column: string,
  player: Allplayer,
  ktc_current: { [key: string]: number },
  fpseason: { [key: string]: { [key: string]: number } },
  scoring_settings: { [key: string]: number },
  allplayers: { [key: string]: Allplayer },
  rosters: Roster[]
) => {
  let text, trendColor;

  switch (column) {
    case "Proj":
      text = Math.round(
        getPlayerProjection(player.player_id, scoring_settings, fpseason)
      );

      const positional_values = Object.keys(fpseason)
        .filter(
          (player_id) =>
            allplayers[player_id].position === player.position &&
            rosters.find((r) => r.starters.includes(player_id))
        )
        .map((player_id) =>
          getPlayerProjection(player_id, scoring_settings, fpseason)
        );

      trendColor = getTrendColor_Range(
        text,
        Math.min(...positional_values),
        Math.max(...positional_values)
      );
      break;
    case "KTC":
      text =
        (ktc_current?.[player?.player_id] && ktc_current[player.player_id]) ||
        0;
      trendColor = getTrendColor_Range(text, 0, 10000);
      break;
    case "Age":
      text = player?.age || "-";

      if (typeof text === "number") {
        const min_age = 21;
        const max_age =
          player?.position === "QB"
            ? 35
            : ["WR", "TE"].includes(player.position)
            ? 30
            : 28;

        trendColor = getTrendColor_Range(text, min_age, max_age, true);
      } else {
        trendColor = { color: `rgb(255, 255, 255)` };
      }
      break;
    case "Tm":
      text = player?.team || "FA";

      let color1, color2, color3, backgroundImage;
      switch (text) {
        case "ARI":
          color1 = `rgb(0, 0, 0)`;
          color2 = `#97233F`;
          color3 = `white`;
          backgroundImage = "none";
          break;
        case "ATL":
          color1 = `rgb(0, 0, 0)`;
          color2 = `rgb(167, 25, 48)`;
          color3 = `rgb(165, 172, 175)`;
          backgroundImage = "none";
          break;
        case "BAL":
          color1 = `rgb(0, 0, 0)`;
          color2 = `#241773`;
          color3 = `rgb(158, 124, 12)`;
          backgroundImage = "none";
          break;
        case "BUF":
          color1 = `#C60C30`;
          color2 = `#00338D`;
          color3 = `white`;
          backgroundImage = "none";
          break;
        case "CAR":
          color1 = `#101820`;
          color2 = `#0085CA`;
          color3 = `#BFC0BF`;
          backgroundImage = "none";
          break;
        case "CHI":
          color1 = `#C83803`;
          color2 = `#0B162A`;
          color3 = `white`;
          backgroundImage = "none";
          break;
        case "CIN":
          color1 = "black";
          color2 = `#C83803`;
          color3 = `white`;
          backgroundImage = "none";
          break;
        case "CLE":
          color1 = `#FF3C00`;
          color2 = `#C83803`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "DAL":
          color1 = `#869397`;
          color2 = `#041E42`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "DEN":
          color1 = `#FB4F14`;
          color2 = `#002244`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "DET":
          color1 = `#B0B7BC`;
          color2 = `#0076B6`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "GB":
          color1 = `#FFB612`;
          color2 = `#203731`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "HOU":
          color1 = `#03202F`;
          color2 = `#A71930`;
          color3 = "white";
          backgroundImage = "none";
          break;
        case "IND":
          color1 = "white";
          color2 = `#002C5F`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "JAX":
          color1 = `#D7A22A`;
          color2 = `#006778`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "KC":
          color1 = `#FFB81C`;
          color2 = `#E31837`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "LAC":
          color1 = `#FFC20E`;
          color2 = `#0080C6`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "LAR":
          color1 = `#FFD100`;
          color2 = `#003594`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "MIA":
          color1 = `#FC4C02`;
          color2 = `#008E97`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "MIN":
          color1 = `#FFC62F`;
          color2 = `#4F2683`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "NE":
          color1 = `#002244`;
          color2 = `#B0B7BC`;
          color3 = `#C60C30`;
          backgroundImage = "none";
          break;
        case "NO":
          color1 = `black`;
          color2 = `#D3BC8D`;
          color3 = `white`;
          backgroundImage = "none";
          break;
        case "NYG":
          color1 = `#A5ACAF`;
          color2 = `#0B2265`;
          color3 = `#A71930`;
          backgroundImage = "none";
          break;
        case "NYJ":
          color1 = `white`;
          color2 = `#125740`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "LV":
          color1 = `white`;
          color2 = "black";
          color3 = `#A5ACAF`;
          backgroundImage = "none";
          break;
        case "PHI":
          color1 = `#565A5C`;
          color2 = "#004C54";
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "PIT":
          color1 = "black";
          color2 = `#FFB612`;
          color3 = `#A5ACAF`;
          backgroundImage = "none";
          break;
        case "SF":
          color1 = `#B3995D`;
          color2 = "#AA0000";
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "SEA":
          color1 = `#69BE28`;
          color2 = "#002244";
          color3 = `#A5ACAF`;
          backgroundImage = "none";
          break;
        case "TB":
          color1 = `#34302B`;
          color2 = "#D50A0A";
          color3 = `#FF7900`;
          backgroundImage = "none";
          break;
        case "TEN":
          color1 = "#4B92DB";
          color2 = `#0C2340`;
          color3 = `black`;
          backgroundImage = "none";
          break;
        case "WAS":
          color1 = `#FFB612`;
          color2 = "#5A1414";
          color3 = `black`;
          backgroundImage = "none";
          break;
        default:
          color1 = `white`;
          color2 = `transparent`;
          color3 = `black`;
          backgroundImage = "";
          break;
      }
      trendColor = {
        color: color1,
        "text-shadow": `0 0 .5rem ${color3}`,
        "background-color": color2,
        "background-image": backgroundImage,
        "font-weight": "900",
      };
      break;
    default:
      text = "-";
      trendColor = { color: `rgb(255, 255, 255)` };
      break;
  }

  return { text, trendColor };
};

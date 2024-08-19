import { Trade, League, Allplayer } from "@/lib/types";
import { getOptimalStarters } from "./getPlayerShares";

export const getTradeTips = (
  trades: Trade[],
  leagues: { [key: string]: League },
  fpseason: { [key: string]: { [key: string]: number } },
  allplayers: { [key: string]: Allplayer }
) => {
  const trades_w_tips: Trade[] = [];

  trades.forEach((trade) => {
    const trade_away: {
      league_id: string;
      leaguemate_id: string;
      player_id: string;
    }[] = [];

    Object.keys(trade.adds || {}).forEach((player_id) => {
      const lm_user_id = trade.adds[player_id];

      if (lm_user_id) {
        Object.keys(leagues)
          .filter((league_id) => {
            return (
              league_id !== trade.league_id &&
              lm_user_id !== leagues[league_id].userRoster.user_id &&
              leagues[league_id].userRoster.players?.includes(player_id) &&
              leagues[league_id].rosters.find((r) => r.user_id === lm_user_id)
            );
          })
          .forEach((league_id) => {
            trade_away.push({
              league_id: league_id,
              player_id: player_id,
              leaguemate_id: lm_user_id,
            });
          });
      }
    });

    const acquire: {
      league_id: string;
      leaguemate_id: string;
      player_id: string;
    }[] = [];

    Object.keys(trade.drops || {}).forEach((player_id) => {
      const lm_user_id = trade.drops[player_id];

      if (lm_user_id) {
        Object.keys(leagues)
          .filter((league_id) => {
            return (
              league_id !== trade.league_id &&
              lm_user_id !== leagues[league_id].userRoster.user_id &&
              leagues[league_id].rosters?.find(
                (r) =>
                  r.user_id === lm_user_id && r.players?.includes(player_id)
              )
            );
          })
          .forEach((league_id) => {
            acquire.push({
              league_id: league_id,
              player_id: player_id,
              leaguemate_id: lm_user_id,
            });
          });
      }
    });

    trades_w_tips.push({
      ...trade,
      rosters: trade.rosters.map((r) => {
        const { starters, proj_ros_s, proj_ros_t } = getOptimalStarters(
          r,
          trade.roster_positions,
          fpseason,
          allplayers,
          trade.scoring_settings
        );
        return {
          ...r,
          starters,
          proj_ros_s,
          proj_ros_t,
        };
      }),
      tips: {
        for: acquire,
        away: trade_away,
      },
    });
  });
  return trades_w_tips;
};

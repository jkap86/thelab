import {
  Allplayer,
  League,
  Matchup,
  PlayerProjection,
  Roster,
  User,
} from "@/lib/types";

export const position_map: { [key: string]: string[] } = {
  QB: ["QB"],
  RB: ["RB", "FB"],
  WR: ["WR"],
  TE: ["TE"],
  FLEX: ["RB", "FB", "WR", "TE"],
  SUPER_FLEX: ["QB", "RB", "FB", "WR", "TE"],
  WRRB_FLEX: ["RB", "FB", "WR"],
  REC_FLEX: ["WR", "TE"],
  DEF: ["DEF"],
};
const getPosLen = (pos: string) => {
  if (
    pos === "QB" ||
    pos === "RB" ||
    pos === "WR" ||
    pos === "TE" ||
    pos === "FLEX" ||
    pos === "SUPER_FLEX" ||
    pos === "WRRB_FLEX" ||
    pos === "REC_FLEX" ||
    pos === "DEF"
  ) {
    return position_map[pos].length;
  } else {
    return 999;
  }
};

export const getPlayerProjection = (
  player_id: string,
  scoring_settings: { [key: string]: number },
  fpseason: { [key: string]: { [key: string]: number } }
) => {
  const player_stats = fpseason[player_id];

  if (!player_stats || !scoring_settings) {
    return 0;
  }

  const projection = Object.keys(player_stats)
    .filter((key) => Object.keys(scoring_settings).includes(key))
    .reduce(
      (acc, cur) => acc + scoring_settings[cur] * (player_stats[cur] || 0),
      0
    );

  return projection;
};

export const getPlayerProjectionWeek = (
  player_id: string,
  scoring_settings: { [key: string]: number },
  fpweek: { [key: string]: PlayerProjection }
) => {
  const player_proj_week = fpweek[player_id];

  if (!player_proj_week || !scoring_settings) {
    return 0;
  }

  const projection = Object.keys(player_proj_week.projection)
    .filter((key) => Object.keys(scoring_settings).includes(key))
    .reduce(
      (acc, cur) =>
        acc + scoring_settings[cur] * (player_proj_week.projection[cur] || 0),
      0
    );

  return projection;
};

export const getOptimalStarters = (
  roster: Roster,
  roster_positions: string[],
  fpseason: { [key: string]: { [key: string]: number } },
  allplayers: { [key: string]: Allplayer },
  scoring_settings: { [key: string]: number }
) => {
  const optimal_starters: {
    slot_index: number;
    optimal_player: string;
    proj: number;
  }[] = [];

  let players = (roster.players || []).map((player_id) => {
    return {
      player_id: player_id,
      proj: getPlayerProjection(player_id, scoring_settings, fpseason) || 0,
    };
  });

  const proj_ros_t = players.reduce((acc, cur) => acc + cur.proj, 0);

  const starting_slots = roster_positions
    .filter(
      (rp) =>
        rp === "QB" ||
        rp === "RB" ||
        rp === "WR" ||
        rp === "TE" ||
        rp === "FLEX" ||
        rp === "SUPER_FLEX" ||
        rp === "WRRB_FLEX" ||
        rp === "REC_FLEX" ||
        rp === "DEF"
    )
    .map((slot, index) => {
      return {
        slot,
        index,
      };
    });

  starting_slots
    .sort((a, b) => getPosLen(a.slot) - getPosLen(b.slot))
    .forEach((slot) => {
      const slot_options = players
        ?.filter((player) =>
          position_map[slot.slot].includes(
            allplayers[player.player_id]?.position
          )
        )
        .sort((a, b) => b.proj - a.proj);

      const optimal_player = slot_options?.[0] || "0";

      players =
        players?.filter((p) => p.player_id !== optimal_player.player_id) ||
        null;

      optimal_starters.push({
        slot_index: slot.index,
        optimal_player: optimal_player.player_id,
        proj: optimal_player.proj,
      });
    });

  return {
    starters: optimal_starters
      .sort((a, b) => a.slot_index - b.slot_index)
      .map((s) => s.optimal_player),
    proj_ros_s: optimal_starters.reduce((acc, cur) => acc + cur.proj, 0),
    proj_ros_t,
  };
};

export const getPlayerShares = (leagues: League[]) => {
  const playershares: {
    [key: string]: {
      owned: string[];
      taken: {
        lm_roster_id: number;
        lm: User;
        league: string;
      }[];
      available: string[];
    };
  } = {};

  const leaguemates: {
    [key: string]: {
      user_id: string;
      username: string;
      avatar: string | null;
      leagues: string[];
    };
  } = {};

  leagues.forEach((league) => {
    league.userRoster.players?.forEach((player_id) => {
      if (!playershares[player_id]) {
        playershares[player_id] = {
          owned: [],
          taken: [],
          available: [],
        };
      }

      playershares[player_id].owned.push(league.league_id);
    });

    league.rosters
      .filter((roster) => roster.roster_id !== league.userRoster.roster_id)
      .forEach((roster) => {
        if (!leaguemates[roster.user_id]) {
          leaguemates[roster.user_id] = {
            user_id: roster.user_id,
            username: roster.username,
            avatar: roster.avatar,
            leagues: [],
          };
        }

        leaguemates[roster.user_id].leagues.push(league.league_id);

        roster.players?.forEach((player_id) => {
          if (!playershares[player_id]) {
            playershares[player_id] = {
              owned: [],
              taken: [],
              available: [],
            };
          }

          playershares[player_id].taken.push({
            lm_roster_id: roster.roster_id,
            lm: {
              user_id: roster.user_id,
              username: roster.username,
              avatar: roster.avatar || "",
            },
            league: league.league_id,
          });
        });
      });
  });

  leagues.forEach((league) => {
    const available = Object.keys(playershares).filter(
      (player_id) =>
        !league.rosters.some((roster) => roster.players?.includes(player_id))
    );

    available.forEach((player_id) => {
      playershares[player_id].available.push(league.league_id);
    });
  });

  return { playershares, leaguemates };
};

export const getOptimalStartersMatchup = (
  matchup: Matchup,
  roster_positions: string[],
  fpweek: { [key: string]: PlayerProjection },
  allplayers: { [key: string]: Allplayer },
  scoring_settings: { [key: string]: number }
) => {
  const optimal_starters: {
    slot_index: number;
    player_id: string;
    proj: number;
  }[] = [];

  const players_projections = (matchup.players || []).map((player_id) => {
    return {
      player_id: player_id,
      proj: getPlayerProjectionWeek(player_id, scoring_settings, fpweek),
    };
  });

  let players = [...players_projections];

  const starting_slots = roster_positions
    .filter(
      (rp) =>
        rp === "QB" ||
        rp === "RB" ||
        rp === "WR" ||
        rp === "TE" ||
        rp === "FLEX" ||
        rp === "SUPER_FLEX" ||
        rp === "WRRB_FLEX" ||
        rp === "REC_FLEX" ||
        rp === "DEF"
    )
    .map((slot, index) => {
      return {
        slot,
        index,
      };
    });

  starting_slots
    .sort((a, b) => getPosLen(a.slot) - getPosLen(b.slot))
    .forEach((slot) => {
      const slot_options = players
        ?.filter((player) =>
          position_map[slot.slot].some((p) =>
            allplayers[player.player_id]?.fantasy_positions.includes(p)
          )
        )
        .sort((a, b) => b.proj - a.proj);

      const optimal_player = slot_options?.[0] || "0";

      players =
        players?.filter((p) => p.player_id !== optimal_player.player_id) ||
        null;

      optimal_starters.push({
        slot_index: slot.index,
        player_id: optimal_player.player_id,
        proj: optimal_player.proj,
      });
    });

  const actual_proj = matchup.starters.reduce(
    (acc, cur) => acc + getPlayerProjectionWeek(cur, scoring_settings, fpweek),
    0
  );

  return {
    optimal_starters: optimal_starters.sort(
      (a, b) => a.slot_index - b.slot_index
    ),
    optimal_proj: optimal_starters.reduce((acc, cur) => acc + cur.proj, 0),
    actual_proj: actual_proj,
    players_projections,
  };
};

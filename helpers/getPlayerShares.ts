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
  K: ["K"],
  DEF: ["DEF"],
  DL: ["DL"],
  LB: ["LB"],
  DB: ["DB"],
  IDP_FLEX: ["DL", "LB", "DB"],
};
const getPosLen = (pos: string) => {
  if (Object.keys(position_map).includes(pos)) {
    return position_map[pos]?.length || 999;
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
    .filter((rp) => Object.keys(position_map).includes(rp))
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
          position_map[slot.slot]?.some((p) =>
            allplayers[player.player_id].fantasy_positions?.includes(p)
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
  scoring_settings: { [key: string]: number },
  bestball: number
) => {
  const optimal_starters: {
    slot_index: number;
    slot: string;
    player_id: string;
    player_id_slot: string;
    proj: number;
    kickoff_slot: number;
  }[] = [];

  const players_projections = (matchup.players || []).map((player_id) => {
    return {
      player_id: player_id,
      proj: getPlayerProjectionWeek(player_id, scoring_settings, fpweek),
      kickoff: fpweek[player_id]?.kickoff_slot || 0,
    };
  });

  let players = [...players_projections];

  const starting_slots = roster_positions
    .filter((rp) => Object.keys(position_map).includes(rp))
    .map((slot, index) => {
      return {
        slot,
        index,
        player_id: matchup.starters?.[index] || "0",
        proj:
          players_projections.find(
            (p) => p.player_id === matchup.starters?.[index]
          )?.proj || 0,
        kickoff:
          fpweek[matchup.starters?.[index] || "0"]?.kickoff_slot || Infinity,
      };
    });

  starting_slots
    .sort((a, b) => getPosLen(a.slot) - getPosLen(b.slot))
    .forEach((slot) => {
      const slot_options = players
        ?.filter(
          (player) =>
            (player.kickoff > new Date().getTime() || bestball === 1) &&
            position_map[slot.slot].some((p) =>
              allplayers[player.player_id]?.fantasy_positions?.includes(p)
            )
        )
        .sort((a, b) => b.proj - a.proj);

      const optimal_player = ((slot.kickoff > new Date().getTime() ||
        bestball === 1) &&
        slot_options?.[0]) || {
        player_id: slot.player_id,
        proj: slot.proj,
      };

      players =
        players?.filter((p) => p.player_id !== optimal_player.player_id) ||
        null;

      optimal_starters.push({
        slot_index: slot.index,
        slot: slot.slot,
        player_id: optimal_player.player_id,
        player_id_slot:
          roster_positions[
            matchup.starters?.indexOf(optimal_player.player_id)
          ] || "BN",
        proj: optimal_player.proj,
        kickoff_slot: fpweek[optimal_player.player_id]?.kickoff_slot,
      });
    });

  const actual_proj =
    matchup.starters?.reduce(
      (acc, cur) =>
        acc + getPlayerProjectionWeek(cur, scoring_settings, fpweek),
      0
    ) || 0;

  return {
    optimal_starters: optimal_starters
      .sort((a, b) => a.slot_index - b.slot_index)
      .map((os) => {
        let move_into_flex = false;
        let move_outof_flex = false;

        if (
          optimal_starters.find(
            (os2) =>
              position_map[os.player_id_slot]?.length >
                position_map[os2.player_id_slot]?.length &&
              os2.kickoff_slot - os.kickoff_slot > 60 * 60 * 1000 &&
              position_map[os.player_id_slot]?.some((p) =>
                allplayers[os2.player_id]?.fantasy_positions?.includes(p)
              ) &&
              position_map[os2.player_id_slot]?.some((p) =>
                allplayers[os.player_id]?.fantasy_positions?.includes(p)
              )
          )
        ) {
          move_outof_flex = true;
        } else if (
          optimal_starters.find((os2) => {
            return (
              position_map[os.player_id_slot]?.length <
                position_map[os2.player_id_slot]?.length &&
              os.kickoff_slot - os2.kickoff_slot > 60 * 60 * 1000 &&
              position_map[os.player_id_slot].some((p) =>
                allplayers[os2.player_id]?.fantasy_positions?.includes(p)
              ) &&
              position_map[os2.player_id_slot].some((p) =>
                allplayers[os.player_id]?.fantasy_positions?.includes(p)
              )
            );
          })
        ) {
          move_into_flex = true;
        }

        return {
          ...os,
          move_into_flex,
          move_outof_flex,
        };
      }),
    optimal_proj: optimal_starters.reduce((acc, cur) => acc + cur.proj, 0),
    actual_proj: actual_proj,
    players_projections,
  };
};

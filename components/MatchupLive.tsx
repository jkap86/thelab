import { useSelector } from "react-redux";
import TableMain from "./TableMain";
import { RootState } from "@/redux/store";

interface MatchupLiveProps {
  type: number;
  league_id: string;
}

const MatchupLive: React.FC<MatchupLiveProps> = ({ league_id, type }) => {
  const { allplayers } = useSelector((state: RootState) => state.common);
  const { user, live_stats, leagues, matchups } = useSelector(
    (state: RootState) => state.user
  );

  const opp =
    leagues &&
    matchups &&
    leagues[league_id].rosters.find(
      (r) => r.roster_id === matchups[league_id].opp.roster_id
    )?.username;

  const user_bench = Array.from(
    new Set([
      ...Object.keys(live_stats.leagues[league_id]?.user?.players_points || {}),
      ...Object.keys(
        live_stats.leagues[league_id]?.user?.players_proj_remaining || {}
      ),
    ])
  ).filter(
    (player_id) =>
      live_stats &&
      !live_stats.leagues[league_id].user.starters.includes(player_id)
  );

  const opp_bench = Array.from(
    new Set([
      ...Object.keys(live_stats.leagues[league_id]?.opp?.players_points || {}),
      ...Object.keys(
        live_stats.leagues[league_id]?.opp?.players_proj_remaining || {}
      ),
    ])
  ).filter(
    (player_id) =>
      live_stats &&
      !live_stats.leagues[league_id].opp.starters.includes(player_id)
  );

  return (
    <>
      <div className={"nav nav" + type}>
        <div>
          {user && user.username}{" "}
          <span>
            {live_stats &&
              live_stats.leagues[league_id]?.user?.points_total?.toFixed(1)}
            &nbsp;
            <em>
              (
              {live_stats &&
                live_stats.leagues[
                  league_id
                ]?.user?.proj_remaining_total?.toFixed(1)}
              )
            </em>
          </span>
        </div>
        {live_stats.leagues[league_id]?.median?.current !== undefined ? (
          <span>
            Median
            <br />
            {live_stats &&
              live_stats.leagues[league_id]?.median?.current?.toFixed(1)}
            <em>
              (
              {live_stats &&
                live_stats.leagues[league_id]?.median?.projected?.toFixed(1)}
              )
            </em>
          </span>
        ) : null}
        <div>
          {opp}{" "}
          <span>
            {live_stats &&
              live_stats.leagues[league_id]?.opp?.points_total?.toFixed(1)}
            &nbsp;
            <em>
              (
              {live_stats &&
                live_stats.leagues[
                  league_id
                ]?.opp?.proj_remaining_total?.toFixed(1)}
              )
            </em>
          </span>
        </div>
      </div>
      <TableMain
        type={type}
        half={true}
        headers={[
          { text: "Slot", colspan: 1 },
          { text: "Player", colspan: 3 },
          { text: "Pts", colspan: 1 },
          { text: "Proj", colspan: 1 },
        ]}
        data={
          (leagues &&
            matchups &&
            allplayers && [
              ...leagues[league_id].roster_positions
                .filter((rp) => rp !== "BN")
                .map((rp, index) => {
                  const player_id =
                    live_stats.leagues[league_id].user.starters[index];

                  const points =
                    live_stats.leagues[league_id]?.user?.players_points?.[
                      player_id
                    ] || 0;
                  const proj =
                    live_stats.leagues[league_id]?.user
                      ?.players_proj_remaining?.[player_id] || 0;

                  const teamGameSecLeft =
                    live_stats.teamGameSecLeft[allplayers[player_id]?.team];

                  const classname =
                    "live " +
                    (teamGameSecLeft === 0
                      ? "complete"
                      : teamGameSecLeft < 1
                      ? "inprogress"
                      : "scheduled");

                  return {
                    id: `${rp}_${index}`,
                    columns: [
                      {
                        text: rp,
                        colspan: 1,
                        classname,
                      },
                      {
                        text: allplayers[player_id]?.full_name,
                        colspan: 3,
                        classname,
                      },
                      {
                        text: (
                          <div
                            className={
                              "live_proj" +
                              (teamGameSecLeft === 0 ? " complete" : "")
                            }
                          >
                            {points.toFixed(1)}
                            {teamGameSecLeft > 0 && (
                              <em>{(points + proj).toFixed(1)}</em>
                            )}
                          </div>
                        ),
                        colspan: 2,
                        classname,
                      },
                    ],
                  };
                }),

              ...user_bench
                .map((player_id) => {
                  const points =
                    live_stats.leagues[league_id].user.players_points[
                      player_id
                    ] || 0;
                  const proj =
                    live_stats.leagues[league_id].user.players_proj_remaining[
                      player_id
                    ] || 0;

                  const teamGameSecLeft =
                    live_stats.teamGameSecLeft[allplayers[player_id].team];

                  const classname =
                    "bench live " +
                    (teamGameSecLeft === 0
                      ? "complete"
                      : teamGameSecLeft < 1
                      ? "inprogress"
                      : "scheduled");
                  return {
                    id: player_id,
                    sort: points + proj,
                    columns: [
                      { text: "BN", colspan: 1, classname },
                      {
                        text: allplayers[player_id].full_name || player_id,
                        colspan: 3,
                        classname,
                      },
                      {
                        text: (
                          <div
                            className={
                              "live_proj" +
                              (teamGameSecLeft === 0 ? " complete" : "")
                            }
                          >
                            {points.toFixed(1)}
                            {teamGameSecLeft > 0 && (
                              <em>{(points + proj).toFixed(1)}</em>
                            )}
                          </div>
                        ),
                        colspan: 2,
                        classname,
                      },
                    ],
                  };
                })
                .sort((a, b) => b.sort - a.sort),
            ]) ||
          []
        }
      />
      <TableMain
        type={type}
        half={true}
        headers={[
          { text: "Slot", colspan: 1 },
          { text: "Player", colspan: 3 },
          { text: "Pts", colspan: 1 },
          { text: "Proj", colspan: 1 },
        ]}
        data={
          (leagues &&
            matchups &&
            allplayers && [
              ...leagues[league_id].roster_positions
                .filter((rp) => rp !== "BN")
                .map((rp, index) => {
                  const player_id =
                    live_stats.leagues[league_id].opp.starters[index];

                  const points =
                    live_stats.leagues[league_id]?.opp?.players_points?.[
                      player_id
                    ] || 0;
                  const proj =
                    live_stats.leagues[league_id]?.opp
                      ?.players_proj_remaining?.[player_id] || 0;

                  const teamGameSecLeft =
                    live_stats.teamGameSecLeft[
                      allplayers[player_id]?.team || "FA"
                    ];

                  const classname =
                    "live " +
                    (teamGameSecLeft === 0
                      ? "complete"
                      : teamGameSecLeft < 1
                      ? "inprogress"
                      : "scheduled");

                  return {
                    id: `${rp}_${index}`,
                    columns: [
                      {
                        text: rp,
                        colspan: 1,
                        classname,
                      },
                      {
                        text: allplayers[player_id]?.full_name,
                        colspan: 3,
                        classname,
                      },
                      {
                        text: (
                          <div
                            className={
                              "live_proj" +
                              (teamGameSecLeft === 0 ? " complete" : "")
                            }
                          >
                            <p>{points.toFixed(1)}</p>
                            {teamGameSecLeft > 0 && (
                              <em>{(points + proj).toFixed(1)}</em>
                            )}
                          </div>
                        ),
                        colspan: 2,
                        classname,
                      },
                    ],
                  };
                }),
              ...opp_bench.map((player_id) => {
                const points =
                  live_stats.leagues[league_id]?.opp?.players_points?.[
                    player_id
                  ] || 0;
                const proj =
                  live_stats.leagues[league_id]?.opp?.players_proj_remaining?.[
                    player_id
                  ] || 0;

                const teamGameSecLeft =
                  live_stats.teamGameSecLeft[allplayers[player_id].team];

                const classname =
                  "bench live " +
                  (teamGameSecLeft === 0
                    ? "complete"
                    : teamGameSecLeft < 1
                    ? "inprogress"
                    : "scheduled");
                return {
                  id: player_id,
                  columns: [
                    { text: "BN", colspan: 1, classname },
                    {
                      text: allplayers[player_id]?.full_name || player_id,
                      colspan: 3,
                      classname,
                    },
                    {
                      text: (
                        <div
                          className={
                            "live_proj" +
                            (teamGameSecLeft === 0 ? " complete" : "")
                          }
                        >
                          {points.toFixed(1)}
                          {teamGameSecLeft > 0 && (
                            <em>{(points + proj).toFixed(1)}</em>
                          )}
                        </div>
                      ),
                      colspan: 2,
                      classname,
                    },
                  ],
                };
              }),
            ]) ||
          []
        }
      />
    </>
  );
};

export default MatchupLive;

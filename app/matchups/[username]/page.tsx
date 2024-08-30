"use client";

import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import Matchup from "@/components/Matchup";
import TableMain from "@/components/TableMain";
import { filterLeagueIds } from "@/helpers/filterLeagues";
import { getSortIcon } from "@/helpers/getSortIcon";
import {
  setActiveMatchup,
  setMatchupsPage,
  setMatchupsTab,
  setSortStartersBy,
} from "@/redux/actions/matchupsActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

interface MatchupsProps {
  params: { username: string };
}

const Matchups: React.FC<MatchupsProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2, allplayers } = useSelector(
    (state: RootState) => state.common
  );
  const { matchups, leagues } = useSelector((state: RootState) => state.user);
  const {
    column1,
    column2,
    column3,
    column4,
    sortStartersBy,
    activeMatchup,
    page,
    tab,
  } = useSelector((state: RootState) => state.matchups);

  const starters_obj = useMemo(() => {
    const user: { [key: string]: { start: string[]; bench: string[] } } = {};
    const opp: { [key: string]: { start: string[]; bench: string[] } } = {};

    matchups &&
      leagues &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).forEach(
        (league_id) => {
          matchups[league_id].user.players.forEach((player_id) => {
            if (!user[player_id]) {
              user[player_id] = { start: [], bench: [] };
            }

            if (matchups[league_id].user.starters.includes(player_id)) {
              user[player_id].start.push(league_id);
            } else {
              user[player_id].bench.push(league_id);
            }
          });

          matchups[league_id].opp.players.forEach((player_id) => {
            if (!opp[player_id]) {
              opp[player_id] = { start: [], bench: [] };
            }

            if (matchups[league_id].opp.starters.includes(player_id)) {
              opp[player_id].start.push(league_id);
            } else {
              opp[player_id].bench.push(league_id);
            }
          });
        }
      );

    return { user, opp };
  }, [matchups, leagues, type1, type2]);

  const player_ids = Array.from(
    new Set([
      ...Object.keys(starters_obj.user),
      ...Object.keys(starters_obj.opp),
    ])
  );

  console.log({ player_ids });

  const headers_lineupcheck = [
    { text: "League", colspan: 3 },
    { text: "Opt-Act", colspan: 1 },
    { text: "Mv to FLX", colspan: 1 },
    { text: "Mv frm FLX", colspan: 1 },
    { text: "Proj Result", colspan: 1 },
  ];

  const data_lineupcheck =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2)
        .sort((a, b) => leagues[a].index - leagues[b].index)
        .map((league_id) => {
          const user_matchup = matchups[league_id].user;
          const delta =
            user_matchup &&
            (user_matchup.starters.some(
              (s) =>
                !user_matchup.optimal_starters
                  .map((os) => os.player_id)
                  .includes(s)
            ) ||
              user_matchup.optimal_starters.some(
                (os) => !user_matchup.starters.includes(os.player_id)
              ))
              ? user_matchup.optimal_proj - user_matchup.actual_proj
              : <>&#10003;</> || "-";

          const move_into_flex = (user_matchup?.optimal_starters || []).filter(
            (os) => os.move_into_flex
          ).length;

          const move_outof_flex = (user_matchup?.optimal_starters || []).filter(
            (os) => os.move_outof_flex
          ).length;

          return {
            id: league_id,
            columns: [
              {
                text: (
                  <Avatar
                    id={leagues[league_id].avatar}
                    type={"L"}
                    text={leagues[league_id].name}
                  />
                ),
                colspan: 3,
              },
              {
                text: (typeof delta === "number" && delta.toFixed(2)) || delta,
                colspan: 1,
                classname: typeof delta === "number" ? "red" : "green",
              },
              {
                text:
                  move_into_flex > 0 ? (
                    <span className="red">{move_into_flex}</span>
                  ) : (
                    <span className="green">&#10003;</span>
                  ),
                colspan: 1,
              },
              {
                text:
                  move_outof_flex > 0 ? (
                    <span className="red">{move_outof_flex}</span>
                  ) : (
                    <span className="green">&#10003;</span>
                  ),
                colspan: 1,
              },
              {
                text: (
                  <>
                    {user_matchup.actual_proj >
                    matchups[league_id].opp.actual_proj ? (
                      <span className="green">W</span>
                    ) : user_matchup.actual_proj <
                      matchups[league_id].opp.actual_proj ? (
                      <span className="red">L</span>
                    ) : (
                      <span>T</span>
                    )}
                    &nbsp;
                    {matchups[league_id].median ? (
                      user_matchup.actual_proj > matchups[league_id].median ? (
                        <span className="green">W</span>
                      ) : (
                        <span className="red">L</span>
                      )
                    ) : (
                      ""
                    )}
                  </>
                ),
                colspan: 1,
              },
            ],
            secondaryTable: (
              <Matchup matchups={matchups[league_id]} league_id={league_id} />
            ),
          };
        })) ||
    [];

  console.log({ matchups });

  const wins =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).filter(
        (league_id) => {
          return (
            matchups[league_id].user.actual_proj >
            matchups[league_id].opp.actual_proj
          );
        }
      ).length) ||
    0;

  const losses =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).filter(
        (league_id) => {
          return (
            matchups[league_id].user.actual_proj <
            matchups[league_id].opp.actual_proj
          );
        }
      ).length) ||
    0;

  const ties =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).filter(
        (league_id) => {
          return (
            matchups[league_id].user.actual_proj ===
            matchups[league_id].opp.actual_proj
          );
        }
      ).length) ||
    0;

  const median_wins =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).filter(
        (league_id) => {
          return (
            matchups[league_id].median &&
            matchups[league_id].user.actual_proj > matchups[league_id].median
          );
        }
      ).length) ||
    0;

  const median_losses =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).filter(
        (league_id) => {
          return (
            matchups[league_id].median &&
            matchups[league_id].user.actual_proj < matchups[league_id].median
          );
        }
      ).length) ||
    0;

  const content = (
    <>
      <h2 className="nav_buttons">
        <button
          className={tab === "LineupCheck" ? "active" : ""}
          onClick={() => dispatch(setMatchupsTab("LineupCheck"))}
        >
          LineupCheck
        </button>
        <button
          className={tab === "Starters" ? "active" : ""}
          onClick={() => dispatch(setMatchupsTab("Starters"))}
        >
          Starters
        </button>
      </h2>
      <h2>
        {wins + median_wins}-{losses + median_losses}
        {ties ? `-${ties}` : ""}
      </h2>

      {tab === "LineupCheck" ? (
        <TableMain
          type={1}
          headers={headers_lineupcheck}
          data={data_lineupcheck}
          active={activeMatchup}
          setActive={(league_id) => dispatch(setActiveMatchup(league_id))}
          page={page}
          setPage={(page) => dispatch(setMatchupsPage(page))}
        />
      ) : (
        <TableMain
          type={1}
          headers_sort={[
            {
              text: getSortIcon(0, sortStartersBy, (colNum, asc) =>
                dispatch(setSortStartersBy(colNum, asc))
              ),
              colspan: 3,
            },
            {
              text: getSortIcon(1, sortStartersBy, (colNum, asc) =>
                dispatch(setSortStartersBy(colNum, asc))
              ),
              colspan: 1,
            },
            {
              text: getSortIcon(2, sortStartersBy, (colNum, asc) =>
                dispatch(setSortStartersBy(colNum, asc))
              ),
              colspan: 1,
            },
            {
              text: getSortIcon(3, sortStartersBy, (colNum, asc) =>
                dispatch(setSortStartersBy(colNum, asc))
              ),
              colspan: 1,
            },
            {
              text: getSortIcon(4, sortStartersBy, (colNum, asc) =>
                dispatch(setSortStartersBy(colNum, asc))
              ),
              colspan: 1,
            },
          ]}
          headers={[
            { text: "Player", colspan: 3 },
            { text: "Start", colspan: 1 },
            { text: "Bench", colspan: 1 },
            { text: "Opp Start", colspan: 1 },
            { text: "Opp Bench", colspan: 1 },
          ]}
          data={player_ids
            .map((player_id) => {
              return {
                id: player_id,
                sortby:
                  sortStartersBy.column === 0
                    ? (allplayers && allplayers[player_id]?.full_name) ||
                      player_id
                    : sortStartersBy.column === 1
                    ? starters_obj.user[player_id]?.start?.length || 0
                    : sortStartersBy.column === 2
                    ? starters_obj.user[player_id]?.bench?.length || 0
                    : sortStartersBy.column === 3
                    ? starters_obj.opp[player_id]?.start?.length || 0
                    : sortStartersBy.column === 4
                    ? starters_obj.opp[player_id]?.bench?.length || 0
                    : player_id,
                columns: [
                  {
                    text: (
                      <Avatar
                        id={player_id}
                        type="P"
                        text={
                          (allplayers && allplayers[player_id]?.full_name) ||
                          player_id
                        }
                      />
                    ),
                    colspan: 3,
                    classname: sortStartersBy.column === 0 ? "sort" : "",
                  },
                  {
                    text: starters_obj.user[player_id]?.start?.length || "0",
                    colspan: 1,
                    classname: sortStartersBy.column === 1 ? "sort" : "",
                  },
                  {
                    text: starters_obj.user[player_id]?.bench?.length || "0",
                    colspan: 1,
                    classname: sortStartersBy.column === 2 ? "sort" : "",
                  },
                  {
                    text: starters_obj.opp[player_id]?.start?.length || "0",
                    colspan: 1,
                    classname: sortStartersBy.column === 3 ? "sort" : "",
                  },
                  {
                    text: starters_obj.opp[player_id]?.bench?.length || "0",
                    colspan: 1,
                    classname: sortStartersBy.column === 4 ? "sort" : "",
                  },
                ],
              };
            })
            .sort((a, b) =>
              sortStartersBy.asc
                ? a.sortby > b.sortby
                  ? 1
                  : -1
                : a.sortby < b.sortby
                ? 1
                : -1
            )}
        />
      )}
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Matchups;

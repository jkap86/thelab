"use client";

import Avatar from "@/components/Avatar";
import HeaderDropdown from "@/components/HeaderDropdown";
import Layout from "@/components/Layout";
import Matchup from "@/components/Matchup";
import PlayerMatchups from "@/components/PlayerMatchups";
import TableMain from "@/components/TableMain";
import { filterLeagueIds } from "@/helpers/filterLeagues";
import {
  columnOptions_lc,
  getLineupcheckColumn,
} from "@/helpers/getLineupcheckColumn";
import { getSortIcon } from "@/helpers/getSortIcon";
import {
  setActiveMatchup,
  setMatchupsPage,
  setMatchupsTab,
  setSortStartersBy,
  setLineupcheckColumn,
  setSearchedStarter,
  setStartersPage,
  setActiveStarter,
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
    sortLineupcheckBy,
    activeMatchup,
    activeStarter,
    page,
    page_starters,
    tab,
    searchedStarter,
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

  const headers_lineupcheck = [
    { text: "League", colspan: 3 },
    {
      text: (
        <HeaderDropdown
          options={columnOptions_lc}
          columnText={column1}
          setColumnText={(col) => dispatch(setLineupcheckColumn(1, col))}
        />
      ),
      colspan: 1,
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions_lc}
          columnText={column2}
          setColumnText={(col) => dispatch(setLineupcheckColumn(2, col))}
        />
      ),
      colspan: 1,
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions_lc}
          columnText={column3}
          setColumnText={(col) => dispatch(setLineupcheckColumn(3, col))}
        />
      ),
      colspan: 1,
    },
    {
      text: (
        <HeaderDropdown
          options={columnOptions_lc}
          columnText={column4}
          setColumnText={(col) => dispatch(setLineupcheckColumn(4, col))}
        />
      ),
      colspan: 1,
    },
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
              ...[column1, column2, column3, column4].map((col, index) => {
                const { text, trendColor } = getLineupcheckColumn(
                  col,
                  sortLineupcheckBy.asc,
                  matchups[league_id],
                  leagues[league_id]
                );

                return {
                  text: text,
                  style: { ...trendColor },
                  colspan: 1,
                };
              }),
              /*
              {
                text: (
                  <>
                    {getLineupcheckColumn(
                      column1,
                      sortLineupcheckBy.asc,
                      matchups[league_id],
                      leagues[league_id]
                    )}
                  </>
                ), //(typeof delta === "number" && delta.toFixed(2)) || delta,
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
              */
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
            .filter(
              (player_id) => !searchedStarter || searchedStarter === player_id
            )
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
                secondaryTable: (
                  <PlayerMatchups
                    starters_obj={starters_obj}
                    player_id={player_id}
                  />
                ),
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
          searches={[
            {
              placeholder: "Search Starters",
              searched: searchedStarter,
              setSearched: (searched) => dispatch(setSearchedStarter(searched)),
              options: Array.from(
                new Set([
                  ...Object.keys(starters_obj.user),
                  ...Object.keys(starters_obj.opp),
                ])
              ).map((player_id) => {
                return {
                  id: player_id,
                  text:
                    (allplayers && allplayers[player_id]?.full_name) ||
                    player_id,
                  display: (
                    <Avatar
                      id={player_id}
                      type="P"
                      text={
                        (allplayers && allplayers[player_id]?.full_name) ||
                        player_id
                      }
                    />
                  ),
                };
              }),
            },
          ]}
          page={page_starters}
          setPage={(page) => dispatch(setStartersPage(page))}
          active={activeStarter}
          setActive={(starter) => dispatch(setActiveStarter(starter))}
        />
      )}
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Matchups;

"use client";

import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import Matchup from "@/components/Matchup";
import TableMain from "@/components/TableMain";
import { filterLeagueIds } from "@/helpers/filterLeagues";
import {
  setActiveMatchup,
  setMatchupsPage,
} from "@/redux/actions/matchupsActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";

interface LineupcheckProps {
  params: { username: string };
}

const Matchups: React.FC<LineupcheckProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2, fpweek } = useSelector(
    (state: RootState) => state.common
  );
  const { matchups, leagues } = useSelector((state: RootState) => state.user);
  const { activeMatchup, page } = useSelector(
    (state: RootState) => state.matchups
  );

  const headers = [
    { text: "League", colspan: 3 },
    { text: "Opt-Act", colspan: 1 },
    { text: "Mv to FLX", colspan: 1 },
    { text: "Mv frm FLX", colspan: 1 },
    { text: "Proj Result", colspan: 1 },
  ];

  const data =
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
      <h2>
        {wins + median_wins}-{losses + median_losses}
        {ties ? `-${ties}` : ""}
      </h2>
      <TableMain
        type={1}
        headers={headers}
        data={data}
        active={activeMatchup}
        setActive={(league_id) => dispatch(setActiveMatchup(league_id))}
        page={page}
        setPage={(page) => dispatch(setMatchupsPage(page))}
      />
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Matchups;

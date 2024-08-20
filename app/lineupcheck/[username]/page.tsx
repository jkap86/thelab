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
    { text: "# Q", colspan: 1 },
    { text: "# D", colspan: 1 },
    { text: "# O", colspan: 1 },
  ];

  const data =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2)
        .sort((a, b) => leagues[a].index - leagues[b].index)
        .map((league_id) => {
          const user_matchup = matchups[league_id].find(
            (m) => m.roster_id === leagues[league_id].userRoster.roster_id
          );
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
              {
                text: (typeof delta === "number" && delta.toFixed(2)) || delta,
                colspan: 1,
                classname: typeof delta === "number" ? "red" : "green",
              },
              {
                text: (user_matchup?.starters || []).filter(
                  (s) => fpweek && fpweek[s]?.injury_status === "Questionable"
                ).length,
                colspan: 1,
              },
              {
                text: (user_matchup?.starters || []).filter(
                  (s) => fpweek && fpweek[s]?.injury_status === "Doubtful"
                ).length,
                colspan: 1,
              },
              {
                text: (user_matchup?.starters || []).filter(
                  (s) => fpweek && fpweek[s]?.injury_status === "Out"
                ).length,
                colspan: 1,
              },
            ],
            secondaryTable: (
              <Matchup matchups={matchups[league_id]} league_id={league_id} />
            ),
          };
        })) ||
    [];

  const content = (
    <>
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

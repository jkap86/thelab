"use client";

import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import Matchup from "@/components/Matchup";
import TableMain from "@/components/TableMain";
import { filterLeagueIds } from "@/helpers/filterLeagues";
import { setActiveMatchup } from "@/redux/actions/matchupsActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";

interface MatchupProps {
  params: { username: string };
}

const Matchups: React.FC<MatchupProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { type1, type2 } = useSelector((state: RootState) => state.common);
  const { matchups, leagues } = useSelector((state: RootState) => state.user);
  const { activeMatchup } = useSelector((state: RootState) => state.matchups);

  const headers = [
    { text: "League", colspan: 3 },
    { text: "-", colspan: 1 },
  ];

  const data =
    (leagues &&
      matchups &&
      filterLeagueIds(Object.keys(matchups), leagues, type1, type2).map(
        (league_id) => {
          const user_matchup = matchups[league_id].find(
            (m) => m.roster_id === leagues[league_id].userRoster.roster_id
          );
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
                text:
                  (user_matchup &&
                    (
                      user_matchup.optimal_proj - user_matchup.actual_proj
                    ).toFixed(2)) ||
                  "-",
                colspan: 1,
              },
            ],
            secondaryTable: (
              <Matchup matchups={matchups[league_id]} league_id={league_id} />
            ),
          };
        }
      )) ||
    [];

  const content = (
    <TableMain
      type={1}
      headers={headers}
      data={data}
      active={activeMatchup}
      setActive={(league_id) => dispatch(setActiveMatchup(league_id))}
    />
  );

  return <Layout username={params.username} content={content} />;
};

export default Matchups;

"use client";

import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import TableMain from "@/components/TableMain";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface MatchupProps {
  params: { username: string };
}

const Matchups: React.FC<MatchupProps> = ({ params }) => {
  const { matchups, leagues } = useSelector((state: RootState) => state.user);

  const data =
    (leagues &&
      Object.keys(matchups || {}).map((league_id) => {
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
          ],
        };
      })) ||
    [];

  const content = <TableMain type={1} headers={[]} data={data} />;

  return <Layout username={params.username} content={content} />;
};

export default Matchups;

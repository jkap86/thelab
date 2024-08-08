"use client";

import Layout from "@/components/Layout";
import TableMain from "@/components/TableMain";

interface MatchupProps {
  params: { username: string };
}

const Matchups: React.FC<MatchupProps> = ({ params }) => {
  const content = <TableMain type={1} headers={[]} data={[]} />;

  return <Layout username={params.username} content={content} />;
};

export default Matchups;

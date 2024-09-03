"use client";

import Avatar from "@/components/Avatar";
import TableMain from "@/components/TableMain";
import axios from "axios";
import { useEffect, useState } from "react";

interface PicktrackerProps {
  params: { league_id: string };
}

interface Picks {
  league: {
    avatar: string;
    name: string;
  };
  picks: {
    pick: string;
    player_name: string;
    player_id: string;
    picked_by: string;
    picked_by_avatar: string;
  }[];
}
const Picktracker: React.FC<PicktrackerProps> = ({ params }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [picks, setPicks] = useState<Picks>({
    league: { avatar: "", name: "" },
    picks: [],
  });

  useEffect(() => {
    const fetchPicks = async () => {
      setIsLoading(true);
      const p = await axios.get("/api/picktracker", {
        params: {
          league_id: params.league_id,
        },
      });

      setPicks(p.data);
      setIsLoading(false);
    };

    fetchPicks();
  }, [params.league_id]);

  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h1>
            <Avatar
              id={picks.league?.avatar}
              type="L"
              text={picks.league.name}
            />
          </h1>
          <TableMain
            type={1}
            headers={[
              {
                text: "Pick",
                colspan: 2,
              },
              {
                text: "Manager",
                colspan: 4,
              },
              {
                text: "Kicker",
                colspan: 4,
              },
            ]}
            data={picks.picks.map((pick) => {
              return {
                id: pick.player_id,
                columns: [
                  {
                    text: pick.pick,
                    colspan: 2,
                  },
                  {
                    text: (
                      <Avatar
                        id={pick.picked_by_avatar}
                        type="U"
                        text={pick.picked_by}
                      />
                    ),
                    colspan: 4,
                  },
                  {
                    text: (
                      <Avatar
                        id={pick.player_id}
                        type="P"
                        text={pick.player_name}
                      />
                    ),
                    colspan: 4,
                  },
                ],
              };
            })}
          />
        </>
      )}
    </>
  );
};

export default Picktracker;

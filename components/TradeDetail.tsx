import { Trade } from "@/lib/types";
import TableMain from "./TableMain";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Avatar from "./Avatar";

interface TradeDetailProps {
  trade: Trade;
}
const TradeDetail: React.FC<TradeDetailProps> = ({ trade }) => {
  const { allplayers } = useSelector((state: RootState) => state.common);
  const { leagues, leaguemates } = useSelector(
    (state: RootState) => state.user
  );

  return (
    <>
      <div className="trades_nav">
        <div className="button">Tips</div>
        <div className="button">Rosters</div>
      </div>
      <TableMain
        type={2}
        headers={[
          { text: "Manager", colspan: 1 },
          { text: "Acquire", colspan: 1 },
          { text: "League", colspan: 1 },
        ]}
        data={
          (leagues &&
            (trade.tips?.for || []).map((tip) => {
              const lm = leaguemates[tip.leaguemate_id];
              const tip_league = leagues[tip.league_id];
              return {
                id: `${tip.player_id}_${tip.league_id}_${tip.leaguemate_id}`,
                columns: [
                  {
                    text: (
                      <Avatar id={lm.avatar} type={"U"} text={lm.username} />
                    ),
                    colspan: 1,
                  },
                  {
                    text: (
                      <Avatar
                        id={tip.player_id}
                        type="P"
                        text={
                          (allplayers && allplayers[tip.player_id].full_name) ||
                          "-"
                        }
                      />
                    ),
                    colspan: 1,
                  },
                  {
                    text: (
                      <Avatar
                        id={tip_league.avatar}
                        type={"L"}
                        text={tip_league.name}
                      />
                    ),
                  },
                ],
              };
            })) ||
          []
        }
      />
      <TableMain
        type={2}
        headers={[
          { text: "Manager", colspan: 1 },
          { text: "Flip", colspan: 1 },
          { text: "League", colspan: 1 },
        ]}
        data={
          (leagues &&
            (trade.tips?.away || []).map((tip) => {
              const lm = leaguemates[tip.leaguemate_id];
              const tip_league = leagues[tip.league_id];
              return {
                id: `${tip.player_id}_${tip.league_id}_${tip.leaguemate_id}`,
                columns: [
                  {
                    text: (
                      <Avatar id={lm.avatar} type={"U"} text={lm.username} />
                    ),
                    colspan: 1,
                  },
                  {
                    text: (
                      <Avatar
                        id={tip.player_id}
                        type="P"
                        text={
                          (allplayers && allplayers[tip.player_id].full_name) ||
                          "-"
                        }
                      />
                    ),
                    colspan: 1,
                  },
                  {
                    text: (
                      <Avatar
                        id={tip_league.avatar}
                        type={"L"}
                        text={tip_league.name}
                      />
                    ),
                  },
                ],
              };
            })) ||
          []
        }
      />
    </>
  );
};

export default TradeDetail;

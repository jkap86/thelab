import { Trade } from "@/lib/types";
import TableMain from "./TableMain";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Avatar from "./Avatar";
import Standings from "./Standings";
import { setDetailTab, setRostersTab } from "@/redux/actions/tradesActions";

interface TradeDetailProps {
  trade: Trade;
}
const TradeDetail: React.FC<TradeDetailProps> = ({ trade }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers } = useSelector((state: RootState) => state.common);
  const { leagues, leaguemates } = useSelector(
    (state: RootState) => state.user
  );
  const { detailTab, rostersTab1, rostersTab2 } = useSelector(
    (state: RootState) => state.trades
  );

  const tipsTables = (
    <>
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

  return (
    <>
      <div className="trades_nav">
        <div
          onClick={() => dispatch(setDetailTab("Tips"))}
          className={"button" + (detailTab === "Tips" ? " active" : "")}
        >
          Tips
        </div>
        <div
          onClick={() => dispatch(setDetailTab("Rosters"))}
          className={"button" + (detailTab === "Rosters" ? " active" : "")}
        >
          Rosters
        </div>
      </div>
      {detailTab === "Tips" ? (
        tipsTables
      ) : (
        <Standings
          type={2}
          league={trade}
          standingsTab={rostersTab1}
          standingsTab2={rostersTab2}
          setStandingsTab={(value) => dispatch(setRostersTab(1, value))}
          setStandingsTab2={(value) => dispatch(setRostersTab(2, value))}
        />
      )}
    </>
  );
};

export default TradeDetail;

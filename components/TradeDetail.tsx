import { Trade } from "@/lib/types";
import TableMain from "./TableMain";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Avatar from "./Avatar";
import Standings from "./Standings";
import {
  setActiveTip,
  setDetailTab,
  setRostersTab,
} from "@/redux/actions/tradesActions";
import {
  setStandingsTab,
  setStandingsTab2,
} from "@/redux/actions/leaguesActions";

interface TradeDetailProps {
  trade: Trade;
}
const TradeDetail: React.FC<TradeDetailProps> = ({ trade }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers } = useSelector((state: RootState) => state.common);
  const { leagues, leaguemates } = useSelector(
    (state: RootState) => state.user
  );
  const { detailTab, rostersTab1, rostersTab2, activeTip } = useSelector(
    (state: RootState) => state.trades
  );
  const { standingsTab, standingsTab2 } = useSelector(
    (state: RootState) => state.leagues
  );

  const tipsTables = (
    <>
      <TableMain
        type={2}
        headers={[
          { text: "Acquire", colspan: 1 },
          { text: "From", colspan: 1 },
          { text: "In", colspan: 1 },
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
                      <Avatar id={lm.avatar} type={"U"} text={lm.username} />
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
        active={activeTip}
        setActive={(tip) => dispatch(setActiveTip(tip))}
      />
      <TableMain
        type={2}
        headers={[
          { text: "Flip", colspan: 1 },
          { text: "To", colspan: 1 },
          { text: "In", colspan: 1 },
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
                      <Avatar id={lm.avatar} type={"U"} text={lm.username} />
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
                secondaryTable: (
                  <Standings
                    type={3}
                    league={tip_league}
                    standingsTab={standingsTab}
                    standingsTab2={standingsTab2}
                    setStandingsTab={(tab) => dispatch(setStandingsTab(tab))}
                    setStandingsTab2={(tab) => dispatch(setStandingsTab2(tab))}
                  />
                ),
              };
            })) ||
          []
        }
        active={activeTip}
        setActive={(tip) => dispatch(setActiveTip(tip))}
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
          onClick={() => dispatch(setDetailTab("League"))}
          className={"button" + (detailTab === "League" ? " active" : "")}
        >
          League
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

"use client";

import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import { fetchLmTrades } from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "@/styles/trades.css";
import { setActiveTrade, setTradesPage } from "@/redux/actions/tradesActions";
import TradeDetail from "@/components/TradeDetail";

interface TradesProps {
  params: { username: string };
}

const Trades: React.FC<TradesProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, ktc_current } = useSelector(
    (state: RootState) => state.common
  );
  const { leagues, lmTrades, isLoadingLmTrades, leaguemates } = useSelector(
    (state: RootState) => state.user
  );
  const { activeTrade, page } = useSelector((state: RootState) => state.trades);

  useEffect(() => {
    if (
      leagues &&
      Object.keys(leaguemates).length > 0 &&
      !lmTrades.trades &&
      !isLoadingLmTrades
    ) {
      dispatch(fetchLmTrades(Object.keys(leaguemates), 0, 125, leagues));
    }
  }, [leaguemates, isLoadingLmTrades, lmTrades, leagues, dispatch]);

  const content = (
    <>
      <div className="page_numbers_wrapper">
        <ol className="page_numbers">
          {Array.from(
            Array(
              Math.ceil((lmTrades.trades && lmTrades.trades?.length / 25) || 0)
            ).keys()
          ).map((key) => {
            return (
              <li
                key={key + 1}
                className={page === key + 1 ? "active" : ""}
                onClick={() => dispatch(setTradesPage(key + 1))}
              >
                {key + 1}
              </li>
            );
          })}
        </ol>
      </div>
      <table className="trades">
        {[...(lmTrades.trades || [])]
          .sort((a, b) => (b.status_updated > a.status_updated ? 1 : -1))
          .slice((page - 1) * 25, (page - 1) * 25 + 25)
          .map((lmTrade, index) => {
            return (
              <tbody key={`${lmTrade.transaction_id}_${index}`}>
                <tr>
                  <td>
                    <table>
                      <tbody
                        onClick={() =>
                          dispatch(
                            setActiveTrade(
                              activeTrade === lmTrade.transaction_id
                                ? false
                                : lmTrade.transaction_id
                            )
                          )
                        }
                        className={
                          activeTrade === lmTrade.transaction_id ? "active" : ""
                        }
                      >
                        <tr>
                          <td colSpan={3} className="timestamp">
                            <div>
                              {new Date(
                                parseInt(lmTrade.status_updated)
                              ).toLocaleDateString("en-US")}
                            </div>
                            <div>
                              {new Date(
                                parseInt(lmTrade.status_updated)
                              ).toLocaleTimeString("en-US")}
                            </div>
                          </td>
                          <td colSpan={8}>
                            <Avatar
                              id={lmTrade.avatar}
                              type={"L"}
                              text={lmTrade.name}
                            />
                          </td>
                          <td colSpan={3}>
                            <div>
                              {lmTrade.settings.type === 2
                                ? "Dynasty"
                                : lmTrade.settings.type === 1
                                ? "Keeper"
                                : "Redraft"}
                            </div>
                            <div>
                              {lmTrade.settings.best_ball === 1
                                ? "Bestball"
                                : "Lineup"}
                            </div>
                          </td>
                          <td colSpan={4}>
                            <div>
                              {lmTrade.roster_positions
                                .filter((rp) => rp === "QB")
                                .length.toString()}{" "}
                              QB{" "}
                              {lmTrade.roster_positions
                                .filter((rp) => rp === "SUPER_FLEX")
                                .length.toString()}{" "}
                              SF
                            </div>
                          </td>
                        </tr>
                        {...lmTrade.managers.map((user_id, index) => {
                          const manager_roster = lmTrade.rosters.find(
                            (r) => r.user_id === user_id
                          );

                          return (
                            <tr key={`${user_id}_${index}`}>
                              <td colSpan={5}>
                                <Avatar
                                  id={manager_roster?.avatar || null}
                                  type={"U"}
                                  text={manager_roster?.username || "Orphan"}
                                />
                              </td>
                              <td colSpan={7} className="adds">
                                <div>
                                  {Object.keys(lmTrade.adds)
                                    .filter(
                                      (add) =>
                                        lmTrade.adds[add] ===
                                        manager_roster?.user_id
                                    )
                                    .map((add, index) => {
                                      return (
                                        <div
                                          key={`${add}_${index}`}
                                          className={
                                            lmTrade.tips?.away.some(
                                              (tip) =>
                                                tip.player_id === add &&
                                                tip.leaguemate_id ===
                                                  lmTrade.adds[add]
                                            )
                                              ? "redb"
                                              : ""
                                          }
                                        >
                                          {allplayers &&
                                            allplayers[add]?.full_name}
                                        </div>
                                      );
                                    })}

                                  {lmTrade.draft_picks
                                    .filter(
                                      (dp) => dp.new === manager_roster?.user_id
                                    )
                                    .map((dp) => {
                                      return (
                                        <div
                                          key={`${dp.season}_${dp.round}_${dp.original}_${index}`}
                                        >
                                          {dp.order
                                            ? `${dp.season} ${
                                                dp.round
                                              }.${dp.order.toLocaleString(
                                                "en-US",
                                                {
                                                  minimumIntegerDigits: 2,
                                                }
                                              )}`
                                            : `${dp.season} Round ${dp.round}`}
                                        </div>
                                      );
                                    })}
                                </div>
                              </td>
                              <td colSpan={6} className="drops">
                                {Object.keys(lmTrade.drops)
                                  .filter(
                                    (drops) =>
                                      lmTrade.drops[drops] ===
                                      manager_roster?.user_id
                                  )
                                  .map((drop, index) => {
                                    return (
                                      <div
                                        key={`${drop}_${index}`}
                                        className={
                                          lmTrade.tips?.for?.some(
                                            (tip) =>
                                              tip.player_id === drop &&
                                              lmTrade.drops[drop] ===
                                                tip.leaguemate_id
                                          )
                                            ? "greenb"
                                            : ""
                                        }
                                      >
                                        {allplayers &&
                                          allplayers[drop]?.full_name}
                                      </div>
                                    );
                                  })}

                                {lmTrade.draft_picks
                                  .filter(
                                    (dp) => dp.old === manager_roster?.user_id
                                  )
                                  .map((dp, index) => {
                                    return (
                                      <div
                                        key={`${dp.season}_${dp.round}_${dp.original}_${index}`}
                                      >
                                        {dp.order
                                          ? `${dp.season} ${
                                              dp.round
                                            }.${dp.order.toLocaleString(
                                              "en-US",
                                              {
                                                minimumIntegerDigits: 2,
                                              }
                                            )}`
                                          : `${dp.season} Round ${dp.round}`}
                                      </div>
                                    );
                                  })}
                              </td>
                            </tr>
                          );
                        })}
                        {activeTrade === lmTrade.transaction_id && (
                          <tr>
                            <td colSpan={18}>
                              <TradeDetail trade={lmTrade} />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            );
          })}
      </table>
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Trades;

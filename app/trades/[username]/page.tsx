"use client";

import Avatar from "@/components/Avatar";
import Layout from "@/components/Layout";
import {
  fetchFilteredLmTrades,
  fetchLmTrades,
} from "@/redux/actions/userActions";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "@/styles/trades.css";
import {
  setActiveTrade,
  setSearchedManager,
  setSearchedPlayer,
  setTradesPage,
} from "@/redux/actions/tradesActions";
import TradeDetail from "@/components/TradeDetail";
import Search from "@/components/Search";

interface TradesProps {
  params: { username: string };
}

const Trades: React.FC<TradesProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, ktc_current } = useSelector(
    (state: RootState) => state.common
  );
  const {
    user,
    leagues,
    lmTrades,
    isLoadingLmTrades,
    leaguemates,
    lmTradeSearches,
    playershares,
  } = useSelector((state: RootState) => state.user);
  const { activeTrade, page, searchedManager, searchedPlayer } = useSelector(
    (state: RootState) => state.trades
  );

  console.log({ lmTrades });

  const tradesDisplay =
    searchedManager || searchedPlayer
      ? lmTradeSearches.find(
          (s) => s.manager === searchedManager && s.player === searchedPlayer
        )?.trades || []
      : lmTrades.trades || [];

  const tradesCount =
    searchedManager || searchedPlayer
      ? lmTradeSearches.find(
          (s) => s.manager === searchedManager && s.player === searchedPlayer
        )?.count || 0
      : lmTrades.count || 0;

  const cur_trade_length = tradesDisplay.length;

  useEffect(() => {
    if (
      leagues &&
      Object.keys(leaguemates).length > 0 &&
      !lmTrades.trades &&
      !isLoadingLmTrades
    ) {
      dispatch(fetchLmTrades(Object.keys(leaguemates), 0, 125, leagues));
    }

    if (searchedManager || searchedPlayer) {
      leagues &&
        dispatch(
          fetchFilteredLmTrades(
            Object.keys(leaguemates),
            0,
            125,
            leagues,
            searchedManager,
            searchedPlayer
          )
        );
    }
  }, [
    leaguemates,
    isLoadingLmTrades,
    lmTrades,
    leagues,
    searchedManager,
    searchedPlayer,
    dispatch,
  ]);

  const mananger_options = Object.values(leaguemates || {}).map(
    (leaguemate) => {
      return {
        id: leaguemate.user_id,
        text: leaguemate.username,
        display: (
          <Avatar
            id={leaguemate.avatar}
            type={"U"}
            text={leaguemate.username}
          />
        ),
      };
    }
  );

  const player_options = Object.keys(playershares).map((player_id) => {
    const player_name =
      (allplayers &&
        allplayers[player_id] &&
        allplayers[player_id].full_name) ||
      player_id;
    return {
      id: player_id,
      text: player_name,
      display: <Avatar id={player_id} type={"P"} text={player_name} />,
    };
  });

  if (user) {
    mananger_options.push({
      id: user.user_id,
      text: user.username,
      display: <Avatar id={user.avatar} type={"U"} text={user.username} />,
    });
  }

  const content = (
    <>
      <div className="searches">
        <Search
          searched={searchedManager}
          setSearched={(user_id) => dispatch(setSearchedManager(user_id))}
          options={mananger_options}
          placeholder={"Search Manager"}
        />
        <Search
          searched={searchedPlayer}
          setSearched={(player_id) => dispatch(setSearchedPlayer(player_id))}
          options={player_options}
          placeholder={"Search Player"}
        />
      </div>
      <div className="page_numbers_wrapper">
        <ol className="page_numbers">
          {Array.from(
            Array(Math.ceil(tradesDisplay.length / 25 || 0)).keys()
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
          {leagues && tradesCount > cur_trade_length ? (
            <li
              onClick={
                searchedManager || searchedPlayer
                  ? () =>
                      dispatch(
                        fetchFilteredLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          cur_trade_length + 125,
                          leagues,
                          searchedManager,
                          searchedPlayer
                        )
                      )
                  : () =>
                      dispatch(
                        fetchLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          cur_trade_length + 125,
                          leagues
                        )
                      )
              }
            >
              ...
            </li>
          ) : null}
        </ol>
      </div>
      <table className="trades">
        {[...tradesDisplay]
          .sort((a, b) => (b.status_updated > a.status_updated ? 1 : -1))
          .slice((page - 1) * 25, (page - 1) * 25 + 25)
          .map((lmTrade, index) => {
            return (
              <tbody key={`${lmTrade.transaction_id}_${index}`}>
                <tr>
                  <td>
                    <table className="trade">
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
                          <td colSpan={9}>
                            <Avatar
                              id={lmTrade.avatar}
                              type={"L"}
                              text={lmTrade.name}
                            />
                          </td>
                          <td colSpan={6}>
                            <div>
                              <span>
                                {lmTrade.settings.type === 2
                                  ? "Dynasty"
                                  : lmTrade.settings.type === 1
                                  ? "Keeper"
                                  : "Redraft"}
                              </span>
                              <span>
                                {lmTrade.settings.best_ball === 1
                                  ? "Bestball"
                                  : "Lineup"}
                              </span>
                            </div>
                            <div>
                              <span>
                                Start{" "}
                                {
                                  lmTrade.roster_positions.filter(
                                    (rp) => rp !== "BN"
                                  ).length
                                }
                              </span>
                              <span>
                                {lmTrade.roster_positions
                                  .filter((rp) => rp === "QB")
                                  .length.toString()}{" "}
                                QB
                              </span>
                              <span>
                                {lmTrade.roster_positions
                                  .filter((rp) => rp === "SUPER_FLEX")
                                  .length.toString()}{" "}
                                SF
                              </span>
                              <span>
                                {lmTrade.roster_positions
                                  .filter((rp) => rp === "TE")
                                  .length.toString()}{" "}
                                TE
                              </span>
                              <span>
                                {lmTrade.scoring_settings.bonus_rec_te || "0"}{" "}
                                Prem
                              </span>
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
                                <table className="adds">
                                  <tbody>
                                    {Object.keys(lmTrade.adds)
                                      .filter(
                                        (add) =>
                                          lmTrade.adds[add] ===
                                          manager_roster?.user_id
                                      )
                                      .map((add, index) => {
                                        return (
                                          <tr key={`${add}_${index}`}>
                                            <td
                                              colSpan={2}
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
                                              <div>
                                                {allplayers &&
                                                  allplayers[add]?.full_name}
                                              </div>
                                            </td>
                                            <td>
                                              <em>
                                                {(ktc_current &&
                                                  ktc_current[add]) ||
                                                  "0"}
                                              </em>
                                            </td>
                                          </tr>
                                        );
                                      })}

                                    {lmTrade.draft_picks
                                      .filter(
                                        (dp) =>
                                          dp.new === manager_roster?.user_id
                                      )
                                      .map((dp) => {
                                        return (
                                          <tr
                                            key={`${dp.season}_${dp.round}_${dp.original}_${index}`}
                                          >
                                            <td colSpan={2}>
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
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
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
                      </tbody>
                      <tbody>
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
      <div className="page_numbers_wrapper">
        <ol className="page_numbers">
          {Array.from(
            Array(Math.ceil(tradesDisplay.length / 25 || 0)).keys()
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
          {leagues && tradesCount > cur_trade_length ? (
            <li
              onClick={
                searchedManager || searchedPlayer
                  ? () =>
                      dispatch(
                        fetchFilteredLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          cur_trade_length + 125,
                          leagues,
                          searchedManager,
                          searchedPlayer
                        )
                      )
                  : () =>
                      dispatch(
                        fetchLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          cur_trade_length + 125,
                          leagues
                        )
                      )
              }
            >
              ...
            </li>
          ) : null}
        </ol>
      </div>
    </>
  );

  return <Layout username={params.username} content={content} />;
};

export default Trades;

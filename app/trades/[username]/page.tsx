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
  setTab,
  setTradesPage,
  setValueType,
} from "@/redux/actions/tradesActions";
import TradeDetail from "@/components/TradeDetail";
import Search from "@/components/Search";
import { getPlayerProjection } from "@/helpers/getPlayerShares";
import { getTrendColor_Percentage } from "@/helpers/getTrendColor";
import { fetchPcTrades } from "@/redux/actions/commonActions";

interface TradesProps {
  params: { username: string };
}

const Trades: React.FC<TradesProps> = ({ params }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, ktc_current, fpseason, pcTrades } = useSelector(
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
  const { tab, activeTrade, page, searchedManager, searchedPlayer, valueType } =
    useSelector((state: RootState) => state.trades);

  console.log({ lmTrades });

  const getSuffix = (number: number) => {
    switch (number) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      case 4:
        return "th";
      default:
        return "";
    }
  };
  const tradesDisplay =
    tab === "LM"
      ? searchedManager || searchedPlayer
        ? lmTradeSearches.find(
            (s) => s.manager === searchedManager && s.player === searchedPlayer
          )?.trades || []
        : lmTrades.trades || []
      : tab === "PC" && searchedPlayer
      ? pcTrades[searchedPlayer]?.trades || []
      : [];

  const tradesCount =
    tab === "LM"
      ? searchedManager || searchedPlayer
        ? lmTradeSearches.find(
            (s) => s.manager === searchedManager && s.player === searchedPlayer
          )?.count || 0
        : lmTrades.count || 0
      : tab === "PC" && searchedPlayer
      ? pcTrades[searchedPlayer]?.count || 0
      : 0;

  const cur_trade_length = tradesDisplay.length;

  useEffect(() => {
    if (
      tab === "LM" &&
      leagues &&
      fpseason &&
      allplayers &&
      Object.keys(leaguemates).length > 0 &&
      !lmTrades.trades &&
      !isLoadingLmTrades
    ) {
      dispatch(
        fetchLmTrades(
          Object.keys(leaguemates),
          0,
          125,
          leagues,
          fpseason,
          allplayers
        )
      );
    }

    if (
      tab === "LM" &&
      (searchedManager || searchedPlayer) &&
      fpseason &&
      allplayers
    ) {
      leagues &&
        dispatch(
          fetchFilteredLmTrades(
            Object.keys(leaguemates),
            0,
            125,
            leagues,
            searchedManager,
            searchedPlayer,
            fpseason,
            allplayers
          )
        );
    }
  }, [
    tab,
    leaguemates,
    isLoadingLmTrades,
    lmTrades,
    leagues,
    searchedManager,
    searchedPlayer,
    fpseason,
    allplayers,
    dispatch,
  ]);

  useEffect(() => {
    if (tab === "PC" && searchedPlayer && !pcTrades[searchedPlayer]) {
      dispatch(fetchPcTrades(searchedPlayer, 125, tradesDisplay.length));
    }
  }, [tab, pcTrades, searchedPlayer, dispatch]);

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
      <div className="buttons">
        <button
          onClick={() => dispatch(setTab("LM"))}
          className={tab === "LM" ? "active" : ""}
        >
          Leaguemate
        </button>
        <button
          onClick={() => dispatch(setTab("PC"))}
          className={tab === "PC" ? "active" : ""}
        >
          Price Check
        </button>
      </div>
      <div className="info">
        {tab === "LM"
          ? "All Trades made by leaguemates, including in leagues you are not in."
          : tab === "PC"
          ? "All Trades where only searched player is on one side."
          : ""}
      </div>
      <h3 className="tradeCount">
        {tradesCount.toLocaleString("en-US")} Trades
      </h3>
      <div className="searches">
        <Search
          searched={searchedPlayer}
          setSearched={(player_id) => dispatch(setSearchedPlayer(player_id))}
          options={player_options}
          placeholder={"Search Player"}
        />
        {tab === "LM" && (
          <Search
            searched={searchedManager}
            setSearched={(user_id) => dispatch(setSearchedManager(user_id))}
            options={mananger_options}
            placeholder={"Search Manager"}
          />
        )}
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
          {leagues &&
          fpseason &&
          allplayers &&
          tradesCount > cur_trade_length ? (
            <li
              onClick={
                searchedManager || searchedPlayer
                  ? () =>
                      dispatch(
                        fetchFilteredLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          125,
                          leagues,
                          searchedManager,
                          searchedPlayer,
                          fpseason,
                          allplayers
                        )
                      )
                  : () =>
                      dispatch(
                        fetchLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          125,
                          leagues,
                          fpseason,
                          allplayers
                        )
                      )
              }
            >
              ...
            </li>
          ) : null}
        </ol>
      </div>
      <div className="valuetype">
        <span>
          <input
            checked={valueType === "KTC"}
            onChange={() => dispatch(setValueType("KTC"))}
            type="radio"
          />
          <label>KTC</label>
        </span>
        <span>
          <input
            checked={valueType === "ROS"}
            onChange={() => dispatch(setValueType("ROS"))}
            type="radio"
          />
          <label>Rest of Season Projected Points</label>
        </span>
      </div>
      <table className="trades">
        {[...tradesDisplay]
          .sort((a, b) => (b.status_updated > a.status_updated ? 1 : -1))
          .slice((page - 1) * 25, (page - 1) * 25 + 25)
          .map((lmTrade, index) => {
            const player_values = Object.keys(lmTrade.adds).map((a) => {
              if (valueType === "KTC") {
                return (ktc_current && ktc_current[a]?.value) || 0;
              } else {
                return (
                  (fpseason &&
                    getPlayerProjection(
                      a,
                      lmTrade.scoring_settings,
                      fpseason
                    )) ||
                  0
                );
              }
            });
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
                          <td colSpan={6} className="timestamp">
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
                          <td colSpan={12}>
                            <Avatar
                              id={lmTrade.avatar}
                              type={"L"}
                              text={lmTrade.name}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3}>
                            <div>
                              {lmTrade.settings.type === 2
                                ? "Dynasty"
                                : lmTrade.settings.type === 1
                                ? "Keeper"
                                : "Redraft"}
                            </div>
                          </td>
                          <td colSpan={3}>
                            <div>
                              {lmTrade.settings.best_ball === 1
                                ? "Bestball"
                                : "Lineup"}
                            </div>
                          </td>
                          <td colSpan={3}>
                            <div>
                              Start{" "}
                              {
                                lmTrade.roster_positions.filter(
                                  (rp) => rp !== "BN"
                                ).length
                              }
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
                          <td colSpan={5}>
                            <div>
                              {lmTrade.roster_positions
                                .filter((rp) => rp === "TE")
                                .length.toString()}{" "}
                              TE {lmTrade.scoring_settings.bonus_rec_te || "0"}
                              {"pt "}
                              Prem
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
                                        const value =
                                          valueType === "KTC"
                                            ? (ktc_current &&
                                                ktc_current[add]?.value) ||
                                              0
                                            : (fpseason &&
                                                getPlayerProjection(
                                                  add,
                                                  lmTrade.scoring_settings,
                                                  fpseason
                                                )) ||
                                              0;
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
                                              <em
                                                className="stat"
                                                style={getTrendColor_Percentage(
                                                  value,
                                                  player_values
                                                )}
                                              >
                                                <select
                                                  value={valueType}
                                                  onChange={(e) =>
                                                    dispatch(
                                                      setValueType(
                                                        e.target.value
                                                      )
                                                    )
                                                  }
                                                  onClick={(e) =>
                                                    e.stopPropagation()
                                                  }
                                                >
                                                  <option value={"KTC"}>
                                                    KTC Value
                                                  </option>
                                                  <option value={"ROS"}>
                                                    Rest of Season Projection
                                                  </option>
                                                </select>
                                                {valueType === "KTC"
                                                  ? (ktc_current &&
                                                      ktc_current[add]
                                                        ?.value) ||
                                                    "0"
                                                  : leagues &&
                                                    fpseason &&
                                                    getPlayerProjection(
                                                      add,
                                                      lmTrade.scoring_settings,
                                                      fpseason
                                                    ).toFixed(1)}
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
                                        const ktc_pick_type =
                                          (dp.order &&
                                            (dp.order <= 4
                                              ? "Early"
                                              : dp.order >= 9
                                              ? "Late"
                                              : "Mid")) ||
                                          "Mid";

                                        const ktc_pick_name = `${
                                          dp.season
                                        } ${ktc_pick_type} ${
                                          dp.round
                                        }${getSuffix(dp.round)}`;
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
                                            <td>
                                              <em className="stat">
                                                {valueType === "KTC"
                                                  ? ktc_current &&
                                                    (ktc_current[
                                                      `${dp.season} ${dp.round}.${dp.order}`
                                                    ]?.value ||
                                                      ktc_current[ktc_pick_name]
                                                        ?.value ||
                                                      "0")
                                                  : "-"}
                                              </em>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
                              </td>
                              <td colSpan={6} className="drops">
                                <table className="drops">
                                  <tbody>
                                    {Object.keys(lmTrade.drops)
                                      .filter(
                                        (drops) =>
                                          lmTrade.drops[drops] ===
                                          manager_roster?.user_id
                                      )
                                      .map((drop, index) => {
                                        return (
                                          <tr key={`${drop}_${index}`}>
                                            <td
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
                                              <div>
                                                {allplayers &&
                                                  allplayers[drop]?.full_name}
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}

                                    {lmTrade.draft_picks
                                      .filter(
                                        (dp) =>
                                          dp.old === manager_roster?.user_id
                                      )
                                      .map((dp, index) => {
                                        return (
                                          <tr
                                            key={`${dp.season}_${dp.round}_${dp.original}_${index}`}
                                          >
                                            <td>
                                              <div>
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
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </tbody>
                                </table>
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
          {leagues &&
          fpseason &&
          allplayers &&
          tradesCount > cur_trade_length ? (
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
                          searchedPlayer,
                          fpseason,
                          allplayers
                        )
                      )
                  : () =>
                      dispatch(
                        fetchLmTrades(
                          Object.keys(leaguemates),
                          cur_trade_length,
                          125,
                          leagues,
                          fpseason,
                          allplayers
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

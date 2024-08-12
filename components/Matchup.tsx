import { MatchupOptimal } from "@/lib/types";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import TableMain from "./TableMain";
import { useState } from "react";
import { position_map } from "@/helpers/getPlayerShares";
import "@/styles/detailnav.css";

interface MatchupProps {
  league_id: string;
  matchups: MatchupOptimal[];
}

const Matchup: React.FC<MatchupProps> = ({ matchups, league_id }) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers } = useSelector((state: RootState) => state.common);
  const { leagues } = useSelector((state: RootState) => state.user);
  const [activePlayer, setActivePlayer] = useState("");

  const user_matchup =
    leagues &&
    matchups.find(
      (m) => m.roster_id === leagues[league_id].userRoster.roster_id
    );

  const opp_matchup =
    user_matchup &&
    matchups.find(
      (m) =>
        m.matchup_id === user_matchup.matchup_id &&
        m.roster_id !== user_matchup.roster_id
    );

  const opp_roster =
    opp_matchup &&
    leagues[league_id].rosters.find(
      (r) => r.roster_id === opp_matchup.roster_id
    );

  const getUserPlayerProjection = (player_id: string) => {
    return (
      (user_matchup &&
        user_matchup.players_projections.find(
          (pp) => pp.player_id === player_id
        )?.proj) ||
      0
    );
  };

  const headersStarters = [
    { text: "Slot", colspan: 1 },
    { text: "Player", colspan: 3 },
    { text: "Proj", colspan: 1 },
  ];
  const dataStarters =
    (leagues &&
      user_matchup &&
      leagues[league_id].roster_positions
        .filter((rp) => rp !== "BN")
        .map((rp, index) => {
          return {
            id: `${rp}_${user_matchup.starters[index]}`,
            columns: [
              { text: rp, colspan: 1 },
              {
                text:
                  (allplayers &&
                    allplayers[user_matchup.starters[index]]?.full_name) ||
                  "-",
                colspan: 3,
              },
              {
                text:
                  user_matchup.players_projections
                    .find((pp) => pp.player_id === user_matchup.starters[index])
                    ?.proj?.toFixed(1) || "-",
                colspan: 2,
              },
            ],
          };
        })) ||
    [];

  const activeSlot = activePlayer?.split("_")[0];
  const activeStarter = activePlayer?.split("_")?.[1];

  const options =
    user_matchup &&
    allplayers &&
    user_matchup.players.filter(
      (player_id) =>
        !user_matchup.starters.includes(player_id) &&
        allplayers[player_id].fantasy_positions.some((fp) =>
          position_map[activeSlot]?.includes(fp)
        )
    );

  const dataOptions =
    (options &&
      options
        .sort((a, b) => getUserPlayerProjection(b) - getUserPlayerProjection(a))
        .map((option, index) => {
          return {
            id: option,
            columns: [
              { text: allplayers[option].position, colspan: 1 },
              { text: allplayers[option].full_name, colspan: 3 },
              { text: getUserPlayerProjection(option).toFixed(1), colspan: 2 },
            ],
          };
        })) ||
    [];

  return (
    <>
      <div className="nav nav2">
        <div></div>
        <div></div>
      </div>
      <TableMain
        type={2}
        half={true}
        headers={headersStarters}
        data={dataStarters}
        active={activePlayer}
        setActive={setActivePlayer}
      />
      {activePlayer ? (
        <TableMain type={2} half={true} headers={[]} data={dataOptions} />
      ) : null}
    </>
  );
};
export default Matchup;
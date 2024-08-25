import { MatchupOptimal } from "@/lib/types";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import TableMain from "./TableMain";
import { useState } from "react";
import { position_map } from "@/helpers/getPlayerShares";
import "@/styles/detailnav.css";
import { syncMatchup } from "@/redux/actions/userActions";

interface MatchupProps {
  league_id: string;
  matchups: { user: MatchupOptimal; opp: MatchupOptimal; median?: number };
}

const Matchup: React.FC<MatchupProps> = ({ matchups, league_id }) => {
  const dispatch: AppDispatch = useDispatch();
  const { state, allplayers, fpweek } = useSelector(
    (state: RootState) => state.common
  );
  const { leagues, isSyncingMatchup } = useSelector(
    (state: RootState) => state.user
  );
  const [activePlayer, setActivePlayer] = useState("");

  const week = (state && Math.max(state.leg, 1)) || 1;
  const user_matchup = leagues && matchups.user;

  const opp_matchup = user_matchup && matchups.opp;

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
  const getDataStarters = (matchup: MatchupOptimal) => {
    return (
      (leagues &&
        matchup &&
        leagues[league_id].roster_positions
          .filter((rp) => rp !== "BN")
          .map((rp, index) => {
            const classname = !matchup.optimal_starters
              .map((os) => os.player_id)
              .includes(matchup.starters[index])
              ? "red"
              : "";
            return {
              id: `${rp}__${index}`,
              columns: [
                { text: rp, colspan: 1, classname },
                {
                  text: (
                    <div className="">
                      {(allplayers &&
                        allplayers[matchup.starters[index]]?.full_name) ||
                        "-"}
                      <em className="inj">
                        {fpweek &&
                          fpweek[matchup.starters[index]]?.injury_status?.slice(
                            0,
                            1
                          )}
                      </em>
                    </div>
                  ),
                  colspan: 3,
                  classname: classname + " relative",
                },
                {
                  text:
                    matchup.players_projections
                      .find((pp) => pp.player_id === matchup.starters[index])
                      ?.proj?.toFixed(1) || "-",
                  colspan: 2,
                  classname,
                },
              ],
            };
          })) ||
      []
    );
  };
  const activeSlot = activePlayer?.split("__")[0];

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
          const classname = user_matchup.optimal_starters
            .map((os) => os.player_id)
            .includes(option)
            ? "green"
            : "";
          return {
            id: option,
            columns: [
              { text: allplayers[option].position, colspan: 1, classname },
              {
                text: allplayers[option].full_name,
                colspan: 3,
                classname,
              },
              {
                text: getUserPlayerProjection(option).toFixed(1),
                colspan: 2,
                classname,
              },
            ],
          };
        })) ||
    [];

  return (
    <>
      <div className="nav nav2">
        <div className="sync">
          <i
            className={
              "fa-solid fa-arrows-rotate " +
              (isSyncingMatchup === league_id ? "rotate" : "")
            }
            onClick={() =>
              leagues &&
              allplayers &&
              fpweek &&
              dispatch(
                syncMatchup(league_id, leagues, week, allplayers, fpweek)
              )
            }
          ></i>
        </div>
      </div>
      <div className="nav nav2">
        <div>
          <strong>
            {user_matchup && user_matchup.actual_proj.toFixed(1)}{" "}
            <em>({user_matchup && user_matchup.optimal_proj.toFixed(1)})</em>
          </strong>

          {user_matchup && leagues[league_id].userRoster.username}
        </div>
        <div className="sync">
          <strong>{matchups.median?.toFixed(1)}</strong>
        </div>
        <div>
          {!activePlayer && opp_matchup && (
            <>
              {opp_roster && opp_roster.username}
              <strong>
                {opp_matchup.actual_proj.toFixed(1)}
                <em>({opp_matchup.optimal_proj.toFixed(1)})</em>
              </strong>
            </>
          )}
        </div>
      </div>
      <TableMain
        type={2}
        half={true}
        headers={headersStarters}
        data={(user_matchup && getDataStarters(user_matchup)) || []}
        active={activePlayer}
        setActive={setActivePlayer}
      />
      {activePlayer ? (
        <TableMain type={2} half={true} headers={[]} data={dataOptions} />
      ) : (
        <TableMain
          type={2}
          half={true}
          headers={headersStarters}
          data={(opp_matchup && getDataStarters(opp_matchup)) || []}
        />
      )}
    </>
  );
};
export default Matchup;

import { Roster } from "@/lib/types";
import "@/styles/detailnav.css";
import TableMain from "./TableMain";
import Avatar from "./Avatar";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import HeaderDropdown from "./HeaderDropdown";
import {
  getStandingsColumn,
  getTeamColumn,
} from "@/helpers/getStandingsColumn";
import { syncLeague } from "@/redux/actions/userActions";
import { getPlayerProjection } from "@/helpers/getPlayerShares";
import {
  setStandingsColumn,
  setTeamColumn,
} from "@/redux/actions/leaguesActions";

type setColumn = (column: string) => void;
type setTab = (tab: string) => void;

interface StandingsProps {
  type: number;
  league: {
    league_id: string;
    userRoster?: Roster;
    rosters: Roster[];
    scoring_settings: { [key: string]: number };
    roster_positions: string[];
  };
  standingsTab: string;
  standingsTab2: string;
  setStandingsTab: setTab;
  setStandingsTab2: setTab;
}

const Standings: React.FC<StandingsProps> = ({
  type,
  league,
  standingsTab,
  standingsTab2,
  setStandingsTab,
  setStandingsTab2,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { allplayers, ktc_current, fpseason } = useSelector(
    (state: RootState) => state.common
  );
  const { leagues, isSyncing } = useSelector((state: RootState) => state.user);
  const { standingsColumn, teamColumn } = useSelector(
    (state: RootState) => state.leagues
  );

  useEffect(() => {
    if (league.userRoster) {
      if (
        !["Standings", "Settings", league.userRoster.username].includes(
          standingsTab
        )
      ) {
        if (standingsTab2 === "Standings") {
          setStandingsTab(league.userRoster.username);
        } else {
          setStandingsTab("Standings");
        }
      }

      if (
        !["Standings", "Settings", league.userRoster.username].includes(
          standingsTab2
        )
      ) {
        if (standingsTab === league.userRoster.username) {
          setStandingsTab2("Standings");
        } else {
          setStandingsTab2(league.userRoster.username);
        }
      }
    } else {
      setStandingsTab("Standings");
      setStandingsTab2("Settings");
    }
  }, []);

  /*
  useEffect(() => {
    if (standingsTab === "") {
      setStandingsTab("Settings");
    }
  }, [standingsTab]);

  useEffect(() => {
    if (standingsTab2 === "") {
      setStandingsTab2("Settings");
    }
  }, [standingsTab2]);
  */

  const handleSetStandingsTabs = (tabNo: 1 | 2, selectedValue: string) => {
    if (tabNo === 1) {
      if (standingsTab2 === selectedValue) {
        setStandingsTab2(standingsTab);
      }

      if (selectedValue === "") {
        setStandingsTab("Settings");
      } else {
        setStandingsTab(selectedValue);
      }
    } else {
      if (standingsTab === selectedValue) {
        setStandingsTab(standingsTab2);
      }

      if (selectedValue === "") {
        setStandingsTab2("Settings");
      } else {
        setStandingsTab2(selectedValue);
      }
    }
  };

  const headersStandings = [
    { text: <div>Rk</div>, colspan: 1 },
    { text: <div>Manager</div>, colspan: 3 },
    {
      text: (
        <HeaderDropdown
          options={[
            { text: "Wins", abbrev: "W" },
            { text: "Losses", abbrev: "L" },
            { text: "Total ROS Proj", abbrev: "T Proj" },
            { text: "Starters ROS Proj", abbrev: "S Proj" },
            { text: "Total KTC Value", abbrev: "T KTC" },
            { text: "Starters KTC Value", abbrev: "S KTC" },
          ]}
          columnText={standingsColumn}
          setColumnText={(col) => dispatch(setStandingsColumn(col))}
        />
      ),
      colspan: 2,
    },
  ];

  const standings: {
    [key: string]: {
      text: string | number;
      trendColor: { [key: string]: string };
      sortby: number;
    };
  } = {};

  league.rosters.forEach((r) => {
    const { text, trendColor, sortby } = getStandingsColumn(
      standingsColumn,
      r,
      league.rosters,
      ktc_current || {},
      fpseason || {},
      league.scoring_settings,
      allplayers || {}
    );

    standings[r.roster_id] = { text, trendColor, sortby };
  });

  const dataStandings = league.rosters
    .map((roster, index) => {
      const { text, trendColor, sortby } = standings[roster.roster_id];

      const rank =
        Object.keys(standings)
          .sort(
            (a: string, b: string) => standings[b].sortby - standings[a].sortby
          )
          .indexOf(roster.roster_id.toString()) + 1;

      return {
        id:
          roster.username === "Orphan"
            ? `Orphan_${roster.roster_id}`
            : roster.username,
        sortby: rank,
        columns: [
          { text: rank, colspan: 1 },
          {
            text: <Avatar id={roster.avatar} type="U" text={roster.username} />,
            colspan: 3,
          },
          {
            text: text,
            colspan: 2,
            style: trendColor,
          },
        ],
      };
    })
    .sort((a, b) => (a.sortby > b.sortby ? 1 : -1));

  const headersTeam = [
    { text: "Slot", colspan: 1 },
    { text: "Player", colspan: 3 },
    {
      text: (
        <HeaderDropdown
          options={[
            { text: "Age", abbrev: "Age" },
            { text: "Team", abbrev: "Tm" },
            { text: "KTC Dynasty Value", abbrev: "KTC" },
            { text: "ROS Proj", abbrev: "Proj" },
          ]}
          columnText={teamColumn}
          setColumnText={(col) => dispatch(setTeamColumn(col))}
        />
      ),
      colspan: 2,
    },
  ];

  const getDataTeam = (roster: Roster) => {
    return [
      ...league.roster_positions
        .filter((rp) => rp !== "BN")
        .map((rp, index) => {
          let text, trendColor;

          if (allplayers) {
            ({ text, trendColor } = getTeamColumn(
              teamColumn,
              allplayers[roster.starters[index]],
              ktc_current || {},
              fpseason || {},
              league.scoring_settings,
              allplayers,
              league.rosters
            ));
          } else {
            text = "-";
            trendColor = { color: `rgb(255, 255, 255)` };
          }

          return {
            id: `${rp}_${index}`,
            columns: [
              { text: rp, colspan: 1 },
              {
                text: allplayers && (
                  <Avatar
                    id={roster.starters[index]}
                    type="P"
                    text={allplayers[roster.starters[index]]?.full_name || "-"}
                  />
                ),
                colspan: 3,
              },
              { text: text, colspan: 2, style: trendColor },
            ],
          };
        }),
      ...(roster.players || [])
        ?.filter(
          (player_id) => !Object.values(roster.starters).includes(player_id)
        )
        .sort((a, b) => {
          const getPositionValue = (player_id: string) => {
            const position = allplayers && allplayers[player_id]?.position;

            switch (position) {
              case "QB":
                return 1;
              case "RB":
                return 2;
              case "FB":
                return 2;
              case "WR":
                return 3;
              case "TE":
                return 4;
              default:
                return 5;
            }
          };

          const pos_diff = getPositionValue(a) - getPositionValue(b);

          if (pos_diff !== 0) {
            return pos_diff;
          }

          return (
            (fpseason &&
              getPlayerProjection(b, league.scoring_settings, fpseason) -
                getPlayerProjection(a, league.scoring_settings, fpseason)) ||
            1
          );
        })
        .map((player_id, index) => {
          let text, trendColor;

          if (allplayers) {
            ({ text, trendColor } = getTeamColumn(
              teamColumn,
              allplayers[player_id],
              ktc_current || {},
              fpseason || {},
              league.scoring_settings,
              allplayers,
              league.rosters
            ));
          } else {
            text = "-";
            trendColor = { color: `rgb(255, 255, 255)` };
          }

          return {
            id: `${player_id}_${index}`,
            columns: [
              {
                text: "BN",
                colspan: 1,
              },
              {
                text:
                  (allplayers && (
                    <Avatar
                      id={player_id}
                      type="P"
                      text={allplayers[player_id].full_name}
                    />
                  )) ||
                  "-",
                colspan: 3,
              },
              { text: text, colspan: 2, style: trendColor },
            ],
          };
        }),
      ...[...(roster.draftpicks || [])]
        .sort(
          (a, b) =>
            a.season - b.season ||
            a.round - b.round ||
            (a.order || a.roster_id) - (b.order || b.roster_id)
        )
        .map((draftpick, index) => {
          return {
            id: `${draftpick.season}_${draftpick.round}_${draftpick.roster_id}_${index}`,
            columns: [
              {
                text: `${draftpick.season} ${
                  draftpick.order
                    ? `${draftpick.round}.${draftpick.order.toLocaleString(
                        "en-US",
                        { minimumIntegerDigits: 2 }
                      )}`
                    : ` Round ${draftpick.round} ${
                        draftpick.roster_id !== roster.roster_id
                          ? `(${draftpick.original_user.username})`
                          : ""
                      }`
                }`,
                colspan: 6,
              },
            ],
          };
        }),
    ];
  };

  const headersSettings = [
    { text: "Setting", colspan: 3 },
    { text: "Pts", colspan: 1 },
  ];

  const dataSettings = Object.keys(league.scoring_settings)
    .filter((setting) => {
      const condition1 = [
        "pass",
        "rush",
        "rec",
        "st",
        "sack",
        "bonus",
        "fum",
        "int",
      ].some((cat) => setting.startsWith(cat));

      const condition2 =
        league.roster_positions.includes("K") &&
        ["fg", "xpm"].some((cat) => setting.startsWith(cat));

      const condition3 =
        ["DEF", "DL", "LB", "DB", "IDP_FLEX"].some((slot) =>
          league.roster_positions.includes(slot)
        ) && ["idp", "pts", "def"].some((cat) => setting.startsWith(cat));

      return (
        league.scoring_settings[setting] > 0 &&
        (condition1 || condition2 || condition3)
      );
    })
    .sort((a, b) => {
      const getSortValue = (setting_to_sort: string) => {
        let sort_value;

        if (setting_to_sort.startsWith("pass")) {
          sort_value = 1;
        } else if (["int", "sack"].includes(setting_to_sort)) {
          sort_value = 2;
        } else if (setting_to_sort.includes("pass")) {
          sort_value = 3;
        } else if (setting_to_sort.startsWith("rush")) {
          sort_value = 4;
        } else if (setting_to_sort.includes("rush")) {
          sort_value = 5;
        } else if (setting_to_sort.startsWith("rec")) {
          sort_value = 6;
        } else if (
          setting_to_sort.includes("rec") &&
          !setting_to_sort.includes("fum")
        ) {
          sort_value = 7;
        } else {
          sort_value = 8;
        }

        return sort_value;
      };

      const a_sort_value = getSortValue(a);

      const b_sort_value = getSortValue(b);

      return a_sort_value - b_sort_value;
    })
    .map((setting, index) => {
      return {
        id: `setting_${index}`,
        columns: [
          { text: setting.replace(/_/g, " "), colspan: 3 },
          { text: league.scoring_settings[setting], colspan: 1 },
        ],
      };
    });

  const standingsTable = (
    <TableMain
      type={type}
      half={true}
      headers={headersStandings}
      data={dataStandings}
      active={
        standingsTab === "Standings"
          ? standingsTab2
          : standingsTab2 === "Standings"
          ? standingsTab
          : ""
      }
      setActive={
        standingsTab === "Standings"
          ? (value) => handleSetStandingsTabs(2, value)
          : standingsTab2 === "Standings"
          ? (value) => handleSetStandingsTabs(1, value)
          : console.log
      }
    />
  );

  const settingsTable = (
    <TableMain
      type={type}
      half={true}
      headers={headersSettings}
      data={dataSettings}
    />
  );

  const getRosterTable = (username: string) => {
    let roster;

    if (username.startsWith("Orphan_")) {
      roster = league.rosters.find(
        (r) => r.roster_id.toString() === username.split("_")[1]
      );
    } else {
      roster = league.rosters.find((r) => r.username === username);
    }

    return (
      roster && (
        <TableMain
          type={type}
          half={true}
          headers={headersTeam}
          data={getDataTeam(roster)}
        />
      )
    );
  };

  return (
    <>
      <div className={"nav nav" + type}>
        <div>
          <div className={"button active"}>
            {standingsTab}
            <select
              value={standingsTab}
              onChange={(e) => handleSetStandingsTabs(1, e.target.value)}
            >
              {[
                "Standings",
                "Settings",
                ...league.rosters.map((r) =>
                  r.username === "Orphan" ? `Orphan_${r.roster_id}` : r.username
                ),
              ].map((option, index) => {
                return <option key={`${option}_${index}`}>{option}</option>;
              })}
            </select>
          </div>
        </div>
        {league.userRoster && (
          <div className="sync">
            <i
              className={
                "fa-solid fa-arrows-rotate " +
                (isSyncing === league.league_id ? "rotate" : "")
              }
              onClick={() =>
                leagues &&
                allplayers &&
                fpseason &&
                !isSyncing &&
                dispatch(
                  syncLeague(league.league_id, leagues, allplayers, fpseason)
                )
              }
            ></i>
          </div>
        )}
        <div>
          <div className={"button active"}>
            {standingsTab2}
            <select
              value={standingsTab2}
              onChange={(e) => handleSetStandingsTabs(2, e.target.value)}
            >
              {[
                "Standings",
                "Settings",
                ...league.rosters.map((r) =>
                  r.username === "Orphan" ? `Orphan_${r.roster_id}` : r.username
                ),
              ].map((option, index) => {
                return <option key={`${option}_${index}`}>{option}</option>;
              })}
            </select>
          </div>
        </div>
      </div>
      {standingsTab === "Standings"
        ? standingsTable
        : standingsTab === "Settings"
        ? settingsTable
        : getRosterTable(standingsTab)}
      {standingsTab2 === "Standings"
        ? standingsTable
        : standingsTab2 === "Settings"
        ? settingsTable
        : getRosterTable(standingsTab2)}
    </>
  );
};

export default Standings;

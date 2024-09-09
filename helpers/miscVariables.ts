export const nfl_teams = [
  "ARI",
  "ATL",
  "BAL",
  "BUF",
  "CAR",
  "CHI",
  "CIN",
  "CLE",
  "DAL",
  "DEN",
  "DET",
  "GB",
  "HOU",
  "IND",
  "JAX",
  "KC",
  "LV",
  "LAC",
  "LAR",
  "MIA",
  "MIN",
  "NE",
  "NO",
  "NYG",
  "NYJ",
  "PHI",
  "PIT",
  "SF",
  "SEA",
  "TB",
  "TEN",
  "WAS",
];

export const convertTeamAbbrev = (mfl_team_id: string) => {
  let sleeper_team_abbrev;

  switch (mfl_team_id) {
    case "JAC":
      sleeper_team_abbrev = "JAX";
      break;
    case "GBP":
      sleeper_team_abbrev = "GB";
      break;
    case "KCC":
      sleeper_team_abbrev = "KC";
      break;
    case "LVR":
      sleeper_team_abbrev = "LV";
      break;
    case "NEP":
      sleeper_team_abbrev = "NE";
      break;
    case "NOS":
      sleeper_team_abbrev = "NO";
      break;
    case "SFO":
      sleeper_team_abbrev = "SF";
      break;
    case "TBB":
      sleeper_team_abbrev = "TB";
      break;
    default:
      sleeper_team_abbrev = mfl_team_id;
      break;
  }

  return sleeper_team_abbrev;
};

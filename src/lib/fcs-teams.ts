type FcsStyle = {
  mascot: string;
  abbrev: string;
  primary: string;
  secondary: string;
};

export type FcsTeam = {
  name: string;
  conference: string;
  style: FcsStyle;
};

/** 2026 FCS membership: 128 programs, including teams still in a Division I transition. */
export const FCS_TEAMS: FcsTeam[] = [
  {
    name: "Abilene Christian",
    conference: "UAC",
    style: { mascot: "Wildcats", abbrev: "ACU", primary: "#4E2683", secondary: "#FFFFFF" },
  },
  {
    name: "Alabama A&M",
    conference: "SWAC",
    style: { mascot: "Bulldogs", abbrev: "AAMU", primary: "#750000", secondary: "#FFFFFF" },
  },
  {
    name: "Alabama State",
    conference: "SWAC",
    style: { mascot: "Hornets", abbrev: "ALST", primary: "#000000", secondary: "#C5A900" },
  },
  {
    name: "Albany",
    conference: "CAA",
    style: { mascot: "Great Danes", abbrev: "ALB", primary: "#461660", secondary: "#EAAA00" },
  },
  {
    name: "Alcorn State",
    conference: "SWAC",
    style: { mascot: "Braves", abbrev: "ALCN", primary: "#4B0082", secondary: "#C5A900" },
  },
  {
    name: "Arkansas-Pine Bluff",
    conference: "SWAC",
    style: { mascot: "Golden Lions", abbrev: "UAPB", primary: "#000000", secondary: "#FFD100" },
  },
  {
    name: "Austin Peay",
    conference: "UAC",
    style: { mascot: "Governors", abbrev: "APSU", primary: "#8E0B2E", secondary: "#FFFFFF" },
  },
  {
    name: "Bethune-Cookman",
    conference: "SWAC",
    style: { mascot: "Wildcats", abbrev: "BCU", primary: "#800020", secondary: "#FFD700" },
  },
  {
    name: "Brown",
    conference: "Ivy",
    style: { mascot: "Bears", abbrev: "BRWN", primary: "#4E3629", secondary: "#FFFFFF" },
  },
  {
    name: "Bryant",
    conference: "CAA",
    style: { mascot: "Bulldogs", abbrev: "BRY", primary: "#000000", secondary: "#FFD100" },
  },
  {
    name: "Bucknell",
    conference: "Patriot",
    style: { mascot: "Bison", abbrev: "BUCK", primary: "#003366", secondary: "#FF6600" },
  },
  {
    name: "Butler",
    conference: "Pioneer",
    style: { mascot: "Bulldogs", abbrev: "BUT", primary: "#13294B", secondary: "#FFFFFF" },
  },
  {
    name: "Cal Poly",
    conference: "Big Sky",
    style: { mascot: "Mustangs", abbrev: "CP", primary: "#154734", secondary: "#C4B581" },
  },
  {
    name: "Campbell",
    conference: "CAA",
    style: { mascot: "Fighting Camels", abbrev: "CAM", primary: "#000000", secondary: "#F47920" },
  },
  {
    name: "Central Arkansas",
    conference: "UAC",
    style: { mascot: "Bears", abbrev: "UCA", primary: "#4B116F", secondary: "#FFFFFF" },
  },
  {
    name: "Central Connecticut",
    conference: "NEC",
    style: { mascot: "Blue Devils", abbrev: "CCSU", primary: "#0033A0", secondary: "#FFFFFF" },
  },
  {
    name: "Charleston Southern",
    conference: "OVC",
    style: { mascot: "Buccaneers", abbrev: "CHSO", primary: "#002855", secondary: "#B3A369" },
  },
  {
    name: "Chattanooga",
    conference: "SoCon",
    style: { mascot: "Mocs", abbrev: "UTC", primary: "#00386B", secondary: "#E0AA0F" },
  },
  {
    name: "Chicago State",
    conference: "Independent",
    style: { mascot: "Cougars", abbrev: "CSU", primary: "#006747", secondary: "#FFFFFF" },
  },
  {
    name: "The Citadel",
    conference: "SoCon",
    style: { mascot: "Bulldogs", abbrev: "CIT", primary: "#002868", secondary: "#A5ACAF" },
  },
  {
    name: "Colgate",
    conference: "Patriot",
    style: { mascot: "Raiders", abbrev: "COLG", primary: "#821019", secondary: "#FFFFFF" },
  },
  {
    name: "Columbia",
    conference: "Ivy",
    style: { mascot: "Lions", abbrev: "CLMB", primary: "#9BC2E6", secondary: "#002B5C" },
  },
  {
    name: "Cornell",
    conference: "Ivy",
    style: { mascot: "Big Red", abbrev: "COR", primary: "#B31B1B", secondary: "#FFFFFF" },
  },
  {
    name: "Dartmouth",
    conference: "Ivy",
    style: { mascot: "Big Green", abbrev: "DART", primary: "#00693E", secondary: "#FFFFFF" },
  },
  {
    name: "Davidson",
    conference: "Pioneer",
    style: { mascot: "Wildcats", abbrev: "DAV", primary: "#CC0000", secondary: "#000000" },
  },
  {
    name: "Dayton",
    conference: "Pioneer",
    style: { mascot: "Flyers", abbrev: "DAY", primary: "#CE1141", secondary: "#004B8D" },
  },
  {
    name: "Delaware State",
    conference: "MEAC",
    style: { mascot: "Hornets", abbrev: "DSU", primary: "#EE3124", secondary: "#0033A0" },
  },
  {
    name: "Drake",
    conference: "Pioneer",
    style: { mascot: "Bulldogs", abbrev: "DRKE", primary: "#004477", secondary: "#FFFFFF" },
  },
  {
    name: "Duquesne",
    conference: "NEC",
    style: { mascot: "Dukes", abbrev: "DUQ", primary: "#041E42", secondary: "#BA0C2F" },
  },
  {
    name: "East Tennessee State",
    conference: "SoCon",
    style: { mascot: "Buccaneers", abbrev: "ETSU", primary: "#041E42", secondary: "#FFC72C" },
  },
  {
    name: "East Texas A&M",
    conference: "Southland",
    style: { mascot: "Lions", abbrev: "ETAM", primary: "#0033A0", secondary: "#FFC72C" },
  },
  {
    name: "Eastern Illinois",
    conference: "OVC",
    style: { mascot: "Panthers", abbrev: "EIU", primary: "#003399", secondary: "#FFFFFF" },
  },
  {
    name: "Eastern Kentucky",
    conference: "UAC",
    style: { mascot: "Colonels", abbrev: "EKU", primary: "#660000", secondary: "#FFFFFF" },
  },
  {
    name: "Eastern Washington",
    conference: "Big Sky",
    style: { mascot: "Eagles", abbrev: "EWU", primary: "#A10022", secondary: "#FFFFFF" },
  },
  {
    name: "Elon",
    conference: "CAA",
    style: { mascot: "Phoenix", abbrev: "ELON", primary: "#73000A", secondary: "#B59A6D" },
  },
  {
    name: "Florida A&M",
    conference: "SWAC",
    style: { mascot: "Rattlers", abbrev: "FAMU", primary: "#F4811F", secondary: "#006747" },
  },
  {
    name: "Fordham",
    conference: "Patriot",
    style: { mascot: "Rams", abbrev: "FOR", primary: "#830032", secondary: "#FFFFFF" },
  },
  {
    name: "Furman",
    conference: "SoCon",
    style: { mascot: "Paladins", abbrev: "FUR", primary: "#582C83", secondary: "#FFFFFF" },
  },
  {
    name: "Gardner-Webb",
    conference: "OVC",
    style: { mascot: "Runnin' Bulldogs", abbrev: "GWU", primary: "#C8102E", secondary: "#000000" },
  },
  {
    name: "Georgetown",
    conference: "Patriot",
    style: { mascot: "Hoyas", abbrev: "GU", primary: "#041E42", secondary: "#FFFFFF" },
  },
  {
    name: "Grambling State",
    conference: "SWAC",
    style: { mascot: "Tigers", abbrev: "GRAM", primary: "#000000", secondary: "#FDB913" },
  },
  {
    name: "Hampton",
    conference: "CAA",
    style: { mascot: "Pirates", abbrev: "HAMP", primary: "#0067B1", secondary: "#FFFFFF" },
  },
  {
    name: "Harvard",
    conference: "Ivy",
    style: { mascot: "Crimson", abbrev: "HARV", primary: "#A41034", secondary: "#FFFFFF" },
  },
  {
    name: "Holy Cross",
    conference: "Patriot",
    style: { mascot: "Crusaders", abbrev: "HC", primary: "#602D89", secondary: "#FFFFFF" },
  },
  {
    name: "Houston Christian",
    conference: "Southland",
    style: { mascot: "Huskies", abbrev: "HCU", primary: "#0033A0", secondary: "#C8102E" },
  },
  {
    name: "Howard",
    conference: "MEAC",
    style: { mascot: "Bison", abbrev: "HOW", primary: "#003A63", secondary: "#E31837" },
  },
  {
    name: "Idaho",
    conference: "Big Sky",
    style: { mascot: "Vandals", abbrev: "IDHO", primary: "#000000", secondary: "#C4B581" },
  },
  {
    name: "Idaho State",
    conference: "Big Sky",
    style: { mascot: "Bengals", abbrev: "IDST", primary: "#F47920", secondary: "#000000" },
  },
  {
    name: "Illinois State",
    conference: "MVFC",
    style: { mascot: "Redbirds", abbrev: "ILST", primary: "#CE1126", secondary: "#FFFFFF" },
  },
  {
    name: "Incarnate Word",
    conference: "Southland",
    style: { mascot: "Cardinals", abbrev: "UIW", primary: "#CE1126", secondary: "#000000" },
  },
  {
    name: "Indiana State",
    conference: "MVFC",
    style: { mascot: "Sycamores", abbrev: "INST", primary: "#0033A0", secondary: "#FFFFFF" },
  },
  {
    name: "Jackson State",
    conference: "SWAC",
    style: { mascot: "Tigers", abbrev: "JKST", primary: "#002147", secondary: "#C5B358" },
  },
  {
    name: "Lafayette",
    conference: "Patriot",
    style: { mascot: "Leopards", abbrev: "LAF", primary: "#6C1D45", secondary: "#FFFFFF" },
  },
  {
    name: "Lamar",
    conference: "Southland",
    style: { mascot: "Cardinals", abbrev: "LAM", primary: "#C8102E", secondary: "#FFFFFF" },
  },
  {
    name: "Lehigh",
    conference: "Patriot",
    style: { mascot: "Mountain Hawks", abbrev: "LEH", primary: "#6C2C2F", secondary: "#FFFFFF" },
  },
  {
    name: "Lindenwood",
    conference: "OVC",
    style: { mascot: "Lions", abbrev: "LIN", primary: "#000000", secondary: "#FFC72C" },
  },
  {
    name: "LIU",
    conference: "NEC",
    style: { mascot: "Sharks", abbrev: "LIU", primary: "#69B3E7", secondary: "#000000" },
  },
  {
    name: "Maine",
    conference: "CAA",
    style: { mascot: "Black Bears", abbrev: "ME", primary: "#003263", secondary: "#B3A369" },
  },
  {
    name: "Marist",
    conference: "Pioneer",
    style: { mascot: "Red Foxes", abbrev: "MRST", primary: "#C8102E", secondary: "#FFFFFF" },
  },
  {
    name: "McNeese",
    conference: "Southland",
    style: { mascot: "Cowboys", abbrev: "MCN", primary: "#00529B", secondary: "#FFD100" },
  },
  {
    name: "Mercer",
    conference: "SoCon",
    style: { mascot: "Bears", abbrev: "MER", primary: "#F47920", secondary: "#000000" },
  },
  {
    name: "Mercyhurst",
    conference: "NEC",
    style: { mascot: "Lakers", abbrev: "MERC", primary: "#006747", secondary: "#FFC72C" },
  },
  {
    name: "Merrimack",
    conference: "Independent",
    style: { mascot: "Warriors", abbrev: "MRMK", primary: "#0033A0", secondary: "#FFD100" },
  },
  {
    name: "Mississippi Valley State",
    conference: "SWAC",
    style: { mascot: "Delta Devils", abbrev: "MVSU", primary: "#006747", secondary: "#FFFFFF" },
  },
  {
    name: "Monmouth",
    conference: "CAA",
    style: { mascot: "Hawks", abbrev: "MON", primary: "#002D72", secondary: "#FFFFFF" },
  },
  {
    name: "Montana",
    conference: "Big Sky",
    style: { mascot: "Grizzlies", abbrev: "MONT", primary: "#6F263D", secondary: "#999999" },
  },
  {
    name: "Montana State",
    conference: "Big Sky",
    style: { mascot: "Bobcats", abbrev: "MTST", primary: "#003366", secondary: "#FFCC00" },
  },
  {
    name: "Morehead State",
    conference: "Pioneer",
    style: { mascot: "Eagles", abbrev: "MOR", primary: "#0033A0", secondary: "#FFCC00" },
  },
  {
    name: "Morgan State",
    conference: "MEAC",
    style: { mascot: "Bears", abbrev: "MORG", primary: "#003087", secondary: "#F47920" },
  },
  {
    name: "Murray State",
    conference: "MVFC",
    style: { mascot: "Racers", abbrev: "MUR", primary: "#002144", secondary: "#FFC72C" },
  },
  {
    name: "New Hampshire",
    conference: "CAA",
    style: { mascot: "Wildcats", abbrev: "UNH", primary: "#003591", secondary: "#FFFFFF" },
  },
  {
    name: "New Haven",
    conference: "NEC",
    style: { mascot: "Chargers", abbrev: "NHVN", primary: "#003087", secondary: "#FFC72C" },
  },
  {
    name: "Nicholls",
    conference: "Southland",
    style: { mascot: "Colonels", abbrev: "NICH", primary: "#C8102E", secondary: "#FFFFFF" },
  },
  {
    name: "Norfolk State",
    conference: "MEAC",
    style: { mascot: "Spartans", abbrev: "NSU", primary: "#046A38", secondary: "#FFC72C" },
  },
  {
    name: "North Alabama",
    conference: "UAC",
    style: { mascot: "Lions", abbrev: "UNA", primary: "#46166B", secondary: "#FFB81C" },
  },
  {
    name: "North Carolina A&T",
    conference: "CAA",
    style: { mascot: "Aggies", abbrev: "NCAT", primary: "#004684", secondary: "#FFC72C" },
  },
  {
    name: "North Carolina Central",
    conference: "MEAC",
    style: { mascot: "Eagles", abbrev: "NCCU", primary: "#8B0E04", secondary: "#FFFFFF" },
  },
  {
    name: "North Dakota",
    conference: "MVFC",
    style: { mascot: "Fighting Hawks", abbrev: "UND", primary: "#009A44", secondary: "#000000" },
  },
  {
    name: "Northern Arizona",
    conference: "Big Sky",
    style: { mascot: "Lumberjacks", abbrev: "NAU", primary: "#003466", secondary: "#FFC72C" },
  },
  {
    name: "Northern Colorado",
    conference: "Big Sky",
    style: { mascot: "Bears", abbrev: "UNCO", primary: "#013C65", secondary: "#FFD100" },
  },
  {
    name: "Northern Iowa",
    conference: "MVFC",
    style: { mascot: "Panthers", abbrev: "UNI", primary: "#4B116F", secondary: "#FFCC00" },
  },
  {
    name: "Northwestern State",
    conference: "Southland",
    style: { mascot: "Demons", abbrev: "NWST", primary: "#4B2682", secondary: "#F47920" },
  },
  {
    name: "Penn",
    conference: "Ivy",
    style: { mascot: "Quakers", abbrev: "PENN", primary: "#011F5B", secondary: "#990000" },
  },
  {
    name: "Portland State",
    conference: "Big Sky",
    style: { mascot: "Vikings", abbrev: "PRST", primary: "#154734", secondary: "#FFFFFF" },
  },
  {
    name: "Prairie View A&M",
    conference: "SWAC",
    style: { mascot: "Panthers", abbrev: "PVAM", primary: "#4F2683", secondary: "#FFB81C" },
  },
  {
    name: "Presbyterian",
    conference: "Pioneer",
    style: { mascot: "Blue Hose", abbrev: "PRES", primary: "#002F6C", secondary: "#FFFFFF" },
  },
  {
    name: "Princeton",
    conference: "Ivy",
    style: { mascot: "Tigers", abbrev: "PRIN", primary: "#FF6000", secondary: "#000000" },
  },
  {
    name: "Rhode Island",
    conference: "CAA",
    style: { mascot: "Rams", abbrev: "URI", primary: "#003366", secondary: "#68ABE8" },
  },
  {
    name: "Richmond",
    conference: "Patriot",
    style: { mascot: "Spiders", abbrev: "UR", primary: "#003366", secondary: "#990000" },
  },
  {
    name: "Robert Morris",
    conference: "NEC",
    style: { mascot: "Colonials", abbrev: "RMU", primary: "#00205B", secondary: "#C41230" },
  },
  {
    name: "Sacred Heart",
    conference: "CAA",
    style: { mascot: "Pioneers", abbrev: "SHU", primary: "#CE1126", secondary: "#FFFFFF" },
  },
  {
    name: "St. Thomas",
    conference: "Pioneer",
    style: { mascot: "Tommies", abbrev: "UST", primary: "#4B1E6D", secondary: "#FFFFFF" },
  },
  {
    name: "Samford",
    conference: "SoCon",
    style: { mascot: "Bulldogs", abbrev: "SAM", primary: "#002649", secondary: "#C41230" },
  },
  {
    name: "San Diego",
    conference: "Pioneer",
    style: { mascot: "Toreros", abbrev: "USD", primary: "#003DA5", secondary: "#FFFFFF" },
  },
  {
    name: "South Carolina State",
    conference: "MEAC",
    style: { mascot: "Bulldogs", abbrev: "SCST", primary: "#800000", secondary: "#FFD100" },
  },
  {
    name: "South Dakota",
    conference: "MVFC",
    style: { mascot: "Coyotes", abbrev: "SDAK", primary: "#A6192E", secondary: "#FFFFFF" },
  },
  {
    name: "South Dakota State",
    conference: "MVFC",
    style: { mascot: "Jackrabbits", abbrev: "SDSU", primary: "#0033A0", secondary: "#FFD100" },
  },
  {
    name: "Southeast Missouri State",
    conference: "OVC",
    style: { mascot: "Redhawks", abbrev: "SEMO", primary: "#C8102E", secondary: "#000000" },
  },
  {
    name: "Southeastern Louisiana",
    conference: "Southland",
    style: { mascot: "Lions", abbrev: "SELA", primary: "#006747", secondary: "#FFD100" },
  },
  {
    name: "Southern",
    conference: "SWAC",
    style: { mascot: "Jaguars", abbrev: "SOU", primary: "#0033A0", secondary: "#FFD100" },
  },
  {
    name: "Southern Illinois",
    conference: "MVFC",
    style: { mascot: "Salukis", abbrev: "SIU", primary: "#800000", secondary: "#FFFFFF" },
  },
  {
    name: "Southern Utah",
    conference: "Big Sky",
    style: { mascot: "Thunderbirds", abbrev: "SUU", primary: "#C8102E", secondary: "#000000" },
  },
  {
    name: "Stephen F. Austin",
    conference: "Southland",
    style: { mascot: "Lumberjacks", abbrev: "SFA", primary: "#4B0082", secondary: "#FFFFFF" },
  },
  {
    name: "Stetson",
    conference: "Pioneer",
    style: { mascot: "Hatters", abbrev: "STET", primary: "#006747", secondary: "#FFFFFF" },
  },
  {
    name: "Stonehill",
    conference: "NEC",
    style: { mascot: "Skyhawks", abbrev: "STO", primary: "#4B116F", secondary: "#FFFFFF" },
  },
  {
    name: "Stony Brook",
    conference: "CAA",
    style: { mascot: "Seawolves", abbrev: "SBU", primary: "#990000", secondary: "#FFFFFF" },
  },
  {
    name: "Tarleton State",
    conference: "UAC",
    style: { mascot: "Texans", abbrev: "TAR", primary: "#4B116F", secondary: "#FFFFFF" },
  },
  {
    name: "Tennessee State",
    conference: "OVC",
    style: { mascot: "Tigers", abbrev: "TNST", primary: "#0033A0", secondary: "#FFFFFF" },
  },
  {
    name: "Tennessee Tech",
    conference: "SoCon",
    style: { mascot: "Golden Eagles", abbrev: "TNTC", primary: "#4B116F", secondary: "#FFC72C" },
  },
  {
    name: "Texas Southern",
    conference: "SWAC",
    style: { mascot: "Tigers", abbrev: "TXSO", primary: "#6F263D", secondary: "#FFFFFF" },
  },
  {
    name: "Towson",
    conference: "CAA",
    style: { mascot: "Tigers", abbrev: "TOW", primary: "#000000", secondary: "#FFC72C" },
  },
  {
    name: "UC Davis",
    conference: "Big Sky",
    style: { mascot: "Aggies", abbrev: "UCD", primary: "#022851", secondary: "#C4B581" },
  },
  {
    name: "UT Martin",
    conference: "OVC",
    style: { mascot: "Skyhawks", abbrev: "UTM", primary: "#003366", secondary: "#F47920" },
  },
  {
    name: "Utah Tech",
    conference: "Big Sky",
    style: { mascot: "Trailblazers", abbrev: "UTU", primary: "#C8102E", secondary: "#0033A0" },
  },
  {
    name: "UTRGV",
    conference: "Southland",
    style: { mascot: "Vaqueros", abbrev: "RGV", primary: "#F15A22", secondary: "#003DA5" },
  },
  {
    name: "Valparaiso",
    conference: "Pioneer",
    style: { mascot: "Beacons", abbrev: "VAL", primary: "#4B1E2F", secondary: "#FFC72C" },
  },
  {
    name: "Villanova",
    conference: "Patriot",
    style: { mascot: "Wildcats", abbrev: "NOVA", primary: "#003366", secondary: "#FFFFFF" },
  },
  {
    name: "VMI",
    conference: "SoCon",
    style: { mascot: "Keydets", abbrev: "VMI", primary: "#C8102E", secondary: "#FFD100" },
  },
  {
    name: "Wagner",
    conference: "NEC",
    style: { mascot: "Seahawks", abbrev: "WAG", primary: "#006747", secondary: "#FFFFFF" },
  },
  {
    name: "Weber State",
    conference: "Big Sky",
    style: { mascot: "Wildcats", abbrev: "WEB", primary: "#4B116F", secondary: "#FFFFFF" },
  },
  {
    name: "West Florida",
    conference: "UAC",
    style: { mascot: "Argonauts", abbrev: "UWF", primary: "#003087", secondary: "#007A53" },
  },
  {
    name: "West Georgia",
    conference: "UAC",
    style: { mascot: "Wolves", abbrev: "UWG", primary: "#0033A0", secondary: "#C8102E" },
  },
  {
    name: "Western Carolina",
    conference: "SoCon",
    style: { mascot: "Catamounts", abbrev: "WCU", primary: "#592C82", secondary: "#C5B783" },
  },
  {
    name: "Western Illinois",
    conference: "OVC",
    style: { mascot: "Leathernecks", abbrev: "WIU", primary: "#4B116F", secondary: "#FFC72C" },
  },
  {
    name: "William & Mary",
    conference: "Patriot",
    style: { mascot: "Tribe", abbrev: "W&M", primary: "#115740", secondary: "#FFC72C" },
  },
  {
    name: "Wofford",
    conference: "SoCon",
    style: { mascot: "Terriers", abbrev: "WOF", primary: "#000000", secondary: "#FFC72C" },
  },
  {
    name: "Yale",
    conference: "Ivy",
    style: { mascot: "Bulldogs", abbrev: "YALE", primary: "#00356B", secondary: "#FFFFFF" },
  },
  {
    name: "Youngstown State",
    conference: "MVFC",
    style: { mascot: "Penguins", abbrev: "YSU", primary: "#C8102E", secondary: "#000000" },
  },
];

export const FCS_TEAM_STYLES: Record<string, FcsStyle> = Object.fromEntries(
  FCS_TEAMS.map((team) => [team.name, team.style]),
);

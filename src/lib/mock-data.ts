// Mock data for demo display when API returns empty results.
// Untyped — cast at usage site via `as any`.
export const MOCK_LIVE_EVENTS = [
  {
    sportEventId: "mock-1",
    sportId: 1,
    tournamentNameLocalization: "UEFA Champions League",
    opponent1NameLocalization: "Real Madrid",
    opponent2NameLocalization: "Manchester City",
    gameStatus: 3,
    timeSec: 2340,
    fullScore: { sc1: 2, sc2: 1 },
    startDate: new Date().toISOString(),
    oddsLocalization: [
      { oddsMarket: 2.10 },
      { oddsMarket: 3.40 },
      { oddsMarket: 3.25 },
    ],
  },
  {
    sportEventId: "mock-2",
    sportId: 1,
    tournamentNameLocalization: "Jupiler Pro League",
    opponent1NameLocalization: "Club Brugge",
    opponent2NameLocalization: "RSC Anderlecht",
    gameStatus: 3,
    timeSec: 4080,
    fullScore: { sc1: 1, sc2: 1 },
    startDate: new Date().toISOString(),
    oddsLocalization: [
      { oddsMarket: 1.85 },
      { oddsMarket: 3.50 },
      { oddsMarket: 4.10 },
    ],
  },
  {
    sportEventId: "mock-3",
    sportId: 2,
    tournamentNameLocalization: "NBA",
    opponent1NameLocalization: "LA Lakers",
    opponent2NameLocalization: "Boston Celtics",
    gameStatus: 3,
    timeSec: 1800,
    fullScore: { sc1: 78, sc2: 82 },
    startDate: new Date().toISOString(),
    oddsLocalization: [
      { oddsMarket: 1.90 },
      { oddsMarket: 0 },
      { oddsMarket: 1.95 },
    ],
  },
  {
    sportEventId: "mock-4",
    sportId: 1,
    tournamentNameLocalization: "Premier League",
    opponent1NameLocalization: "Arsenal",
    opponent2NameLocalization: "Liverpool",
    gameStatus: 2,
    timeSec: 2700,
    fullScore: { sc1: 0, sc2: 1 },
    startDate: new Date().toISOString(),
    oddsLocalization: [
      { oddsMarket: 2.60 },
      { oddsMarket: 3.30 },
      { oddsMarket: 2.70 },
    ],
  },
  {
    sportEventId: "mock-5",
    sportId: 4,
    tournamentNameLocalization: "ATP Roland Garros",
    opponent1NameLocalization: "C. Alcaraz",
    opponent2NameLocalization: "N. Djokovic",
    gameStatus: 3,
    timeSec: 5400,
    fullScore: { sc1: 2, sc2: 1 },
    startDate: new Date().toISOString(),
    oddsLocalization: [
      { oddsMarket: 1.75 },
      { oddsMarket: 0 },
      { oddsMarket: 2.15 },
    ],
  },
];

export const MOCK_PREMATCH_EVENTS = [
  {
    sportEventId: "pre-1",
    sportId: 1,
    tournamentNameLocalization: "Jupiler Pro League",
    opponent1NameLocalization: "Union SG",
    opponent2NameLocalization: "KRC Genk",
    startDate: getUpcomingDate(0, 19, 30),
    oddsLocalization: [
      { oddsMarket: 2.20 },
      { oddsMarket: 3.30 },
      { oddsMarket: 3.10 },
    ],
  },
  {
    sportEventId: "pre-2",
    sportId: 1,
    tournamentNameLocalization: "Jupiler Pro League",
    opponent1NameLocalization: "AA Gent",
    opponent2NameLocalization: "Standard Liège",
    startDate: getUpcomingDate(0, 21, 0),
    oddsLocalization: [
      { oddsMarket: 1.75 },
      { oddsMarket: 3.60 },
      { oddsMarket: 4.50 },
    ],
  },
  {
    sportEventId: "pre-3",
    sportId: 1,
    tournamentNameLocalization: "Premier League",
    opponent1NameLocalization: "Chelsea",
    opponent2NameLocalization: "Tottenham",
    startDate: getUpcomingDate(1, 17, 30),
    oddsLocalization: [
      { oddsMarket: 2.10 },
      { oddsMarket: 3.40 },
      { oddsMarket: 3.40 },
    ],
  },
  {
    sportEventId: "pre-4",
    sportId: 1,
    tournamentNameLocalization: "Premier League",
    opponent1NameLocalization: "Man United",
    opponent2NameLocalization: "Newcastle",
    startDate: getUpcomingDate(1, 20, 0),
    oddsLocalization: [
      { oddsMarket: 2.50 },
      { oddsMarket: 3.20 },
      { oddsMarket: 2.80 },
    ],
  },
  {
    sportEventId: "pre-5",
    sportId: 1,
    tournamentNameLocalization: "La Liga",
    opponent1NameLocalization: "Barcelona",
    opponent2NameLocalization: "Atlético Madrid",
    startDate: getUpcomingDate(1, 21, 0),
    oddsLocalization: [
      { oddsMarket: 1.60 },
      { oddsMarket: 3.80 },
      { oddsMarket: 5.50 },
    ],
  },
  {
    sportEventId: "pre-6",
    sportId: 2,
    tournamentNameLocalization: "NBA",
    opponent1NameLocalization: "Golden State",
    opponent2NameLocalization: "Milwaukee",
    startDate: getUpcomingDate(0, 23, 0),
    oddsLocalization: [
      { oddsMarket: 2.05 },
      { oddsMarket: 0 },
      { oddsMarket: 1.80 },
    ],
  },
  {
    sportEventId: "pre-7",
    sportId: 4,
    tournamentNameLocalization: "ATP Masters 1000",
    opponent1NameLocalization: "J. Sinner",
    opponent2NameLocalization: "D. Medvedev",
    startDate: getUpcomingDate(2, 14, 0),
    oddsLocalization: [
      { oddsMarket: 1.55 },
      { oddsMarket: 0 },
      { oddsMarket: 2.40 },
    ],
  },
  {
    sportEventId: "pre-8",
    sportId: 3,
    tournamentNameLocalization: "NHL",
    opponent1NameLocalization: "Toronto Maple Leafs",
    opponent2NameLocalization: "Montreal Canadiens",
    startDate: getUpcomingDate(0, 22, 0),
    oddsLocalization: [
      { oddsMarket: 1.70 },
      { oddsMarket: 4.20 },
      { oddsMarket: 2.15 },
    ],
  },
];

function getUpcomingDate(daysFromNow: number, hours: number, minutes: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
}

// Featured match for hero section
export const FEATURED_MATCH = {
  league: "UEFA Champions League — Semi-Final",
  leagueIcon: "🏆",
  team1: "Real Madrid",
  team2: "Bayern Munich",
  date: "Tomorrow, 21:00 CET",
  team1Logo: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100&h=100&fit=crop",
  team2Logo: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=100&h=100&fit=crop",
  odds: { home: 1.95, draw: 3.60, away: 3.50 },
};

// Popular leagues
export const POPULAR_LEAGUES = [
  {
    name: "Jupiler Pro League",
    country: "Belgium",
    emoji: "🇧🇪",
    matches: 8,
    logoKey: "jupiler pro league",
    description: "Top-tier Belgian football division featuring 16 clubs, including Club Brugge, Anderlecht and Union SG. Founded in 1895.",
    teams: 16,
    season: "2025/26",
  },
  {
    name: "Premier League",
    country: "England",
    emoji: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    matches: 10,
    logoKey: "premier league",
    description: "England's elite football league with 20 clubs. The most-watched football division in the world, broadcast in 200+ countries.",
    teams: 20,
    season: "2025/26",
  },
  {
    name: "Champions League",
    country: "Europe",
    emoji: "🏆",
    matches: 4,
    logoKey: "champions league",
    description: "UEFA's premier club competition. 36 teams compete in the league phase before knockout rounds, ending with the Final in May.",
    teams: 36,
    season: "2025/26",
  },
  {
    name: "La Liga",
    country: "Spain",
    emoji: "🇪🇸",
    matches: 10,
    logoKey: "la liga",
    description: "Spain's top professional football division. Home of Real Madrid, Barcelona and Atlético Madrid. 20 clubs, 38 matchdays.",
    teams: 20,
    season: "2025/26",
  },
  {
    name: "NBA",
    country: "USA",
    emoji: "🇺🇸",
    matches: 12,
    logoKey: "nba",
    description: "North American professional basketball league. 30 franchises split between Eastern and Western Conferences. Regular season runs October–April.",
    teams: 30,
    season: "2025/26",
  },
  {
    name: "NHL",
    country: "USA / Canada",
    emoji: "🇺🇸",
    matches: 8,
    logoKey: "nhl",
    description: "Top professional ice hockey league in North America. 32 teams (25 US, 7 Canada). Regular season culminates in the Stanley Cup Playoffs.",
    teams: 32,
    season: "2025/26",
  },
];

// Star athletes
export const STAR_ATHLETES = [
  {
    name: "Kevin De Bruyne",
    sport: "Football",
    team: "Manchester City",
    country: "🇧🇪 Belgium",
    image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&h=500&fit=crop",
    stat: "23 assists this season",
  },
  {
    name: "Romelu Lukaku",
    sport: "Football",
    team: "AS Roma",
    country: "🇧🇪 Belgium",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=500&fit=crop",
    stat: "18 goals this season",
  },
  {
    name: "Kylian Mbappé",
    sport: "Football",
    team: "Real Madrid",
    country: "🇫🇷 France",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&h=500&fit=crop",
    stat: "29 goals this season",
  },
  {
    name: "Carlos Alcaraz",
    sport: "Tennis",
    team: "ATP #2",
    country: "🇪🇸 Spain",
    image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=500&fit=crop",
    stat: "3 titles this year",
  },
];

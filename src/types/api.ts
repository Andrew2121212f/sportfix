export interface SportEvent {
  sportEventId: number;
  mainConstSportEventId: number;
  constSportEventId: number;
  tournamentId: number;
  sportId: number;
  subSportId: number;
  tournamentNameLocalization: string | null;
  opponent1NameLocalization: string | null;
  opponent2NameLocalization: string | null;
  imageOpponent1: string[] | null;
  imageOpponent2: string[] | null;
  tournamentImage: string[] | null;
  opponent1Ids: number[] | null;
  opponent2Ids: number[] | null;
  type: number;
  vid: number;
  period: number;
  periodName: string | null;
  startDate: number;
  link: string | null;
  oddsLocalization: OddItem[] | null;
  hasVideo: boolean;
  waitingLive?: boolean;
  matchInfoObject?: MatchInfoObject | null;
  stadiumInfoObject?: StadiumInfoObject | null;
  statGameId?: string | null;
  hasInsights?: boolean;
}

export interface LiveSportEvent extends SportEvent {
  gameStatus: number;
  fullScore: Score;
  curScore: Score;
  periodScores: Record<string, Score> | null;
  timeSec: number;
  currentPeriodName?: string | null;
}

export interface Score {
  sc1: number;
  sc2: number;
}

export interface OddItem {
  type: number;
  parameter: number;
  oddsMarket: number;
  playerId: number;
  playerName: string | null;
  isBlocked: boolean;
  display: string | null;
  isCenter: boolean;
}

export interface MatchInfoObject {
  tournamentStage?: string;
  matchFormat?: string;
  surface?: string;
  locationCountry?: string;
  locationCity?: string;
  location?: string;
}

export interface StadiumInfoObject {
  id?: number;
  name?: string;
  locationAddress?: string;
  surface?: string;
}

export interface SportItem {
  id: number;
  name: string | null;
  maxPeriodCount: number;
}

export interface SportV3Item {
  sportId: number;
  sportType: string | null;
  oneRound: boolean;
  noScore: boolean;
  localized: Record<string, string> | null;
}

export interface TournamentItem {
  id: number;
  name: string | null;
  sportId: number;
  countryId: number;
  countryName: string | null;
}

export interface CountryItem {
  id: number;
  localized: Record<string, string> | null;
  iso: string | null;
  alpha2Code: string | null;
}

export interface ApiListResponse<T> {
  count: number;
  items: T[] | null;
}

/**
 * Ответ деталей одного матча — discriminated union по полю source.
 * Используется на странице /events/[id] и в /api/events/[id].
 */
export type EventDetailResponse =
  | { source: "live"; data: LiveSportEvent }
  | { source: "prematch"; data: SportEvent };

export interface ApiLoadListResponse {
  count: number;
  lastIndex: number;
  items: number[] | null;
}

export interface ResultSportEvent {
  sportEventId: number;
  constSportEventId: number;
  tournamentId: number;
  sportId: number;
  opponent1: string | null;
  opponent2: string | null;
  scores: Score[];
  startDate: number;
  matchStatus?: number;
}

export interface H2HResponse {
  teams: TeamResponse[] | null;
  gameShorts: GameShortResponse[] | null;
  sportId: number;
  entity: HeadToHeadEntity | null;
}

export interface TeamResponse {
  id: number;
  name: string | null;
  imageUrl: string | null;
}

export interface GameShortResponse {
  id: string;
  startDate: number;
  score1: number;
  score2: number;
  team1Id: number;
  team2Id: number;
}

export interface HeadToHeadEntity {
  [key: string]: unknown;
}

export enum GameStatus {
  Playing = 0,
  Finished = 1,
  HalfTime = 2,
  Cancelled = 4,
  Penalty1 = 8,
  Penalty2 = 16,
  Interrupted = 32,
  VAR = 64,
  VARPenalty = 72,
}

export const SPORT_IDS: Record<string, number> = {
  football: 1,
  hockey: 2,
  basketball: 3,
  tennis: 4,
  volleyball: 9,
  baseball: 6,
  handball: 8,
  rugby: 10,
  boxing: 14,
  mma: 15,
  esports: 30,
  cricket: 36,
  tableTennis: 5,
};

export const SPORT_SLUGS: Record<number, string> = Object.fromEntries(
  Object.entries(SPORT_IDS).map(([k, v]) => [v, k])
);

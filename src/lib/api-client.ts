import { getAccessToken } from "./auth";
import { API_BASE_URL, API_REF, CACHE_TTL } from "./constants";
import { getCached, setCached, deleteCached } from "./cache";
import type {
  ApiListResponse,
  SportEvent,
  LiveSportEvent,
  SportV3Item,
  CountryItem,
} from "@/types/api";

async function apiFetch<T>(path: string, params: Record<string, string> = {}, cacheTtl?: number): Promise<T> {
  const cacheKey = `api:${path}:${JSON.stringify(params)}`;

  if (cacheTtl) {
    const cached = getCached<T>(cacheKey);
    if (cached) return cached;
  }

  const token = await getAccessToken();
  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 401) {
    deleteCached("oauth_token");
    const newToken = await getAccessToken();
    const retryRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${newToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!retryRes.ok) throw new Error(`API error: ${retryRes.status}`);
    const data = await retryRes.json();
    if (cacheTtl) setCached(cacheKey, data, cacheTtl);
    return data;
  }

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  if (cacheTtl) setCached(cacheKey, data, cacheTtl);
  return data;
}

export async function getPrematchEvents(params: {
  sportIds?: string;
  tournamentIds?: string;
  lng?: string;
  count?: number;
} = {}): Promise<ApiListResponse<SportEvent>> {
  return apiFetch<ApiListResponse<SportEvent>>(
    "/gateway/marketing/datafeed/prematch/api/v2/sportevents",
    {
      ref: String(API_REF),
      lng: params.lng || "en",
      periods: "0",
      vids: "1",
      types: "1",
      count: String(params.count || 50),
      schemeOfGettingOddsOperations: "GetMainOdds",
      ...(params.sportIds ? { sportIds: params.sportIds } : {}),
      ...(params.tournamentIds ? { tournamentIds: params.tournamentIds } : {}),
    },
    CACHE_TTL.PREMATCH
  );
}

export async function getLiveEvents(params: {
  sportIds?: string;
  lng?: string;
  count?: number;
} = {}): Promise<ApiListResponse<LiveSportEvent>> {
  return apiFetch<ApiListResponse<LiveSportEvent>>(
    "/gateway/marketing/datafeed/live/api/v2/sportevents",
    {
      ref: String(API_REF),
      lng: params.lng || "en",
      periods: "0",
      vids: "1",
      types: "1",
      count: String(params.count || 50),
      schemeOfGettingOddsOperations: "GetMainOdds",
      ...(params.sportIds ? { sportIds: params.sportIds } : {}),
    },
    CACHE_TTL.LIVE
  );
}

/**
 * Одно live-событие по sportEventId.
 * Дёргает тот же list-endpoint но фильтрует по id (отдельной точки в API нет).
 * Возвращает null если не нашли.
 */
export async function getLiveEventDetail(params: {
  sportEventId: number;
  lng?: string;
}): Promise<LiveSportEvent | null> {
  try {
    const list = await apiFetch<ApiListResponse<LiveSportEvent>>(
      "/gateway/marketing/datafeed/live/api/v2/sportevents",
      {
        ref: String(API_REF),
        lng: params.lng || "en",
        periods: "0",
        vids: "1",
        types: "1",
        count: "200",
        schemeOfGettingOddsOperations: "GetMainOdds",
      },
      CACHE_TTL.LIVE
    );
    return (list.items || []).find((e) => e.sportEventId === params.sportEventId) || null;
  } catch {
    return null;
  }
}

/**
 * Одно prematch-событие по sportEventId.
 * Аналогично getLiveEventDetail — фильтр по id из общего списка.
 */
export async function getPrematchEventDetail(params: {
  sportEventId: number;
  lng?: string;
}): Promise<SportEvent | null> {
  try {
    const list = await apiFetch<ApiListResponse<SportEvent>>(
      "/gateway/marketing/datafeed/prematch/api/v2/sportevents",
      {
        ref: String(API_REF),
        lng: params.lng || "en",
        periods: "0",
        vids: "1",
        types: "1",
        count: "200",
        schemeOfGettingOddsOperations: "GetMainOdds",
      },
      CACHE_TTL.PREMATCH
    );
    return (list.items || []).find((e) => e.sportEventId === params.sportEventId) || null;
  } catch {
    return null;
  }
}

export async function getSports(lng = "en"): Promise<SportV3Item[]> {
  const data = await apiFetch<SportV3Item[]>(
    "/gateway/marketing/datafeed/directories/api/v2/sports",
    { languages: lng },
    CACHE_TTL.DICTIONARIES
  );
  return data;
}

export async function getCountries(lng = "en"): Promise<CountryItem[]> {
  const data = await apiFetch<CountryItem[]>(
    "/gateway/marketing/datafeed/directories/api/v2/countries",
    { languages: lng },
    CACHE_TTL.DICTIONARIES
  );
  return data;
}

export async function getTournaments(sportId: number, lng = "en") {
  return apiFetch(
    "/gateway/marketing/datafeed/loadtree/prematch/api/v1/tournaments",
    {
      ref: String(API_REF),
      sportId: String(sportId),
      lng,
    },
    CACHE_TTL.DICTIONARIES
  );
}

export async function getResultSports(params: {
  dateFrom: number;
  dateTo: number;
  lng?: string;
} ) {
  return apiFetch<ApiListResponse<{ id: number; name: string }>>(
    "/gateway/marketing/result/api/v1/sports",
    {
      ref: String(API_REF),
      lng: params.lng || "en",
      dateFrom: String(params.dateFrom),
      dateTo: String(params.dateTo),
    },
    CACHE_TTL.RESULTS
  );
}

export async function getResults(params: {
  dateFrom: number;
  dateTo: number;
  sportId: number;
  lng?: string;
}) {
  return apiFetch<ApiListResponse<{
    tournamentId: number;
    tournamentNameLocalization: string;
    tournamentImage: string;
    sportId: number;
  }>>(
    "/gateway/marketing/result/api/v1/tournaments",
    {
      ref: String(API_REF),
      lng: params.lng || "en",
      dateFrom: String(params.dateFrom),
      dateTo: String(params.dateTo),
      sportId: String(params.sportId),
    },
    CACHE_TTL.RESULTS
  );
}

export async function getResultEvents(params: {
  dateFrom: number;
  dateTo: number;
  tournamentId: number;
  lng?: string;
}) {
  return apiFetch<ApiListResponse<{
    key: number;
    sportEventId: number;
    constSportEventId: number;
    opponent1NameLocalization: string;
    opponent2NameLocalization: string;
    imageOpponent1: string[];
    imageOpponent2: string[];
    type: number;
    vid: number;
    score: string;
    startDate: number;
  }>>(
    "/gateway/marketing/result/api/v1/sportevents",
    {
      ref: String(API_REF),
      lng: params.lng || "en",
      dateFrom: String(params.dateFrom),
      dateTo: String(params.dateTo),
      tournamentId: String(params.tournamentId),
    },
    CACHE_TTL.RESULTS
  );
}

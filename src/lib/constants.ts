// .trim() защищает от случайного \n или пробелов, попавших в env через
// `echo ... | vercel env add` или копипаст из UI с переносом строки.
// Без trim API возвращало 0 матчей — заголовок Authorization приходил
// с переносом и сервер не принимал токен.
export const API_BASE_URL = (process.env.API_BASE_URL || "").trim();
export const API_CLIENT_ID = (process.env.API_CLIENT_ID || "").trim();
export const API_CLIENT_SECRET = (process.env.API_CLIENT_SECRET || "").trim();
export const API_REF = parseInt((process.env.API_REF || "282").trim(), 10);

export const CACHE_TTL = {
  TOKEN: 3500,
  DICTIONARIES: 3600,
  PREMATCH: 20,
  LIVE: 5,
  RESULTS: 300,
} as const;

export const SPORT_ICONS: Record<number, string> = {
  1: "⚽",
  2: "🏒",
  3: "🏀",
  4: "🎾",
  5: "🏓",
  6: "⚾",
  8: "🤾",
  9: "🏐",
  10: "🏉",
  14: "🥊",
  15: "🥋",
  30: "🎮",
  36: "🏏",
};

export const PARTNER_LINK = "sportfix.bet/go";

// Ссылка на партнёрскую платформу (1xbet) — копия SportFix максимизирует
// количество переходов: в hero CTA, sidebar баннер, topbar кнопка, рядом с
// каждой группой матчей, на странице события, на промо-карточках новостей.
// PARTNER_NAME используется в копи-тексте CTA.
export const PARTNER_NAME = "1xBet";
export const EXTERNAL_PLATFORM = process.env.NEXT_PUBLIC_PARTNER_URL || "https://1xbet.com/";

// Маппинг sport ID → slug для SVG-иконок в public/icons/sports/
export const SPORT_ICON_SLUGS: Record<number, string> = {
  1: "football",
  2: "hockey",
  3: "basketball",
  4: "tennis",
  5: "ping-pong",
  6: "baseball",
  8: "handball",
  9: "volleyball",
  10: "rugby",
  14: "boxing",
  15: "mma",
  30: "esports",
  36: "cricket",
};

import type { NewsArticle } from "@/types/news";
import { EXTERNAL_PLATFORM, PARTNER_NAME } from "@/lib/constants";

/**
 * Промо-карточки SportFix → 1xBet.
 * Выглядят как обычные статьи в ленте, но ведут на партнёра.
 * Мы вставляем 1 промо на каждые 3 реальных новости — агрессивная стратегия
 * (по бэклогу копия SportFix должна максимизировать переходы).
 */
export const PROMO_NEWS: NewsArticle[] = [
  {
    id: "promo-1",
    slug: "",
    title: `Welcome Bonus: 100% on First Deposit at ${PARTNER_NAME}`,
    excerpt: `New to ${PARTNER_NAME}? Double your first deposit up to €100 — biggest welcome bonus in sports betting right now.`,
    url: `${EXTERNAL_PLATFORM}?utm_source=sportfix&utm_medium=news-promo-1`,
    imageUrl: "/banners/vivat-promo-1.png",
    source: PARTNER_NAME,
    category: "Promotion",
    publishedAt: new Date().toISOString(),
    isPromo: true,
    isExternal: true,
  },
  {
    id: "promo-2",
    slug: "",
    title: `Free Bet €10 every weekend on football | ${PARTNER_NAME}`,
    excerpt: "Place a qualifying bet on any football match midweek and receive a €10 free bet for the weekend.",
    url: `${EXTERNAL_PLATFORM}?utm_source=sportfix&utm_medium=news-promo-2`,
    imageUrl: "/banners/vivat-promo-2.png",
    source: PARTNER_NAME,
    category: "Promotion",
    publishedAt: new Date().toISOString(),
    isPromo: true,
    isExternal: true,
  },
  {
    id: "promo-3",
    slug: "",
    title: `Live betting with best odds on ${PARTNER_NAME}`,
    excerpt: "Cash out anytime, partial cash out, edit your bet — full control on the live action.",
    url: `${EXTERNAL_PLATFORM}?utm_source=sportfix&utm_medium=news-promo-3`,
    imageUrl: "/banners/vivat-promo-1.png",
    source: PARTNER_NAME,
    category: "Promotion",
    publishedAt: new Date().toISOString(),
    isPromo: true,
    isExternal: true,
  },
  {
    id: "promo-4",
    slug: "",
    title: `Loyalty rewards: cashback and free spins on ${PARTNER_NAME}`,
    excerpt: "Earn loyalty points on every bet and redeem them for cashback, free bets and exclusive experiences.",
    url: `${EXTERNAL_PLATFORM}?utm_source=sportfix&utm_medium=news-promo-4`,
    imageUrl: "/banners/vivat-promo-2.png",
    source: PARTNER_NAME,
    category: "Promotion",
    publishedAt: new Date().toISOString(),
    isPromo: true,
    isExternal: true,
  },
];

/**
 * Миксует реальные новости с промо.
 * promoInterval=3 — на каждые 3 реальных вставляется 1 промо.
 */
export function mixWithPromo(realNews: NewsArticle[], promoInterval = 3): NewsArticle[] {
  const result: NewsArticle[] = [];
  let promoIndex = 0;
  for (let i = 0; i < realNews.length; i++) {
    result.push(realNews[i]);
    if ((i + 1) % promoInterval === 0 && promoIndex < PROMO_NEWS.length) {
      result.push(PROMO_NEWS[promoIndex]);
      promoIndex++;
    }
  }
  return result;
}

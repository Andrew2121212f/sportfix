"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight, Newspaper, Activity, ChevronDown, Calendar, CalendarClock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "@/components/ui/empty-state";
import Link from "next/link";
import { useLiveEvents } from "@/hooks/use-live-events";
import { usePrematchEvents } from "@/hooks/use-prematch-events";
import { useNews } from "@/hooks/use-news";
import type { NewsArticle } from "@/types/news";
import { groupBy, cn } from "@/lib/utils";
import { TournamentLogo } from "@/components/sports/team-logo";
import MatchRow from "@/components/sports/match-row";
import CountryFlag from "@/components/sports/country-flag";
import { sortTournamentEntries } from "@/lib/league-priority";
import { POPULAR_LEAGUES, MOCK_LIVE_EVENTS, MOCK_PREMATCH_EVENTS } from "@/lib/mock-data";
import { getLocalLeagueLogo } from "@/lib/league-logos";
import { useTheme } from "@/components/theme-provider";
import { TournamentGroupSkeleton } from "@/components/ui/skeletons";
import HeroVideo from "@/components/home/hero-video";

export default function HomeClient() {
  const t = useTranslations("home");
  const locale = useLocale();

  const { theme } = useTheme();
  const { data: liveData, isLoading: liveLoading } = useLiveEvents(undefined, locale);
  const { data: prematchData, isLoading: prematchLoading } = usePrematchEvents(undefined, locale);
  const { data: newsData } = useNews(undefined, locale);
  const newsArticles = (newsData?.items || []).slice(0, 4);

  // Mount-flag: SSR и первый клиентский рендер показывают skeleton.
  // После mount подставляем реальные/мок-данные. Без этого React Query
  // на клиенте отдаёт данные раньше hydration → mismatch с server skeleton.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Для SportFix-копии используем mock fallback когда API пуст —
  // партнёрский ref ещё не настроен под 1xBet, и без mock страница
  // была бы пустой ("No matches"). На fastscore mock убран намеренно.
  const liveEvents = (liveData?.items?.length ? liveData.items : MOCK_LIVE_EVENTS) as any[];
  const prematchEvents = (prematchData?.items?.length ? prematchData.items : MOCK_PREMATCH_EVENTS) as any[];
  const groupedPrematch = groupBy(prematchEvents, (e: any) => e.tournamentNameLocalization || "Other");
  const groupedLive = groupBy(liveEvents, (e: any) => e.tournamentNameLocalization || "Other");

  // Сортируем турниры по приоритету (Бельгия → Франция → Германия → Европа → ... → Россия в конце)
  const sortedPrematch = sortTournamentEntries(Object.entries(groupedPrematch));
  const sortedLive = sortTournamentEntries(Object.entries(groupedLive));

  // Состояние раскрытой лиги (accordion)
  const [openLeague, setOpenLeague] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Hero-блок: главный h1 страницы + фоновое видео. CTA-кнопки нет (по требованию: переходы только через сайдбар-баннер и кнопку в шапке) */}
      <HeroVideo />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Live + Upcoming */}
        <div className="xl:col-span-2 space-y-5">
          {/* Live Now */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-accent-green animate-pulse-live" />
              <h2 className="text-base font-bold">{t("liveNow")}</h2>
              {liveEvents.length > 0 && (
                <span className="text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-lg">{liveEvents.length} live</span>
              )}
            </div>
            <Link href={`/${locale}/live`} className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline">
              {t("seeAll")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!mounted || liveLoading ? (
            <div className="space-y-3">{[...Array(2)].map((_, i) => <TournamentGroupSkeleton key={i} rows={3} />)}</div>
          ) : liveEvents.length === 0 ? (
            <EmptyState icon={Activity} title={t("noLiveEvents")} description="Check back soon — matches update in real time" />
          ) : (
            <div className="space-y-3">
              {sortedLive.slice(0, 6).map(([tournament, events]) => (
                <div key={tournament} className="card overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-surface/50">
                    <TournamentLogo images={events[0]?.tournamentImage} name={tournament} sportId={events[0]?.sportId} />
                    <CountryFlag tournamentName={tournament} />
                    <span className="text-xs font-bold">{tournament}</span>
                    <span className="text-xs text-text-muted ml-auto">{events.length} matches</span>
                  </div>
                  <div className="divide-y divide-border">
                    {events.slice(0, 4).map((event: any) => (
                      <MatchRow key={event.sportEventId} event={event} mode="live" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Today's Matches */}
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-base font-bold">{t("todayMatches")}</h2>
            <Link href={`/${locale}/matches`} className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline">
              {t("seeAll")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!mounted || prematchLoading ? (
            <div className="space-y-3">{[...Array(2)].map((_, i) => <TournamentGroupSkeleton key={i} rows={4} />)}</div>
          ) : prematchEvents.length === 0 ? (
            <EmptyState icon={CalendarClock} title="No upcoming matches" description="Match schedule updates throughout the day" />
          ) : (
            <div className="space-y-3">
              {sortedPrematch.slice(0, 5).map(([tournament, events]) => (
                <div key={tournament} className="card overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-surface/50">
                    <TournamentLogo images={events[0]?.tournamentImage} name={tournament} sportId={events[0]?.sportId} />
                    <CountryFlag tournamentName={tournament} />
                    <span className="text-xs font-bold">{tournament}</span>
                    <span className="text-xs text-text-muted ml-auto">{events.length} matches</span>
                  </div>
                  <div className="divide-y divide-border">
                    {events.slice(0, 4).map((event: any) => (
                      <MatchRow key={event.sportEventId} event={event} mode="prematch" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Блок новостей на дашборде */}
          {newsArticles.length > 0 && (
            <>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4 text-brand-orange" />
                  <h2 className="text-base font-bold">Latest News</h2>
                </div>
                <Link href={`/${locale}/news`} className="flex items-center gap-1 text-xs font-semibold text-brand-orange hover:underline">
                  {t("seeAll")} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {newsArticles.map((article: NewsArticle) => {
                  // Internal Sheets-статьи → /[locale]/news/[slug], внешние → новая вкладка
                  const isInternal = !article.isExternal && article.slug;
                  const href = isInternal ? `/${locale}/news/${article.slug}` : article.url;
                  const linkProps = isInternal
                    ? {}
                    : { target: "_blank" as const, rel: "noopener noreferrer" };
                  return (
                  <a
                    key={article.id}
                    href={href}
                    {...linkProps}
                    className="card card-interactive overflow-hidden group cursor-pointer flex gap-3 p-3"
                  >
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
                      {/* Используем img т.к. домены картинок из API непредсказуемы */}
                      <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop"; }} />
                      {article.isPromo && (
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 text-[9px] font-medium text-white/70 bg-black/40 backdrop-blur-sm rounded">
                          Sponsored
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-brand-orange uppercase">{article.category}</span>
                        <span className="text-[10px] text-text-muted">{article.source}</span>
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold leading-snug group-hover:text-brand-orange transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[11px] text-text-muted mt-1 line-clamp-1">{article.excerpt}</p>
                    </div>
                  </a>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          <div>
            <h3 className="text-base font-bold mb-3">Popular Leagues</h3>
            <div className="space-y-2">
              {POPULAR_LEAGUES.map((league) => {
                const logoPath = getLocalLeagueLogo(league.logoKey, theme as "dark" | "light");
                const isOpen = openLeague === league.name;
                return (
                  <div key={league.name} className={cn("card overflow-hidden transition-colors", isOpen && "border-brand-orange/30")}>
                    <button
                      type="button"
                      onClick={() => setOpenLeague(isOpen ? null : league.name)}
                      aria-expanded={isOpen}
                      className="w-full p-3 flex items-center gap-3 cursor-pointer group hover:bg-surface/30 transition-colors text-left"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface shrink-0 p-1.5">
                        {logoPath ? (
                          <img src={logoPath} alt={league.name} className="w-full h-full" style={{ objectFit: "contain" }} />
                        ) : (
                          <span className="text-lg">{league.emoji}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-brand-orange transition-colors">{league.name}</p>
                        <p className="text-xs text-text-muted">{league.emoji} {league.country}</p>
                      </div>
                      <span className="text-xs font-bold text-text-muted bg-surface px-2 py-0.5 rounded-md">{league.matches}</span>
                      <ChevronDown className={cn("h-4 w-4 text-text-muted transition-transform shrink-0", isOpen && "rotate-180")} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-1 border-t border-border space-y-3">
                            <p className="text-xs leading-relaxed text-text-secondary">
                              {league.description}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-text-muted">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> {league.season}
                              </span>
                              <span>·</span>
                              <span>{league.teams} teams</span>
                              <span>·</span>
                              <span>{league.matches} live</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

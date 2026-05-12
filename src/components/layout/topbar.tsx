"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Activity, Calendar, Trophy, Newspaper, Home, Bell, ExternalLink, X, Sun, Moon, Globe, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn, formatMatchTime } from "@/lib/utils";
import { useLiveEvents } from "@/hooks/use-live-events";
import { EXTERNAL_PLATFORM } from "@/lib/constants";
import { useTheme } from "@/components/theme-provider";
import { localeNames, type Locale } from "@/i18n/config";

const routeInfo: Record<string, { icon: typeof Home; labelKey: string }> = {
  "/": { icon: Home, labelKey: "dashboard" },
  "/live": { icon: Activity, labelKey: "live" },
  "/matches": { icon: Calendar, labelKey: "matches" },
  "/results": { icon: Trophy, labelKey: "results" },
  "/news": { icon: Newspaper, labelKey: "news" },
};

export default function Topbar() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const { theme, toggle } = useTheme();
  const { data: liveData } = useLiveEvents(undefined, locale);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const baseRoute = "/" + (pathnameWithoutLocale.split("/")[1] || "");
  const info = routeInfo[baseRoute] || routeInfo["/"];
  const Icon = info?.icon || Home;

  // Только реальные данные с API. Без mock-фоллбэка — иначе topbar
  // будет показывать "5 Live" даже когда матчей нет.
  const liveEvents = (liveData?.items || []) as any[];
  const liveCount = liveEvents.length;

  // Закрываем dropdown при клике вне
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Закрываем при смене маршрута
  useEffect(() => { setNotifOpen(false); setLangOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 border-b border-border backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-3 sm:px-6">
        {/* Left: Page info */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl shrink-0",
            baseRoute === "/live" ? "bg-accent-green/10" : "bg-brand-orange/10"
          )}>
            <Icon className={cn(
              "h-4 w-4 sm:h-[18px] sm:w-[18px]",
              baseRoute === "/live" ? "text-accent-green" : "text-brand-orange"
            )} />
          </div>
          {/* h2, чтобы не конкурировать с главным h1 hero-блока (SEO — один h1 на страницу) */}
          <h2 className="text-sm sm:text-lg font-bold leading-tight truncate">
            {baseRoute === "/" ? "Dashboard" : t(info?.labelKey as "live" | "matches" | "results" | "news")}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {liveCount > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-accent-green/10 border border-accent-green/20">
              <span className="flex h-2 w-2 rounded-full bg-accent-green animate-pulse-live" />
              <span className="text-[11px] sm:text-xs font-bold text-accent-green">{liveCount} Live</span>
            </div>
          )}

          {/* Колокольчик с dropdown уведомлений */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all"
              aria-label="Notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {liveCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-red" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-1.5rem)] sm:w-96 max-w-96 bg-background border border-border rounded-2xl shadow-xl animate-fade-up z-50 overflow-hidden">
                {/* Заголовок */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-sm font-bold">Live Updates</span>
                  <button onClick={() => setNotifOpen(false)} className="text-text-muted hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Список live-матчей */}
                <div className="max-h-80 overflow-y-auto scrollbar-none divide-y divide-border">
                  {liveCount === 0 ? (
                    <div className="p-6 text-center text-xs text-text-muted">
                      No live matches right now
                    </div>
                  ) : (
                    liveEvents.slice(0, 8).map((event: any) => {
                      const isHT = event.gameStatus === 2;
                      const isFT = event.gameStatus === 1;
                      return (
                        <Link
                          key={event.sportEventId}
                          href={`/${locale}/live`}
                          onClick={() => setNotifOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface/50 transition-colors"
                        >
                          {/* Статус */}
                          <div className="w-10 shrink-0 text-center">
                            {isFT ? (
                              <span className="text-[10px] font-bold text-text-muted px-1.5 py-0.5 rounded bg-surface">FT</span>
                            ) : isHT ? (
                              <span className="text-[10px] font-bold text-brand-orange px-1.5 py-0.5 rounded bg-brand-orange/10">HT</span>
                            ) : (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse-live" />
                                <span className="text-[10px] font-mono text-accent-green font-bold">{formatMatchTime(event.timeSec)}</span>
                              </div>
                            )}
                          </div>
                          {/* Матч */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold truncate">{event.opponent1NameLocalization || "Team 1"}</span>
                              <span className="text-xs font-mono font-bold">{event.fullScore?.sc1 ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold truncate">{event.opponent2NameLocalization || "Team 2"}</span>
                              <span className="text-xs font-mono font-bold">{event.fullScore?.sc2 ?? 0}</span>
                            </div>
                            <span className="text-[10px] text-text-muted">{event.tournamentNameLocalization}</span>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* Ссылка на все live */}
                {liveCount > 0 && (
                  <Link
                    href={`/${locale}/live`}
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t border-border text-xs font-semibold text-brand-orange hover:bg-brand-orange/5 transition-colors"
                  >
                    View all {liveCount} live matches
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Тема — только на мобильном (на десктопе в сайдбаре) */}
          <button
            onClick={toggle}
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Язык — только на мобильном */}
          <div className="relative lg:hidden" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
              <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-background border border-border rounded-xl p-1 shadow-xl animate-fade-up z-50">
                {(Object.entries(localeNames) as [Locale, string][]).map(([code, name]) => (
                  <Link
                    key={code}
                    href={`/${code}${pathnameWithoutLocale}`}
                    onClick={() => setLangOpen(false)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      code === locale
                        ? "bg-brand-orange/15 text-brand-orange"
                        : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Главный partner CTA — золотая кнопка "Bet on 1xBet" в правом углу */}
          <a
            href={`${EXTERNAL_PLATFORM}?utm_source=sportfix&utm_medium=topbar`}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-2 h-9 w-9 sm:w-auto sm:px-4 sm:py-2 bg-brand-gold text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all shadow-md shadow-brand-gold/40"
            aria-label="Bet on 1xBet"
          >
            <ExternalLink className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            <span className="hidden sm:inline">Bet 1xBet</span>
          </a>
        </div>
      </div>
    </header>
  );
}

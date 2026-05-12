"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import {
  Activity, Calendar, Trophy, Newspaper, Search,
  Home, ChevronDown, Globe, Sun, Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { localeNames, type Locale, isRtlLocale } from "@/i18n/config";
import { useTheme } from "@/components/theme-provider";
import { SPORT_IDS } from "@/types/api";
import SportIcon from "@/components/sports/sport-icon";
import PartnerCTA from "@/components/promo/partner-cta";

const mainNav = [
  { key: "home", href: "", icon: Home },
  { key: "live", href: "/live", icon: Activity },
  { key: "matches", href: "/matches", icon: Calendar },
  { key: "results", href: "/results", icon: Trophy },
  { key: "news", href: "/news", icon: Newspaper },
] as const;

const sports = [
  { slug: "football", id: SPORT_IDS.football },
  { slug: "basketball", id: SPORT_IDS.basketball },
  { slug: "hockey", id: SPORT_IDS.hockey },
  { slug: "tennis", id: SPORT_IDS.tennis },
  { slug: "volleyball", id: SPORT_IDS.volleyball },
  { slug: "baseball", id: SPORT_IDS.baseball },
  { slug: "handball", id: SPORT_IDS.handball },
  { slug: "tableTennis", id: SPORT_IDS.tableTennis },
  { slug: "esports", id: SPORT_IDS.esports },
  { slug: "mma", id: SPORT_IDS.mma },
  { slug: "boxing", id: SPORT_IDS.boxing },
  { slug: "rugby", id: SPORT_IDS.rugby },
  { slug: "cricket", id: SPORT_IDS.cricket },
];

export default function Sidebar() {
  const t = useTranslations("nav");
  const tSport = useTranslations("sport");
  const locale = useLocale();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportsExpanded, setSportsExpanded] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isActive = (href: string) => {
    if (href === "") return pathnameWithoutLocale === "/";
    return pathnameWithoutLocale === href || pathnameWithoutLocale.startsWith(href + "/");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-3.5 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gold text-black font-extrabold text-sm shadow-md shadow-brand-gold/20">
            SF
          </div>
          <span className="text-lg font-bold tracking-tight">
            Sport<span className="text-brand-gold">Fix</span>
          </span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matches, teams..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="px-3 mb-1.5">
        <span className="px-3 text-[11px] font-bold uppercase tracking-widest text-text-muted">
          Menu
        </span>
      </div>
      <nav className="px-3 space-y-0.5 mb-3" role="navigation" aria-label="Main navigation">
        {mainNav.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-orange/10 text-brand-orange font-semibold"
                  : "text-text-secondary hover:text-foreground hover:bg-surface-hover"
              )}
            >
              <item.icon className={cn("h-[18px] w-[18px]", active && "text-brand-orange")} />
              <span>{item.key === "home" ? "Dashboard" : t(item.key as "live" | "matches" | "results" | "news")}</span>
              {item.key === "live" && (
                <span className="ml-auto flex h-2 w-2 rounded-full bg-accent-green animate-pulse-live" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sports */}
      <div className="px-3 mb-1.5">
        <button
          onClick={() => setSportsExpanded(!sportsExpanded)}
          className="flex items-center justify-between w-full px-3 group"
        >
          <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Sports
          </span>
          <ChevronDown className={cn("h-3 w-3 text-text-muted transition-transform", sportsExpanded && "rotate-180")} />
        </button>
      </div>
      <nav className="px-3 space-y-0.5 mb-3">
        {(sportsExpanded ? sports : sports.slice(0, 4)).map((sport) => (
          <Link
            key={sport.slug}
            href={`/${locale}/live?sport=${sport.slug}`}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all"
          >
            <span className="w-[18px] flex items-center justify-center"><SportIcon sportId={sport.id} size={16} /></span>
            <span className="capitalize">{tSport(sport.slug)}</span>
          </Link>
        ))}
        {!sportsExpanded && sports.length > 4 && (
          <button
            onClick={() => setSportsExpanded(true)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-medium text-text-muted hover:text-text-secondary transition-all w-full"
          >
            <span className="w-[18px] text-center text-sm">+</span>
            <span>{sports.length - 4} more sports</span>
          </button>
        )}
      </nav>

      {/* INFO раздел перенесён в Footer (внизу основного контента) — освобождает
          место в сайдбаре, чтобы он помещался по высоте на стандартных лаптопах. */}

      {/* Spacer */}
      <div className="flex-1 min-h-2" />

      {/* Bottom controls */}
      <div className="px-4 pb-3 space-y-2">
        {/* Theme + Language row */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="relative flex-1" ref={langRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-foreground hover:bg-surface-hover transition-all"
            >
              <Globe className="h-4 w-4" />
              {locale.toUpperCase()}
              <ChevronDown className={cn("h-3 w-3 ml-auto transition-transform", langOpen && "rotate-180")} />
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-background border border-border rounded-xl p-1.5 shadow-xl animate-fade-up z-50">
                {(Object.entries(localeNames) as [Locale, string][]).map(([code, name]) => (
                  <Link
                    key={code}
                    href={`/${code}${pathnameWithoutLocale}`}
                    onClick={() => setLangOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
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
        </div>

        {/* Партнёрский CTA (1xBet) — крупная карточка в нижней части сайдбара.
            Это один из главных конверсионных точек сайта. */}
        <PartnerCTA variant="card" size="md" source="sidebar" label="Bet on 1xBet now" icon="gift" />
        <PartnerCTA variant="outline" size="sm" source="sidebar-bonus" label="100% bonus up to €100" icon="trending" className="w-full justify-center" />
      </div>
    </div>
  );

  return (
    <aside
      className={cn(
        "hidden lg:block fixed top-0 z-50 h-screen w-[272px] bg-background overflow-y-auto sidebar-scroll",
        // RTL — справа, рамка слева; LTR — наоборот
        isRtlLocale(locale)
          ? "right-0 border-l border-border"
          : "left-0 border-r border-border"
      )}
    >
      {sidebarContent}
    </aside>
  );
}

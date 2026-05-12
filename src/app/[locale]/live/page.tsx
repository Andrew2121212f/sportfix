"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, Loader2, Activity } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { useLiveEvents } from "@/hooks/use-live-events";
import { SPORT_IDS } from "@/types/api";
import { groupBy } from "@/lib/utils";
import { TournamentLogo } from "@/components/sports/team-logo";
import MatchRow from "@/components/sports/match-row";
import CountryFlag from "@/components/sports/country-flag";
import SportTabs from "@/components/sports/sport-tabs";
import { TournamentGroupSkeleton } from "@/components/ui/skeletons";
import { sortTournamentEntries } from "@/lib/league-priority";

export default function LivePage() {
  const t = useTranslations("home");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const sportFromUrl = searchParams.get("sport");
  const [activeSport, setActiveSport] = useState<string | null>(sportFromUrl);

  useEffect(() => {
    setActiveSport(sportFromUrl);
  }, [sportFromUrl]);

  const handleSportChange = (slug: string | null) => {
    setActiveSport(slug);
    if (slug) {
      router.replace(`/${locale}/live?sport=${slug}`, { scroll: false });
    } else {
      router.replace(`/${locale}/live`, { scroll: false });
    }
  };

  const sportId = activeSport ? String(SPORT_IDS[activeSport]) : undefined;
  const { data, isLoading, isFetching, dataUpdatedAt } = useLiveEvents(sportId, locale);
  const isRefreshing = isFetching && !isLoading;

  // Mount-flag избегает hydration mismatch: на сервере React Query
  // возвращает isLoading=true, на клиенте после первого рендера данные
  // (или моки) появляются мгновенно — рассинхрон с server skeleton.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // На /live используем только реальные данные с API.
  // Если API ничего не вернул — показываем empty state, а не моки.
  const events = (data?.items || []) as any[];
  const grouped = groupBy(events, (e: any) => e.tournamentNameLocalization || "Other");
  const sortedGroups = sortTournamentEntries(Object.entries(grouped));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <SportTabs active={activeSport} onChange={handleSportChange} />
        <div
          key={dataUpdatedAt}
          className="flex items-center gap-1.5 text-xs font-medium text-accent-green bg-accent-green/5 px-3 py-1.5 rounded-xl border border-accent-green/20 shrink-0 animate-fade-up"
        >
          {isRefreshing ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Wifi className="h-3 w-3" />
          )}
          <span>{isRefreshing ? "Updating..." : "Live · auto-update"}</span>
        </div>
      </div>

      {!mounted || isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <TournamentGroupSkeleton key={i} rows={3} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState icon={Activity} title={t("noLiveEvents")} description="Live scores will appear here when matches start" />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedGroups.map(([tournament, tournamentEvents]) => (
              <motion.div
                key={tournament}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="card overflow-hidden"
              >
                <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-surface/50">
                  <TournamentLogo images={tournamentEvents[0]?.tournamentImage} name={tournament} sportId={tournamentEvents[0]?.sportId} />
                  <CountryFlag tournamentName={tournament} />
                  <span className="text-xs font-bold text-foreground">{tournament}</span>
                  <span className="text-xs text-text-muted ml-auto">{tournamentEvents.length} matches</span>
                </div>

                <div className="divide-y divide-border">
                  {tournamentEvents.map((event) => (
                    <MatchRow key={event.sportEventId} event={event} mode="live" />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

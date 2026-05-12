"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import { usePrematchEvents } from "@/hooks/use-prematch-events";
import { SPORT_IDS } from "@/types/api";
import { groupBy, formatDateSafe } from "@/lib/utils";
import { TournamentLogo } from "@/components/sports/team-logo";
import MatchRow from "@/components/sports/match-row";
import CountryFlag from "@/components/sports/country-flag";
import SportTabs from "@/components/sports/sport-tabs";
import { TournamentGroupSkeleton } from "@/components/ui/skeletons";
import { sortTournamentEntries } from "@/lib/league-priority";

export default function MatchesPage() {
  const locale = useLocale();
  const [activeSport, setActiveSport] = useState<string | null>(null);

  const sportId = activeSport ? String(SPORT_IDS[activeSport]) : undefined;
  const { data, isLoading } = usePrematchEvents(sportId, locale);

  // Mount-flag, чтобы SSR и клиент рендерили skeleton одинаково.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // На /matches используем только реальные данные с API.
  // Если API ничего не вернул — показываем empty state, а не моки.
  const events = (data?.items || []) as any[];
  const groupedByDate = groupBy(events, (e: any) => formatDateSafe(e.startDate));

  return (
    <div className="space-y-4">
      <SportTabs active={activeSport} onChange={setActiveSport} />

      {!mounted || isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <TournamentGroupSkeleton key={i} rows={4} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState icon={Calendar} title="No upcoming matches" description="Match schedule updates throughout the day — check back later" />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, dateEvents]: [string, any[]]) => {
            const groupedByTournament = groupBy(
              dateEvents,
              (e: any) => e.tournamentNameLocalization || "Other"
            );
            // Сортируем турниры внутри даты по приоритету (Бельгия → Франция → ... → Россия)
            const sortedTournaments = sortTournamentEntries(Object.entries(groupedByTournament));

            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-extrabold text-foreground">{date}</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-text-muted font-medium">{dateEvents.length} matches</span>
                </div>

                <div className="space-y-3">
                  {sortedTournaments.map(([tournament, tournEvents]) => (
                    <motion.div
                      key={tournament}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="card overflow-hidden"
                    >
                      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-surface/50">
                        <TournamentLogo images={tournEvents[0]?.tournamentImage} name={tournament} sportId={tournEvents[0]?.sportId} />
                        <CountryFlag tournamentName={tournament} />
                        <span className="text-xs font-bold text-foreground">{tournament}</span>
                        <span className="text-xs text-text-muted ml-auto">{tournEvents.length} matches</span>
                      </div>

                      <div className="divide-y divide-border">
                        {tournEvents.map((event) => (
                          <MatchRow key={event.sportEventId} event={event} mode="prematch" />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

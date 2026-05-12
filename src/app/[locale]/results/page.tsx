"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2, Trophy } from "lucide-react";
import EmptyState from "@/components/ui/empty-state";
import SportIcon from "@/components/sports/sport-icon";
import CountryFlag from "@/components/sports/country-flag";

interface ResultSport {
  id: number;
  name: string;
}

interface ResultTournament {
  tournamentId: number;
  tournamentNameLocalization: string;
  tournamentImage: string;
  sportId: number;
}

export default function ResultsPage() {
  const t = useTranslations();
  const locale = useLocale();

  const [sports, setSports] = useState<ResultSport[]>([]);
  const [selectedSport, setSelectedSport] = useState<number | null>(null);
  const [tournaments, setTournaments] = useState<ResultTournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTournaments, setLoadingTournaments] = useState(false);

  useEffect(() => {
    fetch(`/api/results?lng=${locale}`)
      .then((r) => r.json())
      .then((d) => {
        setSports(d.items || []);
        if (d.items?.length > 0) {
          setSelectedSport(d.items[0].id);
        }
      })
      .finally(() => setLoading(false));
  }, [locale]);

  useEffect(() => {
    if (!selectedSport) return;
    setLoadingTournaments(true);
    fetch(`/api/results/tournaments?lng=${locale}&sportId=${selectedSport}`)
      .then((r) => r.json())
      .then((d) => setTournaments(d.items || []))
      .finally(() => setLoadingTournaments(false));
  }, [selectedSport, locale]);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-brand-orange" />
        </div>
      ) : sports.length === 0 ? (
        <EmptyState icon={Trophy} title={t("common.noResults")} description="Results will appear after matches are completed" />
      ) : (
        <>
          {/* Sport Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSelectedSport(sport.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedSport === sport.id
                    ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                    : "text-text-secondary border-border hover:text-foreground hover:border-foreground/20 hover:bg-surface"
                }`}
              >
                <SportIcon sportId={sport.id} size={16} />
                {sport.name}
              </button>
            ))}
          </div>

          {/* Tournaments */}
          {loadingTournaments ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-5 w-5 animate-spin text-brand-orange" />
            </div>
          ) : tournaments.length === 0 ? (
            <EmptyState icon={Trophy} title={t("common.noResults")} description="No tournaments found for this sport" />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSport}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {tournaments.map((tournament, i) => (
                  <motion.div
                    key={tournament.tournamentId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="card p-3 flex items-center justify-between hover:border-brand-orange/30 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {tournament.tournamentImage && (
                        <img
                          src={`https://cpservm.com/gateway/marketing/sfiles/logo_teams/${tournament.tournamentImage}`}
                          alt=""
                          className="h-8 w-8 rounded-lg object-cover bg-surface"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <p className="flex items-center gap-1.5 text-xs font-semibold group-hover:text-brand-orange transition-colors">
                          <CountryFlag tournamentName={tournament.tournamentNameLocalization} size={12} />
                          {tournament.tournamentNameLocalization}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-text-muted">
                          <SportIcon sportId={tournament.sportId} size={16} />
                          {sports.find((s) => s.id === tournament.sportId)?.name}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-text-muted group-hover:text-brand-orange transition-colors" />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}

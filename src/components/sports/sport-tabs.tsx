"use client";

import { cn } from "@/lib/utils";
import { SPORT_IDS } from "@/types/api";
import SportIcon from "@/components/sports/sport-icon";

interface Props {
  active: string | null;
  onChange: (sportSlug: string | null) => void;
}

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

export default function SportTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-fade-x">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
          active === null
            ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
            : "text-text-secondary border-border hover:text-foreground hover:border-foreground/20 hover:bg-surface"
        )}
      >
        All Sports
      </button>
      {sports.map((sport) => (
        <button
          key={sport.slug}
          onClick={() => onChange(sport.slug === active ? null : sport.slug)}
          className={cn(
            "relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border",
            active === sport.slug
              ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
              : "text-text-secondary border-border hover:text-foreground hover:border-foreground/20 hover:bg-surface"
          )}
        >
          <SportIcon sportId={sport.id} size={16} />
          <span className="capitalize">{sport.slug === "tableTennis" ? "Table Tennis" : sport.slug}</span>
        </button>
      ))}
    </div>
  );
}

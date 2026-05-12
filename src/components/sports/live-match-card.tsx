"use client";

import { motion } from "framer-motion";
import { cn, formatMatchTime } from "@/lib/utils";
import { SPORT_ICONS } from "@/lib/constants";
import LiveBadge from "./live-badge";
import type { LiveSportEvent } from "@/types/api";

interface Props {
  event: LiveSportEvent;
  index?: number;
}

export default function LiveMatchCard({ event, index = 0 }: Props) {
  const isHalfTime = event.gameStatus === 2;
  const isFinished = event.gameStatus === 1;
  const sportIcon = SPORT_ICONS[event.sportId] || "⚽";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card card-interactive group relative flex flex-col min-w-60 p-4 cursor-pointer shrink-0"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{sportIcon}</span>
          <span className="text-xs text-text-muted font-medium truncate max-w-32">
            {event.tournamentNameLocalization}
          </span>
        </div>
        {!isFinished && <LiveBadge />}
        {isFinished && (
          <span className="text-xs font-bold text-text-muted px-2 py-0.5 rounded-lg bg-surface">FT</span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="text-sm font-bold truncate flex-1">
          {event.opponent1NameLocalization || "Team 1"}
        </span>
        <span className={cn(
          "text-xl font-extrabold font-mono tabular-nums",
          (event.fullScore?.sc1 ?? 0) > (event.fullScore?.sc2 ?? 0) && "text-accent-green"
        )}>
          {event.fullScore?.sc1 ?? 0}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-bold truncate flex-1">
          {event.opponent2NameLocalization || "Team 2"}
        </span>
        <span className={cn(
          "text-xl font-extrabold font-mono tabular-nums",
          (event.fullScore?.sc2 ?? 0) > (event.fullScore?.sc1 ?? 0) && "text-accent-green"
        )}>
          {event.fullScore?.sc2 ?? 0}
        </span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        {isHalfTime ? (
          <span className="text-xs font-bold text-brand-orange px-2 py-0.5 rounded-lg bg-brand-orange/10">HT</span>
        ) : isFinished ? (
          <span className="text-xs text-text-muted font-medium">Full Time</span>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse-live" />
            <span className="text-xs font-mono text-accent-green font-bold">
              {formatMatchTime(event.timeSec)}
            </span>
          </div>
        )}

        {event.oddsLocalization && event.oddsLocalization.length > 0 && (
          <span className="text-xs text-text-muted font-mono">
            {event.oddsLocalization[0]?.oddsMarket?.toFixed(2)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

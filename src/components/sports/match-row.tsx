"use client";

import { cn, formatMatchTime, formatKickoffSafe } from "@/lib/utils";
import { TeamLogo } from "@/components/sports/team-logo";

interface MatchRowProps {
  event: any;
  /** "live" — показывает статус/время, "prematch" — показывает время начала */
  mode: "live" | "prematch";
}

/**
 * Адаптивная строка матча.
 * Мобильный: вертикальный стек (команда 1 / команда 2 + счёт сбоку).
 * Десктоп: горизонтальный grid (команда 1 | счёт | команда 2 | коэффициенты).
 */
export default function MatchRow({ event, mode }: MatchRowProps) {
  const isHT = event.gameStatus === 2;
  const isFT = event.gameStatus === 1;
  const isLive = mode === "live";

  const sc1 = event.fullScore?.sc1 ?? 0;
  const sc2 = event.fullScore?.sc2 ?? 0;

  // Статус / время начала
  const statusEl = isLive ? (
    isFT ? (
      <span className="text-[10px] sm:text-xs font-bold text-text-muted px-1.5 sm:px-2 py-0.5 rounded bg-surface">FT</span>
    ) : isHT ? (
      <span className="text-[10px] sm:text-xs font-bold text-brand-orange px-1.5 sm:px-2 py-0.5 rounded bg-brand-orange/10">HT</span>
    ) : (
      <div className="flex flex-col items-center gap-0.5">
        <span className="flex h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse-live" />
        <span className="text-[10px] sm:text-xs font-mono text-accent-green font-bold">{formatMatchTime(event.timeSec)}</span>
      </div>
    )
  ) : (
    <div className="text-[10px] sm:text-xs font-mono text-text-muted font-medium">
      {formatKickoffSafe(event.startDate)}
    </div>
  );

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-surface/50 transition-colors">
      {/* Статус */}
      <div className="w-9 sm:w-14 shrink-0 text-center">
        {statusEl}
      </div>

      {/* Мобильный layout: вертикальный стек */}
      <div className="flex-1 min-w-0 sm:hidden">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <TeamLogo images={event.imageOpponent1} name={event.opponent1NameLocalization || "T"} sportId={event.sportId} size={20} />
            <span className="text-xs font-semibold truncate">{event.opponent1NameLocalization || "Team 1"}</span>
          </div>
          {isLive ? (
            <span className={cn("text-xs font-mono font-bold tabular-nums", sc1 > sc2 && "text-accent-green")}>{sc1}</span>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <TeamLogo images={event.imageOpponent2} name={event.opponent2NameLocalization || "T"} sportId={event.sportId} size={20} />
            <span className="text-xs font-semibold truncate">{event.opponent2NameLocalization || "Team 2"}</span>
          </div>
          {isLive ? (
            <span className={cn("text-xs font-mono font-bold tabular-nums", sc2 > sc1 && "text-accent-green")}>{sc2}</span>
          ) : (
            <span className="text-[10px] text-text-muted font-bold px-1.5 py-0.5 rounded bg-surface">vs</span>
          )}
        </div>
      </div>

      {/* Десктоп layout: горизонтальный grid */}
      <div className="hidden sm:grid flex-1 min-w-0 grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex items-center justify-end gap-2 min-w-0">
          <span className="text-sm font-semibold truncate">{event.opponent1NameLocalization || "Team 1"}</span>
          <TeamLogo images={event.imageOpponent1} name={event.opponent1NameLocalization || "T"} sportId={event.sportId} />
        </div>

        {isLive ? (
          <div className="flex items-center gap-1.5 font-mono text-sm font-extrabold tabular-nums px-2.5 py-1 rounded-lg bg-surface">
            <span className={cn("w-6 text-center", sc1 > sc2 && "text-accent-green")}>{sc1}</span>
            <span className="text-text-muted text-xs">:</span>
            <span className={cn("w-6 text-center", sc2 > sc1 && "text-accent-green")}>{sc2}</span>
          </div>
        ) : (
          <span className="text-xs text-text-muted font-bold px-2 py-0.5 rounded bg-surface">vs</span>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <TeamLogo images={event.imageOpponent2} name={event.opponent2NameLocalization || "T"} sportId={event.sportId} />
          <span className="text-sm font-semibold truncate">{event.opponent2NameLocalization || "Team 2"}</span>
        </div>
      </div>

      {/* Коэффициенты — только десктоп */}
      {event.oddsLocalization && event.oddsLocalization.length >= 3 && (
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          {event.oddsLocalization.slice(0, 3).map((odd: any, i: number) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg bg-surface text-xs font-mono font-bold text-text-secondary hover:bg-brand-orange/10 hover:text-brand-orange transition-all min-w-11 text-center"
            >
              {odd.oddsMarket?.toFixed(2)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

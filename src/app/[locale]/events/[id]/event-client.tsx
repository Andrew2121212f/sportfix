"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, Calendar, Clock, Trophy } from "lucide-react";
import { useEventDetail } from "@/hooks/use-event-detail";
import { formatDateFull, formatKickoffSafe, formatMatchTime, getGameStatusLabel } from "@/lib/utils";
import { TeamLogo, TournamentLogo } from "@/components/sports/team-logo";
import LiveBadge from "@/components/sports/live-badge";
import type { EventDetailResponse } from "@/types/api";
import { GameStatus } from "@/types/api";
import PartnerCTA from "@/components/promo/partner-cta";

interface Props {
  id: string;
  type: "live" | "prematch" | undefined;
  locale: string;
  initialData: EventDetailResponse;
}

export default function EventClient({ id, type, locale, initialData }: Props) {
  const t = useTranslations("match.detail");
  const tMatch = useTranslations("match");
  const tStatus = useTranslations("match.status");
  const { data } = useEventDetail(id, type, locale, initialData);
  const response = data ?? initialData;

  // Сужаем тип через response.source — TypeScript понимает type guard на дискриминанте
  const liveEvent = response.source === "live" ? response.data : null;
  const event = response.data;
  const isLive = liveEvent !== null;

  const team1 = event.opponent1NameLocalization || "Team 1";
  const team2 = event.opponent2NameLocalization || "Team 2";
  const tournament = event.tournamentNameLocalization || "";
  const sc1 = liveEvent?.fullScore?.sc1 ?? 0;
  const sc2 = liveEvent?.fullScore?.sc2 ?? 0;
  const isFinished = liveEvent?.gameStatus === GameStatus.Finished;
  const isHalfTime = liveEvent?.gameStatus === GameStatus.HalfTime;
  const statusLabel = liveEvent
    ? tStatus(getGameStatusLabel(liveEvent.gameStatus) as "playing" | "finished" | "halftime" | "cancelled" | "interrupted" | "var")
    : "";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Назад */}
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {tournament || t("tabs.overview")}
      </Link>

      {/* Шапка турнира */}
      {tournament && (
        <div className="flex items-center gap-3 px-4 py-3 card">
          <TournamentLogo
            images={event.tournamentImage}
            name={tournament}
            sportId={event.sportId}
            size={28}
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-muted">{tMatch("tournament")}</p>
            <p className="text-sm font-bold truncate">{tournament}</p>
          </div>
          {isLive && !isFinished && <LiveBadge />}
          {isFinished && (
            <span className="text-xs font-bold text-text-muted px-2 py-0.5 rounded-lg bg-surface">FT</span>
          )}
          {isHalfTime && (
            <span className="text-xs font-bold text-brand-orange px-2 py-0.5 rounded-lg bg-brand-orange/10">HT</span>
          )}
        </div>
      )}

      {/* Хедер матча */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="card p-6 sm:p-10"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
          {/* Команда 1 */}
          <div className="flex flex-col items-center text-center gap-3">
            <TeamLogo
              images={event.imageOpponent1}
              name={team1}
              sportId={event.sportId}
              size={64}
            />
            <span className="text-sm sm:text-lg font-bold leading-tight">{team1}</span>
          </div>

          {/* Счёт или vs */}
          <div className="flex flex-col items-center gap-2 min-w-[80px] sm:min-w-[120px]">
            {isLive ? (
              <>
                <div className="flex items-center gap-2 sm:gap-3 font-mono text-3xl sm:text-5xl font-extrabold tabular-nums">
                  <span className={sc1 > sc2 ? "text-accent-green" : ""}>{sc1}</span>
                  <span className="text-text-muted text-2xl sm:text-3xl">:</span>
                  <span className={sc2 > sc1 ? "text-accent-green" : ""}>{sc2}</span>
                </div>
                {liveEvent && !isFinished && !isHalfTime && (
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-accent-green font-bold">
                    <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse-live" />
                    {formatMatchTime(liveEvent.timeSec)}
                  </div>
                )}
                {isHalfTime && (
                  <span className="text-xs font-bold text-brand-orange">{tStatus("halftime")}</span>
                )}
                {isFinished && (
                  <span className="text-xs font-bold text-text-muted">{tStatus("finished")}</span>
                )}
                {liveEvent?.currentPeriodName && !isFinished && !isHalfTime && (
                  <span className="text-[10px] sm:text-xs text-text-muted">{liveEvent.currentPeriodName}</span>
                )}
              </>
            ) : (
              <>
                <span className="text-text-muted font-bold text-lg sm:text-2xl px-3 py-1 rounded-lg bg-surface">vs</span>
                <span className="text-[11px] sm:text-xs text-text-muted">{statusLabel || t("startsAt")}</span>
              </>
            )}
          </div>

          {/* Команда 2 */}
          <div className="flex flex-col items-center text-center gap-3">
            <TeamLogo
              images={event.imageOpponent2}
              name={team2}
              sportId={event.sportId}
              size={64}
            />
            <span className="text-sm sm:text-lg font-bold leading-tight">{team2}</span>
          </div>
        </div>

        {/* Мета-информация о матче */}
        <div className="mt-8 pt-6 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Calendar className="h-3.5 w-3.5" />
              <span>{t("startsAt")}</span>
            </div>
            <span className="text-sm font-semibold">{formatDateFull(event.startDate)}</span>
          </div>
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5" />
              <span>{t("matchTime")}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">{formatKickoffSafe(event.startDate)}</span>
          </div>
          {tournament && (
            <div className="flex flex-col items-center sm:items-start gap-1 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Trophy className="h-3.5 w-3.5" />
                <span>{tMatch("tournament")}</span>
              </div>
              <span className="text-sm font-semibold truncate max-w-full">{tournament}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* SportFix-копия: максимизируем CTA. На странице события — две точки входа:
          крупный solid-CTA снизу + outline-баннер с бонусом сразу под мета-блоком */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-2xl border border-brand-gold/30 bg-brand-gold/5">
        <div className="text-sm">
          <p className="font-bold text-brand-gold">Live odds available on 1xBet</p>
          <p className="text-xs text-text-secondary mt-0.5">Place your bet before the next goal — odds update in real time.</p>
        </div>
        <PartnerCTA size="md" variant="solid" source="event-detail" icon="trending" label="Open odds" />
      </div>

      <PartnerCTA size="lg" variant="solid" source="event-detail-bottom" icon="gift" className="w-full justify-center" />
    </div>
  );
}

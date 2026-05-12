"use client";

import { ExternalLink, Zap, Gift, TrendingUp } from "lucide-react";
import { EXTERNAL_PLATFORM, PARTNER_NAME } from "@/lib/constants";

interface PartnerCTAProps {
  /** Размер кнопки */
  size?: "sm" | "md" | "lg";
  /** Стиль:
   *  - solid — заметная золотая кнопка (главные CTA — hero, страница события)
   *  - outline — менее назойливая (рядом со списком матчей)
   *  - card — карточка-баннер (между блоками контента)
   */
  variant?: "solid" | "outline" | "card";
  /** Кастомный текст (по умолчанию: "Bet on {PARTNER_NAME}") */
  label?: string;
  /** Иконка слева (по умолчанию — Zap) */
  icon?: "zap" | "gift" | "trending";
  /** UTM-метка для атрибуции (откуда пришёл клик) */
  source?: string;
  className?: string;
}

const ICONS = {
  zap: Zap,
  gift: Gift,
  trending: TrendingUp,
} as const;

/**
 * Универсальная CTA-кнопка на партнёрскую платформу (1xBet).
 * SportFix максимизирует кол-во точек перехода — этот компонент
 * используется почти в каждом крупном блоке.
 *
 * UTM-параметр source помогает понять, какой блок конвертит лучше.
 */
export default function PartnerCTA({
  size = "md",
  variant = "solid",
  label,
  icon = "zap",
  source,
  className = "",
}: PartnerCTAProps) {
  const Icon = ICONS[icon];
  const text = label || `Bet on ${PARTNER_NAME}`;
  const url = source ? `${EXTERNAL_PLATFORM}?utm_source=sportfix&utm_medium=${source}` : EXTERNAL_PLATFORM;

  const sizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-xs gap-1.5"
      : size === "lg"
      ? "px-6 py-3.5 text-base gap-2"
      : "px-4 py-2.5 text-sm gap-2";

  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";

  // Solid — золотой контраст на тёмном фоне, главный CTA-цвет SportFix
  const variantClass =
    variant === "solid"
      ? "bg-brand-gold text-white font-bold hover:brightness-110 shadow-lg shadow-brand-gold/30"
      : variant === "outline"
      ? "border border-brand-gold/60 text-brand-gold font-semibold hover:bg-brand-gold/10"
      : "w-full justify-between bg-gradient-to-r from-brand-gold/15 to-brand-gold/5 border border-brand-gold/30 text-brand-gold font-bold hover:brightness-110";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      data-cta-source={source}
      className={`inline-flex items-center rounded-xl transition-all ${sizeClass} ${variantClass} ${className}`}
    >
      <Icon className={iconSize} />
      <span>{text}</span>
      <ExternalLink className={iconSize + " opacity-70"} />
    </a>
  );
}

"use client";

import { useState } from "react";
import { getLeagueMeta } from "@/lib/league-priority";

interface CountryFlagProps {
  /** Название турнира — по нему определяется флаг */
  tournamentName: string;
  /** Размер шрифта (px) — используется для emoji-fallback */
  size?: number;
  className?: string;
}

/**
 * Флаг страны рядом с названием турнира.
 *
 * Стратегия рендера:
 *  1. Если у меты турнира есть flagCode — рендерим реальный SVG/PNG с flagcdn.com.
 *     Это решает проблему Windows: он не отрисовывает emoji-флаги (REGIONAL INDICATOR-
 *     символы), а показывает их как обычные буквы "BE", "FR" и т.д.
 *  2. Если flagCode нет (например, "Champions League" → флаг 🏆) — рендерим emoji.
 *  3. Если CDN недоступен — возвращаемся на emoji-fallback.
 *  4. Если ничего нет — ничего не рендерим.
 */
export default function CountryFlag({ tournamentName, size = 14, className = "" }: CountryFlagProps) {
  const meta = getLeagueMeta(tournamentName);
  const [cdnFailed, setCdnFailed] = useState(false);

  if (!meta.flag && !meta.flagCode) return null;

  // Есть ISO-код → реальный флаг с CDN
  if (meta.flagCode && !cdnFailed) {
    // size 14px (default) → берём w40 чтобы было резко на ретине
    const cdnWidth = size <= 16 ? 40 : size <= 24 ? 80 : 160;
    const retinaWidth = cdnWidth * 2;
    return (
      <img
        src={`https://flagcdn.com/w${cdnWidth}/${meta.flagCode}.png`}
        srcSet={`https://flagcdn.com/w${cdnWidth}/${meta.flagCode}.png 1x, https://flagcdn.com/w${retinaWidth}/${meta.flagCode}.png 2x`}
        alt={meta.country}
        title={meta.country}
        width={Math.round(size * 1.4)}
        height={size}
        loading="lazy"
        onError={() => setCdnFailed(true)}
        className={`inline-block rounded-sm object-cover shrink-0 ${className}`}
        style={{ width: `${Math.round(size * 1.4)}px`, height: `${size}px` }}
      />
    );
  }

  // Fallback на emoji (Champions League, тенниc и т.п. — там нет страны)
  return (
    <span
      role="img"
      aria-label={meta.country}
      title={meta.country}
      className={`inline-flex items-center leading-none shrink-0 ${className}`}
      style={{ fontSize: `${size}px` }}
    >
      {meta.flag}
    </span>
  );
}

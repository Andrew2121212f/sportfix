"use client";

import { useState } from "react";
import { SPORT_ICON_SLUGS, SPORT_ICONS } from "@/lib/constants";

interface SportIconProps {
  sportId: number;
  size?: 16 | 24;
  className?: string;
}

/**
 * SVG-иконка спорта из public/icons/sports/.
 * Использует mask-image чтобы иконка наследовала цвет текста (currentColor).
 * При ошибке загрузки — fallback на эмодзи.
 */
export default function SportIcon({ sportId, size = 16, className = "" }: SportIconProps) {
  const [failed, setFailed] = useState(false);
  const slug = SPORT_ICON_SLUGS[sportId];

  if (!slug || failed) {
    return (
      <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
        {SPORT_ICONS[sportId] || "🏅"}
      </span>
    );
  }

  const url = `/icons/sports/${slug}-${size}.svg`;

  return (
    <span
      role="img"
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        width: size,
        height: size,
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
      // Fallback: если SVG не загрузится — переключаемся на эмодзи
      ref={(el) => {
        if (el && !failed) {
          const img = document.createElement("img");
          img.onerror = () => setFailed(true);
          img.src = url;
        }
      }}
    />
  );
}

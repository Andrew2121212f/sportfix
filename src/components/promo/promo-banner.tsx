"use client";

import { EXTERNAL_PLATFORM } from "@/lib/constants";

interface PromoBannerProps {
  variant?: 1 | 2;
  className?: string;
  /** "default" — крупный (h-40/h-48 с обрезкой). "compact" — для сайдбара,
   * сохраняет родное соотношение сторон 280×240 (примерно 7:6). */
  size?: "default" | "compact";
}

/**
 * Промо-баннер Vivat Sport.
 * variant 1 и 2 — два разных дизайна баннеров.
 * Для compact размера держим естественные пропорции картинки —
 * иначе object-cover режет логотип/текст.
 */
export default function PromoBanner({ variant = 1, className = "", size = "default" }: PromoBannerProps) {
  const src = `/banners/vivat-promo-${variant}.png`;
  const srcHiRes = `/banners/vivat-promo-${variant}-4x.png`;

  if (size === "compact") {
    return (
      <a
        href={EXTERNAL_PLATFORM}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block overflow-hidden rounded-2xl group ${className}`}
      >
        {/* h-auto + width=280 height=240 сохраняют соотношение 7:6 без обрезки */}
        <picture>
          <img
            src={srcHiRes}
            srcSet={`${src} 280w, ${srcHiRes} 1120w`}
            sizes="(max-width: 640px) calc(100vw - 1.5rem), 240px"
            width={280}
            height={240}
            alt="Vivat Sport"
            className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </picture>
      </a>
    );
  }

  return (
    <a
      href={EXTERNAL_PLATFORM}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative block overflow-hidden rounded-2xl group ${className}`}
    >
      {/* default — фиксированная высота с object-cover для контента в гриде */}
      <picture>
        <img
          src={srcHiRes}
          srcSet={`${src} 280w, ${srcHiRes} 1120w`}
          sizes="(max-width: 640px) calc(100vw - 1.5rem), 560px"
          alt="Vivat Sport"
          className="w-full h-40 sm:h-48 object-cover group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </picture>
    </a>
  );
}

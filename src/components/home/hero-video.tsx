"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import PartnerCTA from "@/components/promo/partner-cta";

/**
 * Hero-блок главной страницы с фоновым видео.
 *
 * Видеофайлы (опционально, кладутся в public/videos/):
 *   - hero.webm  — основной формат (быстрее, лучше сжатие)
 *   - hero.mp4   — fallback для Safari/iOS
 *   - hero-poster.jpg — статичный постер до загрузки видео
 *
 * Если видео не загрузилось — показывается постер или градиент.
 * Hero используется как информационный заголовок страницы — CTA отсутствует
 * (по требованию: переходы на vivatbet только через баннер слева и кнопку в шапке).
 */
export default function HeroVideo() {
  const t = useTranslations("home.hero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Принудительный воспроизведение после монтирования (некоторые браузеры
  // блокируют autoPlay на первом рендере SSR).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // autoPlay заблокирован — оставляем постер, не падаем
    });
  }, []);

  const posterFallback = "/banners/vivat-promo-1-4x.png";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border h-[50vh] sm:h-[60vh] lg:h-[70vh] min-h-[320px] max-h-[640px]">
      {/* Видео-слой */}
      {!videoFailed && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/hero-poster.jpg"
          onError={() => setVideoFailed(true)}
        >
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Фоллбэк-картинка, если видео-теги не отрендерились/не загрузились */}
      {videoFailed && (
        <img
          src={posterFallback}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Затемняющий градиент — улучшает читаемость текста независимо от кадра */}
      <div className="absolute inset-0 bg-linear-to-tr from-black/80 via-black/45 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

      {/* Контент */}
      <div className="relative h-full flex flex-col justify-end p-6 sm:p-10 lg:p-12">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight max-w-2xl drop-shadow-lg"
        >
          {t("title")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 text-white/85 text-sm sm:text-base lg:text-lg max-w-xl drop-shadow"
        >
          {t("subtitle")}
        </motion.p>

        {/* Главный CTA на партнёра — крупная золотая кнопка под hero-текстом */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6"
        >
          <PartnerCTA size="lg" variant="solid" source="hero" icon="zap" />
        </motion.div>
      </div>
    </section>
  );
}

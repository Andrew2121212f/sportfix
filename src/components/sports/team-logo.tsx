"use client";

import { useEffect, useState } from "react";
import { teamLogoUrl, tournamentLogoUrl } from "@/lib/utils";
import { SPORT_ICON_SLUGS, SPORT_ICONS } from "@/lib/constants";
import { getLocalLeagueLogo } from "@/lib/league-logos";
import { useTheme } from "@/components/theme-provider";

const SPORT_GRADIENTS: Record<number, string> = {
  1:  "from-emerald-500 to-green-700",
  2:  "from-sky-400 to-blue-700",
  3:  "from-orange-400 to-red-600",
  4:  "from-lime-400 to-green-600",
  5:  "from-cyan-400 to-teal-600",
  6:  "from-red-400 to-rose-700",
  8:  "from-indigo-400 to-violet-700",
  9:  "from-amber-400 to-yellow-600",
  10: "from-emerald-400 to-teal-700",
  14: "from-red-500 to-red-800",
  15: "from-slate-400 to-slate-700",
  30: "from-purple-500 to-indigo-700",
  36: "from-green-400 to-emerald-700",
  40: "from-purple-500 to-indigo-700",
};

const DEFAULT_GRADIENT = "from-zinc-400 to-zinc-600";

function getSportGradient(sportId?: number) {
  if (!sportId) return DEFAULT_GRADIENT;
  return SPORT_GRADIENTS[sportId] || DEFAULT_GRADIENT;
}

function FallbackAvatar({ sportId, name, size, round = true }: { sportId?: number; name?: string; size: number; round?: boolean }) {
  const gradient = getSportGradient(sportId);
  const slug = sportId ? SPORT_ICON_SLUGS[sportId] : undefined;
  const iconSize = size <= 20 ? 10 : size <= 28 ? 12 : 14;
  const fontSize = size <= 20 ? 8 : size <= 28 ? 10 : 12;

  return (
    <span
      className={`inline-flex items-center justify-center bg-gradient-to-br ${gradient} shadow-sm ring-1 ring-white/10 shrink-0 ${round ? "rounded-full" : "rounded-md"}`}
      style={{ width: size, height: size }}
    >
      {slug ? (
        <span
          className="inline-block bg-white/90"
          style={{
            width: iconSize,
            height: iconSize,
            maskImage: `url(/icons/sports/${slug}-${iconSize >= 14 ? 24 : 16}.svg)`,
            WebkitMaskImage: `url(/icons/sports/${slug}-${iconSize >= 14 ? 24 : 16}.svg)`,
            maskSize: "contain",
            WebkitMaskSize: "contain",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      ) : sportId && SPORT_ICONS[sportId] ? (
        <span style={{ fontSize: iconSize, lineHeight: 1 }}>{SPORT_ICONS[sportId]}</span>
      ) : name ? (
        <span className="font-bold text-white/90" style={{ fontSize, lineHeight: 1 }}>
          {name.charAt(0).toUpperCase()}
        </span>
      ) : null}
    </span>
  );
}

export function TeamLogo({
  images,
  name,
  sportId,
  size = 24,
}: {
  images?: string[] | null;
  name: string;
  sportId?: number;
  size?: number;
}) {
  const url = teamLogoUrl(images);
  const [failed, setFailed] = useState(false);

  if (!url || failed) {
    return <FallbackAvatar sportId={sportId} name={name} size={size} />;
  }

  return (
    <img
      src={url}
      alt=""
      className="rounded-full object-cover bg-surface ring-1 ring-white/10 shrink-0"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

export function TournamentLogo({
  images,
  name,
  sportId,
  size = 20,
}: {
  images?: string[] | string | null;
  name?: string;
  sportId?: number;
  size?: number;
}) {
  const { theme } = useTheme();
  // Откладываем чтение темы до клиента: на SSR используем "dark" (как фолбэк темы),
  // на клиенте после mount — реальную из localStorage. Иначе hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const effectiveTheme = mounted ? (theme as "dark" | "light") : "dark";
  const localLogo = getLocalLeagueLogo(name, effectiveTheme);
  const url = tournamentLogoUrl(images);
  const [failed, setFailed] = useState(false);

  // Приоритет: локальный SVG → CDN → fallback
  if (localLogo) {
    return (
      <img
        src={localLogo}
        alt={name || ""}
        className="shrink-0"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }

  if (!url || failed) {
    return <FallbackAvatar sportId={sportId} name={name} size={size} round={false} />;
  }

  return (
    <img
      src={url}
      alt={name || ""}
      className="rounded-md object-cover bg-surface ring-1 ring-white/10 shrink-0"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}

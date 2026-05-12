import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GameStatus } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}'${secs > 0 ? `:${secs.toString().padStart(2, "0")}` : ""}`;
}

export function formatMatchTime(seconds: number): string {
  return `${Math.floor(seconds / 60)}'`;
}

export function formatDate(unix: number): string {
  return new Date(unix * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function formatKickoff(unix: number): string {
  return new Date(unix * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getGameStatusLabel(status: number): string {
  // Ключи должны совпадать с match.status.* в i18n-сообщениях (playing/finished/halftime/...)
  // Иначе next-intl бросит MISSING_MESSAGE.
  switch (status) {
    case GameStatus.Playing:
      return "playing";
    case GameStatus.Finished:
      return "finished";
    case GameStatus.HalfTime:
      return "halftime";
    case GameStatus.Cancelled:
      return "cancelled";
    case GameStatus.Interrupted:
      return "interrupted";
    case GameStatus.VAR:
    case GameStatus.VARPenalty:
      return "var";
    default:
      return "playing";
  }
}

export function teamLogoUrl(images: string[] | null | undefined): string | null {
  if (!images || images.length === 0) return null;
  return `https://nimblecd.com/sfiles/logo_teams/${images[0]}`;
}

export function tournamentLogoUrl(images: string[] | string | null | undefined): string | null {
  if (!images) return null;
  const file = Array.isArray(images) ? images[0] : images;
  if (!file) return null;
  return `https://nimblecd.com/sfiles/logo-champ/${file}`;
}

export function formatDateFull(unix: number | string): string {
  const d = typeof unix === "string" ? new Date(unix) : new Date(unix * 1000);
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export function formatKickoffSafe(unix: number | string): string {
  const d = typeof unix === "string" ? new Date(unix) : new Date(unix * 1000);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateSafe(unix: number | string): string {
  const d = typeof unix === "string" ? new Date(unix) : new Date(unix * 1000);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export function groupBy<T>(array: T[], key: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const k = key(item);
    (groups[k] = groups[k] || []).push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

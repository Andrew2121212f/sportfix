// Маппинг названий турниров → локальные SVG-логотипы
// Для лиг с вариантами тем (dark/light) возвращает нужную версию

type ThemeVariant = "dark" | "light";

interface LeagueLogoEntry {
  /** Ключевые слова для нечёткого поиска (lowercase) */
  keywords: string[];
  /** Путь к SVG. Если объект — разные варианты для тем */
  path: string | Record<ThemeVariant, string>;
}

const LEAGUE_LOGOS: LeagueLogoEntry[] = [
  {
    keywords: ["premier league"],
    path: {
      dark: "/logos/leagues/premierleague_dark.svg",
      light: "/logos/leagues/premierleague_light.svg",
    },
  },
  {
    keywords: ["champions league", "uefa champions"],
    path: {
      dark: "/logos/leagues/UEFAchampionsleague_dark.svg",
      light: "/logos/leagues/UEFAchampionsleague_light.svg",
    },
  },
  {
    keywords: ["atp", "roland garros", "wimbledon", "us open tennis", "australian open tennis"],
    path: {
      dark: "/logos/leagues/ATR_dark.svg",
      light: "/logos/leagues/ATR_light.svg",
    },
  },
  {
    keywords: ["nba"],
    path: "/logos/leagues/NBA.svg",
  },
  {
    keywords: ["nhl"],
    path: "/logos/leagues/NHL.svg",
  },
  {
    keywords: ["la liga", "laliga"],
    path: "/logos/leagues/laliga.svg",
  },
  {
    keywords: ["jupiler", "pro league"],
    path: "/logos/leagues/proleague.svg",
  },
];

/**
 * Ищет локальный SVG-логотип по названию турнира.
 * Возвращает путь к SVG или null, если логотип не найден.
 */
export function getLocalLeagueLogo(
  tournamentName: string | undefined | null,
  theme: ThemeVariant = "dark"
): string | null {
  if (!tournamentName) return null;

  const normalized = tournamentName.toLowerCase();

  for (const entry of LEAGUE_LOGOS) {
    const match = entry.keywords.some((kw) => normalized.includes(kw));
    if (match) {
      if (typeof entry.path === "string") return entry.path;
      return entry.path[theme] || entry.path.dark;
    }
  }

  return null;
}

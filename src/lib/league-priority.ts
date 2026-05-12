// Приоритизация турниров для бельгийской аудитории.
// Чем меньше число — тем выше приоритет (Belgium = 1, минимум = 999).
// Используется для сортировки сгруппированных по турнирам матчей.

interface LeagueMeta {
  /** Приоритет: 1 — самый высокий */
  priority: number;
  /** ISO-страна или регион (для определения флага) */
  country: string;
  /** Эмодзи-флаг (fallback) */
  flag: string;
  /** ISO-код для flagcdn.com (be/fr/de/gb-eng/...) — для SVG-флага.
   *  Если не задан — рендерим emoji. Для турниров без страны (Champions League, NBA) — undefined. */
  flagCode?: string;
}

// Маппинг ключевых слов в названии турнира → приоритет, страна, флаг.
// Сначала проверяются более специфичные совпадения.
const LEAGUE_RULES: Array<{ keywords: string[]; meta: LeagueMeta }> = [
  // 1. Бельгия — топ-приоритет
  { keywords: ["jupiler", "belgium", "belgique", "challenger pro league"], meta: { priority: 1, country: "Belgium", flag: "🇧🇪", flagCode: "be" } },

  // 2. Франция
  { keywords: ["ligue 1", "ligue 2", "france.", "coupe de france"], meta: { priority: 2, country: "France", flag: "🇫🇷", flagCode: "fr" } },

  // 3. Германия
  { keywords: ["bundesliga", "germany.", "dfb-pokal", "deutschland"], meta: { priority: 3, country: "Germany", flag: "🇩🇪", flagCode: "de" } },

  // 4. Голландия (соседняя страна)
  { keywords: ["eredivisie", "netherlands.", "knvb"], meta: { priority: 4, country: "Netherlands", flag: "🇳🇱", flagCode: "nl" } },

  // 5. Англия
  { keywords: ["premier league", "england.", "fa cup", "championship"], meta: { priority: 5, country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", flagCode: "gb-eng" } },

  // 6. Италия
  { keywords: ["serie a", "serie b", "italy.", "coppa italia"], meta: { priority: 6, country: "Italy", flag: "🇮🇹", flagCode: "it" } },

  // 7. Испания
  { keywords: ["la liga", "laliga", "spain.", "copa del rey"], meta: { priority: 7, country: "Spain", flag: "🇪🇸", flagCode: "es" } },

  // 8. Португалия
  { keywords: ["primeira liga", "portugal."], meta: { priority: 8, country: "Portugal", flag: "🇵🇹", flagCode: "pt" } },

  // 9. Европейские турниры — высокий приоритет (без страны → emoji-fallback)
  { keywords: ["champions league", "uefa champions"], meta: { priority: 9, country: "Europe", flag: "🏆" } },
  { keywords: ["europa league", "uefa europa"], meta: { priority: 10, country: "Europe", flag: "🏆" } },
  { keywords: ["conference league", "uefa conference"], meta: { priority: 11, country: "Europe", flag: "🏆" } },
  { keywords: ["euro", "european championship", "nations league"], meta: { priority: 12, country: "Europe", flag: "🇪🇺", flagCode: "eu" } },

  // 10. Международные турниры (FIFA)
  { keywords: ["world cup", "fifa", "copa america"], meta: { priority: 13, country: "World", flag: "🌍", flagCode: "un" } },

  // 11. Главные баскетбольные/хоккейные/теннисные турниры
  { keywords: ["nba"], meta: { priority: 14, country: "USA", flag: "🇺🇸", flagCode: "us" } },
  { keywords: ["nhl"], meta: { priority: 15, country: "USA / Canada", flag: "🇺🇸", flagCode: "us" } },
  { keywords: ["atp", "wta", "grand slam", "roland garros", "wimbledon", "us open", "australian open"], meta: { priority: 16, country: "Tennis", flag: "🎾" } },
  { keywords: ["euroleague"], meta: { priority: 17, country: "Europe", flag: "🏀" } },

  // 12. Прочие европейские страны
  { keywords: ["austria.", "bundesliga austria"], meta: { priority: 20, country: "Austria", flag: "🇦🇹", flagCode: "at" } },
  { keywords: ["switzerland.", "super league switzerland"], meta: { priority: 21, country: "Switzerland", flag: "🇨🇭", flagCode: "ch" } },
  { keywords: ["scotland."], meta: { priority: 22, country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", flagCode: "gb-sct" } },
  { keywords: ["greece."], meta: { priority: 23, country: "Greece", flag: "🇬🇷", flagCode: "gr" } },
  { keywords: ["turkey."], meta: { priority: 24, country: "Turkey", flag: "🇹🇷", flagCode: "tr" } },

  // 13. MLB / другие американские
  { keywords: ["mlb"], meta: { priority: 30, country: "USA", flag: "🇺🇸", flagCode: "us" } },
  { keywords: ["mls"], meta: { priority: 31, country: "USA", flag: "🇺🇸", flagCode: "us" } },

  // 14. Кибер-спорт (флаг — игровой эмодзи, без страны)
  { keywords: ["league of legends", "lol", "lck", "lpl", "lec"], meta: { priority: 40, country: "Esports", flag: "🎮" } },
  { keywords: ["counter-strike", "cs2", "cs:go", "dota"], meta: { priority: 41, country: "Esports", flag: "🎮" } },

  // 15. Низкий приоритет — Россия, Казахстан, остальные СНГ
  { keywords: ["russia.", "russian cup", "rpl", "premier league russia"], meta: { priority: 800, country: "Russia", flag: "🇷🇺", flagCode: "ru" } },
  { keywords: ["belarus."], meta: { priority: 810, country: "Belarus", flag: "🇧🇾", flagCode: "by" } },
  { keywords: ["kazakhstan."], meta: { priority: 820, country: "Kazakhstan", flag: "🇰🇿", flagCode: "kz" } },
  { keywords: ["ukraine."], meta: { priority: 830, country: "Ukraine", flag: "🇺🇦", flagCode: "ua" } },

  // 16. Остальные — низкий приоритет
  { keywords: ["india."], meta: { priority: 700, country: "India", flag: "🇮🇳", flagCode: "in" } },
  { keywords: ["china."], meta: { priority: 710, country: "China", flag: "🇨🇳", flagCode: "cn" } },
  { keywords: ["japan."], meta: { priority: 720, country: "Japan", flag: "🇯🇵", flagCode: "jp" } },
  { keywords: ["korea."], meta: { priority: 730, country: "South Korea", flag: "🇰🇷", flagCode: "kr" } },
  { keywords: ["bangladesh."], meta: { priority: 740, country: "Bangladesh", flag: "🇧🇩", flagCode: "bd" } },
  { keywords: ["argentina."], meta: { priority: 600, country: "Argentina", flag: "🇦🇷", flagCode: "ar" } },
  { keywords: ["brazil."], meta: { priority: 610, country: "Brazil", flag: "🇧🇷", flagCode: "br" } },
];

const DEFAULT_META: LeagueMeta = { priority: 999, country: "", flag: "" };

/**
 * Возвращает метаданные турнира (приоритет/флаг/страну) по его названию.
 * Поиск регистронезависимый, по подстрокам.
 */
export function getLeagueMeta(tournamentName: string | null | undefined): LeagueMeta {
  if (!tournamentName) return DEFAULT_META;
  const lower = tournamentName.toLowerCase();
  for (const rule of LEAGUE_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      return rule.meta;
    }
  }
  return DEFAULT_META;
}

/**
 * Сортирует пары [tournamentName, events] по приоритету.
 * Лиги Бельгии впереди, Россия и остальные — в конце.
 * При равном приоритете сохраняется исходный порядок (стабильная сортировка).
 */
export function sortTournamentEntries<T>(entries: Array<[string, T]>): Array<[string, T]> {
  return [...entries].sort(([a], [b]) => {
    const pa = getLeagueMeta(a).priority;
    const pb = getLeagueMeta(b).priority;
    return pa - pb;
  });
}

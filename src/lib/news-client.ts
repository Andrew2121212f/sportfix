import type { NewsArticle } from "@/types/news";

// NewsData.io — 200 кредитов/день бесплатно, категория sports
const NEWS_API_KEY = process.env.NEWS_API_KEY || "";
const NEWS_API_URL = "https://newsdata.io/api/1/latest";

// Разнообразные спортивные placeholder-картинки (когда у статьи нет своей)
const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1461896836934-bd45ba47c285?w=600&h=400&fit=crop", // стадион ночью
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop", // футбольный мяч
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop", // баскетбол
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop", // футбольное поле сверху
  "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&h=400&fit=crop", // теннисный корт
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop", // бегун
  "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=600&h=400&fit=crop", // бейсбол
  "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&h=400&fit=crop", // велоспорт
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop", // плавание
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&h=400&fit=crop", // велогонка
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=600&h=400&fit=crop", // гольф
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&h=400&fit=crop", // стадион закат
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&h=400&fit=crop", // американский футбол
  "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&h=400&fit=crop", // бокс
  "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop", // волейбол
  "https://images.unsplash.com/photo-1580748142216-0bc0e5169dba?w=600&h=400&fit=crop", // хоккей
];

/**
 * Захардкоженные статьи-заглушки (fallback при недоступности API).
 */
const FALLBACK_ARTICLES: NewsArticle[] = [
  {
    id: "fb-1",
    title: "Champions League Quarter-Finals Draw Revealed",
    excerpt: "The draw for the Champions League quarter-finals has been completed with exciting matchups ahead.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=500&fit=crop",
    source: "SportFix",
    category: "Football",
    publishedAt: "2026-03-20T10:00:00Z",
    isPromo: false,
    isExternal: true,
    slug: "",
  },
  {
    id: "fb-2",
    title: "NBA Playoff Race Heats Up as Season Enters Final Stretch",
    excerpt: "With just weeks remaining in the regular season, several teams are battling for the final playoff spots.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1504450758481-7338bbe75005?w=600&h=400&fit=crop",
    source: "SportFix",
    category: "Basketball",
    publishedAt: "2026-03-19T10:00:00Z",
    isPromo: false,
    isExternal: true,
    slug: "",
  },
  {
    id: "fb-3",
    title: "Belgian Pro League Title Race Intensifies",
    excerpt: "Club Brugge and Union Saint-Gilloise continue their fierce battle for the Belgian title.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&h=400&fit=crop",
    source: "SportFix",
    category: "Football",
    publishedAt: "2026-03-18T10:00:00Z",
    isPromo: false,
    isExternal: true,
    slug: "",
  },
  {
    id: "fb-4",
    title: "Grand Slam Tennis Season Preview: Clay Court Edition",
    excerpt: "A comprehensive look at the top contenders for this year's clay court season.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&h=400&fit=crop",
    source: "SportFix",
    category: "Tennis",
    publishedAt: "2026-03-17T10:00:00Z",
    isPromo: false,
    isExternal: true,
    slug: "",
  },
  {
    id: "fb-5",
    title: "Ice Hockey World Championship Groups Announced",
    excerpt: "The IIHF has revealed the group stage draw for the upcoming Ice Hockey World Championship.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1580748142216-0bc0e5169dba?w=600&h=400&fit=crop",
    source: "SportFix",
    category: "Hockey",
    publishedAt: "2026-03-16T10:00:00Z",
    isPromo: false,
    isExternal: true,
    slug: "",
  },
  {
    id: "fb-6",
    title: "Volleyball Nations League Schedule Released",
    excerpt: "The complete schedule for this year's Volleyball Nations League has been published.",
    url: "#",
    imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&h=400&fit=crop",
    source: "SportFix",
    category: "General",
    publishedAt: "2026-03-15T10:00:00Z",
    isPromo: false,
    isExternal: true,
    slug: "",
  },
];

interface FetchNewsOptions {
  category?: string;
  count?: number;
  lang?: string;
}

/**
 * Получает спортивные новости из NewsData.io.
 * Категория sports встроена — все результаты спортивные.
 * При ошибке — возвращает fallback-статьи.
 */
export async function fetchSportsNews(options: FetchNewsOptions = {}): Promise<NewsArticle[]> {
  const { count = 12, lang = "en" } = options;

  // Если нет API ключа — сразу fallback
  if (!NEWS_API_KEY) {
    console.warn("[news-client] NEWS_API_KEY is not set, using fallback articles");
    return FALLBACK_ARTICLES.slice(0, count);
  }

  console.log("[news-client] Fetching from NewsData.io, key starts with:", NEWS_API_KEY.substring(0, 8));

  try {
    const langCode = lang === "nl" ? "nl" : lang === "de" ? "de" : lang === "fr" ? "fr" : "en";
    // NewsData.io бесплатный: макс 10 за запрос, но можно делать несколько с пагинацией
    const pages = Math.ceil(Math.min(count, 30) / 10);
    let allResults: any[] = [];
    let nextPage: string | null = null;

    for (let p = 0; p < pages; p++) {
      const params = new URLSearchParams({
        apikey: NEWS_API_KEY,
        category: "sports",
        language: langCode,
        size: "10",
      });

      // Если конкретный вид спорта — добавляем поиск
      if (options.category && options.category !== "all") {
        params.set("q", options.category);
      }

      // Пагинация — следующая страница
      if (nextPage) {
        params.set("page", nextPage);
      }

      const res = await fetch(`${NEWS_API_URL}?${params}`, {
        cache: "no-store", // Без кэша — на Vercel serverless кэш может блокировать
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.error(`[news-client] NewsData.io responded with ${res.status}:`, errorText.substring(0, 200));
        break;
      }

      const data = await res.json();
      console.log(`[news-client] Page ${p + 1}: got ${data.results?.length || 0} articles, status: ${data.status}`);

      if (data.status !== "success" || !data.results) {
        break;
      }

      allResults = [...allResults, ...data.results];
      nextPage = data.nextPage || null;

      // Если нет следующей страницы — выходим
      if (!nextPage) break;
    }

    if (allResults.length === 0) {
      return FALLBACK_ARTICLES.slice(0, count);
    }

    // Дедупликация по заголовку
    const seen = new Set<string>();
    const uniqueResults = allResults.filter((item: any) => {
      if (!item.title || seen.has(item.title)) return false;
      seen.add(item.title);
      return true;
    });

    const apiArticles: NewsArticle[] = uniqueResults.map((item: any, i: number) => ({
      id: `news-${item.article_id || i}`,
      title: item.title,
      excerpt: item.description || item.content?.substring(0, 200) || "",
      url: item.link || "#",
      imageUrl: item.image_url || PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length],
      source: item.source_name || item.source_id || "Unknown",
      category: mapCategory(item.category || []),
      publishedAt: item.pubDate || new Date().toISOString(),
      isPromo: false,
    isExternal: true,
    slug: "",
    }));

    // Если API вернул мало — дополняем fallback-статьями
    if (apiArticles.length < count) {
      const needed = count - apiArticles.length;
      const existingTitles = new Set(apiArticles.map((a) => a.title));
      const extras = FALLBACK_ARTICLES.filter((a) => !existingTitles.has(a.title)).slice(0, needed);
      return [...apiArticles, ...extras];
    }

    return apiArticles.slice(0, count);
  } catch (error) {
    console.error("[news-client] Failed to fetch news:", error);
    return FALLBACK_ARTICLES.slice(0, count);
  }
}

/**
 * Маппит категории NewsData.io в наши.
 */
function mapCategory(categories: string[]): string {
  const cat = (categories[0] || "").toLowerCase();
  if (cat.includes("football") || cat.includes("soccer")) return "Football";
  if (cat.includes("basketball") || cat.includes("nba")) return "Basketball";
  if (cat.includes("tennis")) return "Tennis";
  if (cat.includes("hockey") || cat.includes("nhl")) return "Hockey";
  if (cat === "sports") return "Sports";
  return "Sports";
}

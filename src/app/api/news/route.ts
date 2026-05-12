import { NextRequest, NextResponse } from "next/server";
import { fetchSportsNews } from "@/lib/news-client";
import { mixWithPromo } from "@/lib/promo-news";
import { fetchSheetArticles } from "@/lib/sheets-news";
import type { NewsArticle } from "@/types/news";

/**
 * Аггрегатор новостей.
 *
 * Порядок выдачи:
 *   1. Кастомные статьи из Google Sheets для текущего языка (приоритет, internal)
 *   2. Внешние спортивные новости с NewsData.io (external)
 *   3. Промо-вставки (1 на каждые 3 реальные)
 *
 * Если Sheets пуст — отдаём только внешние + промо. Если NewsData упал —
 * только Sheets + промо. Если всё упало — пустой массив.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category") || "all";
  const count = parseInt(searchParams.get("count") || "20", 10);
  const lang = searchParams.get("lng") || "en";

  try {
    // Параллельно тянем оба источника, чтобы не ждать последовательно
    const [sheetArticles, externalNews] = await Promise.all([
      fetchSheetArticles(lang).catch(() => [] as NewsArticle[]),
      fetchSportsNews({ category, count, lang }).catch(() => [] as NewsArticle[]),
    ]);

    // Sheets-статьи фильтруем по категории если задана конкретная
    const sheetsFiltered =
      category && category !== "all"
        ? sheetArticles.filter((a) =>
            a.category.toLowerCase().includes(category.toLowerCase())
          )
        : sheetArticles;

    // Featured из Sheets — самые первые
    const featured = sheetsFiltered.filter((a) => a.featured);
    const regular = sheetsFiltered.filter((a) => !a.featured);

    // Композиция: featured → остальные из Sheets → внешние с NewsData
    const allReal = [...featured, ...regular, ...externalNews].slice(0, count);

    // Миксуем с промо (1 промо на 3 реальные)
    const mixed = mixWithPromo(allReal, 3);

    return NextResponse.json({ items: mixed });
  } catch (error) {
    console.error("[news route] Error:", error);
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { fetchSheetArticleBySlug } from "@/lib/sheets-news";

/**
 * GET /api/news/[slug]?lng=fr — одна статья из Google Sheets по slug.
 * Используется детальной страницей /[locale]/news/[slug].
 *
 * Если в текущем языке статьи нет — клиент Sheets делает fallback на en.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const lang = request.nextUrl.searchParams.get("lng") || "en";

  const article = await fetchSheetArticleBySlug(slug, lang);
  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
  return NextResponse.json(article);
}

import type { NewsArticle } from "@/types/news";

/**
 * Клиент для Google Sheets как CMS для статей.
 *
 * Идея: маркетинг ведёт статьи в Google Sheets (5 листов по языкам: en/fr/de/nl/ar).
 * Таблица расшарена "anyone with link can view" — мы читаем её через публичный
 * gviz CSV-экспорт (БЕЗ Google API ключа, БЕЗ Cloud Console).
 *
 * Формат строки (колонки 0-8):
 *   slug | title | excerpt | image_url | content | category | author | date | featured
 *
 * Env:
 *   NEWS_SHEET_ID — ID таблицы (часть URL между /d/ и /edit)
 *
 * Кэширование: 5 минут на сервере (Next fetch revalidate).
 */

export const SHEET_ID = process.env.NEWS_SHEET_ID || "1QEimf07_cVcvHxQ-I23fivpuCVX19GJo5Wfr7BFU-fE";
const SUPPORTED_LANGS = ["en", "fr", "de", "nl", "ar"] as const;

/**
 * Парсит CSV-текст в массив строк.
 * Поддерживает кавычки и переводы строк внутри полей (для длинного content).
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        current.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        current.push(field);
        field = "";
        if (current.some((f) => f.trim())) rows.push(current);
        current = [];
      } else {
        field += c;
      }
    }
  }
  if (field || current.length > 0) {
    current.push(field);
    if (current.some((f) => f.trim())) rows.push(current);
  }
  return rows;
}

/**
 * Превращает строку из CSV в NewsArticle.
 * Игнорирует строки без обязательных полей (slug, title).
 */
function rowToArticle(row: string[]): NewsArticle | null {
  const [slug, title, excerpt, imageUrl, content, category, author, date, featured] = row.map((c) =>
    (c || "").trim()
  );

  if (!slug || !title) return null;

  return {
    id: `sheet-${slug}`,
    slug,
    title,
    excerpt: excerpt || "",
    // url — относительный путь (без локали — её добавит страница при рендере)
    url: `/news/${slug}`,
    imageUrl: imageUrl || "https://images.unsplash.com/photo-1461896836934-bd45ba47c285?w=1200",
    source: author || "Vivat Sport",
    author: author || undefined,
    category: category || "News",
    publishedAt: date || new Date().toISOString(),
    isPromo: false,
    isExternal: false,
    content,
    featured: featured?.toLowerCase() === "true",
  };
}

/**
 * Загружает статьи из Google Sheets для конкретного языка.
 * Возвращает пустой массив при ошибке (чтобы не ломать всю страницу новостей).
 */
export async function fetchSheetArticles(lang: string): Promise<NewsArticle[]> {
  // Fallback на en если язык не поддерживается в таблице
  const sheet = (SUPPORTED_LANGS as readonly string[]).includes(lang) ? lang : "en";
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5 минут кэш на сервере
    });
    if (!res.ok) {
      console.warn(`[sheets-news] HTTP ${res.status} for sheet '${sheet}'`);
      return [];
    }
    const text = await res.text();
    const rows = parseCSV(text);
    // Первая строка — заголовки колонок, пропускаем
    return rows
      .slice(1)
      .map(rowToArticle)
      .filter((a): a is NewsArticle => a !== null)
      // Свежие первыми
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (err) {
    console.error("[sheets-news] Fetch error:", err);
    return [];
  }
}

/**
 * Достаёт одну статью по slug.
 * Сначала ищет в указанном языке, потом fallback на en.
 */
export async function fetchSheetArticleBySlug(
  slug: string,
  lang: string
): Promise<NewsArticle | null> {
  const inLang = await fetchSheetArticles(lang);
  const found = inLang.find((a) => a.slug === slug);
  if (found) return found;

  // Fallback на английский, если в текущем языке статьи нет
  if (lang !== "en") {
    const inEn = await fetchSheetArticles("en");
    return inEn.find((a) => a.slug === slug) || null;
  }
  return null;
}

// Типы для новостного блока
export interface NewsArticle {
  /** Уникальный ID. Для Sheets-статей = slug, для внешних NewsData.io = их ID */
  id: string;
  /** Slug для внутренних ссылок (только для Sheets/promo). Пустая строка — статья внешняя */
  slug: string;
  /** Заголовок */
  title: string;
  /** Короткое описание (для карточки) */
  excerpt: string;
  /** Куда вести при клике: если isExternal=true — это полный URL, иначе — относительный путь */
  url: string;
  imageUrl: string;
  source: string;
  category: string;
  publishedAt: string;
  /** Промо-карточка от Vivat */
  isPromo: boolean;
  /** Внешняя статья (NewsData.io) — открывается во вкладке. Sheets/promo → internal page */
  isExternal: boolean;
  /** Полный текст статьи (markdown) — заполняется только при запросе одной статьи */
  content?: string;
  /** Автор */
  author?: string;
  /** featured — закреплено вверху */
  featured?: boolean;
}

export type NewsCategory = "all" | "football" | "basketball" | "tennis" | "hockey" | "general";

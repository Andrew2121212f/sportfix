import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { fetchSheetArticleBySlug } from "@/lib/sheets-news";
import ArticleContent from "@/components/news/article-content";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * SEO metadata формируется на сервере из данных Sheets —
 * title, description, og:image. Это даёт нормальный preview в соцсетях
 * и индексацию Google.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await fetchSheetArticleBySlug(slug, locale);

  if (!article) return { title: "Article not found" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [{ url: article.imageUrl }] : undefined,
      type: "article",
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : undefined,
    },
  };
}

function formatDate(dateStr: string, locale: string): string {
  try {
    return new Date(dateStr).toLocaleDateString(locale === "ar" ? "ar-EG" : locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const article = await fetchSheetArticleBySlug(slug, locale);

  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      {/* Назад к списку */}
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to news
      </Link>

      {/* Шапка статьи */}
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2.5 py-1 bg-brand-orange/10 text-brand-orange font-bold uppercase rounded-md">
            {article.category}
          </span>
          <span className="inline-flex items-center gap-1 text-text-muted">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.publishedAt, locale)}
          </span>
          {article.author && (
            <span className="inline-flex items-center gap-1 text-text-muted">
              <User className="h-3.5 w-3.5" />
              {article.author}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
          {article.title}
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed">{article.excerpt}</p>
      </header>

      {/* Главная картинка */}
      {article.imageUrl && (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface">
          {/* Изображение может прийти с произвольного домена — используем <img>,
              чтобы не настраивать remotePatterns для каждого источника */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.imageUrl}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}

      {/* Тело статьи (Markdown → React) */}
      <ArticleContent content={article.content || ""} />
    </article>
  );
}

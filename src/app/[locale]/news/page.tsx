"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Clock, ArrowRight, ExternalLink, Newspaper } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/empty-state";
import { useNews } from "@/hooks/use-news";
import { cn } from "@/lib/utils";
import type { NewsArticle } from "@/types/news";
import { NewsCardSkeleton } from "@/components/ui/skeletons";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "football", label: "Football" },
  { key: "basketball", label: "Basketball" },
  { key: "tennis", label: "Tennis" },
  { key: "hockey", label: "Hockey" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" as const },
  }),
};

function formatNewsDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Решает куда вести по клику на статью:
 *  - internal (Sheets-статьи с slug) → /[locale]/news/[slug]
 *  - external (NewsData.io / промо) → внешний URL во вкладке
 */
function ArticleLink({
  article,
  locale,
  className,
  children,
}: {
  article: NewsArticle;
  locale: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (!article.isExternal && article.slug) {
    return (
      <Link href={`/${locale}/news/${article.slug}`} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

export default function NewsPage() {
  const t = useTranslations("news");
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState("all");

  const { data, isLoading } = useNews(activeCategory, locale);
  const articles = data?.items || [];
  const featured = articles.find((a) => !a.isPromo);
  const rest = articles.filter((a) => a !== featured);

  return (
    <div className="space-y-5">
      {/* Фильтр категорий */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-fade-x">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
              activeCategory === cat.key
                ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20"
                : "text-text-secondary border-border hover:text-foreground hover:border-foreground/20 hover:bg-surface"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="skeleton aspect-video lg:min-h-64" />
              <div className="p-5 lg:p-6 space-y-3">
                <div className="flex gap-2">
                  <div className="skeleton h-3 w-16 rounded" />
                  <div className="skeleton h-3 w-24 rounded" />
                </div>
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-5 w-1/2 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <NewsCardSkeleton key={i} index={i} />
            ))}
          </div>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState icon={Newspaper} title={t("noArticles")} description="New articles are published regularly" />
      ) : (
        <>
          {/* Featured Article */}
          {featured && (
            <motion.article
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="card card-interactive overflow-hidden cursor-pointer group"
            >
              <ArticleLink
                article={featured}
                locale={locale}
                className="grid grid-cols-1 lg:grid-cols-2"
              >
                <div className="relative aspect-video lg:aspect-auto lg:min-h-64 overflow-hidden bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featured.imageUrl}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1461896836934-bd45ba47c285?w=800&h=500&fit=crop";
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-brand-orange text-white text-xs font-bold rounded-lg">
                      {t("featured")}
                    </span>
                  </div>
                </div>
                <div className="p-5 lg:p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                      {featured.category}
                    </span>
                    <span className="text-xs text-text-muted">{formatNewsDate(featured.publishedAt)}</span>
                    {featured.source && <span className="text-xs text-text-muted">{featured.source}</span>}
                  </div>
                  <h2 className="text-base sm:text-lg font-extrabold mb-2 group-hover:text-brand-orange transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-orange">
                    {t("readMore")}
                    {featured.isExternal ? (
                      <ExternalLink className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    ) : (
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </div>
              </ArticleLink>
            </motion.article>
          )}

          {/* Article Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {rest.map((article: NewsArticle, i: number) => (
              <motion.article
                key={article.id}
                variants={fadeUp}
                custom={i}
                className="card card-interactive overflow-hidden group cursor-pointer relative"
              >
                <ArticleLink article={article} locale={locale} className="block">
                  <div className="relative aspect-video overflow-hidden bg-surface">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&h=400&fit=crop";
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-xs font-bold text-brand-orange">
                        {article.category}
                      </span>
                    </div>
                    {article.isPromo && (
                      <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-medium text-white/70 bg-black/40 backdrop-blur-sm rounded">
                        Sponsored
                      </span>
                    )}
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-2.5 w-2.5 text-text-muted" />
                      <span className="text-xs text-text-muted">{formatNewsDate(article.publishedAt)}</span>
                      <span className="text-xs text-text-muted">{article.source}</span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug mb-1.5 group-hover:text-brand-orange transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{article.excerpt}</p>
                    {article.isPromo && (
                      <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-brand-orange">
                        Learn more <ExternalLink className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </ArticleLink>
              </motion.article>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

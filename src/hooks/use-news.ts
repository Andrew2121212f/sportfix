"use client";

import { useQuery } from "@tanstack/react-query";
import type { NewsArticle } from "@/types/news";

interface NewsResponse {
  items: NewsArticle[];
}

/**
 * Хук для получения новостей (реальные + промо).
 * Кэш на 5 минут, без автообновления.
 */
export function useNews(category?: string, locale?: string) {
  return useQuery<NewsResponse>({
    queryKey: ["news", category, locale],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "all") params.set("category", category);
      if (locale) params.set("lng", locale);
      params.set("count", "20");

      const res = await fetch(`/api/news?${params}`);
      if (!res.ok) throw new Error("Failed to fetch news");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

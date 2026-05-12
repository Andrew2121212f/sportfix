"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse, SportEvent } from "@/types/api";

export function usePrematchEvents(sportIds?: string, lng = "en") {
  return useQuery<ApiListResponse<SportEvent>>({
    queryKey: ["prematch-events", sportIds, lng],
    queryFn: async () => {
      const params = new URLSearchParams({ lng, count: "50" });
      if (sportIds) params.set("sportIds", sportIds);
      const res = await fetch(`/api/events/prematch?${params}`);
      if (!res.ok) throw new Error("Failed to fetch prematch events");
      return res.json();
    },
    staleTime: 20000,
    refetchInterval: 60000,
  });
}

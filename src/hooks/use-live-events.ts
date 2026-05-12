"use client";

import { useQuery } from "@tanstack/react-query";
import type { ApiListResponse, LiveSportEvent } from "@/types/api";

export function useLiveEvents(sportIds?: string, lng = "en") {
  return useQuery<ApiListResponse<LiveSportEvent>>({
    queryKey: ["live-events", sportIds, lng],
    queryFn: async () => {
      const params = new URLSearchParams({ lng, count: "50" });
      if (sportIds) params.set("sportIds", sportIds);
      const res = await fetch(`/api/events/live?${params}`);
      if (!res.ok) throw new Error("Failed to fetch live events");
      return res.json();
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

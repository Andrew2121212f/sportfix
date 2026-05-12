"use client";

import { useQuery } from "@tanstack/react-query";
import type { EventDetailResponse } from "@/types/api";

type EventType = "live" | "prematch" | undefined;

/**
 * Хук для получения деталей события.
 * Live матчи — поллинг каждые 7 секунд; prematch — без поллинга.
 */
export function useEventDetail(
  id: string,
  type: EventType,
  locale: string,
  initialData?: EventDetailResponse
) {
  return useQuery<EventDetailResponse>({
    queryKey: ["event-detail", id, type, locale],
    queryFn: async () => {
      const params = new URLSearchParams({ lng: locale });
      if (type) params.set("type", type);
      const res = await fetch(`/api/events/${id}?${params}`);
      if (!res.ok) throw new Error("Failed to fetch event detail");
      return res.json();
    },
    refetchInterval: type === "live" ? 7000 : false,
    staleTime: type === "live" ? 3000 : 30_000,
    initialData,
  });
}

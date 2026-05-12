import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLiveEventDetail, getPrematchEventDetail } from "@/lib/api-client";
import type { EventDetailResponse } from "@/types/api";
import EventClient from "./event-client";

type EventType = "live" | "prematch";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ type?: EventType }>;
}

/**
 * Server-side получение деталей события.
 * Если type указан — бьём в нужный источник.
 * Иначе — параллельно в оба, берём первый успешный.
 */
async function fetchEventDetail(
  sportEventId: number,
  type: EventType | undefined,
  locale: string
): Promise<EventDetailResponse | null> {
  if (type === "live") {
    const data = await getLiveEventDetail({ sportEventId, lng: locale });
    return data ? { source: "live", data } : null;
  }
  if (type === "prematch") {
    const data = await getPrematchEventDetail({ sportEventId, lng: locale });
    return data ? { source: "prematch", data } : null;
  }

  const [liveResult, prematchResult] = await Promise.allSettled([
    getLiveEventDetail({ sportEventId, lng: locale }),
    getPrematchEventDetail({ sportEventId, lng: locale }),
  ]);

  if (liveResult.status === "fulfilled" && liveResult.value) {
    return { source: "live", data: liveResult.value };
  }
  if (prematchResult.status === "fulfilled" && prematchResult.value) {
    return { source: "prematch", data: prematchResult.value };
  }
  return null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const { type } = await searchParams;
  const sportEventId = parseInt(id, 10);
  if (Number.isNaN(sportEventId)) return { title: "Event" };

  const result = await fetchEventDetail(sportEventId, type, locale);
  if (!result) return { title: "Event" };

  const { data } = result;
  const team1 = data.opponent1NameLocalization || "Team 1";
  const team2 = data.opponent2NameLocalization || "Team 2";
  const tournament = data.tournamentNameLocalization || "";
  const title = `${team1} vs ${team2}`;
  const description = tournament ? `${title} — ${tournament}` : title;

  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function EventDetailPage({ params, searchParams }: PageProps) {
  const { locale, id } = await params;
  const { type } = await searchParams;
  const sportEventId = parseInt(id, 10);
  if (Number.isNaN(sportEventId)) notFound();

  const initialData = await fetchEventDetail(sportEventId, type, locale);
  if (!initialData) notFound();

  return <EventClient id={id} type={type} locale={locale} initialData={initialData} />;
}

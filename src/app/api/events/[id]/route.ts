import { NextRequest } from "next/server";
import { getLiveEventDetail, getPrematchEventDetail } from "@/lib/api-client";
import type { EventDetailResponse } from "@/types/api";

/**
 * GET /api/events/[id]?type=live|prematch&lng=en
 *
 * Если type указан — бьём сразу в нужный источник.
 * Если type не указан (например, прямой URL) — параллельный запрос в оба
 * эндпоинта, берём первый успешный ответ. Дедупликация на уровне TTL-кэша
 * (live = 5s, prematch = 20s) защищает от лишней нагрузки.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sportEventId = parseInt(id, 10);
  if (Number.isNaN(sportEventId)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") as "live" | "prematch" | null;
  const lng = searchParams.get("lng") || "en";

  try {
    if (type === "live") {
      const data = await getLiveEventDetail({ sportEventId, lng });
      if (!data) return Response.json({ error: "Not found" }, { status: 404 });
      const response: EventDetailResponse = { source: "live", data };
      return Response.json(response);
    }
    if (type === "prematch") {
      const data = await getPrematchEventDetail({ sportEventId, lng });
      if (!data) return Response.json({ error: "Not found" }, { status: 404 });
      const response: EventDetailResponse = { source: "prematch", data };
      return Response.json(response);
    }

    // type не указан — пробуем оба источника параллельно
    const [liveResult, prematchResult] = await Promise.allSettled([
      getLiveEventDetail({ sportEventId, lng }),
      getPrematchEventDetail({ sportEventId, lng }),
    ]);

    if (liveResult.status === "fulfilled" && liveResult.value) {
      const response: EventDetailResponse = { source: "live", data: liveResult.value };
      return Response.json(response);
    }
    if (prematchResult.status === "fulfilled" && prematchResult.value) {
      const response: EventDetailResponse = { source: "prematch", data: prematchResult.value };
      return Response.json(response);
    }

    return Response.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    console.error("[event detail API] Error:", error);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}

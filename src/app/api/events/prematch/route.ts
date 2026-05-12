import { NextRequest } from "next/server";
import { getPrematchEvents } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sportIds = searchParams.get("sportIds") || undefined;
    const tournamentIds = searchParams.get("tournamentIds") || undefined;
    const lng = searchParams.get("lng") || "en";
    const count = parseInt(searchParams.get("count") || "50", 10);

    const data = await getPrematchEvents({ sportIds, tournamentIds, lng, count });
    return Response.json(data);
  } catch (error) {
    console.error("Prematch events API error:", error);
    return Response.json(
      { count: 0, items: [] },
      { status: 200 }
    );
  }
}

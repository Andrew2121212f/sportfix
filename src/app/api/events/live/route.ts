import { NextRequest } from "next/server";
import { getLiveEvents } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sportIds = searchParams.get("sportIds") || undefined;
    const lng = searchParams.get("lng") || "en";
    const count = parseInt(searchParams.get("count") || "50", 10);

    const data = await getLiveEvents({ sportIds, lng, count });
    return Response.json(data);
  } catch (error) {
    console.error("Live events API error:", error);
    return Response.json(
      { count: 0, items: [] },
      { status: 200 }
    );
  }
}

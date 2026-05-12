import { NextRequest } from "next/server";
import { getResults } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lng = searchParams.get("lng") || "en";
    const sportId = parseInt(searchParams.get("sportId") || "1", 10);

    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - 86400;

    const data = await getResults({ dateFrom: yesterday, dateTo: now, sportId, lng });
    return Response.json(data);
  } catch (error) {
    console.error("Results tournaments API error:", error);
    return Response.json(
      { count: 0, items: [] },
      { status: 200 }
    );
  }
}

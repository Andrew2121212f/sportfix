import { NextRequest } from "next/server";
import { getResultSports } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const lng = searchParams.get("lng") || "en";

    const now = Math.floor(Date.now() / 1000);
    const yesterday = now - 86400;

    const data = await getResultSports({ dateFrom: yesterday, dateTo: now, lng });
    return Response.json(data);
  } catch (error) {
    console.error("Results sports API error:", error);
    return Response.json(
      { count: 0, items: [] },
      { status: 200 }
    );
  }
}

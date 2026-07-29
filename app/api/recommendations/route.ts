import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendations";

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const limitParam = request.nextUrl.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 4;

  if (Number.isNaN(limit) || limit < 1 || limit > 8) {
    return NextResponse.json({ error: "limit must be between 1 and 8" }, { status: 400 });
  }

  const recommendations = getRecommendations(productId, limit);
  return NextResponse.json({ recommendations });
}

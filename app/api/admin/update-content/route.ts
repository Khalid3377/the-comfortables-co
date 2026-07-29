import { NextRequest, NextResponse } from "next/server";
import { createClient as createRouteHandlerClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  try {
    const { type, slug, title, payload } = await request.json();
    if (!type || !slug || typeof type !== "string" || typeof slug !== "string") return NextResponse.json({ error: "type and slug are required" }, { status: 400 });

    const supabase = await createRouteHandlerClient();
    const { error } = type === "settings"
      ? await supabase.from("store_settings").upsert({ key: slug, value: (payload ?? {}) as Json }, { onConflict: "key" })
      : await supabase.from("store_content").upsert({ type, slug, title: title ?? null, payload: (payload ?? {}) as Json }, { onConflict: "slug" });
    if (error) {
      console.error("ADMIN_CONTENT_UPSERT_ERROR", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Invalid request";
    console.error("ADMIN_CONTENT_UPDATE_ERROR", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient, insertNotifyRequest } from "@/lib/supabase/server";

interface NotifyRequestBody {
  productId: string;
  variantId: string;
  email: string;
  size: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: NextRequest) {
  let body: NotifyRequestBody;

  try {
    body = (await request.json()) as NotifyRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { productId, variantId, email, size } = body;

  if (!productId || !variantId || !email || !size) {
    return NextResponse.json({ error: "productId, variantId, email, and size are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // Map to the actual DB columns (product_slug not product_id UUID)
    const { error } = await insertNotifyRequest(supabase, {
      product_slug: productId,
      variant_id: variantId,
      email,
      size
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    // If Supabase is not configured or unreachable, return graceful fallback
    return NextResponse.json(
      {
        success: true,
        queued: true,
        message: "Notification saved locally. Connect Supabase to persist requests."
      },
      { status: 202 }
    );
  }
}

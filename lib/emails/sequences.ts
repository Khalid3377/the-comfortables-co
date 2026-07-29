// lib/emails/sequences.ts
// Post-purchase email sequence using Resend SDK
// Install: npm install resend

export interface OrderEmailPayload {
  to: string;
  customerName: string;
  orderId: string;
  orderTotal: number;
  productName: string;
  productSlug: string;
  trackingUrl?: string;
  discountCode?: string;
  creditBalance?: number;
}

// ─── Resend client (lazy init to avoid build errors without RESEND_API_KEY) ──
function getResend() {
  // Dynamic import avoids crashing when Resend isn't installed yet
  // Replace this with: import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // return resend;
  throw new Error("Resend not configured. Set RESEND_API_KEY and install the resend package.");
}

const FROM_EMAIL = "comfort@thecomfortables.co";

// ─── Template helpers ──────────────────────────────────────────────────────────
function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #FAFAF7; color: #2B2B2B; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: #2E6F68; padding: 32px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 20px; font-weight: 700; margin: 0; letter-spacing: 0.05em; }
    .header p { color: #C9B79C; font-size: 12px; margin: 6px 0 0; }
    .body { padding: 40px; }
    .cta { display: inline-block; background: #2E6F68; color: #ffffff; text-decoration: none; border-radius: 100px; padding: 14px 28px; font-weight: 700; font-size: 14px; margin-top: 24px; }
    .muted { color: #6E6E6E; font-size: 13px; line-height: 1.7; }
    .footer { background: #f4f1eb; padding: 24px 40px; text-align: center; font-size: 11px; color: #6E6E6E; }
    .divider { border: none; border-top: 1px solid #EAEAEA; margin: 24px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>The Comfortable Co.</h1>
      <p>Comfort that cares.</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      © 2025 The Comfortable Co. · <a href="https://thecomfortables.co/privacy" style="color:#2E6F68;">Privacy Policy</a>
      <br />Made with care in India 🌿
    </div>
  </div>
</body>
</html>`;
}

// ─── ORDER_CONFIRMED — immediate ───────────────────────────────────────────────
export async function sendOrderConfirmed(payload: OrderEmailPayload): Promise<void> {
  const resend = getResend() as never; // replace with actual Resend instance
  const html = baseLayout(`
    <h2 style="font-size:26px;font-weight:700;margin:0 0 8px;">Your comfort is on its way 🌿</h2>
    <p class="muted">Hi ${payload.customerName}, thank you for your order! We're preparing your ${payload.productName} with care.</p>
    <hr class="divider" />
    <p style="font-size:13px;"><strong>Order ID:</strong> ${payload.orderId}</p>
    <p style="font-size:13px;"><strong>Total:</strong> ₹${payload.orderTotal.toLocaleString("en-IN")}</p>
    <hr class="divider" />
    <p style="font-weight:700;margin-bottom:8px;">Fabric care guide</p>
    <ul class="muted">
      <li>Machine wash cold (30°C max) on gentle cycle</li>
      <li>Do not tumble dry — air dry flat to preserve shape</li>
      <li>Do not bleach or iron directly on bamboo fabric</li>
      <li>Wash inside-out to preserve colour and hand-feel</li>
    </ul>
    <a href="${payload.trackingUrl ?? "https://thecomfortables.co/account"}" class="cta">Track your order →</a>
  `);

  await (resend as { emails: { send: (opts: unknown) => Promise<void> } }).emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    subject: "Your comfort is on its way 🌿",
    html,
  });
}

// ─── DAY_3 — 3 days after order ───────────────────────────────────────────────
export async function sendDay3(payload: OrderEmailPayload): Promise<void> {
  const resend = getResend() as never;
  const html = baseLayout(`
    <h2 style="font-size:26px;font-weight:700;margin:0 0 8px;">How's the comfort treating you?</h2>
    <p class="muted">Hi ${payload.customerName}, your ${payload.productName} should have arrived by now. We hope you love how it feels.</p>
    <hr class="divider" />
    <p style="font-weight:700;margin-bottom:8px;">Tips for first wear</p>
    <ul class="muted">
      <li>The bamboo blend softens further after the first 2–3 washes</li>
      <li>For fitted styles, wear it once before judging the fit — it adapts to your shape</li>
      <li>Notice the temperature regulation — bamboo micro-gaps keep you cool naturally</li>
    </ul>
    <p class="muted" style="margin-top:16px;">Loved it? Your review helps other comfort seekers find the right piece.</p>
    <a href="https://thecomfortables.co/product/${payload.productSlug}#reviews" class="cta">Leave a review →</a>
  `);

  await (resend as { emails: { send: (opts: unknown) => Promise<void> } }).emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    subject: "How's the comfort treating you?",
    html,
  });
}

// ─── DAY_7 — 7 days after delivery ────────────────────────────────────────────
export async function sendDay7(payload: OrderEmailPayload): Promise<void> {
  const resend = getResend() as never;
  const html = baseLayout(`
    <h2 style="font-size:26px;font-weight:700;margin:0 0 8px;">Earn 50 Comfort Credits for your review</h2>
    <p class="muted">Hi ${payload.customerName}, we'd love to hear what you think of your ${payload.productName}.</p>
    <hr class="divider" />
    <div style="background:#E1F5EE;border-radius:12px;padding:20px 24px;text-align:center;margin:16px 0;">
      <p style="font-size:32px;font-weight:700;color:#2E6F68;margin:0;">50</p>
      <p style="color:#2E6F68;font-size:13px;font-weight:600;margin:4px 0 0;">Comfort Credits</p>
      <p style="color:#6E6E6E;font-size:12px;margin:8px 0 0;">Earned when you leave a verified review · worth ₹5</p>
    </div>
    ${payload.creditBalance !== undefined ? `<p class="muted">Your current balance: <strong>${payload.creditBalance} credits</strong></p>` : ""}
    <p class="muted">100 credits = ₹10 off your next order. Credits never expire.</p>
    <a href="https://thecomfortables.co/product/${payload.productSlug}#reviews" class="cta">Write your review →</a>
  `);

  await (resend as { emails: { send: (opts: unknown) => Promise<void> } }).emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    subject: "Earn 50 Comfort Credits for your review",
    html,
  });
}

// ─── DAY_30 — 30 days after purchase ──────────────────────────────────────────
export async function sendDay30(payload: OrderEmailPayload): Promise<void> {
  const resend = getResend() as never;
  const html = baseLayout(`
    <h2 style="font-size:26px;font-weight:700;margin:0 0 8px;">Your next comfort piece is waiting</h2>
    <p class="muted">Hi ${payload.customerName}, it's been a month since you got your ${payload.productName}. Time to complete the set?</p>
    <hr class="divider" />
    <div style="background:#2E6F68;border-radius:12px;padding:24px;text-align:center;color:#fff;margin:16px 0;">
      <p style="font-size:13px;font-weight:600;color:#C9B79C;margin:0 0 8px;letter-spacing:0.1em;text-transform:uppercase;">Exclusive offer — valid 7 days</p>
      <p style="font-size:36px;font-weight:700;margin:0;">₹200 off</p>
      <p style="font-size:13px;margin:8px 0 0;opacity:0.85;">your next order</p>
      <div style="margin-top:16px;background:rgba(255,255,255,0.15);border-radius:8px;padding:10px 20px;display:inline-block;">
        <p style="font-size:16px;font-weight:700;letter-spacing:0.15em;margin:0;">${payload.discountCode ?? "COMFORT200"}</p>
      </div>
    </div>
    <p class="muted">Browse our new arrivals and use the code above at checkout.</p>
    <a href="https://thecomfortables.co/shop?discount=${payload.discountCode ?? "COMFORT200"}" class="cta">Shop now →</a>
  `);

  await (resend as { emails: { send: (opts: unknown) => Promise<void> } }).emails.send({
    from: FROM_EMAIL,
    to: payload.to,
    subject: "Your next comfort piece is waiting",
    html,
  });
}

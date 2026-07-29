const SECRET = process.env.ADMIN_PASSWORD || "admin123";

async function hmac(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyBuf = encoder.encode(key);
  const messageBuf = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuf,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigBuf = await crypto.subtle.sign("HMAC", cryptoKey, messageBuf);

  return Array.from(new Uint8Array(sigBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(): Promise<string> {
  const payload = {
    role: "admin",
    exp: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = btoa(payloadStr);
  const signature = await hmac(payloadStr, SECRET);
  return `${payloadB64}.${signature}`;
}

export async function verifySession(token: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  
  const [payloadB64, signature] = parts;
  try {
    const payloadStr = atob(payloadB64);
    const expectedSignature = await hmac(payloadStr, SECRET);
    if (signature !== expectedSignature) return false;
    
    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return false;
    
    return true;
  } catch (e) {
    return false;
  }
}

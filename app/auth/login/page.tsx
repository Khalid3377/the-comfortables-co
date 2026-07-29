"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
type LoginMethod = "options" | "email" | "phone" | "otp";
type Status = "idle" | "loading" | "error" | "success";

// ─── Icons ───────────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─── OTP Box ─────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  useEffect(() => {
    setTimeout(() => refs.current[0]?.focus(), 50);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = char;
    onChange(newDigits.join("").slice(0, 6));
    if (idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      if (digits[idx]) {
        newDigits[idx] = "";
        onChange(newDigits.join(""));
      } else if (idx > 0) {
        newDigits[idx - 1] = "";
        onChange(newDigits.join(""));
        refs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      e.preventDefault();
      refs.current[idx + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    const focusIndex = pasted.length > 0 ? Math.min(pasted.length - 1, 5) : 0;
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" role="group" aria-label="One-time password">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digits[i] || ""}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKey(e, i)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
          className="w-11 h-14 text-center font-mono text-xl font-bold border-2 rounded-xl bg-[#FAFAF7] text-[#2B2B2B] border-[#EAEAEA] focus:border-[#2E6F68] focus:ring-2 focus:ring-[#2E6F68]/20 outline-none transition-all select-none"
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("next") ?? searchParams.get("redirectTo") ?? "/account";

  const supabase = createClient();

  const [method, setMethod] = useState<LoginMethod>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  const formatPhone = (raw: string) => {
    const cleaned = raw.replace(/[^\d+]/g, "");
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  const isValidPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  const handlePhoneChange = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, "");
    if (!cleaned.startsWith("+")) cleaned = `+${cleaned}`;
    setPhone(cleaned.slice(0, 16));
  };

  const handleGoogleLogin = async () => {
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      }
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatPhone(phone);
    if (!isValidPhone(formatted)) {
      setStatus("error");
      setMessage("Please enter a valid number in E.164 format, e.g. +919876543210");
      return;
    }

    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage(`OTP sent to ${formatted}`);
      setMethod("otp");
      setResendTimer(60);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return;
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.verifyOtp({
      phone: formatPhone(phone),
      token: otp,
      type: "sms"
    });
    if (error) {
      setStatus("error");
      setMessage("Invalid or expired verification code. Please check and try again.");
    } else {
      setStatus("success");
      setMessage("Verified! Redirecting…");
      router.push(redirectTo);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ── Left Panel (hidden on mobile) ─────────────────────────────── */}
      <div className="hidden lg:flex w-[40%] relative bg-[#2E6F68] overflow-hidden flex-col justify-between p-12">
        <Link href="/" className="relative z-10">
          <span className="font-bold text-white text-2xl tracking-tight">
            The Comfortables Co.
          </span>
        </Link>
        <div className="relative z-10">
          <blockquote className="text-white text-3xl font-bold leading-tight mb-8">
            &ldquo;Wear what feels right —<br/>inside and out.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              <span>Sustainably sourced materials</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              <span>Designed for everyday comfort</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              <span>Free shipping on every order</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Auth Form ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white relative">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block mb-12 text-center">
            <span className="text-[#2B2B2B] text-xl font-bold">The Comfortables Co.</span>
          </Link>

          <div className="mb-8">
            {method !== "options" && (
              <button
                onClick={() => { setMethod("options"); setStatus("idle"); setMessage(""); }}
                className="flex items-center gap-1.5 text-[#6E6E6E] text-sm mb-4 hover:text-[#2B2B2B] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
            <h1 className="text-[32px] font-bold text-[#2B2B2B] tracking-tight" style={{ fontFamily: "Inter Tight, sans-serif" }}>
              {method === "otp" ? "Enter your code" : "Welcome back"}
            </h1>
            <p className="text-[#6E6E6E] text-[14px] mt-2">
              {method === "otp" 
                ? `We sent a code to ${formatPhone(phone)}`
                : "Sign in to your account"
              }
            </p>
          </div>

          {message && (
            <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm mb-6 ${
              status === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
            }`}>
              {status === "error" ? (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              <span>{message}</span>
            </div>
          )}

          {method === "options" && (
            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#EAEAEA] rounded-lg font-medium text-[15px] text-[#2B2B2B] bg-white hover:bg-[#FAFAF7] transition-colors"
              >
                {status === "loading" ? <Spinner /> : <GoogleIcon />}
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-[1px] bg-[#EAEAEA]" />
                <span className="text-[#6E6E6E] text-xs font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-[1px] bg-[#EAEAEA]" />
              </div>

              <button
                onClick={() => { setMethod("email"); setStatus("idle"); setMessage(""); }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#EAEAEA] rounded-lg font-medium text-[15px] text-[#2B2B2B] bg-white hover:bg-[#FAFAF7] transition-colors"
              >
                <svg className="w-5 h-5 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                Continue with Email
              </button>

              <button
                onClick={() => { setMethod("phone"); setStatus("idle"); setMessage(""); }}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-[#EAEAEA] rounded-lg font-medium text-[15px] text-[#2B2B2B] bg-white hover:bg-[#FAFAF7] transition-colors"
              >
                <svg className="w-5 h-5 text-[#2B2B2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                Continue with Phone
              </button>
            </div>
          )}

          {method === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[13px] font-medium text-[#2B2B2B]">Password</label>
                  <Link href="/auth/forgot-password" className="text-[13px] font-medium text-[#2E6F68] hover:underline">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-11 bg-[#2E6F68] text-white font-medium text-[15px] rounded-lg hover:bg-[#23554e] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
              >
                {status === "loading" ? <Spinner /> : "Sign In"}
              </button>
            </form>
          )}

          {method === "phone" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Mobile Number</label>
                <div className="flex items-center h-11 rounded-lg border border-[#EAEAEA] focus-within:border-[#2E6F68] focus-within:ring-1 focus-within:ring-[#2E6F68] transition-colors overflow-hidden">
                  <span className="pl-3 pr-2 text-[#6E6E6E]">+</span>
                  <input
                    type="tel"
                    required
                    value={phone.replace(/^\+/, "")}
                    onChange={e => handlePhoneChange("+" + e.target.value)}
                    className="flex-1 h-full px-2 text-[#2B2B2B] text-[15px] outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={status === "loading" || !isValidPhone(phone)}
                className="w-full h-11 bg-[#2E6F68] text-white font-medium text-[15px] rounded-lg hover:bg-[#23554e] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
              >
                {status === "loading" ? <Spinner /> : "Send OTP"}
              </button>
            </form>
          )}

          {method === "otp" && (
            <div className="space-y-6">
              <OtpInput value={otp} onChange={setOtp} />
              <button
                onClick={handleVerifyOtp}
                disabled={status === "loading" || otp.length < 6}
                className="w-full h-11 bg-[#2E6F68] text-white font-medium text-[15px] rounded-lg hover:bg-[#23554e] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {status === "loading" ? <Spinner /> : "Verify Code"}
              </button>
              <div className="text-center text-[13px] text-[#6E6E6E]">
                {resendTimer > 0 ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <button onClick={handleSendOtp} className="text-[#2E6F68] font-medium hover:underline">Resend OTP</button>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-[14px] text-[#6E6E6E]">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#2E6F68] font-medium hover:underline">
              Create Account &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "phone" | "otp";
type Status = "idle" | "loading" | "error" | "success";

// ─── Google Icon ─────────────────────────────────────────────────────────────
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

// ─── OTP Box ─────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  // Autofocus the first box on mount/step change
  useEffect(() => {
    setTimeout(() => {
      refs.current[0]?.focus();
    }, 50);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;
    
    // Use only the last typed character
    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = char;
    
    const combined = newDigits.join("").slice(0, 6);
    onChange(combined);

    // Focus next input box
    if (idx < 5) {
      refs.current[idx + 1]?.focus();
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];
      
      if (digits[idx]) {
        // If current box has character, clear it
        newDigits[idx] = "";
        onChange(newDigits.join(""));
      } else if (idx > 0) {
        // Otherwise clear previous box and focus it
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
    
    // Focus the last filled box, or the first box if empty
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
          aria-label={`Digit ${i + 1}`}
          className="
            w-11 h-14 text-center font-mono text-xl font-bold
            border-2 rounded-xl bg-white text-brand-ink
            border-brand-border focus:border-brand-teal focus:ring-2
            focus:ring-brand-teal/20 outline-none transition-all
            select-none
          "
        />
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PhoneAuth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/account";

  const supabase = createClient();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setTimeout(() => setResendTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [resendTimer]);

  // ── E.164 normaliser — works for any country code ──────────────────────────
  // Accepts: +919876543210  +14787788252  919876543210  9876543210
  const formatPhone = (raw: string): string => {
    // Strip everything except digits and a leading +
    const cleaned = raw.replace(/[^\d+]/g, "");
    // Ensure it starts with +
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  };

  // Returns true when the number has the right digit count for E.164 (7–15 digits after +)
  const isValidPhone = (raw: string): boolean => {
    const digits = raw.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
  };

  // Handle typing in the phone box — keeps the leading + at all times
  const handlePhoneChange = (value: string) => {
    // Strip all non-numeric except leading +
    let cleaned = value.replace(/[^\d+]/g, "");
    // Always ensure a leading +
    if (!cleaned.startsWith("+")) cleaned = `+${cleaned}`;
    // Limit to + followed by 15 digits max
    const plusPart = cleaned.slice(0, 16); // +  + 15 digits
    setPhone(plusPart);
  };

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`
      }
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
    // On success, browser is redirected automatically
  };

  // ── Send OTP ─────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    const formatted = formatPhone(phone);
    if (!isValidPhone(formatted)) {
      setStatus("error");
      setMessage("Please enter a valid number in E.164 format, e.g. +919876543210 or +14787788252");
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
      setStep("otp");
      setResendTimer(60);
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────────────────
  const handleVerifyOtp = async () => {
    if (otp.length < 6) {
      setStatus("error");
      setMessage("Please enter the full 6-digit code.");
      return;
    }
    setStatus("loading");
    setMessage("");
    const { error } = await supabase.auth.verifyOtp({
      phone: formatPhone(phone),
      token: otp,
      type: "sms"
    });
    if (error) {
      setStatus("error");
      
      const errMsg = error.message.toLowerCase();
      if (
        errMsg.includes("expired") ||
        errMsg.includes("invalid") ||
        errMsg.includes("session missing") ||
        errMsg.includes("token") ||
        errMsg.includes("incorrect")
      ) {
        setMessage("Invalid or expired verification code. Please check the code and try again.");
      } else {
        setMessage(error.message);
      }
    } else {
      setStatus("success");
      setMessage("Verified! Redirecting…");
      router.push(redirectTo);
      router.refresh();
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp("");
    await handleSendOtp();
  };

  // ── Spinner ───────────────────────────────────────────────────────────────────
  const Spinner = () => (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-brand-paper flex">
      {/* ── Left decorative panel (desktop only) ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-brand-teal overflow-hidden flex-col justify-between p-12">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 30% 40%, #ffffff 1px, transparent 1px),
                            radial-gradient(circle at 70% 60%, #ffffff 1px, transparent 1px),
                            radial-gradient(circle at 50% 80%, #ffffff 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
        {/* Top logo */}
        <Link href="/" className="relative z-10">
          <span className="font-display text-white text-2xl font-bold tracking-tight">
            The Comfortables Co.
          </span>
        </Link>
        {/* Middle quote */}
        <div className="relative z-10">
          <blockquote className="text-white/90 font-editorial text-3xl leading-snug mb-6">
            &ldquo;Wear what feels right — inside and out.&rdquo;
          </blockquote>
          <div className="flex flex-col gap-3">
            {[
              "🌿 Sustainably sourced materials",
              "🤍 Designed for everyday comfort",
              "📦 Free shipping on every order"
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-white/80 text-sm">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom tag */}
        <p className="relative z-10 text-white/50 text-xs">
          © {new Date().getFullYear()} The Comfortables Co.
        </p>
      </div>

      {/* ── Right: Auth form ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block mb-8 text-center">
            <span className="font-display text-brand-ink text-xl font-bold">The Comfortables Co.</span>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lift border border-brand-border p-8">

            {/* Header */}
            <div className="mb-6">
              {step === "otp" ? (
                <button
                  onClick={() => { setStep("phone"); setOtp(""); setStatus("idle"); setMessage(""); }}
                  className="flex items-center gap-1.5 text-brand-muted text-sm mb-4 hover:text-brand-ink transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : null}
              <h1 className="font-display text-2xl font-bold text-brand-ink">
                {step === "phone" ? "Welcome back" : "Enter your code"}
              </h1>
              <p className="text-brand-muted text-sm mt-1">
                {step === "phone"
                  ? "Sign in to your account"
                  : `We sent a 6-digit code to ${formatPhone(phone)}`
                }
              </p>
            </div>

            {/* ── Status Banner ───────────────────────────────────────────────── */}
            {message && (
              <div className={`
                flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm mb-5 border
                ${status === "error"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
                }
              `}>
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  {status === "error"
                    ? <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    : <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  }
                </svg>
                <span>{message}</span>
              </div>
            )}

            {step === "phone" ? (
              <>
                {/* ── Google OAuth Button ───────────────────────────────────── */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={status === "loading"}
                  className="
                    w-full flex items-center justify-center gap-3 py-3 px-4
                    border-2 border-brand-border rounded-xl font-semibold text-sm
                    text-brand-ink bg-white hover:bg-brand-paper hover:border-brand-teal/40
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-brand-teal/30
                  "
                >
                  {status === "loading" ? <Spinner /> : <GoogleIcon />}
                  Continue with Google
                </button>

                {/* ── Divider ───────────────────────────────────────────────── */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-brand-border" />
                  <span className="text-brand-muted text-xs font-medium">or use your phone</span>
                  <div className="flex-1 h-px bg-brand-border" />
                </div>

                {/* ── Phone Input ───────────────────────────────────────────── */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-brand-ink mb-1.5">
                      Mobile Number
                    </label>
                    <div className={`
                      flex items-center rounded-xl border-2 overflow-hidden transition-all
                      focus-within:ring-2 focus-within:ring-brand-teal/20
                      ${
                        phone.length > 1 && !isValidPhone(phone)
                          ? "border-red-300 focus-within:border-red-400"
                          : phone.length > 1 && isValidPhone(phone)
                            ? "border-emerald-400 focus-within:border-emerald-500"
                            : "border-brand-border focus-within:border-brand-teal"
                      }
                    `}>
                      {/* Static + indicator */}
                      <div className="flex items-center pl-4 pr-1 bg-white text-brand-muted text-sm font-mono select-none">
                        +
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        value={phone.replace(/^\+/, "")}
                        onChange={e => handlePhoneChange("+" + e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                        placeholder="919876543210"
                        maxLength={15}
                        className="flex-1 px-2 py-3 text-sm font-mono text-brand-ink placeholder:text-brand-muted/40 outline-none bg-white"
                        autoComplete="tel"
                        aria-describedby="phone-hint"
                      />
                      {/* Inline validity icon */}
                      {phone.length > 1 && (
                        <div className="pr-3">
                          {isValidPhone(phone) ? (
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <p id="phone-hint" className="text-xs text-brand-muted mt-1.5">
                      Include your country code — e.g.{" "}
                      <button type="button" onClick={() => setPhone("+91")} className="font-semibold text-brand-teal hover:underline">+91</button>
                      {" for India, "}
                      <button type="button" onClick={() => setPhone("+1")} className="font-semibold text-brand-teal hover:underline">+1</button>
                      {" for US/CA"}
                    </p>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={status === "loading" || !isValidPhone(phone)}
                    className="
                      w-full py-3 rounded-xl bg-brand-teal text-white font-bold text-sm
                      hover:bg-brand-teal-light transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-brand-teal/40
                      flex items-center justify-center gap-2
                    "
                  >
                    {status === "loading" ? (
                      <><Spinner /> Sending…</>
                    ) : (
                      "Send OTP →"
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* ── OTP Step ──────────────────────────────────────────────── */}
                <div className="space-y-6">
                  <OtpInput value={otp} onChange={setOtp} />

                  <button
                    onClick={handleVerifyOtp}
                    disabled={status === "loading" || otp.length < 6}
                    className="
                      w-full py-3 rounded-xl bg-brand-teal text-white font-bold text-sm
                      hover:bg-brand-teal-light transition-all duration-200
                      disabled:opacity-40 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-brand-teal/40
                      flex items-center justify-center gap-2
                    "
                  >
                    {status === "loading" ? (
                      <><Spinner /> Verifying…</>
                    ) : (
                      "Verify & Log In"
                    )}
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    <p className="text-brand-muted text-sm">
                      Didn&apos;t receive the code?{" "}
                      {resendTimer > 0 ? (
                        <span className="font-semibold text-brand-ink">
                          Resend in {resendTimer}s
                        </span>
                      ) : (
                        <button
                          onClick={handleResend}
                          className="font-semibold text-brand-teal hover:underline focus:outline-none"
                        >
                          Resend OTP
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            <p className="text-center text-xs text-brand-muted mt-6 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link href="/privacy" className="text-brand-teal hover:underline">Privacy Policy</Link>
              {" "}and{" "}
              <Link href="/returns" className="text-brand-teal hover:underline">Terms of Use</Link>.
            </p>
          </div>

          {/* Back to shop */}
          <div className="text-center mt-6">
            <Link
              href="/shop"
              className="text-brand-muted text-sm hover:text-brand-ink transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Continue shopping without signing in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

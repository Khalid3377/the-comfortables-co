"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Icons ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }
    
    setStatus("loading");
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone
        }
      }
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      // Check if email confirmation is required (user identity usually null if required and not confirmed)
      if (data.user?.identities?.length === 0) {
        setMessage("Check your email to confirm your account");
      } else {
        setMessage("Account created! Redirecting to dashboard...");
        setTimeout(() => {
          router.push("/account");
          router.refresh();
        }, 1500);
      }
    }
  };

  // Basic password strength logic
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const strengthColor = 
    strength === 0 ? "bg-[#EAEAEA]" :
    strength <= 2 ? "bg-red-500" :
    strength === 3 ? "bg-orange-500" : "bg-emerald-500";
    
  const strengthText =
    strength === 0 ? "" :
    strength <= 2 ? "Weak" :
    strength === 3 ? "Fair" : "Strong";

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
        <div className="w-full max-w-[440px]">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block mb-12 text-center">
            <span className="text-[#2B2B2B] text-xl font-bold">The Comfortables Co.</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-[#2B2B2B] tracking-tight" style={{ fontFamily: "Inter Tight, sans-serif" }}>
              Create your account
            </h1>
            <p className="text-[#6E6E6E] text-[14px] mt-2">
              Join thousands of comfort lovers
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

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
              />
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#EAEAEA] rounded-full overflow-hidden">
                  <div className={`h-full ${strengthColor} transition-all duration-300`} style={{ width: `${(strength / 4) * 100}%` }} />
                </div>
                <span className="text-[11px] font-medium text-[#6E6E6E] w-10">{strengthText}</span>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#2B2B2B] mb-1.5">Confirm Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full h-11 rounded-lg border border-[#EAEAEA] px-3 text-[#2B2B2B] text-[15px] focus:border-[#2E6F68] focus:ring-1 focus:ring-[#2E6F68] outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="w-full h-11 bg-[#2E6F68] text-white font-medium text-[15px] rounded-lg hover:bg-[#23554e] transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
            >
              {status === "loading" ? <Spinner /> : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-[14px] text-[#6E6E6E]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#2E6F68] font-medium hover:underline">
              Sign In &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

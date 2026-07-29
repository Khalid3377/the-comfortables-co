"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { KeyRound } from "lucide-react";

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
    } else {
      setStatus("success");
      setMessage("Reset link sent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF7] font-sans p-6">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-sm border border-[#EAEAEA] p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-[#F0F7F5] rounded-full flex items-center justify-center mb-6">
          <KeyRound className="w-6 h-6 text-[#2E6F68]" />
        </div>
        
        <h1 className="text-[24px] font-bold text-[#2B2B2B] tracking-tight mb-2" style={{ fontFamily: "Inter Tight, sans-serif" }}>
          Reset Password
        </h1>
        <p className="text-[#6E6E6E] text-[14px] mb-8">
          Enter your email and we'll send you a reset link
        </p>

        {message && (
          <div className={`flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm mb-6 text-left ${
            status === "error" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
          }`}>
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4 text-left">
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

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full h-11 bg-[#2E6F68] text-white font-medium text-[15px] rounded-lg hover:bg-[#23554e] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {status === "loading" ? <Spinner /> : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-8 text-[14px]">
          <Link href="/auth/login" className="text-[#6E6E6E] font-medium hover:text-[#2E6F68] transition-colors">
            &larr; Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Admin Login | The Comfortable Co.",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper dark:bg-black p-4">
      <div className="w-full max-w-md rounded-brand border border-brand-border bg-white p-8 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-brand-ink dark:text-white">
          Admin Portal
        </h1>
        <p className="mt-2 text-sm text-brand-muted dark:text-white/60">
          Enter your password to access store management.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}

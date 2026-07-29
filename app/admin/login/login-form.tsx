"use client";

import { useActionState, useTransition } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mt-2 w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-3 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      {state?.error && (
        <div className="rounded-brand bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-brand-teal py-3 font-semibold text-white transition hover:bg-brand-teal-light disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

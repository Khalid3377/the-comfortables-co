"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="focus-ring grid h-10 w-10 place-items-center rounded-brand border border-brand-border bg-white/70 text-brand-ink shadow-sm transition hover:border-brand-teal dark:bg-white/10 dark:text-white"
      onClick={() => setDark((value) => !value)}
      type="button"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

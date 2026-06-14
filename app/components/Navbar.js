'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isPremium, setIsPremium] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkPremium = () => {
      setIsPremium(localStorage.getItem('isPremium') === 'true');
    };
    checkPremium();
    window.addEventListener('premium-change', checkPremium);
    window.addEventListener('storage', checkPremium);
    return () => {
      window.removeEventListener('premium-change', checkPremium);
      window.removeEventListener('storage', checkPremium);
    };
  }, []);

  const isHomeActive = pathname === "/";
  const isPremiumActive = pathname === "/premium";

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/70">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className={`text-lg font-bold tracking-tight transition-colors ${
            isHomeActive
              ? "text-indigo-600 dark:text-indigo-400"
              : "text-zinc-900 hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
          }`}
        >
          ⚡ TechCart
        </Link>
        <div className="flex items-center gap-3">
          {mounted && isPremium ? (
            <>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Premium ✓
              </span>
              <Link
                href="/premium"
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isPremiumActive
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
                }`}
              >
                Manage Plan
              </Link>
            </>
          ) : (
            <Link
              href="/premium"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                isPremiumActive
                  ? "bg-indigo-700 text-white ring-2 ring-indigo-500/30"
                  : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm"
              }`}
            >
              Go Premium
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}


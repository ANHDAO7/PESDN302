"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useReadingLogContext } from "@/context/ReadingLogContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, setUser, clearReadingLogs } = useReadingLogContext();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setUser({ id: data.id, email: data.email });
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, [setUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    clearReadingLogs();
    router.push("/");
    router.refresh();
  };

  if (checking) {
    return (
      <header className="px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="font-semibold tracking-widest text-xs uppercase text-slate-700">
          READLOG
        </div>
      </header>
    );
  }

  return (
    <header className="px-6 sm:px-10 py-5 flex items-center justify-between max-w-7xl mx-auto relative z-40">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="font-bold tracking-tight text-xl text-slate-900 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-pink-400 to-sky-400 inline-block shadow-xs"></span>
          <span className="tracking-widest text-sm uppercase font-semibold">READLOG</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-[11px] font-semibold tracking-widest uppercase text-slate-600">
          <span className="hover:text-pink-600 cursor-pointer transition-colors">CORE</span>
          <span className="hover:text-pink-600 cursor-pointer transition-colors">PORTFOLIO</span>
          <span className="hover:text-pink-600 cursor-pointer transition-colors">UI KITS</span>
          <span className="hover:text-pink-600 cursor-pointer transition-colors">RESOURCES</span>
        </div>
      </div>

      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <span
              data-testid="user-email"
              className="text-xs font-medium text-slate-700 hidden sm:block bg-white/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200/50 shadow-xs"
            >
              {user.email}
            </span>
            <Link
              href="/reading-logs"
              data-testid="link-reading-logs"
              className="text-xs font-semibold tracking-wider uppercase text-slate-800 hover:text-pink-600 px-3 py-1.5 rounded-full border border-slate-300/60 bg-white/50 backdrop-blur-md shadow-2xs transition-all hover:bg-white"
            >
              Reading Logs
            </Link>
            <Button
              variant="outline"
              size="sm"
              data-testid="btn-logout"
              onClick={handleLogout}
              className="rounded-full text-xs font-semibold tracking-wider uppercase border-slate-300/60 bg-white/50 backdrop-blur-md hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 shadow-2xs"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              data-testid="btn-login"
              className="text-xs font-semibold tracking-wider uppercase text-slate-800 hover:text-pink-600 px-4 py-2 rounded-full border border-slate-900/10 bg-white/40 backdrop-blur-md shadow-2xs transition-all hover:bg-white/80"
            >
              Login
            </Link>
            <Link
              href="/register"
              data-testid="btn-register"
              className="text-xs font-semibold tracking-wider uppercase text-slate-900 px-4 py-2 rounded-full border border-pink-300/70 bg-gradient-to-r from-pink-100 via-rose-100 to-sky-100 hover:from-pink-200 hover:to-sky-200 shadow-xs transition-all"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

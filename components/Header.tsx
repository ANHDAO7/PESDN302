"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useReadingLogContext } from "@/context/ReadingLogContext";
import { Button, buttonVariants } from "@/components/ui/button";

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
      <header className="border-b bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl text-indigo-600">ReadLog</div>
      </header>
    );
  }

  return (
    <header className="border-b border-indigo-100 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-50">
      <Link href="/" className="font-bold text-xl tracking-tight text-indigo-600 flex items-center gap-2">
        <span className="text-2xl">📖</span>
        <span>ReadLog</span>
      </Link>
      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <span
              data-testid="user-email"
              className="text-sm font-medium text-slate-700 hidden sm:block bg-indigo-50/80 px-3 py-1 rounded-full border border-indigo-100"
            >
              {user.email}
            </span>
            <Link
              href="/reading-logs"
              data-testid="link-reading-logs"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors px-2 py-1"
            >
              My Reading Logs
            </Link>
            <Button
              variant="outline"
              size="sm"
              data-testid="btn-logout"
              onClick={handleLogout}
              className="border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              data-testid="btn-login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Login
            </Link>
            <Link
              href="/register"
              data-testid="btn-register"
              className={buttonVariants({ variant: "default", size: "sm" }) + " bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

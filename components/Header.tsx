"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Button, buttonVariants } from "@/components/ui/button";

export function Header() {
  const { user, setUser, clearExpenses } = useExpenseContext();
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check session on mount
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
    clearExpenses();
    router.push("/");
    router.refresh();
  };

  if (checking) {
    return (
      <header className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-xl text-blue-600">ExpenseTrail</div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white px-4 py-3 flex items-center justify-between shadow-sm">
      <Link href="/" className="font-bold text-xl text-blue-600">
        ExpenseTrail
      </Link>
      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <span
              data-testid="user-email"
              className="text-sm text-gray-600 hidden sm:block"
            >
              {user.email}
            </span>
            <Link
              href="/expenses"
              data-testid="link-expenses"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              My Expenses
            </Link>
            <Button
              variant="outline"
              size="sm"
              data-testid="btn-logout"
              onClick={handleLogout}
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
              className={buttonVariants({ variant: "default", size: "sm" })}
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}


"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useExpenseContext } from "@/context/ExpenseContext";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseSummary } from "@/components/ExpenseSummary";

export interface SummaryData {
  count: number;
  starredCount: number;
  totalAmount: number;
  breakdown: { category: string; count: number; total: number }[];
}

export default function ExpensesPage() {
  const { user, setUser, loadExpenses, expenses } = useExpenseContext();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [summary, setSummary] = useState<SummaryData>({
    count: 0,
    starredCount: 0,
    totalAmount: 0,
    breakdown: [],
  });

  // Check auth first
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) {
          setUser({ id: data.id, email: data.email });
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setAuthChecked(true));
  }, [setUser, router]);

  const buildParams = useCallback(() => {
    const params: Record<string, string> = {};
    if (filterCategory) params.category = filterCategory;
    if (filterStarred) params.starred = "true";
    if (searchQ.trim()) params.q = searchQ.trim();
    return params;
  }, [filterCategory, filterStarred, searchQ]);

  // Load expenses + summary when filters change
  useEffect(() => {
    if (!authChecked || !user) return;
    const params = buildParams();
    loadExpenses(params);

    // Load summary
    const qs = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";
    fetch(`/api/expenses/summary${qs}`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, [authChecked, user, buildParams, loadExpenses]);

  const handleClearFilters = () => {
    setFilterCategory("");
    setFilterStarred(false);
    setSearchQ("");
  };

  if (!authChecked) {
    return null; // No flash of content
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="expenses-page">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Expenses</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form + Filters */}
          <div className="lg:col-span-1 space-y-6">
            <ExpenseForm />
            <ExpenseFilters
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStarred={filterStarred}
              setFilterStarred={setFilterStarred}
              searchQ={searchQ}
              setSearchQ={setSearchQ}
              onClear={handleClearFilters}
            />
            <ExpenseSummary summary={summary} />
          </div>

          {/* Right: List */}
          <div className="lg:col-span-2">
            <ExpenseList />
          </div>
        </div>
      </div>
    </div>
  );
}

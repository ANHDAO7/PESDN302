"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useReadingLogContext } from "@/context/ReadingLogContext";
import { ReadingLogForm } from "@/components/ReadingLogForm";
import { ReadingLogList } from "@/components/ReadingLogList";
import { ReadingLogFilters } from "@/components/ReadingLogFilters";
import {
  ReadingLogSummary,
  SummaryData,
} from "@/components/ReadingLogSummary";

export default function ReadingLogsPage() {
  const { user, setUser, loadReadingLogs, readingLogs } =
    useReadingLogContext();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Filters
  const [filterGenre, setFilterGenre] = useState("");
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [summary, setSummary] = useState<SummaryData>({
    count: 0,
    favoriteCount: 0,
    totalMinutes: 0,
    breakdown: [],
  });

  // Verify auth on mount
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
    if (filterGenre) params.genre = filterGenre;
    if (filterFavorite) params.favorite = "true";
    if (searchQ.trim()) params.q = searchQ.trim();
    return params;
  }, [filterGenre, filterFavorite, searchQ]);

  // Load reading logs & summary whenever filters or logs list change
  useEffect(() => {
    if (!authChecked || !user) return;
    const params = buildParams();
    loadReadingLogs(params);

    const qs = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";
    fetch(`/api/reading-logs/summary${qs}`)
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => {});
  }, [authChecked, user, buildParams, loadReadingLogs, readingLogs.length]);

  const handleClearFilters = () => {
    setFilterGenre("");
    setFilterFavorite(false);
    setSearchQ("");
  };

  if (!authChecked || !user) {
    return null; // Prevents flash of content while checking auth
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/30"
      data-testid="reading-logs-page"
    >
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Reading Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track, filter, and review your personal reading progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Form, Filters, Summary */}
          <div className="lg:col-span-1 space-y-6">
            <ReadingLogForm />
            <ReadingLogFilters
              filterGenre={filterGenre}
              setFilterGenre={setFilterGenre}
              filterFavorite={filterFavorite}
              setFilterFavorite={setFilterFavorite}
              searchQ={searchQ}
              setSearchQ={setSearchQ}
              onClear={handleClearFilters}
            />
            <ReadingLogSummary summary={summary} />
          </div>

          {/* Right Column: Sessions List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Reading Sessions ({readingLogs.length})
              </h2>
            </div>
            <ReadingLogList />
          </div>
        </div>
      </div>
    </div>
  );
}

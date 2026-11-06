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
  const { user, setUser, loadReadingLogs, readingLogs, refreshTrigger } =
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
  }, [authChecked, user, buildParams, loadReadingLogs, refreshTrigger]);

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
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#bce3fe] via-[#f7d5e4] to-[#fbcfe8]"
      data-testid="reading-logs-page"
    >
      {/* Background ambient orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-pink-200/50 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-sky-200/50 rounded-full blur-3xl pointer-events-none -z-0" />

      <Header />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-8 relative z-10">
        <div className="mb-8 flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900 uppercase">
              Reading Logs
            </h1>
            <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider font-semibold">
              Live Tracker &bull; Colormix Pastel Edition
            </p>
          </div>
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
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Logged Sessions ({readingLogs.length})
              </span>
            </div>
            <ReadingLogList />
          </div>
        </div>
      </div>
    </div>
  );
}

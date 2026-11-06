"use client";

import { useReadingLogContext, ReadingLog } from "@/context/ReadingLogContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ReadingLogList() {
  const { readingLogs, updateReadingLog, removeReadingLog } =
    useReadingLogContext();

  const handleToggleFavorite = async (log: ReadingLog) => {
    const res = await fetch(`/api/reading-logs/${log.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !log.favorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      updateReadingLog(updated);
    }
  };

  const handleDelete = async (log: ReadingLog) => {
    const res = await fetch(`/api/reading-logs/${log.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      removeReadingLog(log.id);
    }
  };

  if (readingLogs.length === 0) {
    return (
      <div data-testid="reading-log-list" className="space-y-3">
        <div className="py-20 text-center glass-panel rounded-3xl border-dashed border-pink-200">
          <p
            data-testid="reading-logs-empty"
            className="text-slate-500 font-medium text-sm"
          >
            No reading sessions found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="reading-log-list" className="space-y-3.5">
      {readingLogs.map((log) => (
        <Card
          key={log.id}
          data-testid="reading-log-item"
          className="glass-panel border-white/90 rounded-3xl p-2 shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span
                    data-testid="reading-log-title"
                    className="font-semibold text-slate-900 text-base tracking-tight truncate"
                  >
                    {log.bookTitle}
                  </span>
                  <span
                    data-testid="reading-log-genre"
                    className="text-[11px] font-semibold tracking-wider uppercase bg-pink-100/70 text-pink-700 border border-pink-200/60 px-3 py-0.5 rounded-full"
                  >
                    {log.genre}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-100 shadow-2xs">
                    <span className="text-pink-500">⏱</span>
                    <span data-testid="reading-log-minutes" className="font-bold text-slate-900">
                      {log.minutesRead}
                    </span>
                    <span className="text-[10px] text-slate-400">mins</span>
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-100 shadow-2xs">
                    <span className="text-sky-500">📅</span>
                    <span data-testid="reading-log-date" className="text-slate-700">
                      {log.readOn}
                    </span>
                  </span>
                </div>

                {log.note ? (
                  <p className="text-xs text-slate-600 mt-2.5 bg-white/50 backdrop-blur-xs p-2.5 rounded-2xl border border-white/80 italic">
                    &ldquo;{log.note}&rdquo;
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  data-testid="btn-toggle-favorite"
                  aria-pressed={log.favorite}
                  onClick={() => handleToggleFavorite(log)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    log.favorite
                      ? "text-amber-500 bg-amber-50 border border-amber-200 shadow-xs"
                      : "text-slate-300 hover:text-amber-400 bg-white/60 hover:bg-white border border-white"
                  }`}
                  title={log.favorite ? "Unmark favorite" : "Mark favorite"}
                >
                  <span className="text-lg leading-none">★</span>
                </button>

                <Button
                  data-testid="btn-delete-reading-log"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(log)}
                  className="w-9 h-9 rounded-full p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                  title="Delete session"
                >
                  <span className="text-sm font-bold leading-none">✕</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

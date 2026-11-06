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
        <div className="py-16 text-center border border-dashed border-indigo-200/80 rounded-2xl bg-white/50 backdrop-blur-xs">
          <p
            data-testid="reading-logs-empty"
            className="text-slate-500 font-medium"
          >
            No reading sessions found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="reading-log-list" className="space-y-3">
      {readingLogs.map((log) => (
        <Card
          key={log.id}
          data-testid="reading-log-item"
          className="border-indigo-100/70 bg-white/80 backdrop-blur-md shadow-xs hover:shadow-md transition-all hover:border-indigo-200"
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    data-testid="reading-log-title"
                    className="font-bold text-slate-900 text-base truncate"
                  >
                    {log.bookTitle}
                  </span>
                  <span
                    data-testid="reading-log-genre"
                    className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-full"
                  >
                    {log.genre}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-1.5 text-sm text-slate-600">
                  <span className="flex items-center gap-1 font-medium text-slate-800">
                    <span>⏱️</span>
                    <span data-testid="reading-log-minutes">{log.minutesRead}</span>
                    <span className="text-xs text-slate-500">mins</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span>📅</span>
                    <span data-testid="reading-log-date">{log.readOn}</span>
                  </span>
                </div>

                {log.note ? (
                  <p className="text-xs text-slate-500 mt-2 bg-slate-50/80 p-2 rounded-lg border border-slate-100 italic">
                    &ldquo;{log.note}&rdquo;
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  data-testid="btn-toggle-favorite"
                  aria-pressed={log.favorite}
                  onClick={() => handleToggleFavorite(log)}
                  className={`p-2 rounded-xl transition-all ${
                    log.favorite
                      ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                      : "text-slate-300 hover:text-amber-400 hover:bg-slate-50"
                  }`}
                  title={log.favorite ? "Unmark favorite" : "Mark favorite"}
                >
                  <span className="text-xl leading-none">★</span>
                </button>

                <Button
                  data-testid="btn-delete-reading-log"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(log)}
                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl p-2 h-auto"
                  title="Delete session"
                >
                  <span className="text-base font-bold leading-none">✕</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

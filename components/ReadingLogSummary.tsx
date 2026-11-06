"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SummaryData {
  count: number;
  favoriteCount: number;
  totalMinutes: number;
  breakdown: { genre: string; count: number; total: number }[];
}

interface ReadingLogSummaryProps {
  summary: SummaryData;
}

export function ReadingLogSummary({ summary }: ReadingLogSummaryProps) {
  return (
    <Card className="border-indigo-100/70 bg-white/80 backdrop-blur-md shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>📊</span>
          <span>Reading Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/60">
          <div>
            <p className="text-xs font-medium text-slate-500">Sessions</p>
            <p
              data-testid="reading-log-count"
              className="text-2xl font-extrabold text-slate-900 mt-0.5"
            >
              {summary.count}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Favorites</p>
            <p
              data-testid="favorite-count"
              className="text-2xl font-extrabold text-amber-500 mt-0.5"
            >
              {summary.favoriteCount}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Mins</p>
            <p
              data-testid="total-minutes"
              className="text-2xl font-extrabold text-indigo-600 mt-0.5"
            >
              {summary.totalMinutes}
            </p>
          </div>
        </div>

        {summary.breakdown && summary.breakdown.length > 0 ? (
          <div data-testid="genre-breakdown" className="space-y-2 pt-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              By Genre
            </p>
            <div className="space-y-1.5">
              {summary.breakdown.map((row) => (
                <div
                  key={row.genre}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-white/60 border border-slate-100 hover:border-indigo-100 transition-colors"
                >
                  <span
                    data-testid="breakdown-name"
                    className="font-medium text-slate-700"
                  >
                    {row.genre}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      data-testid="breakdown-count"
                      className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"
                    >
                      {row.count}x
                    </span>
                    <span
                      data-testid="breakdown-total"
                      className="font-bold text-indigo-600"
                    >
                      {row.total}
                    </span>
                    <span className="text-xs text-slate-400 -ml-1.5">mins</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

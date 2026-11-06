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
    <Card className="glass-panel border-white/80 rounded-3xl p-3 sm:p-5 shadow-lg">
      <CardHeader className="pb-3 px-2">
        <CardTitle className="text-base font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block shadow-2xs"></span>
          <span className="uppercase text-xs tracking-wider font-bold">Summary Metrics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-2">
        <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-2xl bg-white/60 border border-white/90 shadow-2xs backdrop-blur-md">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sessions</p>
            <p
              data-testid="reading-log-count"
              className="text-2xl font-light text-slate-900 mt-0.5 tracking-tight"
            >
              {summary.count}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Favorites</p>
            <p
              data-testid="favorite-count"
              className="text-2xl font-light text-amber-500 mt-0.5 tracking-tight"
            >
              {summary.favoriteCount}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Mins</p>
            <p
              data-testid="total-minutes"
              className="text-2xl font-light text-pink-600 mt-0.5 tracking-tight"
            >
              {summary.totalMinutes}
            </p>
          </div>
        </div>

        {summary.breakdown && summary.breakdown.length > 0 ? (
          <div data-testid="genre-breakdown" className="space-y-2 pt-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">
              By Genre Breakdown
            </p>
            <div className="space-y-1.5">
              {summary.breakdown.map((row) => (
                <div
                  key={row.genre}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between text-xs py-2 px-3.5 rounded-full bg-white/60 border border-white/80 shadow-2xs hover:bg-white/90 transition-all"
                >
                  <span
                    data-testid="breakdown-name"
                    className="font-medium text-slate-800"
                  >
                    {row.genre}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span
                      data-testid="breakdown-count"
                      className="text-[10px] text-slate-500 font-semibold bg-pink-100/60 px-2 py-0.5 rounded-full"
                    >
                      {row.count}x
                    </span>
                    <span
                      data-testid="breakdown-total"
                      className="font-bold text-slate-900"
                    >
                      {row.total}
                    </span>
                    <span className="text-[10px] text-slate-400 -ml-1">mins</span>
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GENRE_ORDER } from "@/lib/reading-log-utils";

interface ReadingLogFiltersProps {
  filterGenre: string;
  setFilterGenre: (v: string) => void;
  filterFavorite: boolean;
  setFilterFavorite: (v: boolean) => void;
  searchQ: string;
  setSearchQ: (v: string) => void;
  onClear: () => void;
}

export function ReadingLogFilters({
  filterGenre,
  setFilterGenre,
  filterFavorite,
  setFilterFavorite,
  searchQ,
  setSearchQ,
  onClear,
}: ReadingLogFiltersProps) {
  return (
    <Card className="glass-panel border-white/80 rounded-3xl p-3 sm:p-5 shadow-lg">
      <CardHeader className="pb-3 px-2">
        <CardTitle className="text-base font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block shadow-2xs"></span>
          <span className="uppercase text-xs tracking-wider font-bold">Filter & Search</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5 px-2">
        <div className="space-y-1">
          <Label htmlFor="filter-genre" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
            Genre
          </Label>
          <select
            id="filter-genre"
            data-testid="filter-genre"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="glass-input w-full rounded-full px-4 py-2 text-sm text-slate-800 focus:outline-hidden"
          >
            <option value="">All</option>
            {GENRE_ORDER.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 pt-1 pl-1">
          <input
            id="filter-favorite"
            data-testid="filter-favorite"
            type="checkbox"
            checked={filterFavorite}
            onChange={(e) => setFilterFavorite(e.target.checked)}
            className="h-4 w-4 rounded-sm border-pink-300 text-pink-500 focus:ring-pink-400 cursor-pointer accent-pink-500"
          />
          <Label htmlFor="filter-favorite" className="text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer">
            Favorites only
          </Label>
        </div>

        <div className="space-y-1">
          <Label htmlFor="search-input" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
            Search
          </Label>
          <Input
            id="search-input"
            data-testid="search-input"
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search title or notes..."
            className="glass-input rounded-full px-4 py-2 text-sm"
          />
        </div>

        <Button
          data-testid="btn-clear-filters"
          variant="outline"
          size="sm"
          className="pill-btn w-full rounded-full text-xs font-semibold uppercase tracking-wider border-slate-300/80 bg-white/50 hover:bg-white text-slate-800 shadow-2xs"
          onClick={onClear}
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}

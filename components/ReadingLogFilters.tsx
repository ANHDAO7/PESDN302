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
    <Card className="border-indigo-100/70 bg-white/80 backdrop-blur-md shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span>🔍</span>
          <span>Filters & Search</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5">
        <div className="space-y-1">
          <Label htmlFor="filter-genre" className="text-slate-700 text-xs font-semibold">
            Genre
          </Label>
          <select
            id="filter-genre"
            data-testid="filter-genre"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white/90 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All</option>
            {GENRE_ORDER.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2.5 pt-1">
          <input
            id="filter-favorite"
            data-testid="filter-favorite"
            type="checkbox"
            checked={filterFavorite}
            onChange={(e) => setFilterFavorite(e.target.checked)}
            className="h-4 w-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <Label htmlFor="filter-favorite" className="text-sm font-medium text-slate-700 cursor-pointer">
            Favorites only
          </Label>
        </div>

        <div className="space-y-1">
          <Label htmlFor="search-input" className="text-slate-700 text-xs font-semibold">
            Search
          </Label>
          <Input
            id="search-input"
            data-testid="search-input"
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search book title or note..."
            className="bg-white/90 text-sm"
          />
        </div>

        <Button
          data-testid="btn-clear-filters"
          variant="outline"
          size="sm"
          className="w-full border-slate-200 hover:bg-slate-100 text-slate-700 font-medium"
          onClick={onClear}
        >
          Clear
        </Button>
      </CardContent>
    </Card>
  );
}

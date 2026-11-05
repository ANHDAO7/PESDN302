"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"];

interface ExpenseFiltersProps {
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterStarred: boolean;
  setFilterStarred: (v: boolean) => void;
  searchQ: string;
  setSearchQ: (v: string) => void;
  onClear: () => void;
}

export function ExpenseFilters({
  filterCategory,
  setFilterCategory,
  filterStarred,
  setFilterStarred,
  searchQ,
  setSearchQ,
  onClear,
}: ExpenseFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="filter-category">Category</Label>
          <select
            id="filter-category"
            data-testid="filter-category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="filter-starred"
            data-testid="filter-starred"
            type="checkbox"
            checked={filterStarred}
            onChange={(e) => setFilterStarred(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="filter-starred" className="cursor-pointer">
            Starred only
          </Label>
        </div>

        <div className="space-y-1">
          <Label htmlFor="search-input">Search</Label>
          <Input
            id="search-input"
            data-testid="search-input"
            type="text"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search title or note..."
          />
        </div>

        <Button
          data-testid="btn-clear-filters"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClear}
        >
          Clear
        </Button>
      </CardContent>
    </Card>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SummaryData } from "@/app/expenses/page";

interface ExpenseSummaryProps {
  summary: SummaryData;
}

export function ExpenseSummary({ summary }: ExpenseSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-500">Expenses</p>
            <p data-testid="expense-count" className="text-xl font-bold text-gray-900">
              {summary.count}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Starred</p>
            <p data-testid="starred-count" className="text-xl font-bold text-yellow-600">
              {summary.starredCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total</p>
            <p data-testid="total-amount" className="text-xl font-bold text-blue-600">
              {Number(summary.totalAmount).toFixed(2)}
            </p>
          </div>
        </div>

        {summary.breakdown.length > 0 && (
          <div data-testid="category-breakdown" className="mt-3">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">By Category</p>
            <div className="space-y-1.5">
              {summary.breakdown.map((row) => (
                <div
                  key={row.category}
                  data-testid="breakdown-row"
                  className="flex items-center justify-between text-sm"
                >
                  <span data-testid="breakdown-name" className="text-gray-700">
                    {row.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span data-testid="breakdown-count" className="text-gray-500">
                      {row.count}x
                    </span>
                    <span data-testid="breakdown-total" className="font-semibold text-gray-900">
                      {Number(row.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

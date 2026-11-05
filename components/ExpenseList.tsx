"use client";

import { useExpenseContext, Expense } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ExpenseList() {
  const { expenses, updateExpense, removeExpense } = useExpenseContext();

  const handleToggleStar = async (expense: Expense) => {
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ starred: !expense.starred }),
    });
    if (res.ok) {
      const updated = await res.json();
      updateExpense(updated);
    }
  };

  const handleDelete = async (expense: Expense) => {
    const res = await fetch(`/api/expenses/${expense.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      removeExpense(expense.id);
    }
  };

  if (expenses.length === 0) {
    return (
      <div data-testid="expense-list" className="space-y-3">
        <p
          data-testid="expenses-empty"
          className="text-center text-gray-500 py-12"
        >
          No expenses found
        </p>
      </div>
    );
  }

  return (
    <div data-testid="expense-list" className="space-y-3">
      {expenses.map((expense) => (
        <Card key={expense.id} data-testid="expense-item" className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    data-testid="expense-title"
                    className="font-semibold text-gray-900 truncate"
                  >
                    {expense.title}
                  </span>
                  <span
                    data-testid="expense-category"
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                  >
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                  <span data-testid="expense-amount" className="font-medium text-gray-900">
                    {Number(expense.amount).toFixed(2)}
                  </span>
                  <span data-testid="expense-date">
                    {expense.spentAt}
                  </span>
                </div>
                {expense.note && (
                  <p className="text-xs text-gray-500 mt-1">{expense.note}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  data-testid="btn-toggle-star"
                  aria-pressed={expense.starred}
                  onClick={() => handleToggleStar(expense)}
                  className={`p-1.5 rounded-full transition-colors ${
                    expense.starred
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  title={expense.starred ? "Unstar" : "Star"}
                >
                  ★
                </button>
                <Button
                  data-testid="btn-delete-expense"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(expense)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                  title="Delete"
                >
                  ✕
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

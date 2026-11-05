import { Expense } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export interface ExpenseShape {
  id: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string;
  createdAt: string;
}

export function formatExpense(expense: Expense): ExpenseShape {
  return {
    id: expense.id,
    title: expense.title,
    amount: Number(expense.amount),
    category: expense.category,
    note: expense.note,
    starred: expense.starred,
    spentAt: expense.spentAt.toISOString().split("T")[0], // "YYYY-MM-DD"
    createdAt: expense.createdAt.toISOString(),
  };
}

export const CATEGORY_ORDER = [
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Other",
] as const;

export type CategoryType = (typeof CATEGORY_ORDER)[number];

export function isValidCategory(cat: string): cat is CategoryType {
  return CATEGORY_ORDER.includes(cat as CategoryType);
}

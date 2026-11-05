"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  note: string;
  starred: boolean;
  spentAt: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
}

interface ExpenseContextType {
  user: User | null;
  expenses: Expense[];
  loading: boolean;
  setUser: (user: User | null) => void;
  loadExpenses: (params?: Record<string, string>) => Promise<void>;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  clearExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | null>(null);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (!u) {
      setExpenses([]);
    }
  }, []);

  const loadExpenses = useCallback(
    async (params?: Record<string, string>) => {
      setLoading(true);
      try {
        const qs = params
          ? "?" + new URLSearchParams(params).toString()
          : "";
        const res = await fetch(`/api/expenses${qs}`);
        if (!res.ok) {
          setExpenses([]);
          return;
        }
        const data = await res.json();
        setExpenses(data);
      } catch {
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addExpense = useCallback((expense: Expense) => {
    setExpenses((prev) => {
      const updated = [expense, ...prev];
      return updated.sort((a, b) => {
        const dateDiff =
          new Date(b.spentAt).getTime() - new Date(a.spentAt).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });
    });
  }, []);

  const updateExpense = useCallback((expense: Expense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === expense.id ? expense : e))
    );
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        user,
        expenses,
        loading,
        setUser,
        loadExpenses,
        addExpense,
        updateExpense,
        removeExpense,
        clearExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseContext() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpenseContext must be inside ExpenseProvider");
  return ctx;
}


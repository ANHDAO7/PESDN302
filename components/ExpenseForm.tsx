"use client";

import { useState } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORIES = ["Food", "Transport", "Bills", "Shopping", "Other"];

function validateTitle(title: string) {
  if (!title || !title.trim()) return "Title is required";
  if (title.trim().length > 80) return "Title must be at most 80 characters";
  return "";
}

function validateAmount(amount: string) {
  if (amount === "" || amount === undefined) return "Amount is required";
  const n = Number(amount);
  if (isNaN(n)) return "Amount is required";
  if (n <= 0) return "Amount must be a positive number";
  return "";
}

function validateCategory(category: string) {
  if (!category) return "Please choose a category";
  if (!CATEGORIES.includes(category)) return "Invalid category";
  return "";
}

function validateDate(date: string) {
  if (!date) return "Date is required";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Date is required";
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (d > today) return "Date cannot be in the future";
  return "";
}

export function ExpenseForm() {
  const { addExpense } = useExpenseContext();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    expense: "",
  });
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccess("");

    const errs = {
      title: validateTitle(title),
      amount: validateAmount(amount),
      category: validateCategory(category),
      date: validateDate(date),
      expense: "",
    };
    setErrors(errs);

    if (errs.title || errs.amount || errs.category || errs.date) return;

    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          amount: Number(amount),
          category,
          note: note.trim(),
          spentAt: date,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({ ...prev, expense: data.error || "Failed to add expense" }));
      } else {
        addExpense(data);
        setTitle("");
        setAmount("");
        setCategory("");
        setNote("");
        setDate("");
        setSubmitted(false);
        setErrors({ title: "", amount: "", category: "", date: "", expense: "" });
        setSuccess("Expense added");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch {
      setErrors((prev) => ({ ...prev, expense: "Network error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          data-testid="expense-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3"
        >
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              data-testid="input-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (submitted) setErrors((p) => ({ ...p, title: validateTitle(e.target.value) }));
              }}
              placeholder="e.g. Grab to campus"
            />
            {submitted && errors.title && (
              <p data-testid="error-title" className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              data-testid="input-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (submitted) setErrors((p) => ({ ...p, amount: validateAmount(e.target.value) }));
              }}
              placeholder="e.g. 45000"
            />
            {submitted && errors.amount && (
              <p data-testid="error-amount" className="text-sm text-red-500">{errors.amount}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              data-testid="input-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (submitted) setErrors((p) => ({ ...p, category: validateCategory(e.target.value) }));
              }}
              className="w-full border rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {submitted && errors.category && (
              <p data-testid="error-category" className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              data-testid="input-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (submitted) setErrors((p) => ({ ...p, date: validateDate(e.target.value) }));
              }}
            />
            {submitted && errors.date && (
              <p data-testid="error-date" className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {errors.expense && (
            <p data-testid="error-expense" className="text-sm text-red-500">{errors.expense}</p>
          )}
          {success && (
            <p data-testid="expense-success" className="text-sm text-green-600 font-medium">{success}</p>
          )}

          <Button
            data-testid="btn-add-expense"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

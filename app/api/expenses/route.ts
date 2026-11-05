import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatExpense, isValidCategory, CATEGORY_ORDER } from "@/lib/expense-utils";
import { unauthorized, badRequest, conflict, created } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// GET /api/expenses
export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const starred = searchParams.get("starred");
    const q = searchParams.get("q");

    const where: Prisma.ExpenseWhereInput = { userId: session.userId };

    if (category && isValidCategory(category)) {
      where.category = category;
    }
    if (starred === "true") {
      where.starred = true;
    }
    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { title: { contains: term, mode: "insensitive" } },
        { note: { contains: term, mode: "insensitive" } },
      ];
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: [{ spentAt: "desc" }, { title: "asc" }],
    });

    // Case-insensitive title sort for ties — Prisma "asc" is case-sensitive on Postgres
    const sorted = expenses.sort((a, b) => {
      const dateDiff = b.spentAt.getTime() - a.spentAt.getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
    });

    return NextResponse.json(sorted.map(formatExpense), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("GET /api/expenses error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/expenses
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const { title, amount, category, note, spentAt } = body;

    // Validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return badRequest("Title is required");
    }
    if (title.trim().length > 80) {
      return badRequest("Title must be at most 80 characters");
    }
    if (amount === undefined || amount === null || amount === "") {
      return badRequest("Amount is required");
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return badRequest("Amount must be a positive number");
    }
    if (!category) {
      return badRequest("Please choose a category");
    }
    if (!isValidCategory(category)) {
      return badRequest("Invalid category");
    }
    if (!spentAt) {
      return badRequest("Date is required");
    }
    const spentDate = new Date(spentAt);
    if (isNaN(spentDate.getTime())) {
      return badRequest("Date is required");
    }
    // Check not in future
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (spentDate > today) {
      return badRequest("Date cannot be in the future");
    }

    // Check duplicate
    const duplicate = await prisma.expense.findFirst({
      where: {
        userId: session.userId,
        title: title.trim(),
        amount: new Prisma.Decimal(numAmount),
        spentAt: spentDate,
      },
    });
    if (duplicate) {
      return conflict(
        "Duplicate expense: an expense with the same title, amount and date already exists"
      );
    }

    const expense = await prisma.expense.create({
      data: {
        userId: session.userId,
        title: title.trim(),
        amount: new Prisma.Decimal(numAmount),
        category,
        note: note?.trim() || "",
        spentAt: spentDate,
      },
    });

    return created(formatExpense(expense));
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("POST /api/expenses error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


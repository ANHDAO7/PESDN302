import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidCategory, CATEGORY_ORDER } from "@/lib/expense-utils";
import { unauthorized } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

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

    const expenses = await prisma.expense.findMany({ where });

    const count = expenses.length;
    const starredCount = expenses.filter((e) => e.starred).length;
    const totalAmount = expenses.reduce(
      (sum, e) => sum + Number(e.amount),
      0
    );

    // Build breakdown
    const breakdownMap = new Map<
      string,
      { category: string; count: number; total: number }
    >();
    for (const e of expenses) {
      const cat = e.category;
      if (!breakdownMap.has(cat)) {
        breakdownMap.set(cat, { category: cat, count: 0, total: 0 });
      }
      const entry = breakdownMap.get(cat)!;
      entry.count += 1;
      entry.total += Number(e.amount);
    }

    const breakdown = [...breakdownMap.values()].sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return (
        CATEGORY_ORDER.indexOf(a.category as typeof CATEGORY_ORDER[number]) -
        CATEGORY_ORDER.indexOf(b.category as typeof CATEGORY_ORDER[number])
      );
    });

    return NextResponse.json(
      { count, starredCount, totalAmount, breakdown },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("GET /api/expenses/summary error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


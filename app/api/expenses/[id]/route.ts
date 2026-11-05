import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatExpense, isValidCategory, CATEGORY_ORDER } from "@/lib/expense-utils";
import { unauthorized, badRequest, conflict, notFound, ok } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// PATCH /api/expenses/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await params;

    // Find expense and verify ownership
    const existing = await prisma.expense.findFirst({
      where: { id, userId: session.userId },
    });
    if (!existing) return notFound();

    const body = await req.json();
    const { title, amount, category, note, spentAt, starred } = body;

    const updateData: Prisma.ExpenseUpdateInput = {};

    if (title !== undefined) {
      if (!title || !title.trim()) return badRequest("Title is required");
      if (title.trim().length > 80) return badRequest("Title must be at most 80 characters");
      updateData.title = title.trim();
    }

    if (amount !== undefined) {
      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) return badRequest("Amount must be a positive number");
      updateData.amount = new Prisma.Decimal(numAmount);
    }

    if (category !== undefined) {
      if (!category) return badRequest("Please choose a category");
      if (!isValidCategory(category)) return badRequest("Invalid category");
      updateData.category = category;
    }

    if (note !== undefined) {
      updateData.note = note?.trim() || "";
    }

    if (spentAt !== undefined) {
      const spentDate = new Date(spentAt);
      if (isNaN(spentDate.getTime())) return badRequest("Date is required");
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (spentDate > today) return badRequest("Date cannot be in the future");
      updateData.spentAt = spentDate;
    }

    if (starred !== undefined) {
      updateData.starred = Boolean(starred);
    }

    // Check duplicate if relevant fields changed
    const checkTitle = (updateData.title as string) ?? existing.title;
    const checkAmount = updateData.amount ?? existing.amount;
    const checkSpentAt = (updateData.spentAt as Date) ?? existing.spentAt;

    if (title !== undefined || amount !== undefined || spentAt !== undefined) {
      const duplicate = await prisma.expense.findFirst({
        where: {
          userId: session.userId,
          title: checkTitle,
          amount: new Prisma.Decimal(checkAmount.toString()),
          spentAt: checkSpentAt,
          NOT: { id },
        },
      });
      if (duplicate) {
        return conflict(
          "Duplicate expense: an expense with the same title, amount and date already exists"
        );
      }
    }

    const updated = await prisma.expense.update({
      where: { id },
      data: updateData,
    });

    return ok(formatExpense(updated));
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("PATCH /api/expenses/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/expenses/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const existing = await prisma.expense.findFirst({
      where: { id, userId: session.userId },
    });
    if (!existing) return notFound();

    await prisma.expense.delete({ where: { id } });

    return ok({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("DELETE /api/expenses/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

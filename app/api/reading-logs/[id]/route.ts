import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatReadingLog,
  isValidGenre,
  toDbGenre,
} from "@/lib/reading-log-utils";
import { unauthorized, badRequest, conflict, notFound, ok } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// PATCH /api/reading-logs/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const existing = await prisma.readingLog.findFirst({
      where: { id, userId: session.userId },
    });
    if (!existing) return notFound();

    const body = await req.json();
    const { bookTitle, minutesRead, genre, note, readOn, favorite } = body;

    const updateData: Prisma.ReadingLogUpdateInput = {};

    if (bookTitle !== undefined) {
      if (!bookTitle || !bookTitle.trim()) {
        return badRequest("Book title is required");
      }
      if (bookTitle.trim().length > 80) {
        return badRequest("Book title must be at most 80 characters");
      }
      updateData.bookTitle = bookTitle.trim();
    }

    if (minutesRead !== undefined) {
      if (minutesRead === null || minutesRead === "") {
        return badRequest("Minutes read is required");
      }
      const numMinutes = Number(minutesRead);
      if (isNaN(numMinutes)) {
        return badRequest("Minutes read is required");
      }
      if (numMinutes <= 0 || !Number.isInteger(numMinutes)) {
        return badRequest("Minutes read must be a positive number");
      }
      updateData.minutesRead = numMinutes;
    }

    if (genre !== undefined) {
      if (!genre) return badRequest("Please choose a genre");
      if (!isValidGenre(genre)) return badRequest("Invalid genre");
      const dbG = toDbGenre(genre);
      if (!dbG) return badRequest("Invalid genre");
      updateData.genre = dbG;
    }

    if (note !== undefined) {
      updateData.note = note?.trim() || "";
    }

    if (readOn !== undefined) {
      if (!readOn) return badRequest("Date is required");
      const readDate = new Date(readOn);
      if (isNaN(readDate.getTime())) return badRequest("Date is required");
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (readDate > today) return badRequest("Date cannot be in the future");
      updateData.readOn = readDate;
    }

    if (favorite !== undefined) {
      updateData.favorite = Boolean(favorite);
    }

    // Check duplicate if relevant fields changed
    const checkTitle = (updateData.bookTitle as string) ?? existing.bookTitle;
    const checkMinutes = (updateData.minutesRead as number) ?? existing.minutesRead;
    const checkReadOn = (updateData.readOn as Date) ?? existing.readOn;

    if (bookTitle !== undefined || minutesRead !== undefined || readOn !== undefined) {
      const duplicate = await prisma.readingLog.findFirst({
        where: {
          userId: session.userId,
          bookTitle: checkTitle,
          minutesRead: checkMinutes,
          readOn: checkReadOn,
          NOT: { id },
        },
      });
      if (duplicate) {
        return conflict(
          "Duplicate reading session: a reading session with the same book title, minutes and date already exists"
        );
      }
    }

    const updated = await prisma.readingLog.update({
      where: { id },
      data: updateData,
    });

    return ok(formatReadingLog(updated));
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("PATCH /api/reading-logs/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/reading-logs/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const { id } = await params;

    const existing = await prisma.readingLog.findFirst({
      where: { id, userId: session.userId },
    });
    if (!existing) return notFound();

    await prisma.readingLog.delete({ where: { id } });

    return ok({ success: true });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("DELETE /api/reading-logs/:id error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


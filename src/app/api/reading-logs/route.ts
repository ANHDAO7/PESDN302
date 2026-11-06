import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  formatReadingLog,
  isValidGenre,
  toDbGenre,
} from "@/lib/reading-log-utils";
import { unauthorized, badRequest, conflict, created } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

// GET /api/reading-logs
export async function GET(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const { searchParams } = new URL(req.url);

    const genre = searchParams.get("genre");
    const favorite = searchParams.get("favorite");
    const q = searchParams.get("q");

    const where: Prisma.ReadingLogWhereInput = { userId: session.userId };

    if (genre && isValidGenre(genre)) {
      const dbG = toDbGenre(genre);
      if (dbG) where.genre = dbG;
    }
    if (favorite === "true") {
      where.favorite = true;
    }
    if (q && q.trim()) {
      const term = q.trim();
      where.OR = [
        { bookTitle: { contains: term, mode: "insensitive" } },
        { note: { contains: term, mode: "insensitive" } },
      ];
    }

    const logs = await prisma.readingLog.findMany({
      where,
      orderBy: [{ readOn: "desc" }],
    });

    // Case-insensitive bookTitle sort for ties
    const sorted = logs.sort((a, b) => {
      const dateDiff = b.readOn.getTime() - a.readOn.getTime();
      if (dateDiff !== 0) return dateDiff;
      return a.bookTitle.toLowerCase().localeCompare(b.bookTitle.toLowerCase());
    });

    return NextResponse.json(sorted.map(formatReadingLog), { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("GET /api/reading-logs error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/reading-logs
export async function POST(req: NextRequest) {
  try {
    const session = await requireSession(req);
    const body = await req.json();
    const { bookTitle, minutesRead, genre, note, readOn } = body;

    // Validation
    if (!bookTitle || typeof bookTitle !== "string" || !bookTitle.trim()) {
      return badRequest("Book title is required");
    }
    if (bookTitle.trim().length > 80) {
      return badRequest("Book title must be at most 80 characters");
    }

    if (minutesRead === undefined || minutesRead === null || minutesRead === "") {
      return badRequest("Minutes read is required");
    }
    const numMinutes = Number(minutesRead);
    if (isNaN(numMinutes)) {
      return badRequest("Minutes read is required");
    }
    if (numMinutes <= 0 || !Number.isInteger(numMinutes)) {
      return badRequest("Minutes read must be a positive number");
    }

    if (!genre) {
      return badRequest("Please choose a genre");
    }
    if (!isValidGenre(genre)) {
      return badRequest("Invalid genre");
    }
    const dbGenre = toDbGenre(genre);
    if (!dbGenre) {
      return badRequest("Invalid genre");
    }

    if (!readOn) {
      return badRequest("Date is required");
    }
    const readDate = new Date(readOn);
    if (isNaN(readDate.getTime())) {
      return badRequest("Date is required");
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (readDate > today) {
      return badRequest("Date cannot be in the future");
    }

    // Duplicate check: same bookTitle, minutesRead and readOn already saved by this user
    const duplicate = await prisma.readingLog.findFirst({
      where: {
        userId: session.userId,
        bookTitle: bookTitle.trim(),
        minutesRead: numMinutes,
        readOn: readDate,
      },
    });
    if (duplicate) {
      return conflict(
        "Duplicate reading session: a reading session with the same book title, minutes and date already exists"
      );
    }

    const createdLog = await prisma.readingLog.create({
      data: {
        userId: session.userId,
        bookTitle: bookTitle.trim(),
        minutesRead: numMinutes,
        genre: dbGenre,
        note: note?.trim() || "",
        readOn: readDate,
      },
    });

    return created(formatReadingLog(createdLog));
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("POST /api/reading-logs error:", err);
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


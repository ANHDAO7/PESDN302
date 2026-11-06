import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isValidGenre,
  toDbGenre,
  fromDbGenre,
  GENRE_ORDER,
  GenreType,
} from "@/lib/reading-log-utils";
import { unauthorized } from "@/lib/api-response";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();
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

    const logs = await prisma.readingLog.findMany({ where });

    const count = logs.length;
    const favoriteCount = logs.filter((l) => l.favorite).length;
    const totalMinutes = logs.reduce((sum, l) => sum + l.minutesRead, 0);

    // Build breakdown
    const breakdownMap = new Map<
      string,
      { genre: string; count: number; total: number }
    >();

    for (const log of logs) {
      const gStr = fromDbGenre(log.genre);
      if (!breakdownMap.has(gStr)) {
        breakdownMap.set(gStr, { genre: gStr, count: 0, total: 0 });
      }
      const entry = breakdownMap.get(gStr)!;
      entry.count += 1;
      entry.total += log.minutesRead;
    }

    const breakdown = [...breakdownMap.values()].sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      return (
        GENRE_ORDER.indexOf(a.genre as GenreType) -
        GENRE_ORDER.indexOf(b.genre as GenreType)
      );
    });

    return NextResponse.json(
      { count, favoriteCount, totalMinutes, breakdown },
      { status: 200 }
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Unauthorized") {
      return unauthorized();
    }
    console.error("GET /api/reading-logs/summary error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


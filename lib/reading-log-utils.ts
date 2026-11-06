import { ReadingLog, Genre } from "@prisma/client";

export interface ReadingLogShape {
  id: string;
  bookTitle: string;
  minutesRead: number;
  genre: string;
  note: string;
  favorite: boolean;
  readOn: string;
  createdAt: string;
}

export const GENRE_ORDER = [
  "Fiction",
  "Non-Fiction",
  "Sci-Fi",
  "Biography",
  "Other",
] as const;

export type GenreType = (typeof GENRE_ORDER)[number];

export function toDbGenre(genre: string): Genre | null {
  switch (genre) {
    case "Fiction":
      return Genre.Fiction;
    case "Non-Fiction":
      return Genre.Non_Fiction;
    case "Sci-Fi":
      return Genre.Sci_Fi;
    case "Biography":
      return Genre.Biography;
    case "Other":
      return Genre.Other;
    default:
      return null;
  }
}

export function fromDbGenre(genre: Genre | string): string {
  switch (genre) {
    case Genre.Non_Fiction:
    case "Non_Fiction":
    case "Non-Fiction":
      return "Non-Fiction";
    case Genre.Sci_Fi:
    case "Sci_Fi":
    case "Sci-Fi":
      return "Sci-Fi";
    case Genre.Fiction:
    case "Fiction":
      return "Fiction";
    case Genre.Biography:
    case "Biography":
      return "Biography";
    case Genre.Other:
    case "Other":
      return "Other";
    default:
      return genre;
  }
}

export function isValidGenre(genre: string): genre is GenreType {
  return GENRE_ORDER.includes(genre as GenreType);
}

export function formatReadingLog(log: ReadingLog): ReadingLogShape {
  return {
    id: log.id,
    bookTitle: log.bookTitle,
    minutesRead: log.minutesRead,
    genre: fromDbGenre(log.genre),
    note: log.note,
    favorite: log.favorite,
    readOn: log.readOn.toISOString().split("T")[0], // "YYYY-MM-DD"
    createdAt: log.createdAt.toISOString(),
  };
}


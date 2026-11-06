"use client";

import { useState } from "react";
import { useReadingLogContext } from "@/context/ReadingLogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GENRE_ORDER, isValidGenre } from "@/lib/reading-log-utils";

function validateBookTitle(title: string) {
  if (!title || !title.trim()) return "Book title is required";
  if (title.trim().length > 80) return "Book title must be at most 80 characters";
  return "";
}

function validateMinutes(minutes: string) {
  if (minutes === "" || minutes === undefined || minutes === null) {
    return "Minutes read is required";
  }
  const n = Number(minutes);
  if (isNaN(n)) return "Minutes read is required";
  if (n <= 0 || !Number.isInteger(n)) return "Minutes read must be a positive number";
  return "";
}

function validateGenre(genre: string) {
  if (!genre) return "Please choose a genre";
  if (!isValidGenre(genre)) return "Invalid genre";
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

export function ReadingLogForm() {
  const { addReadingLog } = useReadingLogContext();
  const [bookTitle, setBookTitle] = useState("");
  const [minutesRead, setMinutesRead] = useState("");
  const [genre, setGenre] = useState("");
  const [note, setNote] = useState("");
  const [readOn, setReadOn] = useState("");
  const [errors, setErrors] = useState({
    bookTitle: "",
    minutes: "",
    genre: "",
    date: "",
    readingLog: "",
  });
  const [success, setSuccess] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccess("");

    const titleErr = validateBookTitle(bookTitle);
    const minErr = validateMinutes(minutesRead);
    const genreErr = validateGenre(genre);
    const dateErr = validateDate(readOn);

    const errs = {
      bookTitle: titleErr,
      minutes: minErr,
      genre: genreErr,
      date: dateErr,
      readingLog: "",
    };
    setErrors(errs);

    if (titleErr || minErr || genreErr || dateErr) return;

    setLoading(true);
    try {
      const res = await fetch("/api/reading-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: bookTitle.trim(),
          minutesRead: Number(minutesRead),
          genre,
          note: note.trim(),
          readOn,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          readingLog: data.error || "Failed to add reading session",
        }));
      } else {
        addReadingLog(data);
        setBookTitle("");
        setMinutesRead("");
        setGenre("");
        setNote("");
        setReadOn("");
        setSubmitted(false);
        setErrors({
          bookTitle: "",
          minutes: "",
          genre: "",
          date: "",
          readingLog: "",
        });
        setSuccess("Reading session added");
        setTimeout(() => setSuccess(""), 4000);
      }
    } catch {
      setErrors((prev) => ({ ...prev, readingLog: "Network error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-indigo-100/70 bg-white/80 backdrop-blur-md shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>➕</span>
          <span>Add Reading Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          data-testid="reading-log-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3"
        >
          <div className="space-y-1">
            <Label htmlFor="bookTitle" className="text-slate-700 text-xs font-semibold">
              Book Title
            </Label>
            <Input
              id="bookTitle"
              data-testid="input-book-title"
              value={bookTitle}
              onChange={(e) => {
                const val = e.target.value;
                setBookTitle(val);
                if (submitted) {
                  setErrors((p) => ({ ...p, bookTitle: validateBookTitle(val) }));
                }
              }}
              placeholder="e.g. Atomic Habits"
              className="bg-white/90 text-sm"
            />
            {submitted && errors.bookTitle ? (
              <p data-testid="error-book-title" className="text-xs text-rose-500 font-medium">
                {errors.bookTitle}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="minutesRead" className="text-slate-700 text-xs font-semibold">
              Minutes Read
            </Label>
            <Input
              id="minutesRead"
              data-testid="input-minutes"
              type="number"
              min="1"
              step="1"
              value={minutesRead}
              onChange={(e) => {
                const val = e.target.value;
                setMinutesRead(val);
                if (submitted) {
                  setErrors((p) => ({ ...p, minutes: validateMinutes(val) }));
                }
              }}
              placeholder="e.g. 45"
              className="bg-white/90 text-sm"
            />
            {submitted && errors.minutes ? (
              <p data-testid="error-minutes" className="text-xs text-rose-500 font-medium">
                {errors.minutes}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="genre" className="text-slate-700 text-xs font-semibold">
              Genre
            </Label>
            <select
              id="genre"
              data-testid="input-genre"
              value={genre}
              onChange={(e) => {
                const val = e.target.value;
                setGenre(val);
                if (submitted) {
                  setErrors((p) => ({ ...p, genre: validateGenre(val) }));
                }
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white/90 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Choose genre</option>
              {GENRE_ORDER.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {submitted && errors.genre ? (
              <p data-testid="error-genre" className="text-xs text-rose-500 font-medium">
                {errors.genre}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note" className="text-slate-700 text-xs font-semibold">
              Note (optional)
            </Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Chapter 3, notes..."
              className="bg-white/90 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="readOn" className="text-slate-700 text-xs font-semibold">
              Date
            </Label>
            <Input
              id="readOn"
              data-testid="input-date"
              type="date"
              value={readOn}
              onChange={(e) => {
                const val = e.target.value;
                setReadOn(val);
                if (submitted) {
                  setErrors((p) => ({ ...p, date: validateDate(val) }));
                }
              }}
              className="bg-white/90 text-sm"
            />
            {submitted && errors.date ? (
              <p data-testid="error-date" className="text-xs text-rose-500 font-medium">
                {errors.date}
              </p>
            ) : null}
          </div>

          {errors.readingLog ? (
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
              <p data-testid="error-reading-log" className="text-xs text-rose-600 font-medium">
                {errors.readingLog}
              </p>
            </div>
          ) : null}

          {success ? (
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <p data-testid="reading-log-success" className="text-xs text-emerald-600 font-semibold text-center">
                {success}
              </p>
            </div>
          ) : null}

          <Button
            data-testid="btn-add-reading-log"
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl shadow-xs"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Reading Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

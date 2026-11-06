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
    <Card className="glass-panel border-white/80 rounded-3xl p-3 sm:p-5 shadow-lg">
      <CardHeader className="pb-3 px-2">
        <CardTitle className="text-base font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block shadow-2xs"></span>
          <span className="uppercase text-xs tracking-wider font-bold">New Session</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <form
          data-testid="reading-log-form"
          onSubmit={handleSubmit}
          noValidate
          className="space-y-3.5"
        >
          <div className="space-y-1">
            <Label htmlFor="bookTitle" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
              className="glass-input rounded-full px-4 py-2 text-sm"
            />
            {submitted && errors.bookTitle ? (
              <p data-testid="error-book-title" className="text-xs text-rose-500 font-medium pl-2">
                {errors.bookTitle}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="minutesRead" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
              className="glass-input rounded-full px-4 py-2 text-sm"
            />
            {submitted && errors.minutes ? (
              <p data-testid="error-minutes" className="text-xs text-rose-500 font-medium pl-2">
                {errors.minutes}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="genre" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
              className="glass-input w-full rounded-full px-4 py-2 text-sm text-slate-800 focus:outline-hidden"
            >
              <option value="">Choose genre</option>
              {GENRE_ORDER.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {submitted && errors.genre ? (
              <p data-testid="error-genre" className="text-xs text-rose-500 font-medium pl-2">
                {errors.genre}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
              Note (optional)
            </Label>
            <Input
              id="note"
              data-testid="input-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Key takeaways, chapters..."
              className="glass-input rounded-full px-4 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="readOn" className="text-slate-800 text-xs font-semibold uppercase tracking-wider pl-1">
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
              className="glass-input rounded-full px-4 py-2 text-sm"
            />
            {submitted && errors.date ? (
              <p data-testid="error-date" className="text-xs text-rose-500 font-medium pl-2">
                {errors.date}
              </p>
            ) : null}
          </div>

          {errors.readingLog ? (
            <div className="p-2.5 rounded-2xl bg-rose-50/90 border border-rose-200">
              <p data-testid="error-reading-log" className="text-xs text-rose-600 font-medium pl-1">
                {errors.readingLog}
              </p>
            </div>
          ) : null}

          {success ? (
            <div className="p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200">
              <p data-testid="reading-log-success" className="text-xs text-emerald-700 font-semibold text-center">
                {success}
              </p>
            </div>
          ) : null}

          <Button
            data-testid="btn-add-reading-log"
            type="submit"
            className="pill-btn w-full rounded-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Reading Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

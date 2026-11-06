"use client";

import { useState } from "react";
import { useReadingLogContext, ReadingLog } from "@/context/ReadingLogContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GENRE_ORDER, isValidGenre } from "@/lib/reading-log-utils";

export function ReadingLogList() {
  const { readingLogs, updateReadingLog, removeReadingLog } =
    useReadingLogContext();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMinutes, setEditMinutes] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleToggleFavorite = async (log: ReadingLog) => {
    const res = await fetch(`/api/reading-logs/${log.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favorite: !log.favorite }),
    });
    if (res.ok) {
      const updated = await res.json();
      updateReadingLog(updated);
    }
  };

  const handleDelete = async (log: ReadingLog) => {
    const res = await fetch(`/api/reading-logs/${log.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      removeReadingLog(log.id);
    }
  };

  const startEdit = (log: ReadingLog) => {
    setEditingId(log.id);
    setEditTitle(log.bookTitle);
    setEditMinutes(String(log.minutesRead));
    setEditGenre(log.genre);
    setEditNote(log.note || "");
    setEditDate(log.readOn);
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleSaveEdit = async (log: ReadingLog) => {
    setEditError("");
    if (!editTitle.trim()) {
      setEditError("Book title is required");
      return;
    }
    if (editTitle.trim().length > 80) {
      setEditError("Book title must be at most 80 characters");
      return;
    }
    const numMin = Number(editMinutes);
    if (!editMinutes || isNaN(numMin) || numMin <= 0 || !Number.isInteger(numMin)) {
      setEditError("Minutes read must be a positive number");
      return;
    }
    if (!editGenre || !isValidGenre(editGenre)) {
      setEditError("Please choose a genre");
      return;
    }
    if (!editDate) {
      setEditError("Date is required");
      return;
    }
    const d = new Date(editDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d > today) {
      setEditError("Date cannot be in the future");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/reading-logs/${log.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookTitle: editTitle.trim(),
          minutesRead: numMin,
          genre: editGenre,
          note: editNote.trim(),
          readOn: editDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error || "Failed to update session");
      } else {
        updateReadingLog(data);
        setEditingId(null);
      }
    } catch {
      setEditError("Network error");
    } finally {
      setSaving(false);
    }
  };

  if (readingLogs.length === 0) {
    return (
      <div data-testid="reading-log-list" className="space-y-3">
        <div className="py-20 text-center glass-panel rounded-3xl border-dashed border-pink-200">
          <p
            data-testid="reading-logs-empty"
            className="text-slate-500 font-medium text-sm"
          >
            No reading sessions found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="reading-log-list" className="space-y-3.5">
      {readingLogs.map((log) => {
        const isEditing = editingId === log.id;

        return (
          <Card
            key={log.id}
            data-testid="reading-log-item"
            className="glass-panel border-white/90 rounded-3xl p-2 shadow-md hover:shadow-xl transition-all"
          >
            <CardContent className="p-4 sm:p-5">
              {isEditing ? (
                /* Inline Edit Mode */
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-pink-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Edit Reading Session
                    </span>
                    <button
                      onClick={cancelEdit}
                      className="text-xs text-slate-400 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700 uppercase">
                        Book Title
                      </Label>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="glass-input rounded-full text-xs px-3 py-1.5"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700 uppercase">
                        Minutes Read
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={editMinutes}
                        onChange={(e) => setEditMinutes(e.target.value)}
                        className="glass-input rounded-full text-xs px-3 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700 uppercase">
                        Genre
                      </Label>
                      <select
                        value={editGenre}
                        onChange={(e) => setEditGenre(e.target.value)}
                        className="glass-input w-full rounded-full text-xs px-3 py-2 text-slate-800"
                      >
                        {GENRE_ORDER.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-slate-700 uppercase">
                        Date
                      </Label>
                      <Input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="glass-input rounded-full text-xs px-3 py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-slate-700 uppercase">
                      Note
                    </Label>
                    <Input
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="Optional notes"
                      className="glass-input rounded-full text-xs px-3 py-1.5"
                    />
                  </div>

                  {editError ? (
                    <p className="text-xs text-rose-500 font-medium pl-1">
                      {editError}
                    </p>
                  ) : null}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={cancelEdit}
                      className="rounded-full text-xs px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleSaveEdit(log)}
                      disabled={saving}
                      className="rounded-full text-xs px-5 bg-slate-900 text-white hover:bg-slate-800"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Normal Display Mode */
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span
                        data-testid="reading-log-title"
                        className="font-semibold text-slate-900 text-base tracking-tight truncate"
                      >
                        {log.bookTitle}
                      </span>
                      <span
                        data-testid="reading-log-genre"
                        className="text-[11px] font-semibold tracking-wider uppercase bg-pink-100/70 text-pink-700 border border-pink-200/60 px-3 py-0.5 rounded-full"
                      >
                        {log.genre}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-100 shadow-2xs">
                        <span className="text-pink-500">⏱</span>
                        <span
                          data-testid="reading-log-minutes"
                          className="font-bold text-slate-900"
                        >
                          {log.minutesRead}
                        </span>
                        <span className="text-[10px] text-slate-400">mins</span>
                      </span>
                      <span className="flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded-full border border-slate-100 shadow-2xs">
                        <span className="text-sky-500">📅</span>
                        <span
                          data-testid="reading-log-date"
                          className="text-slate-700"
                        >
                          {log.readOn}
                        </span>
                      </span>
                    </div>

                    {log.note ? (
                      <p className="text-xs text-slate-600 mt-2.5 bg-white/50 backdrop-blur-xs p-2.5 rounded-2xl border border-white/80 italic">
                        &ldquo;{log.note}&rdquo;
                      </p>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Favorite Star Button */}
                    <button
                      data-testid="btn-toggle-favorite"
                      aria-pressed={Boolean(log.favorite)}
                      onClick={() => handleToggleFavorite(log)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                        log.favorite
                          ? "text-amber-500 bg-amber-50 border border-amber-200 shadow-xs"
                          : "text-slate-300 hover:text-amber-400 bg-white/60 hover:bg-white border border-white"
                      }`}
                      title={log.favorite ? "Unmark favorite" : "Mark favorite"}
                    >
                      <span className="text-lg leading-none">★</span>
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => startEdit(log)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-sky-600 hover:bg-sky-50 bg-white/60 border border-white hover:border-sky-100 transition-all"
                      title="Edit session"
                    >
                      <span className="text-xs">✏️</span>
                    </button>

                    {/* Delete Button */}
                    <Button
                      data-testid="btn-delete-reading-log"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(log)}
                      className="w-9 h-9 rounded-full p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                      title="Delete session"
                    >
                      <span className="text-sm font-bold leading-none">✕</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { ReadingLogShape } from "@/lib/reading-log-utils";

export type ReadingLog = ReadingLogShape;

export interface User {
  id: string;
  email: string;
}

interface ReadingLogContextType {
  user: User | null;
  readingLogs: ReadingLog[];
  loading: boolean;
  refreshTrigger: number;
  triggerRefresh: () => void;
  setUser: (user: User | null) => void;
  loadReadingLogs: (params?: Record<string, string>) => Promise<void>;
  addReadingLog: (log: ReadingLog) => void;
  updateReadingLog: (log: ReadingLog) => void;
  removeReadingLog: (id: string) => void;
  clearReadingLogs: () => void;
}

const ReadingLogContext = createContext<ReadingLogContextType | null>(null);

export function ReadingLogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<User | null>(null);
  const [readingLogs, setReadingLogs] = useState<ReadingLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshTrigger((v) => v + 1);
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (!u) {
      setReadingLogs([]);
    }
  }, []);

  const loadReadingLogs = useCallback(
    async (params?: Record<string, string>) => {
      setLoading(true);
      try {
        const qs = params
          ? "?" + new URLSearchParams(params).toString()
          : "";
        const res = await fetch(`/api/reading-logs${qs}`);
        if (!res.ok) {
          setReadingLogs([]);
          return;
        }
        const data = await res.json();
        setReadingLogs(data);
      } catch {
        setReadingLogs([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addReadingLog = useCallback((log: ReadingLog) => {
    setReadingLogs((prev) => {
      const updated = [log, ...prev];
      return updated.sort((a, b) => {
        const dateDiff =
          new Date(b.readOn).getTime() - new Date(a.readOn).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.bookTitle.toLowerCase().localeCompare(b.bookTitle.toLowerCase());
      });
    });
    triggerRefresh();
  }, [triggerRefresh]);

  const updateReadingLog = useCallback((log: ReadingLog) => {
    setReadingLogs((prev) =>
      prev.map((l) => (l.id === log.id ? log : l))
    );
    triggerRefresh();
  }, [triggerRefresh]);

  const removeReadingLog = useCallback((id: string) => {
    setReadingLogs((prev) => prev.filter((l) => l.id !== id));
    triggerRefresh();
  }, [triggerRefresh]);

  const clearReadingLogs = useCallback(() => {
    setReadingLogs([]);
  }, []);

  return (
    <ReadingLogContext.Provider
      value={{
        user,
        readingLogs,
        loading,
        refreshTrigger,
        triggerRefresh,
        setUser,
        loadReadingLogs,
        addReadingLog,
        updateReadingLog,
        removeReadingLog,
        clearReadingLogs,
      }}
    >
      {children}
    </ReadingLogContext.Provider>
  );
}

export function useReadingLogContext() {
  const ctx = useContext(ReadingLogContext);
  if (!ctx) {
    throw new Error(
      "useReadingLogContext must be used within a ReadingLogProvider"
    );
  }
  return ctx;
}


import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/50 via-white to-pink-50/30">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
            Reading Session Tracker
          </div>
          <h1
            data-testid="home-title"
            className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl"
          >
            ReadLog
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track your personal reading sessions: record which book you read,
            how many minutes you spent, what genre, and keep favorites highlighted
            with live reading statistics.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-100 transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-white/80 hover:bg-white text-slate-700 font-medium border border-slate-200/80 shadow-xs transition-all hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Card className="border-indigo-100/60 bg-white/70 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl mb-2">
                📖
              </div>
              <CardTitle className="text-slate-900 font-bold">
                Log every session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed">
                Record book titles, duration in minutes, notes, and dates for
                every book reading session.
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-100/60 bg-white/70 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center text-xl mb-2">
                🏷️
              </div>
              <CardTitle className="text-slate-900 font-bold">
                Sort by genre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed">
                Categorize your books into Fiction, Non-Fiction, Sci-Fi,
                Biography, or Other with instant filtering.
              </p>
            </CardContent>
          </Card>

          <Card className="border-indigo-100/60 bg-white/70 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl mb-2">
                ⏱️
              </div>
              <CardTitle className="text-slate-900 font-bold">
                See minutes read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enjoy real-time summaries of total minutes, session counts, and
                a breakdown per genre with favorite highlights.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

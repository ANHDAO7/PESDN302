import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#bce3fe] via-[#f7d5e4] to-[#fbcfe8]">
      {/* 3D Fluid Ribbon Background SVG */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-90">
        <svg
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover min-w-[1200px]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="35%" stopColor="#ffb5d5" />
              <stop offset="65%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
            <filter id="ribbonShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="25" stdDeviation="30" floodColor="#f43f5e" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background Ambient Glows */}
          <circle cx="200" cy="150" r="300" fill="#93c5fd" opacity="0.45" filter="blur(70px)" />
          <circle cx="1200" cy="450" r="380" fill="#f472b6" opacity="0.4" filter="blur(90px)" />
          <circle cx="600" cy="750" r="320" fill="#fbcfe8" opacity="0.5" filter="blur(80px)" />

          {/* 3D Curving Loop Ribbon */}
          <path
            d="M -100,850 C 150,550 250,50 350,-50 C 450,-150 150,750 650,450 C 950,220 1200,50 1100,350 C 1000,600 1300,750 1600,850"
            stroke="url(#ribbonGrad)"
            strokeWidth="110"
            strokeLinecap="round"
            filter="url(#ribbonShadow)"
            opacity="0.95"
          />
        </svg>
      </div>

      {/* Navigation Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 pt-10 pb-20 relative z-10 flex flex-col justify-between min-h-[calc(100vh-100px)]">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <h1
              data-testid="home-title"
              className="text-6xl sm:text-7xl lg:text-8xl font-light tracking-tight text-slate-900 leading-none uppercase font-sans select-none"
            >
              ReadLog
            </h1>
            <p className="text-slate-700 text-sm sm:text-base max-w-md leading-relaxed font-normal">
              A minimalist space to track your daily personal reading sessions:
              which book was read, how many minutes you spent, what genre, and
              favorite highlights with real-time statistics.
            </p>
            <div className="pt-2 flex items-center gap-4 flex-wrap">
              <Link
                href="/reading-logs"
                className="pill-btn inline-flex items-center gap-2 border border-slate-900/20 px-6 py-2.5 bg-white/40 hover:bg-white/80 text-slate-900 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-xs transition-all"
              >
                <span>Explore style system</span>
                <span className="text-sm">→</span>
              </Link>
              <Link
                href="/register"
                className="pill-btn inline-flex items-center border border-pink-400/30 px-6 py-2.5 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold tracking-wider uppercase shadow-md shadow-pink-200/50 transition-all"
              >
                Start Logging
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:flex justify-end items-end h-full">
            <div className="text-right uppercase tracking-widest text-slate-900 space-y-1 select-none pr-4">
              <p className="text-2xl font-light text-slate-700">UI / UX</p>
              <p className="text-3xl font-extrabold text-slate-900">DESIGN</p>
            </div>
          </div>
        </div>

        {/* 3 Feature Cards required by exam */}
        <div className="pt-16 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel border-white/80 rounded-3xl p-2 transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-200 flex items-center justify-center text-xl mb-2 shadow-2xs">
                  📖
                </div>
                <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
                  Log every session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Easily record titles, duration in minutes, personal notes, and
                  read dates in one fluid, beautiful interface.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/80 rounded-3xl p-2 transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-100 to-indigo-200 flex items-center justify-center text-xl mb-2 shadow-2xs">
                  🏷️
                </div>
                <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
                  Sort by genre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Organize books into Fiction, Non-Fiction, Sci-Fi, Biography,
                  or Other with instant responsive filtering.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel border-white/80 rounded-3xl p-2 transition-all hover:-translate-y-1 hover:shadow-lg">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-200 flex items-center justify-center text-xl mb-2 shadow-2xs">
                  ⏱️
                </div>
                <CardTitle className="text-base font-bold text-slate-900 tracking-tight">
                  See minutes read
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time summary breakdown of minutes read by genre, favorite
                  counts, and overall session milestones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

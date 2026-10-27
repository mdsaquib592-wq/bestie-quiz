import React from "react";

export default function Header({ onReset, onOpenResults, hasSavedQuiz }) {
  return (
    <header className="w-full max-w-md flex items-center justify-between py-3">
      <button
        onClick={onReset}
        className="flex items-center gap-2 text-left cursor-pointer transition hover:opacity-90"
      >
        <span className="text-2xl">🔥</span>
        <div>
          <h1 className="text-lg font-black tracking-tight bg-gradient-to-r from-pink-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
            BestieDare
          </h1>
          <p className="text-[10px] text-slate-400 font-medium">
            Friendship Test 2026
          </p>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {hasSavedQuiz && (
          <button
            onClick={onOpenResults}
            className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 transition cursor-pointer"
          >
            📊 My Results
          </button>
        )}
        <span className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
          Viral Quiz
        </span>
      </div>
    </header>
  );
}

import React from "react";

export default function ResultsCard({
  score,
  total,
  targetName,
  friendName,
  onCreateOwn,
}) {
  const percentage = Math.round((score / total) * 100);

  let badgeTitle = "Acquaintance 👀";
  let badgeDesc = "You two definitely need to hang out more!";
  let badgeColor = "text-amber-400";

  if (percentage >= 80) {
    badgeTitle = "True Soulmate 💖";
    badgeDesc = "You know them inside out! Unbreakable bond.";
    badgeColor = "text-pink-400";
  } else if (percentage >= 50) {
    badgeTitle = "Great Friend 🌟";
    badgeDesc = "You know each other well, with a few mysteries left!";
    badgeColor = "text-indigo-400";
  }

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
      <span className="text-4xl mb-2 block">🏆</span>
      <h2 className="text-2xl font-black text-white mb-1">
        Challenge Completed!
      </h2>
      <p className="text-xs text-slate-400 mb-6">
        <span className="text-slate-200 font-semibold">{friendName}</span>{" "}
        tested knowledge on{" "}
        <span className="text-pink-400 font-semibold">{targetName}</span>
      </p>

      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 border-2 border-pink-500/40 flex flex-col items-center justify-center mb-4">
        <span className="text-3xl font-black text-white">
          {score}/{total}
        </span>
        <span className="text-xs font-semibold text-slate-400">
          {percentage}% Score
        </span>
      </div>

      <div className="mb-6">
        <h3 className={`text-lg font-black ${badgeColor}`}>{badgeTitle}</h3>
        <p className="text-xs text-slate-400 mt-1">{badgeDesc}</p>
      </div>

      <button
        onClick={onCreateOwn}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
      >
        Create Your Own Quiz 🔥
      </button>
    </div>
  );
}

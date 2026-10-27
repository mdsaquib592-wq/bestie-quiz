import React from "react";

export default function ResultsCard({
  score,
  total,
  targetName,
  friendName,
  currentCategory,
  onViewLeaderboard,
  onCreateOwn,
}) {
  const percentage = Math.round((score / total) * 100);

  let badgeTitle = "Casual Connection 👀";
  let badgeColor = "text-amber-400";
  let badgeDesc = "You need to spend more time catching up!";

  if (percentage >= 80) {
    badgeTitle = `${currentCategory.badgeLabel} 🏆`;
    badgeColor = "text-pink-400";
    badgeDesc = `Incredible! You know ${targetName} inside and out.`;
  } else if (percentage >= 50) {
    badgeTitle = "Close Connection 🌟";
    badgeColor = "text-indigo-400";
    badgeDesc = "You know each other quite well with only a few blind spots!";
  }

  // Pre-filled WhatsApp response message to send directly to the creator
  const sendScoreMsg = encodeURIComponent(
    `Hey ${targetName}! 👋 I just took your "${currentCategory.title}" quiz!\n🎯 My Score: ${score}/${total} (${percentage}%)\n🏅 Title: ${badgeTitle}\nCan anyone beat me? 😎`,
  );
  const whatsappSendScoreUrl = `https://api.whatsapp.com/send?text=${sendScoreMsg}`;

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
      <span className="text-4xl mb-2 block">{currentCategory.emoji}</span>
      <h2 className="text-2xl font-black text-white mb-1">
        Challenge Completed!
      </h2>
      <p className="text-xs text-slate-400 mb-6">
        <span className="text-slate-200 font-semibold">{friendName}</span>{" "}
        tested on{" "}
        <span className="text-pink-400 font-semibold">{targetName}</span>'s{" "}
        {currentCategory.title} Quiz
      </p>

      {/* Score Badge */}
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

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Send score to creator */}
        <a
          href={whatsappSendScoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
        >
          📲 Send Score to {targetName} on WhatsApp
        </a>

        {/* View Scoreboard */}
        <button
          onClick={onViewLeaderboard}
          className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          📊 View Quiz Scoreboard
        </button>

        {/* Viral loop */}
        <button
          onClick={onCreateOwn}
          className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${currentCategory.gradient} text-white font-bold text-sm shadow-lg hover:opacity-95 active:scale-[0.98] transition cursor-pointer`}
        >
          Create Your Own Quiz 🔥
        </button>
      </div>
    </div>
  );
}

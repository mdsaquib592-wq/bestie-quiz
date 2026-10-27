import React, { useState } from "react";

export default function ResultsCard({
  score,
  total,
  targetName,
  friendName,
  currentCategory,
  questions = [],
  creatorAnswers = [],
  friendAnswers = [],
  resultSyncUrl,
  onViewLeaderboard,
  onCreateOwn,
}) {
  const [showReview, setShowReview] = useState(false);
  const percentage = Math.round((score / total) * 100);

  let badgeTitle = "Fake Friend Alert 👀";
  let badgeColor = "text-amber-400";
  let badgeDesc = `Lagta hai aapko ${targetName} ke saath aur waqt bitane ki zaroorat hai!`;

  if (percentage >= 80) {
    badgeTitle = `${currentCategory.badgeLabel} 🏆`;
    badgeColor = "text-pink-400";
    badgeDesc = `Kamaal! Aap ${targetName} ko rag-rag se jaante ho! 🔥`;
  } else if (percentage >= 50) {
    badgeTitle = "True Connection 🌟";
    badgeColor = "text-indigo-400";
    badgeDesc = `Kaafi achha score! Bas 1-2 secrets jaanna baaki hai.`;
  }

  // WhatsApp message includes the Sync URL so Creator can tap once to import the score
  const sendScoreMsg = encodeURIComponent(
    `Hey ${targetName}! 👋 Maine abhi tumhara "${currentCategory.title}" Quiz play kiya!\n\n🎯 Mera Score: *${score}/${total} (${percentage}%)*\n🏅 Badge: *${badgeTitle}*\n\n👇 Apne Leaderboard me mera score & answers dekhne ke liye is link par click karo:\n${resultSyncUrl}`,
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
        attempted{" "}
        <span className="text-pink-400 font-semibold">{targetName}</span>'s{" "}
        {currentCategory.title} Quiz
      </p>

      {/* Score Circle */}
      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-pink-500/20 to-indigo-500/20 border-2 border-pink-500/40 flex flex-col items-center justify-center mb-4 shadow-inner">
        <span className="text-3xl font-black text-white">
          {score}/{total}
        </span>
        <span className="text-xs font-semibold text-pink-400">
          {percentage}% Match
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

        {/* Toggle Answer Review */}
        <button
          onClick={() => setShowReview(!showReview)}
          className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {showReview
            ? "🔼 Hide Answer Key"
            : "📝 Check Correct & Wrong Answers"}
        </button>

        {/* Answer Key Drawer */}
        {showReview && (
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left space-y-2.5 max-h-64 overflow-y-auto text-xs">
            {questions.map((q, idx) => {
              const isRight = friendAnswers[idx] === creatorAnswers[idx];
              return (
                <div
                  key={q.id}
                  className={`p-2.5 rounded-xl border ${
                    isRight
                      ? "bg-emerald-950/30 border-emerald-500/30"
                      : "bg-rose-950/30 border-rose-500/30"
                  }`}
                >
                  <p className="font-bold text-slate-200 text-[11px] mb-1">
                    {idx + 1}. {q.question}
                  </p>
                  <p className="text-[10px]">
                    Your Answer:{" "}
                    <span
                      className={
                        isRight
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {q.options[friendAnswers[idx]]} {isRight ? "✅" : "❌"}
                    </span>
                  </p>
                  {!isRight && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {targetName}'s Choice:{" "}
                      <span className="text-emerald-300 font-semibold">
                        {q.options[creatorAnswers[idx]]}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* View Scoreboard */}
        <button
          onClick={onViewLeaderboard}
          className="w-full py-3 px-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
        >
          📊 View Quiz Leaderboard
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

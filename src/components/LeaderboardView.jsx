import React, { useState } from "react";

export default function LeaderboardView({
  quizTitle,
  creatorName,
  questions,
  creatorAnswers,
  results = [],
  onRefresh,
  onBack,
  onCreateNew,
}) {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sort scores descending (highest score first)
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  const handleManualRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-5 sm:p-7 shadow-2xl text-center">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <button
          onClick={onBack}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
        >
          ← Back
        </button>
        <button
          onClick={handleManualRefresh}
          className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
        >
          {isRefreshing ? "⏳ Syncing..." : "🔄 Refresh Live Scores"}
        </button>
        <button
          onClick={onCreateNew}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
        >
          + New Quiz
        </button>
      </div>

      <div className="text-3xl mb-1">📊</div>
      <h2 className="text-xl font-black text-white">
        {creatorName}'s Leaderboard
      </h2>
      <p className="text-xs text-slate-400 mb-5">
        {quizTitle} • {sortedResults.length}{" "}
        {sortedResults.length === 1 ? "friend" : "friends"} attempted
      </p>

      {/* Leaderboard Table / Cards */}
      {sortedResults.length === 0 ? (
        <div className="py-10 px-4 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700/60 my-4">
          <p className="text-3xl mb-2">⏳</p>
          <p className="text-sm font-bold text-slate-300">No attempts yet!</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Apna quiz link WhatsApp par friends ko bhejein. Jaise hi wo quiz
            dekar{" "}
            <span className="text-emerald-400 font-semibold">
              "Send Score on WhatsApp"
            </span>{" "}
            par click karenge ya online submit karenge, unka result yahan dikhne
            lagega!
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 my-4 scrollbar-thin">
          {sortedResults.map((res, index) => {
            const percentage = Math.round((res.score / questions.length) * 100);
            const medal =
              index === 0
                ? "🥇"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : `#${index + 1}`;

            return (
              <div
                key={res.id || index}
                onClick={() =>
                  setSelectedFriend(selectedFriend?.id === res.id ? null : res)
                }
                className="w-full p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 flex items-center justify-between text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base font-black w-6 text-center text-slate-400">
                    {medal}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-pink-300 transition">
                      {res.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {res.date || "Just now"} • Tap to see answers
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-pink-400">
                    {res.score}/{questions.length}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400">
                    {percentage}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Answer Comparison Modal / Drawer */}
      {selectedFriend && selectedFriend.answers && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-pink-500/30 text-left">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-pink-400">
              {selectedFriend.name}'s Answers Breakdown:
            </h4>
            <button
              onClick={() => setSelectedFriend(null)}
              className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
            {questions.map((q, idx) => {
              const creatorAnsIdx = creatorAnswers[idx];
              const friendAnsIdx = selectedFriend.answers[idx];
              const isCorrect = creatorAnsIdx === friendAnsIdx;

              return (
                <div
                  key={q.id}
                  className={`p-2.5 rounded-xl border ${
                    isCorrect
                      ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                      : "bg-rose-950/30 border-rose-500/30 text-rose-200"
                  }`}
                >
                  <p className="font-semibold text-slate-200 text-[11px] mb-1">
                    {idx + 1}. {q.question}
                  </p>
                  <p className="text-[10px]">
                    <span className="text-slate-400">Guessed: </span>
                    <span
                      className={
                        isCorrect
                          ? "text-emerald-400 font-bold"
                          : "text-rose-400 font-bold"
                      }
                    >
                      {q.options[friendAnsIdx] || "No Answer"}{" "}
                      {isCorrect ? "✅" : "❌"}
                    </span>
                  </p>
                  {!isCorrect && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Correct:{" "}
                      <span className="text-slate-200">
                        {q.options[creatorAnsIdx]}
                      </span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="w-full mt-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
      >
        Done Viewing
      </button>
    </div>
  );
}

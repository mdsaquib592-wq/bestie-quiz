import React from "react";

export default function QuizQuestion({
  questionData,
  currentIndex,
  totalQuestions,
  targetName,
  isFriendMode,
  onSelectOption,
}) {
  const progressPercent = Math.round(
    ((currentIndex + 1) / totalQuestions) * 100,
  );

  const displayQuestion = isFriendMode
    ? questionData.question
        .replace(/my/gi, `${targetName}'s`)
        .replace(/I /gi, `${targetName} `)
    : questionData.question;

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-6 leading-snug">
        {displayQuestion}
      </h3>

      <div className="space-y-3">
        {questionData.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectOption(idx)}
            className="w-full text-left p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-[0.98] border border-slate-700/60 hover:border-pink-500/50 text-slate-200 hover:text-white font-medium text-sm transition-all flex items-center justify-between group cursor-pointer"
          >
            <span>{opt}</span>
            <span className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-xs group-hover:border-pink-400 group-hover:bg-pink-500/20 text-slate-400 group-hover:text-pink-300">
              {String.fromCharCode(65 + idx)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

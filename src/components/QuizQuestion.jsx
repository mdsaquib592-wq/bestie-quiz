import React, { useState, useEffect } from "react";

export default function QuizQuestion({
  questionData,
  currentIndex,
  totalQuestions,
  targetName,
  isFriendMode,
  correctOptionIndex,
  onSelectOption,
}) {
  const [selectedIdx, setSelectedIdx] = useState(null);

  // Reset selection state whenever question changes
  useEffect(() => {
    setSelectedIdx(null);
  }, [currentIndex]);

  if (!questionData) return null;
  const progressPercent = Math.round(
    ((currentIndex + 1) / totalQuestions) * 100,
  );

  // Safe word-boundary replacements so words like "tummy" don't break
  const formatForFriend = (text) => {
    if (!isFriendMode || !targetName) return text;
    return text
      .replace(/\bmy\b/gi, `${targetName}'s`)
      .replace(/\bI\b/g, targetName)
      .replace(/\bmain\b/gi, targetName)
      .replace(/\bmera\b/gi, `${targetName} ka`)
      .replace(/\bmeri\b/gi, `${targetName} ki`)
      .replace(/\bmere\b/gi, `${targetName} ke`)
      .replace(/\bmujhe\b/gi, `${targetName} ko`);
  };

  const displayQuestion = formatForFriend(questionData.question);

  const handleOptionClick = (idx) => {
    if (selectedIdx !== null) return; // Prevent double-taps

    if (isFriendMode) {
      setSelectedIdx(idx);
      setTimeout(() => {
        onSelectOption(idx);
      }, 750);
    } else {
      onSelectOption(idx);
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="mb-6">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-pink-400 font-bold">
            Question {currentIndex + 1} / {totalQuestions}
          </span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-white mb-6 leading-snug">
        {displayQuestion}
      </h3>

      <div className="space-y-3">
        {questionData.options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrect = idx === correctOptionIndex;

          let btnStyle =
            "bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 hover:border-pink-500/50 text-slate-200 hover:text-white";
          let badgeText = String.fromCharCode(65 + idx);
          let badgeStyle =
            "border-slate-600 text-slate-400 group-hover:border-pink-400 group-hover:bg-pink-500/20 group-hover:text-pink-300";

          // Instant Real-Quiz Feedback in Friend Mode
          if (isFriendMode && selectedIdx !== null) {
            if (isCorrect) {
              btnStyle =
                "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10 scale-[1.01]";
              badgeText = "✓";
              badgeStyle =
                "border-emerald-400 bg-emerald-500 text-slate-950 font-black";
            } else if (isSelected && !isCorrect) {
              btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200";
              badgeText = "✕";
              badgeStyle = "border-rose-400 bg-rose-500 text-white font-black";
            } else {
              btnStyle =
                "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={selectedIdx !== null}
              onClick={() => handleOptionClick(idx)}
              className={`w-full text-left p-4 rounded-2xl border font-medium text-sm transition-all flex items-center justify-between group cursor-pointer active:scale-[0.98] ${btnStyle}`}
            >
              <span className="pr-3">{opt}</span>
              <span
                className={`w-7 h-7 flex-shrink-0 rounded-full border flex items-center justify-center text-xs transition-all ${badgeStyle}`}
              >
                {badgeText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

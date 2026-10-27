import React, { useState } from "react";

export default function WelcomeCard({ targetName, isFriendMode, onStart }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name first");
      return;
    }
    setError("");
    onStart(name.trim());
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/20">
        {isFriendMode ? "🤝" : "✨"}
      </div>

      <h2 className="text-2xl font-black text-white mb-2">
        {isFriendMode ? (
          <>
            How well do you know{" "}
            <span className="text-pink-400">{targetName}</span>?
          </>
        ) : (
          <>
            Create Your <span className="text-pink-400">Friendship Quiz</span>
          </>
        )}
      </h2>

      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        {isFriendMode
          ? `Answer 10 quick questions to test how well you know ${targetName}!`
          : "Answer 10 fun questions about yourself, get your unique share link, and challenge your friends on WhatsApp!"}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 text-center font-medium text-lg transition-all"
            maxLength={25}
            autoFocus
          />
          {error && (
            <p className="text-xs text-rose-400 mt-2 font-medium">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-600 text-white font-bold text-base shadow-lg shadow-pink-500/30 hover:opacity-95 active:scale-[0.98] transition cursor-pointer"
        >
          {isFriendMode ? "Start Challenge 🚀" : "Start Creating My Quiz 🚀"}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from "react";

export default function ShareModal({ shareUrl, onRestart, onViewResults }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert("Please copy the link directly from your browser's address bar.");
    }
  };

  const shareText = encodeURIComponent(
    `🔥 How well do you really know me? Take the 2026 Friendship Challenge and check your score on the leaderboard! 👇\n${shareUrl}`,
  );
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent("How well do you know me? Take my quiz!")}`;

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl border border-emerald-500/30">
        🎉
      </div>

      <h2 className="text-2xl font-black text-white mb-2">Quiz Created!</h2>
      <p className="text-sm text-slate-400 mb-6">
        Share this unique link with your friends on WhatsApp to see who knows
        you best!
      </p>

      {/* Copy Link Bar */}
      <div className="flex items-center gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700 mb-4">
        <input
          type="text"
          readOnly
          value={shareUrl}
          className="bg-transparent text-xs text-slate-300 px-2 w-full outline-none select-all"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer"
        >
          {copied ? "Copied! ✅" : "Copy"}
        </button>
      </div>

      {/* Social Share Buttons */}
      <div className="space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition cursor-pointer"
        >
          Share on WhatsApp
        </a>

        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition cursor-pointer"
        >
          Share on Telegram
        </a>

        {/* View Results / Leaderboard Button */}
        <button
          onClick={onViewResults}
          className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          📊 Check Live Results & Scoreboard
        </button>
      </div>

      <button
        onClick={onRestart}
        className="mt-6 text-xs text-slate-500 hover:text-slate-300 underline font-medium cursor-pointer"
      >
        Create Another Quiz
      </button>
    </div>
  );
}

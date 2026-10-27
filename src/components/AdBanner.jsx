import React from "react";

export default function AdBanner({
  slotLabel = "Banner Ad",
  format = "horizontal",
}) {
  return (
    <div className="w-full max-w-md my-4 flex flex-col items-center justify-center">
      <div
        className={`w-full ${
          format === "box" ? "h-64" : "h-24"
        } rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-3 text-center transition-all`}
      >
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
          Advertisement • {slotLabel}
        </span>
        <p className="text-xs text-slate-400 font-medium">
          Ad Space (
          {format === "box" ? "300x250 Rectangle" : "Responsive Banner"})
        </p>
      </div>
    </div>
  );
}

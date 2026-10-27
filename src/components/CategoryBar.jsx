import React from "react";
import { QUIZ_CATEGORIES } from "../data/questions";

export default function CategoryBar({
  selectedCategory,
  onSelectCategory,
  disabled,
}) {
  const categories = Object.values(QUIZ_CATEGORIES);

  return (
    <div className="w-full max-w-md my-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Choose Quiz Category
        </span>
        <span className="text-[10px] text-pink-400 font-semibold">
          6 Modes Available
        </span>
      </div>

      {/* Horizontal Scrollable Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              disabled={disabled}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 snap-start px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 border cursor-pointer ${
                isSelected
                  ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-md scale-105`
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <span>{cat.emoji}</span>
              <span className="whitespace-nowrap">{cat.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

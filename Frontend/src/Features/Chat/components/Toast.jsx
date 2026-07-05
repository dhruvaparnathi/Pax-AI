import React from "react";

export default function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm bg-zinc-950/95 border border-red-900/50 text-zinc-100 px-4 py-3.5 rounded-xl shadow-2xl flex items-start gap-3 z-50 animate-fade-in backdrop-blur-md">
      <span className="text-base flex-shrink-0 mt-0.5 select-none">⚠️</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-red-400 select-none">Error occurred</p>
        <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5 break-words select-text">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-zinc-500 hover:text-zinc-300 text-xs font-bold px-1 transition-colors cursor-pointer select-none"
      >
        ✕
      </button>
    </div>
  );
}

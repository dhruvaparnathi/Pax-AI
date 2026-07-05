import React from "react";

export default function LandingPanel({
  searchQuery,
  setSearchQuery,
  focusOptions,
  selectedFocus,
  setSelectedFocus,
  suggestions,
  onSearchSubmit,
  selectedFiles,
  filePreviews,
  onAttachmentClick,
  onRemoveFile,
  isLoading
}) {
  return (
    <div className="flex-1 overflow-y-auto w-full custom-scrollbar flex flex-col items-center">
      <div className="max-w-[680px] mx-auto w-full px-6 py-12 md:py-24 flex flex-col justify-center items-center min-h-full">

        <h2 className="text-3xl font-display font-medium text-zinc-100 mb-8 tracking-tight text-center select-none">
          Where knowledge comes at a Prompt
        </h2>

        {/* Search Box */}
        <div className="w-full border border-zinc-900 focus-within:border-zinc-800 rounded-2xl p-4 transition-all duration-200">
          <form onSubmit={onSearchSubmit}>
            {selectedFiles && selectedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-2 bg-zinc-900/30 rounded-xl border border-zinc-900/40 select-none">
                {selectedFiles.map((file, idx) => (
                  <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img src={filePreviews[idx]} alt="thumbnail" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => onRemoveFile(idx)}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-zinc-950/80 hover:bg-zinc-950 text-zinc-400 hover:text-zinc-200 rounded-full flex items-center justify-center text-[10px] cursor-pointer animate-fade-in"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSearchSubmit(e);
                }
              }}
              placeholder="Ask anything..."
              rows="3"
              className="w-full bg-transparent resize-none text-zinc-200 text-sm outline-none placeholder:text-zinc-700 custom-scrollbar"
            />
            <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-2">
              {/* Attachment and Focus Filter Select */}
              <div className="flex items-center gap-3 max-w-[70%] select-none">
                <button
                  type="button"
                  onClick={onAttachmentClick}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer flex items-center justify-center flex-shrink-0"
                  title="Upload images"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {focusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedFocus(opt)}
                      className={`text-[10px] px-2.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${selectedFocus === opt
                          ? "bg-zinc-900 text-zinc-100 border border-zinc-800"
                          : "bg-transparent border border-transparent text-zinc-600 hover:text-zinc-400"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!searchQuery.trim() && selectedFiles.length === 0) || isLoading}
                className={`p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${(searchQuery.trim() || selectedFiles.length > 0) && !isLoading
                    ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                    : "bg-transparent text-zinc-800 border border-zinc-900 cursor-not-allowed"
                  }`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick suggestions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5 w-full mt-10 select-none">
          {suggestions.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSearchQuery(sug.title)}
              className="border border-zinc-900 hover:border-zinc-800 text-left p-4.5 rounded-2xl transition-colors flex flex-col gap-1 cursor-pointer bg-transparent"
            >
              <span className="text-xs font-semibold text-zinc-200">{sug.title}</span>
              <span className="text-[10px] text-zinc-600 font-sans">{sug.desc}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

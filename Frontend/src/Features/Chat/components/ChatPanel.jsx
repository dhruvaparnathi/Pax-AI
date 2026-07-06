import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function ChatPanel({
  activeChat,
  isLoading,
  followUpQuery,
  setFollowUpQuery,
  onFollowUpSubmit,
  selectedFiles,
  filePreviews,
  onAttachmentClick,
  onRemoveFile,
  messagesEndRef,
  isListening,
  isSpeechSupported,
  listeningTarget,
  onStartListening,
  onStopListening
}) {
  const renderLoadingSkeleton = () => {
    if (!isLoading) return null;
    if (activeChat && activeChat.messages.length > 0) {
      const lastMsg = activeChat.messages[activeChat.messages.length - 1];
      if (lastMsg.role === "user") {
        return (
          <div className="flex gap-4 mb-8 animate-pulse select-none">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700/50 mt-1 flex-shrink-0">
              AI
            </div>
            <div className="flex-1 space-y-2.5 mt-2.5">
              <div className="h-3.5 bg-zinc-900 rounded-md w-3/4"></div>
              <div className="h-3.5 bg-zinc-900 rounded-md w-1/2"></div>
              <div className="h-3.5 bg-zinc-900 rounded-md w-5/6"></div>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Thread Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-900/60 px-6 py-4 bg-zinc-950/80 backdrop-blur-sm z-10 flex-shrink-0 select-none">
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-zinc-100 truncate">
            {activeChat?.title || "Untitled Thread"}
          </h1>
        </div>
      </div>

      {/* Messages List Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar">
        <div className="max-w-[680px] mx-auto space-y-8">
          {activeChat?.messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div key={idx} className="animate-fade-in">
                {isUser ? (
                  /* User query card */
                  <div className="flex justify-end mb-2 select-text">
                    <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 text-sm px-4.5 py-3 rounded-2xl max-w-[85%] shadow-sm leading-relaxed whitespace-pre-wrap flex flex-col gap-2.5">
                      {msg.content && <div>{msg.content}</div>}
                      {msg.media && msg.media.length > 0 && (
                        <div className="flex flex-wrap gap-2 select-none">
                          {msg.media.map((img, i) => (
                            <a key={i} href={img.url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={img.url}
                                alt={img.alt || "Uploaded image"}
                                className="max-w-[240px] max-h-[160px] rounded-lg object-cover border border-zinc-800 hover:border-zinc-700 transition-colors shadow-sm"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* AI response block */
                  <div className="flex gap-4 items-start select-text">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700/50 mt-1 flex-shrink-0 select-none">
                      AI
                    </div>
                    <div className="flex-1 min-w-0">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Skeleton Typing screen */}
          {renderLoadingSkeleton()}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Follow-up Box */}
      <div className="border-t border-zinc-900/60 bg-zinc-950 px-6 py-4 flex-shrink-0">
        <div className="max-w-[680px] mx-auto relative">
          <form onSubmit={onFollowUpSubmit}>
            <div className="border border-zinc-900 focus-within:border-zinc-800 rounded-2xl p-3.5 bg-zinc-950 transition-all duration-200">
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
                value={followUpQuery}
                onChange={(e) => setFollowUpQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onFollowUpSubmit(e);
                  }
                }}
                placeholder="Ask follow-up..."
                rows="2"
                className="w-full bg-transparent resize-none text-zinc-200 text-sm outline-none placeholder:text-zinc-700 custom-scrollbar pr-10"
              />
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-2.5 mt-2 select-none">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onAttachmentClick}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer flex items-center justify-center"
                    title="Upload images"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>

                  {isSpeechSupported && (
                    <button
                      type="button"
                      onClick={() => {
                        if (isListening && listeningTarget === "followUp") {
                          onStopListening();
                        } else {
                          onStartListening("followUp");
                        }
                      }}
                      className={`p-1.5 rounded-lg hover:bg-zinc-900 transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer ${
                        isListening && listeningTarget === "followUp"
                          ? "text-red-500 animate-pulse bg-red-950/20 hover:bg-red-950/30"
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                      title={isListening && listeningTarget === "followUp" ? "Stop voice search" : "Voice search"}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </button>
                  )}

                  <span className="text-[10px] text-zinc-600 font-medium">
                    Press Enter to send, Shift+Enter for new line
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={(!followUpQuery.trim() && selectedFiles.length === 0) || isLoading}
                  className={`p-2 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${(followUpQuery.trim() || selectedFiles.length > 0) && !isLoading
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

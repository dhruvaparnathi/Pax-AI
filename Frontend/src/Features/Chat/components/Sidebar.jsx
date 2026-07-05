import React from "react";

export default function Sidebar({
  chats,
  currentChatId,
  user,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  onNewThread,
  onOpenChat,
  onDeleteChat,
  onSignOut
}) {
  return (
    <aside
      className={`w-60 border-r border-zinc-900 bg-zinc-950 p-6 flex flex-col justify-between flex-shrink-0 z-40 transition-all duration-300 md:duration-0 ${isMobileSidebarOpen
          ? "fixed inset-y-0 left-0 bg-zinc-950 shadow-2xl"
          : "fixed inset-y-0 -left-60 md:static md:flex"
        } md:flex flex-shrink-0 h-full`}
    >
      <div className="flex flex-col flex-1 min-h-0 space-y-6">
        {/* Logo */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={onNewThread}
          >
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-200">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" />
              <path d="M12 20H28M20 12V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="font-display font-bold text-base text-zinc-100 tracking-tight select-none">
              perplexity
            </span>
          </div>

          {isMobileSidebarOpen && (
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* New Thread Button */}
        <button
          onClick={onNewThread}
          className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950 hover:bg-zinc-900/60 text-zinc-200 hover:text-zinc-100 font-semibold text-xs transition-all cursor-pointer select-none"
        >
          <span className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Thread
          </span>
          <kbd className="hidden sm:inline-block text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-600 font-mono border border-zinc-800">Ctrl K</kbd>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1 select-none">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNewThread();
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors ${!currentChatId
                ? "bg-zinc-900 text-zinc-100 font-bold"
                : "text-zinc-500 hover:text-zinc-300 font-medium"
              }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </a>
        </nav>

        {/* Recent Threads List */}
        <div className="flex-1 flex flex-col min-h-0 select-none">
          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-wider px-2 mb-2">
            <span>Recent Threads</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {Object.values(chats).length === 0 ? (
              <p className="text-[10px] text-zinc-700 px-2 italic mt-2">No threads yet</p>
            ) : (
              Object.values(chats)
                .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
                .map((c) => {
                  const isActive = currentChatId === c._id;
                  return (
                    <div
                      key={c._id}
                      className={`group flex items-center justify-between w-full px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${isActive
                          ? "bg-zinc-900 text-zinc-100 font-semibold border border-zinc-800"
                          : "hover:bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 font-medium"
                        }`}
                      onClick={() => {
                        onOpenChat(c._id);
                        setIsMobileSidebarOpen(false);
                      }}
                    >
                      <span className="text-xs truncate flex-1 pr-2">
                        {c.title || "Untitled Thread"}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(c._id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-0.5 rounded transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="border-t border-zinc-900 pt-6 flex flex-col gap-4 flex-shrink-0 bg-zinc-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-100 flex items-center justify-center font-bold text-xs select-none">
            {user.username ? user.username.substring(0, 2).toUpperCase() : "US"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate select-none">{user.username}</p>
            <p className="text-[10px] text-zinc-600 truncate select-none">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-zinc-900 hover:text-zinc-100 text-zinc-500 text-xs font-medium py-2 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

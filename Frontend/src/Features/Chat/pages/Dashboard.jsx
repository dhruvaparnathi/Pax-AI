import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { setCurrentChatId, addNewChat, addNewMessage, setIsLoading, updateLastMessageContent } from "../chat.slice";
import MarkdownRenderer from "../components/MarkdownRenderer";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, handleLogout } = useAuth();

  const {
    chats,
    currentChatId,
    isLoading,
    initializeSocketConnection,
    handleSendMessage,
    handleFetchChats,
    handleOpenChat,
    handleDeleteChat
  } = useChat();

  const [searchQuery, setSearchQuery] = useState("");
  const [followUpQuery, setFollowUpQuery] = useState("");
  const [selectedFocus, setSelectedFocus] = useState("All");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const fileInputRef = useRef(null);
  const [toastError, setToastError] = useState(null);

  useEffect(() => {
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith("image/"));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderFileThumbnails = () => {
    if (selectedFiles.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-3 p-2 bg-zinc-900/30 rounded-xl border border-zinc-900/40 select-none">
        {selectedFiles.map((file, idx) => (
          <div key={idx} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
            <img src={filePreviews[idx]} alt="thumbnail" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeFile(idx)}
              className="absolute top-0.5 right-0.5 w-4 h-4 bg-zinc-950/80 hover:bg-zinc-950 text-zinc-400 hover:text-zinc-200 rounded-full flex items-center justify-center text-[10px] cursor-pointer animate-fade-in"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    );
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = initializeSocketConnection();
    handleFetchChats();

    let currentAIResponseText = "";
    let isFirstToken = true;

    socket.on('chat-created', ({ chat, userMessage }) => {
      dispatch(addNewChat({ chatId: chat._id, title: chat.title }));
      dispatch(addNewMessage({
        chatId: chat._id,
        content: userMessage.content,
        role: "user",
        media: userMessage.media
      }));
      dispatch(setCurrentChatId(chat._id));
    });

    socket.on('ai-token', ({ chatId, token }) => {
      if (isFirstToken) {
        dispatch(addNewMessage({
          chatId,
          content: token,
          role: "ai"
        }));
        isFirstToken = false;
        currentAIResponseText = token;
      } else {
        currentAIResponseText += token;
        dispatch(updateLastMessageContent({
          chatId,
          content: currentAIResponseText
        }));
      }
    });

    socket.on('message-completed', ({ chatId, messages }) => {
      isFirstToken = true;
      currentAIResponseText = "";
      dispatch(setIsLoading(false));
    });

    socket.on('error', (err) => {
      setToastError(err.message);
      dispatch(setIsLoading(false));
      setTimeout(() => setToastError(null), 5000);
    });

    return () => {
      socket.off('chat-created');
      socket.off('ai-token');
      socket.off('message-completed');
      socket.off('error');
    };
  }, [dispatch]);

  // Keyboard shortcut Ctrl+K to start a New Thread
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        dispatch(setCurrentChatId(null));
        setSearchQuery("");
        setFollowUpQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);

  const activeChat = chats[currentChatId];
  const messagesLength = activeChat?.messages?.length || 0;

  // Smooth scroll to messages end after layout paint
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [currentChatId, messagesLength, isLoading]);

  const handleSignOut = async () => {
    await handleLogout();
    navigate("/login");
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if ((!searchQuery.trim() && selectedFiles.length === 0) || isLoading) return;
    const query = searchQuery;
    const filesToSend = [...selectedFiles];
    setSearchQuery("");
    setSelectedFiles([]);
    try {
      await handleSendMessage({ question: query, files: filesToSend });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "An unexpected error occurred.";
      setToastError(msg);
      setTimeout(() => setToastError(null), 5000);
    }
  };

  const handleFollowUpSubmit = async (e) => {
    e.preventDefault();
    if ((!followUpQuery.trim() && selectedFiles.length === 0) || isLoading) return;
    const query = followUpQuery;
    const filesToSend = [...selectedFiles];
    setFollowUpQuery("");
    setSelectedFiles([]);
    try {
      await handleSendMessage({ question: query, chatId: currentChatId, files: filesToSend });
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "An unexpected error occurred.";
      setToastError(msg);
      setTimeout(() => setToastError(null), 5000);
    }
  };

  const focusOptions = ["All", "Academic", "Writing", "YouTube", "Reddit"];
  const suggestions = [
    { title: "Clean Tailwind layouts", desc: "Guidelines for minimalist design" },
    { title: "Quantum mechanics explanation", desc: "Simplified for everyday terms" },
    { title: "AI productivity startup names", desc: "Brainstorm descriptive names" },
    { title: "Camera specification breakdown", desc: "Compare flagship phone lenses" },
  ];

  const isFetchingMessages = currentChatId && (!activeChat || activeChat.messages.length === 0) && isLoading;

  const renderLoadingSkeleton = () => {
    if (!isLoading) return null;
    if (activeChat && activeChat.messages.length > 0) {
      const lastMsg = activeChat.messages[activeChat.messages.length - 1];
      if (lastMsg.role === "user") {
        return (
          <div className="flex gap-4 mb-8 animate-pulse select-none">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-bold border border-zinc-700/50 mt-1 flex-shrink-0">
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
    <div className="h-screen flex bg-zinc-950 text-zinc-100 antialiased font-sans overflow-hidden w-full relative">

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Layout */}
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
              onClick={() => {
                dispatch(setCurrentChatId(null));
                setSearchQuery("");
                setFollowUpQuery("");
                setIsMobileSidebarOpen(false);
              }}
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
            onClick={() => {
              dispatch(setCurrentChatId(null));
              setSearchQuery("");
              setFollowUpQuery("");
              setIsMobileSidebarOpen(false);
            }}
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
                dispatch(setCurrentChatId(null));
                setSearchQuery("");
                setFollowUpQuery("");
                setIsMobileSidebarOpen(false);
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
                          handleOpenChat(c._id);
                          setIsMobileSidebarOpen(false);
                        }}
                      >
                        <span className="text-xs truncate flex-1 pr-2">
                          {c.title || "Untitled Thread"}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(c._id);
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
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-zinc-900 hover:text-zinc-100 text-zinc-500 text-xs font-medium py-2 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden z-10 animate-fade-in bg-zinc-950">

        {/* Verification Alert Banner */}
        {!user.verified && (
          <div className="bg-amber-950/10 border-b border-amber-900/30 px-6 py-3 flex items-center justify-between gap-4 text-amber-400 text-xs font-medium select-none z-10">
            <div className="flex items-center gap-2">
              <span>✉️</span>
              <p>
                Email is unverified. Check <span className="text-amber-200 font-semibold">{user.email}</span> for your verification link.
              </p>
            </div>
            <button className="text-[10px] font-semibold px-2.5 py-1.5 bg-amber-500/5 hover:bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/10 transition-colors">
              Resend
            </button>
          </div>
        )}

        {/* Mobile Navbar Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950 z-10 select-none">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-zinc-200">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" />
                <path d="M12 20H28M20 12V28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <span className="font-display font-bold text-sm text-zinc-100 tracking-tight">perplexity</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-[10px] font-semibold px-2.5 py-1.5 bg-transparent border border-zinc-900 rounded-xl text-zinc-400 hover:text-zinc-200"
          >
            Sign Out
          </button>
        </header>

        {/* Chat Thread Panel */}
        {currentChatId ? (
          isFetchingMessages ? (
            /* Loading Spinner */
            <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 select-none">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-xs text-zinc-500 font-medium">Loading thread history...</span>
              </div>
            </div>
          ) : (
            /* Message conversation layout */
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
                  <form onSubmit={handleFollowUpSubmit}>
                    <div className="border border-zinc-900 focus-within:border-zinc-800 rounded-2xl p-3.5 bg-zinc-950 transition-all duration-200">
                      {renderFileThumbnails()}
                      <textarea
                        value={followUpQuery}
                        onChange={(e) => setFollowUpQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleFollowUpSubmit(e);
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
                            onClick={handleAttachmentClick}
                            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1.5 rounded-lg hover:bg-zinc-900 cursor-pointer flex items-center justify-center"
                            title="Upload images"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </button>
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
          )
        ) : (
          /* Landing Page / Search Box Wrapper */
          <div className="flex-1 overflow-y-auto w-full custom-scrollbar flex flex-col items-center">
            <div className="max-w-[680px] mx-auto w-full px-6 py-12 md:py-24 flex flex-col justify-center items-center min-h-full">

              <h2 className="text-3xl font-display font-medium text-zinc-100 mb-8 tracking-tight text-center select-none">
                Where knowledge comes at a Prompt
              </h2>

              {/* Search Box */}
              <div className="w-full border border-zinc-900 focus-within:border-zinc-800 rounded-2xl p-4 transition-all duration-200">
                <form onSubmit={handleSearchSubmit}>
                  {renderFileThumbnails()}
                  <textarea
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSearchSubmit(e);
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
                        onClick={handleAttachmentClick}
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
        )}

      </main>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* Floating Toast Notification */}
      {toastError && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-zinc-950/95 border border-red-900/50 text-zinc-100 px-4 py-3.5 rounded-xl shadow-2xl flex items-start gap-3 z-50 animate-fade-in backdrop-blur-md">
          <span className="text-base flex-shrink-0 mt-0.5 select-none">⚠️</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-red-400 select-none">Error occurred</p>
            <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5 break-words select-text">{toastError}</p>
          </div>
          <button
            onClick={() => setToastError(null)}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-bold px-1 transition-colors cursor-pointer select-none"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

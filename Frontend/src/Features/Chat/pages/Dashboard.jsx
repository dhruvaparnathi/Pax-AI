import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useAuth } from "../../Auth/hooks/useAuth";
import { useChat } from "../hooks/useChat";
import { setCurrentChatId, addNewChat, addNewMessage, setIsLoading, updateLastMessageContent } from "../chat.slice";
import Sidebar from "../components/Sidebar";
import ChatPanel from "../components/ChatPanel";
import LandingPanel from "../components/LandingPanel";
import Toast from "../components/Toast";
import { useSpeechToText } from "../hooks/useSpeechToText";

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
  const messagesEndRef = useRef(null);

  const handleTranscript = (transcript, target) => {
    if (target === "search") {
      setSearchQuery(transcript);
    } else if (target === "followUp") {
      setFollowUpQuery(transcript);
    }
  };

  const {
    isListening,
    isSpeechSupported,
    listeningTarget,
    startListening,
    stopListening
  } = useSpeechToText(handleTranscript);

  // File preview helper
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

  // Socket.IO event registrations & fetch chats
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

  const handleNewThread = () => {
    dispatch(setCurrentChatId(null));
    setSearchQuery("");
    setFollowUpQuery("");
    setIsMobileSidebarOpen(false);
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
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        user={user}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        onNewThread={handleNewThread}
        onOpenChat={handleOpenChat}
        onDeleteChat={handleDeleteChat}
        onSignOut={handleSignOut}
      />

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
            <ChatPanel
              activeChat={activeChat}
              isLoading={isLoading}
              followUpQuery={followUpQuery}
              setFollowUpQuery={setFollowUpQuery}
              onFollowUpSubmit={handleFollowUpSubmit}
              selectedFiles={selectedFiles}
              filePreviews={filePreviews}
              onAttachmentClick={handleAttachmentClick}
              onRemoveFile={removeFile}
              messagesEndRef={messagesEndRef}
              isListening={isListening}
              isSpeechSupported={isSpeechSupported}
              listeningTarget={listeningTarget}
              onStartListening={startListening}
              onStopListening={stopListening}
            />
          )
        ) : (
          /* Landing Page / Search Box Wrapper */
          <LandingPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            focusOptions={focusOptions}
            selectedFocus={selectedFocus}
            setSelectedFocus={setSelectedFocus}
            suggestions={suggestions}
            onSearchSubmit={handleSearchSubmit}
            selectedFiles={selectedFiles}
            filePreviews={filePreviews}
            onAttachmentClick={handleAttachmentClick}
            onRemoveFile={removeFile}
            isLoading={isLoading}
            isListening={isListening}
            isSpeechSupported={isSpeechSupported}
            listeningTarget={listeningTarget}
            onStartListening={startListening}
            onStopListening={stopListening}
          />
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
      <Toast message={toastError} onClose={() => setToastError(null)} />
    </div>
  );
}

/**
 * App.jsx — Phases 2–6 complete
 * Wires: history, bookmarks, settings, toast, regenerate, markdown, theme.
 */

import { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import ChatWindow from './components/Chat/ChatWindow';
import ChatInput from './components/Chat/ChatInput';
import BookmarksPanel from './components/Bookmarks/BookmarksPanel';
import SettingsModal from './components/Settings/SettingsModal';
import Toast from './components/ui/Toast';
import { useBookmarks } from './hooks/useBookmarks';
import { useSettings } from './hooks/useSettings';
import { useToast } from './hooks/useToast';
import { sendMessage } from './services/api';
import './App.css';

/* ── localStorage helpers ─────────────────────── */
const LS_HISTORY = 'lapai_history';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY)) || []; }
  catch { return []; }
}
function saveHistory(h) {
  localStorage.setItem(LS_HISTORY, JSON.stringify(h.slice(-30)));
}

let _uid = Date.now();
const uid = () => ++_uid;

/* ── Component ────────────────────────────────── */
export default function App() {
  /* Settings (owns dark mode now) */
  const { settings, updateSetting, resetSettings } = useSettings();

  /* Dark mode toggle via header button */
  const toggleDarkMode = useCallback(() => {
    updateSetting('darkMode', !settings.darkMode);
  }, [settings.darkMode, updateSetting]);

  /* Messages */
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Sidebar */
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Desktop/tablet: sidebar starts open (docked, part of layout)
    // Mobile: sidebar starts closed (overlay, opened on demand)
    if (typeof window === 'undefined') return true;
    return window.innerWidth > 900;
  });

  /* History */
  const [history, setHistory] = useState(loadHistory);
  const [sessionId, setSessionId] = useState(() => uid());

  useEffect(() => { saveHistory(history); }, [history]);
  /* Keep sidebar behavior sane on resize — only auto-adjust on the
     breakpoint crossing, never forcibly reopen/close mid-interaction */
  useEffect(() => {
    let lastWasDesktop = window.innerWidth > 900;

    const handleResize = () => {
      const isDesktop = window.innerWidth > 900;
      if (isDesktop !== lastWasDesktop) {
        setSidebarOpen(isDesktop); // crossing the breakpoint: dock open on desktop, hide on mobile
        lastWasDesktop = isDesktop;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  /* Bookmarks */
  const { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks } = useBookmarks();
  const [bookmarksOpen, setBookmarksOpen] = useState(false);

  /* Settings modal */
  const [settingsOpen, setSettingsOpen] = useState(false);

  /* Toast */
  const { toasts, addToast, removeToast } = useToast();

  /* ── New Chat ─────────────────────────────── */
  const handleNewChat = useCallback(() => {
    if (messages.length > 0) {
      const preview = messages.find(m => m.role === 'user')?.content || 'Chat';
      setHistory(prev => [
        ...prev,
        { id: sessionId, preview: preview.slice(0, 60), timestamp: new Date().toISOString(), messages },
      ]);
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setSessionId(uid());
  }, [messages, sessionId]);

  /* ── Load session ─────────────────────────── */
  const handleLoadSession = useCallback((session) => {
    if (messages.length > 0) {
      const preview = messages.find(m => m.role === 'user')?.content || 'Chat';
      setHistory(prev => [
        ...prev.filter(s => s.id !== sessionId),
        { id: sessionId, preview: preview.slice(0, 60), timestamp: new Date().toISOString(), messages },
      ]);
    }
    setMessages(session.messages);
    setSessionId(session.id);
    setError(null);
  }, [messages, sessionId]);

  /* ── Send ─────────────────────────────────── */
  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = { id: uid(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const reply = await sendMessage(text.trim());
      const botMsg = { id: uid(), role: 'bot', content: reply, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /* ── Regenerate ───────────────────────────── */
  const handleRegenerate = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg || isLoading) return;

    // Remove last bot message
    setMessages(prev => {
      const idx = [...prev].reverse().findIndex(m => m.role === 'bot');
      if (idx < 0) return prev;
      const realIdx = prev.length - 1 - idx;
      return prev.filter((_, i) => i !== realIdx);
    });

    setIsLoading(true);
    setError(null);

    try {
      const reply = await sendMessage(lastUserMsg.content);
      const botMsg = { id: uid(), role: 'bot', content: reply, timestamp: new Date() };
      setMessages(prev => [...prev, botMsg]);
      addToast('Response regenerated', 'info');
    } catch (err) {
      setError(err.message || 'Regeneration failed.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, addToast]);

  /* ── Bookmark ─────────────────────────────── */
  const handleBookmark = useCallback((message) => {
    if (isBookmarked(message.id)) {
      removeBookmark(message.id);
      addToast('Bookmark removed', 'info');
    } else {
      addBookmark(message);
      addToast('Saved to bookmarks ⭐', 'success');
    }
  }, [isBookmarked, addBookmark, removeBookmark, addToast]);

  /* ── Clear ────────────────────────────────── */
  const handleClear = useCallback(() => {
    setMessages([]);
    setError(null);
    addToast('Chat cleared', 'info');
  }, [addToast]);

  /* ── Clear all data ───────────────────────── */
  const handleClearCache = useCallback(() => {
    setMessages([]);
    setHistory([]);
    clearBookmarks();
    localStorage.removeItem('lapai_history');
    localStorage.removeItem('lapai_bookmarks');
    setSettingsOpen(false);
    addToast('Cache cleared', 'success');
  }, [clearBookmarks, addToast]);

  /* ── Sidebar nav items ────────────────────── */
  const handleNavSelect = useCallback((id) => {
    if (id === 'bookmarks') setBookmarksOpen(true);
    if (id === 'settings') setSettingsOpen(true);
  }, []);

  /* ── Render ───────────────────────────────── */
  return (
    <div className="app-layout">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpen={() => setSidebarOpen(true)}
        onNewChat={handleNewChat}
        history={history}
        onLoadSession={handleLoadSession}
        currentSessionId={sessionId}
        onNavSelect={handleNavSelect}
      />

      <div className="app-main">
        <Header
          darkMode={settings.darkMode}
          onToggleDark={toggleDarkMode}
          onClearChat={handleClear}
          onMenuToggle={() => setSidebarOpen(p => !p)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenBookmarks={() => setBookmarksOpen(true)}
          bookmarkCount={bookmarks.length}
        />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
          onSuggestion={handleSend}
          onBookmark={handleBookmark}
          onRegenerate={handleRegenerate}
          isBookmarked={isBookmarked}
          settings={settings}
        />

        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          settings={settings}
        />
      </div>

      {/* Bookmarks panel */}
      {bookmarksOpen && (
        <BookmarksPanel
          bookmarks={bookmarks}
          onRemove={(id) => { removeBookmark(id); addToast('Bookmark removed', 'info'); }}
          onClear={() => { clearBookmarks(); addToast('All bookmarks cleared', 'info'); }}
          onClose={() => setBookmarksOpen(false)}
        />
      )}

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSetting}
          onReset={() => { resetSettings(); addToast('Settings reset', 'info'); }}
          onClose={() => setSettingsOpen(false)}
          onClearCache={handleClearCache}
        />
      )}

      {/* Toast notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
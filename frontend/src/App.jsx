/**
 * App.jsx
 * Root component for Lap AI.
 * Manages global state: dark mode, chat messages, sidebar visibility.
 */

import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header  from './components/Header/Header';
import ChatWindow from './components/Chat/ChatWindow';
import ChatInput  from './components/Chat/ChatInput';
import { sendMessage } from './services/api';
import './App.css';

export default function App() {
  /* ── Theme ─────────────────────────────────────── */
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev;
      document.body.classList.toggle('dark', next);
      return next;
    });
  }, []);

  /* ── Messages ───────────────────────────────────── */
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  /* ── Sidebar ────────────────────────────────────── */
  const [sidebarOpen, setSidebarOpen] = useState(true);

  /* ── Send handler ───────────────────────────────── */
  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    const userMsg = {
      id:        Date.now(),
      role:      'user',
      content:   text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const reply = await sendMessage(text.trim());

      const botMsg = {
        id:        Date.now() + 1,
        role:      'bot',
        content:   reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  /* ── Clear handler ──────────────────────────────── */
  const handleClear = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /* ── Render ─────────────────────────────────────── */
  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        darkMode={darkMode}
      />

      <div className="app-main">
        <Header
          darkMode={darkMode}
          onToggleDark={toggleDarkMode}
          onClearChat={handleClear}
          onMenuToggle={() => setSidebarOpen(prev => !prev)}
          sidebarOpen={sidebarOpen}
        />

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          error={error}
        />

        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}
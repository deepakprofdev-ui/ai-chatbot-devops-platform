/**
 * ChatWindow.jsx
 * Scrollable chat history area.
 * Handles: auto-scroll, empty state, typing indicator, error banner.
 */

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import './Chat.css';

/* ── Empty state icon ───────────────────────── */
const SparkleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);

/* ── Suggestion chips ───────────────────────── */
const SUGGESTIONS = [
  '✨ What can you do?',
  '🧠 Explain machine learning',
  '💡 Give me a project idea',
  '🐛 Help debug my code',
];

/* ── Component ─────────────────────────────── */
export default function ChatWindow({ messages, isLoading, error, onSuggestion }) {
  const bottomRef = useRef(null);

  /* Auto-scroll on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <main className="chat-window" role="main" aria-label="Chat conversation">

      {/* ── Empty / welcome state ── */}
      {isEmpty && (
        <div className="chat-window__empty">
          <div className="chat-window__empty-icon" aria-hidden="true">
            <SparkleIcon />
          </div>
          <h1 className="chat-window__empty-title">
            Hello, I'm <span>Lap AI</span>
          </h1>
          <p className="chat-window__empty-subtitle">
            Your intelligent assistant — ask me anything, from code to concepts.
          </p>
          <div className="chat-window__suggestions" role="list" aria-label="Quick start suggestions">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                className="chat-window__chip"
                role="listitem"
                onClick={() => onSuggestion?.(s.replace(/^[^\s]+\s/, ''))} // strip emoji
                aria-label={`Start conversation: ${s}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      {messages.length > 0 && (
        <div
          className="chat-window__messages"
          role="list"
          aria-label="Chat messages"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <MessageBubble
              message={{ id: 'typing', role: 'typing', content: '' }}
            />
          )}
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div
          className="chat-window__error"
          role="alert"
          aria-live="assertive"
        >
          <span className="chat-window__error-icon" aria-hidden="true">⚠️</span>
          <span className="chat-window__error-text">{error}</span>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} aria-hidden="true" />
    </main>
  );
}
/**
 * ChatWindow.jsx — Phase 5 + 6
 * Full markdown, bookmark, regenerate, loading skeleton, smooth scroll.
 */

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LapLogo from '../../assets/LapLogo';
import './Chat.css';

const QUICK_CARDS = [
  { emoji: '🐳', label: 'Learn Docker',         prompt: 'Explain Docker containers and give me a beginner project idea' },
  { emoji: '☁️', label: 'AWS Interview Prep',   prompt: 'Give me the top 10 AWS interview questions with answers' },
  { emoji: '⚙️', label: 'Jenkins Pipeline',     prompt: 'Write a basic Jenkins CI/CD pipeline for a Node.js app' },
  { emoji: '🧠', label: 'Explain Kubernetes',   prompt: 'Explain Kubernetes in simple terms with a real-world analogy' },
  { emoji: '💻', label: 'Build a React App',    prompt: 'Give me a step-by-step plan to build a full-stack React app' },
  { emoji: '📊', label: 'ML Evaluation',        prompt: 'How do I evaluate a machine learning model? Explain key metrics' },
];

/* ── Loading skeleton ────────────────────────── */
function MessageSkeleton() {
  return (
    <div className="message message--bot" aria-hidden="true">
      <div className="message__avatar" />
      <div className="message__wrapper">
        <div className="message__bubble skeleton-bubble">
          <div className="skeleton-line skeleton-line--long" />
          <div className="skeleton-line skeleton-line--medium" />
          <div className="skeleton-line skeleton-line--short" />
        </div>
      </div>
    </div>
  );
}

/* ── Component ───────────────────────────────── */
export default function ChatWindow({
  messages,
  isLoading,
  error,
  onSuggestion,
  onBookmark,
  onRegenerate,
  isBookmarked,
  settings,
}) {
  const bottomRef  = useRef(null);
  const windowRef  = useRef(null);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0 && !isLoading;
  const lastBotIdx = [...messages].reverse().findIndex(m => m.role === 'bot');
  const lastBotId  = lastBotIdx >= 0 ? messages[messages.length - 1 - lastBotIdx]?.id : null;

  return (
    <main
      ref={windowRef}
      className={`chat-window${settings?.compactMode ? ' chat-window--compact' : ''}`}
      role="main"
      aria-label="Chat conversation"
    >
      {/* ── Welcome state ── */}
      {isEmpty && (
        <div className="chat-window__empty">
          <div className="chat-window__empty-icon">
            <LapLogo size={52} />
          </div>
          <h1 className="chat-window__empty-title">
            Hello, I'm <span>Lap AI</span> 👋
          </h1>
          <p className="chat-window__empty-subtitle">
            What can I help you with today?
          </p>
          <div className="chat-window__cards" role="list">
            {QUICK_CARDS.map(({ emoji, label, prompt }) => (
              <button
                key={label}
                className="chat-window__card"
                role="listitem"
                onClick={() => onSuggestion?.(prompt)}
                aria-label={`Ask about: ${label}`}
              >
                <span className="chat-window__card-emoji" aria-hidden="true">{emoji}</span>
                <span className="chat-window__card-label">{label}</span>
              </button>
            ))}
          </div>
          <div className="chat-window__divider">
            <span>or type your own question below</span>
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      {messages.length > 0 && (
        <div
          className="chat-window__messages"
          role="list"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onBookmark={onBookmark}
              onRegenerate={onRegenerate}
              isBookmarked={isBookmarked?.(msg.id)}
              showTimestamps={settings?.showTimestamps !== false}
              showAvatars={settings?.showAvatars !== false}
              isLast={msg.id === lastBotId}
            />
          ))}

          {/* Typing indicator OR skeleton */}
          {isLoading && (
            settings?.animations !== false
              ? <MessageBubble message={{ id: 'typing', role: 'typing', content: '' }} showTimestamps={false} showAvatars={settings?.showAvatars !== false} />
              : <MessageSkeleton />
          )}
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div className="chat-window__error" role="alert" aria-live="assertive">
          <span className="chat-window__error-icon" aria-hidden="true">⚠️</span>
          <span className="chat-window__error-text">{error}</span>
        </div>
      )}

      <div ref={bottomRef} aria-hidden="true" />
    </main>
  );
}
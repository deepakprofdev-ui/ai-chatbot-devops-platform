/**
 * MessageBubble.jsx
 * Renders a single chat message (user or bot) with avatar and timestamp.
 * Also renders the animated typing indicator when role === 'typing'.
 */

import './Chat.css';

/* ── Helpers ────────────────────────────────── */
function formatTime(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Bot avatar icon ────────────────────────── */
const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);

/* ── Component ─────────────────────────────── */
export default function MessageBubble({ message }) {
  const { role, content, timestamp } = message;
  const isUser   = role === 'user';
  const isTyping = role === 'typing';

  return (
    <div
      className={`message message--${isUser ? 'user' : 'bot'}${isTyping ? ' message--typing' : ''}`}
      role="listitem"
      aria-label={`${isUser ? 'You' : 'Lap AI'}: ${isTyping ? 'typing' : content}`}
    >
      {/* Avatar */}
      <div className="message__avatar" aria-hidden="true">
        {isUser ? 'DK' : <BotIcon />}
      </div>

      {/* Bubble + timestamp */}
      <div className="message__wrapper">
        <div className="message__bubble">
          {isTyping ? (
            <div className="typing-dots" aria-label="Lap AI is typing">
              <span /><span /><span />
            </div>
          ) : (
            content
          )}
        </div>

        {!isTyping && (
          <time className="message__time" dateTime={timestamp?.toISOString?.()}>
            {formatTime(timestamp)}
          </time>
        )}
      </div>
    </div>
  );
}
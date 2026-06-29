/**
 * ChatInput.jsx
 * Sticky input bar at the bottom of the chat.
 * Features: auto-resize textarea, Enter to send, Shift+Enter for newline,
 *           emoji button, attachment button, send button, loading state.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import './Chat.css';

/* ── Icons ─────────────────────────────────── */
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const IconPaperclip = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
  </svg>
);

/* ── Component ─────────────────────────────── */
export default function ChatInput({ onSend, isLoading }) {
  const [value, setValue]       = useState('');
  const textareaRef             = useRef(null);
  const canSend                 = value.trim().length > 0 && !isLoading;

  /* Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
  }, [value]);

  /* Submit */
  const handleSubmit = useCallback(() => {
    if (!canSend) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [canSend, onSend, value]);

  /* Keyboard shortcuts */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  /* Emoji placeholder (real picker can be added later) */
  const handleEmoji = () => {
    setValue(prev => prev + '😊');
    textareaRef.current?.focus();
  };

  return (
    <div className="chat-input-area">
      <div className="chat-input-area__inner">

        <div className="chat-input-area__hint">
          Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line
        </div>

        <div className="chat-input" role="form" aria-label="Message input">

          {/* Emoji */}
          <button
            type="button"
            className="chat-input__icon-btn"
            onClick={handleEmoji}
            aria-label="Insert emoji"
            title="Emoji"
            disabled={isLoading}
          >
            😊
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            className="chat-input__textarea"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lap AI anything…"
            rows={1}
            aria-label="Chat message"
            aria-multiline="true"
            disabled={isLoading}
          />

          {/* Right actions */}
          <div className="chat-input__actions">
            {/* Attachment */}
            <button
              type="button"
              className="chat-input__icon-btn"
              aria-label="Attach file"
              title="Attach file"
              disabled={isLoading}
            >
              <IconPaperclip />
            </button>

            {/* Send */}
            <button
              type="button"
              className="chat-input__send-btn"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label={isLoading ? 'Sending…' : 'Send message'}
              title="Send"
            >
              {isLoading ? (
                <div className="chat-input__spinner" aria-hidden="true" />
              ) : (
                <IconSend />
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
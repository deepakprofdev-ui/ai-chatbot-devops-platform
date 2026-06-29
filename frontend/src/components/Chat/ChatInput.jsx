/**
 * ChatInput.jsx — Phase 5 + 6
 * Respects enterToSend setting, character count, disabled states.
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import './Chat.css';

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

export default function ChatInput({ onSend, isLoading, settings }) {
  const [value, setValue]   = useState('');
  const textareaRef         = useRef(null);
  const MAX_CHARS           = 4000;
  const canSend             = value.trim().length > 0 && !isLoading && value.length <= MAX_CHARS;
  const enterToSend         = settings?.enterToSend !== false;

  /* Auto-resize */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = useCallback(() => {
    if (!canSend) return;
    onSend(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  }, [canSend, onSend, value]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      if (enterToSend && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  }, [handleSubmit, enterToSend]);

  const handleEmoji = () => {
    setValue(prev => prev + '😊');
    textareaRef.current?.focus();
  };

  const overLimit = value.length > MAX_CHARS;

  return (
    <div className="chat-input-area">
      <div className="chat-input-area__inner">
        <div className="chat-input-area__hint">
          {enterToSend
            ? <><kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line</>
            : <><kbd>Shift+Enter</kbd> to send · <kbd>Enter</kbd> for new line</>
          }
        </div>

        <div className={`chat-input${overLimit ? ' chat-input--over-limit' : ''}`}>
          <button
            type="button"
            className="chat-input__icon-btn"
            onClick={handleEmoji}
            aria-label="Insert emoji"
            disabled={isLoading}
          >
            😊
          </button>

          <textarea
            ref={textareaRef}
            className="chat-input__textarea"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lap AI anything…"
            rows={1}
            aria-label="Chat message"
            disabled={isLoading}
            aria-describedby="char-count"
          />

          <div className="chat-input__actions">
            {/* Character count (only shows near limit) */}
            {value.length > MAX_CHARS * 0.8 && (
              <span
                id="char-count"
                className={`chat-input__char-count${overLimit ? ' chat-input__char-count--over' : ''}`}
                aria-live="polite"
              >
                {value.length}/{MAX_CHARS}
              </span>
            )}

            <button
              type="button"
              className="chat-input__icon-btn"
              aria-label="Attach file"
              disabled={isLoading}
            >
              <IconPaperclip />
            </button>

            <button
              type="button"
              className="chat-input__send-btn"
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label={isLoading ? 'Sending…' : 'Send message'}
            >
              {isLoading
                ? <div className="chat-input__spinner" aria-hidden="true" />
                : <IconSend />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
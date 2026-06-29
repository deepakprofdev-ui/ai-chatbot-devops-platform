/**
 * MessageBubble.jsx — Phase 5 + 6
 * Full markdown rendering, code syntax highlighting,
 * copy button, bookmark button, regenerate button.
 */

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './Chat.css';

/* ── Timestamp ───────────────────────────────── */
function formatTime(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/* ── Copy button ─────────────────────────────── */
function CopyButton({ text, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  }, [text]);

  return (
    <button
      className={`copy-btn ${className} ${copied ? 'copy-btn--copied' : ''}`}
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy'}
    >
      {copied ? '✓ Copied' : '⎘ Copy'}
    </button>
  );
}

/* ── Code block ──────────────────────────────── */
function CodeBlock({ children, className }) {
  const language = /language-(\w+)/.exec(className || '')?.[1] || 'text';
  const code = String(children).replace(/\n$/, '');

  return (
    <div className="code-block">
      <div className="code-block__header">
        <span className="code-block__lang">{language}</span>
        <CopyButton text={code} />
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 10px 10px',
          fontSize: '0.82rem',
          lineHeight: 1.6,
          padding: '16px',
          background: '#1a1b26',
        }}
        showLineNumbers={code.split('\n').length > 5}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

/* ── Markdown renderer ───────────────────────── */
const MD_COMPONENTS = {
  code({ node, inline, className, children, ...props }) {
    if (inline) {
      return <code className="inline-code" {...props}>{children}</code>;
    }
    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
  p({ children })         { return <p className="md-p">{children}</p>; },
  h1({ children })        { return <h1 className="md-h1">{children}</h1>; },
  h2({ children })        { return <h2 className="md-h2">{children}</h2>; },
  h3({ children })        { return <h3 className="md-h3">{children}</h3>; },
  ul({ children })        { return <ul className="md-ul">{children}</ul>; },
  ol({ children })        { return <ol className="md-ol">{children}</ol>; },
  li({ children })        { return <li className="md-li">{children}</li>; },
  blockquote({ children }) { return <blockquote className="md-blockquote">{children}</blockquote>; },
  a({ href, children })   { return <a className="md-a" href={href} target="_blank" rel="noopener noreferrer">{children}</a>; },
  strong({ children })    { return <strong className="md-strong">{children}</strong>; },
  table({ children })     { return <div className="md-table-wrap"><table className="md-table">{children}</table></div>; },
  th({ children })        { return <th className="md-th">{children}</th>; },
  td({ children })        { return <td className="md-td">{children}</td>; },
  hr()                    { return <hr className="md-hr"/>; },
};

/* ── Bot avatar icon ─────────────────────────── */
const BotIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);

/* ── Main component ──────────────────────────── */
export default function MessageBubble({
  message,
  onBookmark,
  onRegenerate,
  isBookmarked,
  showTimestamps = true,
  showAvatars    = true,
  isLast         = false,
}) {
  const { role, content, timestamp } = message;
  const isUser   = role === 'user';
  const isTyping = role === 'typing';
  const isBot    = role === 'bot';

  return (
    <div
      className={`message message--${isUser ? 'user' : 'bot'}${isTyping ? ' message--typing' : ''}`}
      role="listitem"
    >
      {/* Avatar */}
      {showAvatars && (
        <div className="message__avatar" aria-hidden="true">
          {isUser ? 'DK' : <BotIcon />}
        </div>
      )}

      {/* Content */}
      <div className="message__wrapper">
        <div className="message__bubble">
          {isTyping ? (
            <div className="typing-dots" aria-label="Lap AI is typing">
              <span /><span /><span />
            </div>
          ) : isBot ? (
            <ReactMarkdown components={MD_COMPONENTS}>
              {content}
            </ReactMarkdown>
          ) : (
            content
          )}
        </div>

        {/* Message actions */}
        {isBot && !isTyping && (
          <div className="message__actions">
            {/* Copy full response */}
            <CopyButton text={content} className="message__action-btn" />

            {/* Bookmark */}
            <button
              className={`message__action-btn${isBookmarked ? ' message__action-btn--active' : ''}`}
              onClick={() => onBookmark?.(message)}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this response'}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
            >
              {isBookmarked ? '⭐' : '☆'} {isBookmarked ? 'Saved' : 'Save'}
            </button>

            {/* Regenerate — only on last bot message */}
            {isLast && (
              <button
                className="message__action-btn"
                onClick={() => onRegenerate?.()}
                aria-label="Regenerate response"
                title="Regenerate"
              >
                ↺ Retry
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        {!isTyping && showTimestamps && (
          <time className="message__time" dateTime={timestamp?.toISOString?.()}>
            {formatTime(timestamp)}
          </time>
        )}
      </div>
    </div>
  );
}
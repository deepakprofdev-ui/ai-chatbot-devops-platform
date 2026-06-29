/**
 * Header.jsx
 * Top bar for Lap AI — title, status, dark mode toggle, clear chat.
 */

import './Header.css';

/* ── Icons ─────────────────────────────────── */
const IconMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6"  x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);

const IconSun  = () => <span aria-hidden="true">☀️</span>;
const IconMoon = () => <span aria-hidden="true">🌙</span>;

/* ── Component ─────────────────────────────── */
export default function Header({ darkMode, onToggleDark, onClearChat, onMenuToggle }) {
  return (
    <header className="header" role="banner">

      {/* Left */}
      <div className="header__left">
        <button
          className="header__menu-btn"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <IconMenu />
        </button>

        <div className="header__title-group">
          <span className="header__title">Lap AI</span>
          <span className="header__subtitle">Your Intelligent AI Assistant</span>
        </div>
      </div>

      {/* Right */}
      <div className="header__actions">
        {/* Status */}
        <div className="header__status" aria-label="Service status: online" role="status">
          <span className="header__status-dot" />
          <span className="header__status-text">Online</span>
        </div>

        {/* Dark mode toggle */}
        <button
          className={`header__dark-toggle${darkMode ? ' active' : ''}`}
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
        >
          <div className="header__dark-toggle-knob">
            {darkMode ? <IconMoon /> : <IconSun />}
          </div>
        </button>

        {/* Clear chat */}
        <button
          className="header__btn header__btn--ghost"
          onClick={onClearChat}
          aria-label="Clear chat history"
        >
          <IconTrash />
          <span>Clear</span>
        </button>
      </div>
    </header>
  );
}
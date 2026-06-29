/**
 * Header.jsx — Updated for Phases 3+4
 * Adds bookmark count badge and settings button.
 */

import './Header.css';

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

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

export default function Header({
  darkMode,
  onToggleDark,
  onClearChat,
  onMenuToggle,
  onOpenSettings,
  onOpenBookmarks,
  bookmarkCount,
}) {
  return (
    <header className="header" role="banner">

      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuToggle} aria-label="Toggle sidebar">
          <IconMenu />
        </button>
        <div className="header__title-group">
          <span className="header__title">Lap AI</span>
          <span className="header__subtitle">Your Intelligent AI Assistant</span>
        </div>
      </div>

      <div className="header__actions">
        {/* Status */}
        <div className="header__status" role="status">
          <span className="header__status-dot" />
          <span className="header__status-text">Online</span>
        </div>

        {/* Bookmarks shortcut */}
        <button
          className="header__btn header__btn--ghost header__btn--icon-rel"
          onClick={onOpenBookmarks}
          aria-label={`Bookmarks${bookmarkCount ? ` (${bookmarkCount})` : ''}`}
          title="Bookmarks"
        >
          ⭐
          {bookmarkCount > 0 && (
            <span className="header__badge">{bookmarkCount}</span>
          )}
        </button>

        {/* Settings */}
        <button
          className="header__btn header__btn--ghost"
          onClick={onOpenSettings}
          aria-label="Settings"
          title="Settings"
        >
          <IconSettings />
        </button>

        {/* Dark mode */}
        <button
          className={`header__dark-toggle${darkMode ? ' active' : ''}`}
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-pressed={darkMode}
        >
          <div className="header__dark-toggle-knob">
            {darkMode ? '🌙' : '☀️'}
          </div>
        </button>

        {/* Clear */}
        <button
          className="header__btn header__btn--ghost"
          onClick={onClearChat}
          aria-label="Clear chat"
        >
          <IconTrash />
          <span>Clear</span>
        </button>
      </div>
    </header>
  );
}
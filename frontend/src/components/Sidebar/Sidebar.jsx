/**
 * Sidebar.jsx — Updated: onNavSelect prop for bookmarks/settings routing.
 */

import { useState } from 'react';
import LapLogo from '../../assets/LapLogo';
import './Sidebar.css';

const IconChat = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const IconHistory = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="12 8 12 12 14 14"/>
    <path d="M3.05 11a9 9 0 1 0 .5-4M3 3v5h5"/>
  </svg>
);
const IconBookmark = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
  </svg>
);
const IconSettings = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const IconUser = () => (
  <svg className="sidebar__nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

function groupByDate(history) {
  const now       = new Date();
  const today     = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const weekAgo   = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const groups    = { Today: [], Yesterday: [], 'This Week': [], Older: [] };

  [...history].reverse().forEach(s => {
    const d   = new Date(s.timestamp);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day >= today)        groups['Today'].push(s);
    else if (day >= yesterday) groups['Yesterday'].push(s);
    else if (day >= weekAgo)   groups['This Week'].push(s);
    else                       groups['Older'].push(s);
  });
  return groups;
}

export default function Sidebar({
  isOpen,
  onNewChat,
  history,
  onLoadSession,
  currentSessionId,
  onNavSelect,
}) {
  const [activeNav,   setActiveNav]   = useState('chat');
  const [historyOpen, setHistoryOpen] = useState(true);

  const handleNav = (id) => {
    setActiveNav(id);
    if (id === 'history') { setHistoryOpen(o => !o); return; }
    onNavSelect?.(id);
  };

  const grouped = groupByDate(history);

  return (
    <aside className={`sidebar${isOpen ? '' : ' sidebar--closed'}`} aria-label="Main navigation">

      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          <LapLogo size={26} />
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">Lap AI</span>
          <span className="sidebar__brand-tagline">Your Intelligent Assistant</span>
        </div>
      </div>

      {/* New Chat */}
      <button className="sidebar__new-chat" onClick={onNewChat} aria-label="Start new chat">
        <IconPlus /> New Chat
      </button>

      {/* Nav */}
      <nav className="sidebar__nav" aria-label="Sidebar navigation">
        <span className="sidebar__section-label">Menu</span>

        <button className={`sidebar__nav-item${activeNav === 'chat' ? ' active' : ''}`} onClick={() => handleNav('chat')}>
          <IconChat /> Chat
        </button>

        <button
          className={`sidebar__nav-item${activeNav === 'history' ? ' active' : ''}`}
          onClick={() => handleNav('history')}
          aria-expanded={historyOpen}
        >
          <IconHistory /> History
          {history.length > 0 && <span className="sidebar__nav-badge">{history.length}</span>}
          <span className="sidebar__nav-chevron"><IconChevron open={historyOpen && activeNav === 'history'} /></span>
        </button>

        {/* History list */}
        {activeNav === 'history' && historyOpen && (
          <div className="sidebar__history-list" role="list">
            {history.length === 0 ? (
              <div className="sidebar__history-empty">No past conversations yet.</div>
            ) : (
              Object.entries(grouped).map(([group, sessions]) =>
                sessions.length === 0 ? null : (
                  <div key={group}>
                    <div className="sidebar__history-group-label">{group}</div>
                    {sessions.map(session => (
                      <button
                        key={session.id}
                        className={`sidebar__history-item${session.id === currentSessionId ? ' active' : ''}`}
                        onClick={() => onLoadSession(session)}
                        role="listitem"
                        title={session.preview}
                      >
                        <span className="sidebar__history-dot" />
                        <span className="sidebar__history-preview">{session.preview || 'Untitled'}</span>
                      </button>
                    ))}
                  </div>
                )
              )
            )}
          </div>
        )}

        <button className={`sidebar__nav-item${activeNav === 'bookmarks' ? ' active' : ''}`} onClick={() => handleNav('bookmarks')}>
          <IconBookmark /> Bookmarks
        </button>

        <button className={`sidebar__nav-item${activeNav === 'profile' ? ' active' : ''}`} onClick={() => handleNav('profile')}>
          <IconUser /> Profile
        </button>

        <button className={`sidebar__nav-item${activeNav === 'settings' ? ' active' : ''}`} onClick={() => handleNav('settings')}>
          <IconSettings /> Settings
        </button>
      </nav>

      {/* Upgrade */}
      <div className="sidebar__upgrade">
        <div className="sidebar__upgrade-label">✦ Pro Plan</div>
        <div className="sidebar__upgrade-title">Unlock Full Access</div>
        <div className="sidebar__upgrade-desc">Priority responses, longer context, advanced features.</div>
        <button className="sidebar__upgrade-btn">Upgrade Now →</button>
      </div>

      {/* Profile */}
      <div className="sidebar__profile" role="button" tabIndex={0} aria-label="User profile">
        <div className="sidebar__avatar" aria-hidden="true">DK</div>
        <div className="sidebar__profile-info">
          <div className="sidebar__profile-name">Deepak K</div>
          <div className="sidebar__profile-role">AI & Data Science</div>
        </div>
      </div>
    </aside>
  );
}
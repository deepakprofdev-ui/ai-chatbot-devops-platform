import { useState } from 'react';
import './BookmarksPanel.css';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function BookmarksPanel({ bookmarks, onRemove, onClear, onClose }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? bookmarks.filter(b =>
        b.content.toLowerCase().includes(query.toLowerCase())
      )
    : bookmarks;

  return (
    <>
      <div
        className="bookmarks-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="bookmarks-panel"
        role="dialog"
        aria-label="Bookmarks"
        aria-modal="true"
      >
        <div className="bookmarks-panel__header">
          <div className="bookmarks-panel__title">
            ⭐ Bookmarks
            {bookmarks.length > 0 && (
              <span className="bookmarks-panel__count">
                {bookmarks.length}
              </span>
            )}
          </div>

          <div className="bookmarks-panel__actions">
            {bookmarks.length > 0 && (
              <button
                className="bookmarks-panel__btn bookmarks-panel__btn--danger"
                onClick={onClear}
                title="Clear all"
                aria-label="Clear all bookmarks"
              >
                🗑
              </button>
            )}
            <button
              className="bookmarks-panel__btn"
              onClick={onClose}
              aria-label="Close bookmarks"
            >
              ✕
            </button>
          </div>
        </div>

        {bookmarks.length > 0 && (
          <div className="bookmarks-panel__search">
            <input
              className="bookmarks-panel__search-input"
              type="search"
              placeholder="Search bookmarks…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search bookmarks"
            />
          </div>
        )}

        <div className="bookmarks-panel__list" role="list">
          {filtered.length === 0 ? (
            <div className="bookmarks-panel__empty">
              <div className="bookmarks-panel__empty-icon">⭐</div>
              <div className="bookmarks-panel__empty-text">
                {query
                  ? 'No bookmarks match your search.'
                  : 'No bookmarks yet.\nClick ☆ on any bot response to save it.'}
              </div>
            </div>
          ) : (
            filtered.map(bookmark => (
              <div
                key={bookmark.id}
                className="bookmark-item"
                role="listitem"
              >
                <div className="bookmark-item__content">
                  {bookmark.content}
                </div>
                <div className="bookmark-item__meta">
                  <span className="bookmark-item__date">
                    {formatDate(bookmark.savedAt)}
                  </span>
                  <button
                    className="bookmark-item__remove"
                    onClick={() => onRemove(bookmark.id)}
                    aria-label="Remove bookmark"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export default BookmarksPanel;
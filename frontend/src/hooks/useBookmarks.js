/**
 * useBookmarks.js
 * Phase 3 — Bookmark management hook.
 * Persists to localStorage. Provides add, remove, isBookmarked.
 */

import { useState, useCallback, useEffect } from 'react';

const LS_KEY = 'lapai_bookmarks';

function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(load);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addBookmark = useCallback((message) => {
    setBookmarks(prev => {
      if (prev.find(b => b.id === message.id)) return prev;
      return [{ ...message, savedAt: new Date().toISOString() }, ...prev];
    });
  }, []);

  const removeBookmark = useCallback((id) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const isBookmarked = useCallback((id) => {
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const clearBookmarks = useCallback(() => setBookmarks([]), []);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks };
}
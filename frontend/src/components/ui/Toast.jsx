/**
 * Toast.jsx — Phase 6
 * Renders global toast notifications.
 */

import './Toast.css';

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

export default function Toast({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          role="alert"
          onClick={() => onRemove(toast.id)}
        >
          <span aria-hidden="true">{ICONS[toast.type]}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
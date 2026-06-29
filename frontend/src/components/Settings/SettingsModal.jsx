/**
 * SettingsModal.jsx — Phase 4
 * Full settings modal: theme, font size, animations, behavior, about.
 */

import LapLogo from '../../assets/LapLogo';
import './SettingsModal.css';

/* ── Toggle row ─────────────────────────────── */
function ToggleRow({ name, desc, checked, onChange }) {
  return (
    <div className="settings-row">
      <div className="settings-row__info">
        <span className="settings-row__name">{name}</span>
        {desc && <span className="settings-row__desc">{desc}</span>}
      </div>
      <label className="settings-toggle" aria-label={name}>
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
        <span className="settings-toggle__track" />
        <span className="settings-toggle__knob" />
      </label>
    </div>
  );
}

/* ── Select row ─────────────────────────────── */
function SelectRow({ name, desc, value, options, onChange }) {
  return (
    <div className="settings-row">
      <div className="settings-row__info">
        <span className="settings-row__name">{name}</span>
        {desc && <span className="settings-row__desc">{desc}</span>}
      </div>
      <select
        className="settings-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={name}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Main component ─────────────────────────── */
export default function SettingsModal({ settings, onUpdate, onReset, onClose, onClearCache }) {
  const u = (key) => (val) => onUpdate(key, val);

  return (
    <div className="settings-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="settings-modal" role="dialog" aria-label="Settings" aria-modal="true">

        {/* Header */}
        <div className="settings-modal__header">
          <span className="settings-modal__title">⚙ Settings</span>
          <button className="settings-modal__close" onClick={onClose} aria-label="Close settings">✕</button>
        </div>

        <div className="settings-modal__body">

          {/* Appearance */}
          <div className="settings-section">
            <div className="settings-section__label">Appearance</div>

            <ToggleRow
              name="Dark mode"
              desc="Switch to a darker colour scheme"
              checked={settings.darkMode}
              onChange={u('darkMode')}
            />

            <SelectRow
              name="Font size"
              desc="Controls text size across the app"
              value={settings.fontSize}
              options={[
                { value: 'small',  label: 'Small'  },
                { value: 'medium', label: 'Medium' },
                { value: 'large',  label: 'Large'  },
              ]}
              onChange={u('fontSize')}
            />

            <ToggleRow
              name="Compact mode"
              desc="Tighter spacing between messages"
              checked={settings.compactMode}
              onChange={u('compactMode')}
            />
          </div>

          <div className="settings-divider" />

          {/* Experience */}
          <div className="settings-section">
            <div className="settings-section__label">Experience</div>

            <ToggleRow
              name="Animations"
              desc="Message slide-in and UI motion effects"
              checked={settings.animations}
              onChange={u('animations')}
            />

            <ToggleRow
              name="Enter to send"
              desc="Press Enter to send, Shift+Enter for new line"
              checked={settings.enterToSend}
              onChange={u('enterToSend')}
            />

            <ToggleRow
              name="Show timestamps"
              desc="Display time under each message"
              checked={settings.showTimestamps}
              onChange={u('showTimestamps')}
            />

            <ToggleRow
              name="Show avatars"
              desc="Display user and bot avatars"
              checked={settings.showAvatars}
              onChange={u('showAvatars')}
            />
          </div>

          <div className="settings-divider" />

          {/* Data */}
          <div className="settings-section">
            <div className="settings-section__label">Data</div>
            <div className="settings-row">
              <div className="settings-row__info">
                <span className="settings-row__name">Clear cache</span>
                <span className="settings-row__desc">Removes history and bookmarks from local storage</span>
              </div>
              <button
                className="settings-btn settings-btn--ghost"
                onClick={onClearCache}
                aria-label="Clear app cache"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="settings-divider" />

          {/* About */}
          <div className="settings-about">
            <div className="settings-about__logo">
              <LapLogo size={28} />
              <span className="settings-about__name">Lap AI</span>
            </div>
            <div className="settings-about__version">Version 2.0.0 · DevOps Edition</div>
            <div className="settings-about__links">
              <a
                className="settings-about__link"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="settings-about__link"
                href="https://docs.anthropic.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="settings-modal__footer">
          <button className="settings-btn settings-btn--ghost" onClick={onReset}>
            Reset to defaults
          </button>
          <button className="settings-btn settings-btn--primary" onClick={onClose}>
            Save & close
          </button>
        </div>
      </div>
    </div>
  );
}
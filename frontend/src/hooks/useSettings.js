/**
 * useSettings.js
 * Phase 4 — App settings hook.
 * Controls: theme, font size, animations, sound, enter-to-send.
 */

import { useState, useCallback, useEffect } from 'react';

const LS_KEY = 'lapai_settings';

const DEFAULTS = {
  darkMode:      false,
  fontSize:      'medium',   // small | medium | large
  animations:    true,
  enterToSend:   true,
  showTimestamps: true,
  showAvatars:   true,
  compactMode:   false,
};

function load() {
  try {
    const stored = JSON.parse(localStorage.getItem(LS_KEY));
    return stored ? { ...DEFAULTS, ...stored } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

export function useSettings() {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(settings));

    // Apply font size to root
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.setProperty(
      '--font-size-base', sizes[settings.fontSize] || '16px'
    );

    // Apply dark mode
    document.body.classList.toggle('dark', settings.darkMode);

    // Apply compact mode
    document.body.classList.toggle('compact', settings.compactMode);

    // Apply reduced animations
    document.body.classList.toggle('no-animations', !settings.animations);
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULTS);
  }, []);

  return { settings, updateSetting, resetSettings };
}
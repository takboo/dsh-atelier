import { THEMES } from './themes.js';

const STYLE_KEY = 'dsh-atelier:style';
const NATIVE_KEY = 'dsh-atelier:native-preference';
export const BUILTIN = new Set(['light', 'dark', 'system']);
export const DEFAULT_PREFERENCES = Object.freeze({ mode: 'system', light: 'celadon', dark: 'midnight' });

export function resolveActive(preferences, dark) {
  if (!preferences) return null;
  return preferences[preferences.mode === 'system' ? (dark ? 'dark' : 'light') : preferences.mode];
}

export function parsePreferences(raw) {
  if (!raw) return null;
  const id = raw === 'liquid' ? 'celadon' : raw;
  const legacy = THEMES.find((theme) => theme.id === id);
  if (legacy) return { ...DEFAULT_PREFERENCES, mode: legacy.scheme, [legacy.scheme]: id };
  try {
    const value = JSON.parse(raw);
    if (!value || !BUILTIN.has(value.mode)) return null;
    const light = value.light === 'liquid' ? 'celadon' : value.light;
    const valid = (id, scheme) => THEMES.some((theme) => theme.id === id && theme.scheme === scheme);
    if (!valid(light, 'light') || !valid(value.dark, 'dark')) return null;
    return { mode: value.mode, light, dark: value.dark };
  } catch { return null; }
}

// The accessor itself can throw in a storage-restricted browser.
export function createPreferencesStorage(getStorage) {
  const read = (key) => { try { return getStorage().getItem(key); } catch { return null; } };
  const write = (key, value) => {
    try {
      if (value === null) getStorage().removeItem(key);
      else getStorage().setItem(key, value);
    } catch { /* Live selection remains available without persistence. */ }
  };
  return {
    read: () => parsePreferences(read(STYLE_KEY)),
    write: (value) => write(STYLE_KEY, value ? JSON.stringify(value) : null),
    readNative: (fallback) => {
      const saved = read(NATIVE_KEY);
      return BUILTIN.has(saved) ? saved : BUILTIN.has(fallback) ? fallback : 'system';
    },
    writeNative: (value) => write(NATIVE_KEY, value),
  };
}

import { PLUGIN_ID } from './identity.js';
import { THEMES, makeTokens } from './themes.js';
import { BUILTIN, DEFAULT_PREFERENCES, createPreferencesStorage, resolveActive } from './preferences.js';

/** Owns preferences, theme writes and the override layer; the view only subscribes. */
export function createThemeController({ theme, subscribeTheme, getStorage, setStyle }) {
  const storage = createPreferencesStorage(getStorage);
  let preferences = storage.read();
  let nativePreference = preferences
    ? storage.readNative(theme.getTheme().preference)
    : theme.getTheme().preference;
  if (!BUILTIN.has(nativePreference)) nativePreference = storage.readNative('system');
  let expectedPreference = theme.getTheme().preference;
  let writing = false;
  let disposed = false;
  let removeOverrides;
  const listeners = new Set();
  let snapshot;

  const rememberNative = (value) => {
    if (!BUILTIN.has(value)) return;
    nativePreference = value;
    storage.writeNative(value);
  };
  const publish = () => {
    const systemDark = theme.getTheme().active.colorScheme === 'dark';
    setStyle(resolveActive(preferences, systemDark));
    if (snapshot?.preferences === preferences && snapshot.systemDark === systemDark) return;
    snapshot = Object.freeze({ preferences, systemDark });
    for (const listener of [...listeners]) listener();
  };
  const mutateTheme = (operation) => {
    writing = true;
    try { operation(); } finally { writing = false; }
  };
  const clearOverrides = () => {
    const remove = removeOverrides;
    removeOverrides = undefined;
    remove?.();
  };
  const installPair = () => {
    const light = makeTokens(THEMES.find((item) => item.id === preferences.light));
    const dark = makeTokens(THEMES.find((item) => item.id === preferences.dark));
    // One layer holds both schemes; OS changes need no unregister/register cycle.
    const tokens = Object.fromEntries(Object.keys(light).map((name) => [name, { light: light[name], dark: dark[name] }]));
    removeOverrides = theme.overrideTokens(PLUGIN_ID, tokens);
  };
  const apply = () => {
    expectedPreference = preferences.mode;
    mutateTheme(() => {
      installPair();
      // Keep the official built-in preference and its durable settings in agreement.
      // Non-durable third-party ids are reset by rc.5 after typography writes.
      theme.setTheme(expectedPreference);
    });
    publish();
  };
  const off = subscribeTheme((current) => {
    if (writing || disposed) return;
    if (preferences && current.preference !== expectedPreference) {
      // An outside Appearance/theme choice owns the next state, including other plugins.
      preferences = null;
      storage.write(null);
      mutateTheme(clearOverrides);
    }
    if (!preferences) rememberNative(current.preference);
    publish();
  });

  if (preferences) apply();
  else { rememberNative(nativePreference); publish(); }

  const commit = (next) => {
    if (disposed) return;
    if (!preferences) rememberNative(theme.getTheme().preference);
    preferences = Object.freeze(next);
    storage.write(preferences);
    apply();
  };
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => { listeners.add(listener); return () => listeners.delete(listener); },
    select(id) {
      const definition = THEMES.find((item) => item.id === id);
      if (!definition) return;
      const next = { ...(preferences || DEFAULT_PREFERENCES), [definition.scheme]: id };
      if (!preferences || next.mode !== 'system') next.mode = definition.scheme;
      commit(next);
    },
    setMode(mode) {
      if (BUILTIN.has(mode)) commit({ ...(preferences || DEFAULT_PREFERENCES), mode });
    },
    reset() {
      if (disposed || !preferences) return;
      preferences = null;
      storage.write(null);
      mutateTheme(() => { clearOverrides(); theme.setTheme(nativePreference); });
      expectedPreference = nativePreference;
      publish();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      off();
      mutateTheme(() => {
        clearOverrides();
        if (preferences && theme.getTheme().preference === expectedPreference) theme.setTheme(nativePreference);
      });
      setStyle(null);
      listeners.clear();
    },
  };
}

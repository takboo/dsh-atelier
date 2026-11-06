import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePreferences, createPreferencesStorage } from '../src/preferences.js';
import { THEMES, makeTokens } from '../src/themes.js';
import { en, zh } from '../src/locale.js';

test('invalid storage is rejected and JSON liquid pair migrates', () => {
  for (const raw of ['{', 'null', '{}', '{"mode":"dark","light":"mono","dark":"paper"}']) {
    assert.equal(parsePreferences(raw), null);
  }
  assert.deepEqual(parsePreferences('{"mode":"system","light":"liquid","dark":"mono"}'), {
    mode: 'system', light: 'celadon', dark: 'mono',
  });
});

test('a throwing localStorage accessor still permits nonpersistent operation', () => {
  const storage = createPreferencesStorage(() => { throw new Error('SecurityError'); });
  assert.equal(storage.read(), null);
  assert.equal(storage.readNative('dark'), 'dark');
  assert.doesNotThrow(() => { storage.write(null); storage.writeNative('light'); });
});

test('every theme has matching locale copy and a complete typography-free token set', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(zh).sort());
  const names = Object.keys(makeTokens(THEMES[0])).sort();
  for (const theme of THEMES) {
    assert.deepEqual(Object.keys(makeTokens(theme)).sort(), names);
    for (const key of ['name', 'tag', 'description']) assert.ok(en[`${theme.id}.${key}`]);
    assert.ok(names.every((name) => !name.includes('font')));
  }
});

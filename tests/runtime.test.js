import test from 'node:test';
import assert from 'node:assert/strict';
import { mountPlugin } from './support/host.js';

for (const mode of ['light', 'dark', 'system']) {
  test(`native ${mode} takes over an active Atelier theme`, () => {
    const host = mountPlugin();
    host.ui.onSelect(mode === 'light' ? 'midnight' : 'paper');
    host.theme.setTheme(mode);
    assert.equal(host.theme.getTheme().preference, mode);
    assert.equal(host.document.body.dataset.atelierStyle, undefined);
    assert.equal(host.storage.has('dsh-atelier:style'), false);
    host.dispose();
  });
}

test('reset restores the native preference chosen immediately before activation', () => {
  const host = mountPlugin({ savedNative: 'light' });
  host.theme.setTheme('dark');
  host.ui.onSelect('paper');
  host.ui.onReset();
  assert.equal(host.theme.getTheme().preference, 'dark');
  host.dispose();
});

test('native changes between reset and reactivation replace the restore target', () => {
  const host = mountPlugin();
  host.ui.onSelect('paper');
  host.ui.onReset();
  host.theme.setTheme('dark');
  host.ui.onSelect('celadon');
  host.ui.onReset();
  assert.equal(host.theme.getTheme().preference, 'dark');
  host.dispose();
});

test('system pairing follows OS changes and reset removes token overrides', () => {
  const host = mountPlugin({ native: 'dark' });
  host.ui.onModeChange('system');
  assert.equal(host.document.body.dataset.atelierStyle, 'celadon');
  host.systemDark(true);
  assert.equal(host.document.body.dataset.atelierStyle, 'midnight');
  host.ui.onReset();
  assert.equal(host.theme.getTheme().preference, 'dark');
  assert.deepEqual(Object.keys(host.theme.getTheme().active.tokens), []);
  host.dispose();
});

test('native takeover of system pairing removes the override layer', () => {
  const host = mountPlugin();
  host.ui.onModeChange('system');
  host.theme.setTheme('dark');
  assert.equal(host.theme.getTheme().preference, 'dark');
  assert.deepEqual(Object.keys(host.theme.getTheme().active.tokens), []);
  assert.equal(host.document.body.dataset.atelierStyle, undefined);
  host.dispose();
});

test('font changes preserve the selected style and user typography', async () => {
  const host = mountPlugin();
  host.ui.onSelect('paper');
  host.theme.setFontSize('text', 18);
  host.theme.setFontFamily('code', 'Menlo');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(host.document.body.dataset.atelierStyle, 'paper');
  assert.equal(host.theme.getTheme().fontSizes.text, 18);
  assert.equal(host.theme.getTheme().fontFamilies.code, '"Menlo"');
  host.dispose();
});

test('legacy liquid selection migrates to Celadon', () => {
  const host = mountPlugin({ saved: 'liquid' });
  assert.equal(host.document.body.dataset.atelierStyle, 'celadon');
  host.dispose();
});

test('storage failures still allow live selection and reset', () => {
  const host = mountPlugin({ native: 'dark', blockedStorage: true });
  host.ui.onSelect('paper');
  assert.equal(host.document.body.dataset.atelierStyle, 'paper');
  host.ui.onReset();
  assert.equal(host.theme.getTheme().preference, 'dark');
  host.dispose();
});

test('subscribers see native takeover while the gallery is already mounted', () => {
  const host = mountPlugin();
  const seen = [];
  const off = host.ui.subscribe(() => seen.push(host.ui.getSnapshot().preferences));
  host.ui.onSelect('paper');
  host.theme.setTheme('dark');
  assert.equal(seen.length, 2);
  assert.equal(seen.at(-1), null);
  off();
  host.dispose();
});

test('disposal restores native appearance and releases all plugin resources', () => {
  const host = mountPlugin({ native: 'dark' });
  host.ui.onSelect('paper');
  host.dispose();
  assert.equal(host.theme.getTheme().preference, 'dark');
  assert.equal(host.theme.getTheme().themes.length, 2);
  assert.deepEqual(Object.keys(host.theme.getTheme().active.tokens), []);
  assert.equal(host.document.body.dataset.atelierStyle, undefined);
  host.systemDark(true);
  assert.equal(host.document.body.dataset.atelierStyle, undefined);
});

test('font writes in system mode preserve pairing after durable adoption', async () => {
  const host = mountPlugin();
  host.ui.onModeChange('system');
  host.theme.setFontSize('code', 15);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(host.document.body.dataset.atelierStyle, 'celadon');
  host.systemDark(true);
  assert.equal(host.document.body.dataset.atelierStyle, 'midnight');
  assert.equal(host.theme.getTheme().fontSizes.code, 15);
  host.dispose();
});

test('saved pairing survives a reload and retains its original restore target', () => {
  const host = mountPlugin({ native: 'light', savedNative: 'dark', saved: JSON.stringify({ mode: 'light', light: 'paper', dark: 'mono' }) });
  assert.equal(host.document.body.dataset.atelierStyle, 'paper');
  host.ui.onReset();
  assert.equal(host.theme.getTheme().preference, 'dark');
  host.dispose();
});

test('another theme plugin can take over without retaining Atelier overrides', () => {
  const host = mountPlugin();
  const unregister = host.theme.register({ id: 'other', colorScheme: 'dark', tokens: { '--other': 'yes' } });
  host.ui.onSelect('paper');
  host.theme.setTheme('other');
  assert.equal(host.theme.getTheme().active.id, 'other');
  assert.deepEqual(Object.keys(host.theme.getTheme().active.tokens), ['--other']);
  assert.equal(host.document.body.dataset.atelierStyle, undefined);
  host.dispose();
  unregister();
});

test('manual selection switches schemes while preserving the other pairing', () => {
  const host = mountPlugin();
  host.ui.onSelect('paper');
  host.ui.onSelect('mono');
  assert.equal(host.theme.getTheme().preference, 'dark');
  assert.equal(host.ui.getSnapshot().preferences.light, 'paper');
  assert.equal(host.document.body.dataset.atelierStyle, 'mono');
  host.ui.onModeChange('light');
  assert.equal(host.document.body.dataset.atelierStyle, 'paper');
  host.dispose();
});

test('selecting the inactive system pair saves it without changing the active scheme', () => {
  const host = mountPlugin();
  host.ui.onModeChange('system');
  host.ui.onSelect('mono');
  assert.equal(host.document.body.dataset.atelierStyle, 'celadon');
  assert.equal(host.theme.getTheme().preference, 'system');
  host.systemDark(true);
  assert.equal(host.document.body.dataset.atelierStyle, 'mono');
  host.dispose();
});

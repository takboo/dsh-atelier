import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sdkSource = fs.readFileSync(require.resolve('@deepseek-ai/dsh-client-ui-theme/client'), 'utf8');

// Run the published rc.5 ThemeRuntime; only Cordis, storage and the DOM are adapters.
export function mountPlugin({ native = 'system', saved, savedNative, blockedStorage = false } = {}) {
  const listeners = new Map();
  const disposers = [];
  const entries = new Map();
  const storage = new Map();
  if (saved !== undefined) storage.set('dsh-atelier:style', saved);
  if (savedNative !== undefined) storage.set('dsh-atelier:native-preference', savedNative);
  const document = {
    body: { dataset: {}, style: { getPropertyValue: () => '' } },
    head: { appendChild() {} }, querySelector: () => null,
    createElement: () => ({ dataset: {}, remove() {} }),
  };
  const media = {
    matches: false,
    addEventListener(_, callback) { this.callback = callback; },
    removeEventListener() { this.callback = undefined; },
  };
  let sdk;
  const window = {
    localStorage: {
      getItem(key) { if (blockedStorage) throw new Error('blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blockedStorage) throw new Error('blocked'); storage.set(key, value); },
      removeItem(key) { if (blockedStorage) throw new Error('blocked'); storage.delete(key); },
    },
    __ModuleLoader__: { load(module) { sdk = module.factory(() => ({})); } },
  };
  const environment = { window, document, console, matchMedia: () => media };
  vm.runInNewContext(sdkSource, environment);
  const ctx = {
    effect(setup) { const off = setup(); if (typeof off === 'function') disposers.push(off); return off; },
    inject() {},
    on(event, callback) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(callback);
      return () => listeners.get(event).delete(callback);
    },
    emit(event, snapshot) { for (const callback of [...listeners.get(event) ?? []]) callback(snapshot); },
  };
  const durable = {
    preference: native, fontSize: 14, codeFontSize: 11, terminalFontSize: 13,
    textFontFamily: '', codeFontFamily: '', terminalFontFamily: '',
  };
  ctx.theme = new sdk.ThemeRuntime(ctx, {
    getSnapshot: () => ({ value: durable }), subscribe: () => () => {},
    set: (key, value) => { durable[key] = value; return Promise.resolve(); },
  });
  ctx.locale = { register: () => () => {}, bind: () => (key) => key };
  ctx.slots = {
    inject: (_, setup) => setup(),
    register: (options, component) => { entries.set(options.name, { options, component }); return () => {}; },
  };
  window.__ModuleLoader__.load = (module) => module.factory(() => ({ createElement() {} })).apply(ctx);
  vm.runInNewContext(fs.readFileSync(new URL('../../client.js', import.meta.url), 'utf8'), environment);
  return {
    theme: ctx.theme, ui: entries.get('main').options.inject(), storage, document, durable,
    systemDark(dark) { media.matches = dark; media.callback?.(); },
    dispose() { for (const off of disposers.reverse()) off(); },
  };
}

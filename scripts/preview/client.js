import React from 'react';
import { createRoot } from 'react-dom/client';
import { apply } from '../../src/client.js';

// A small host adapter for the actual gallery and published rc.5 theme runtime.
// This page neither connects to a DSH profile nor contains real conversations.
const events = new Map();
const entries = new Map();
const dictionaries = new Map();
const effects = [];
const language = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'zh';
const durable = JSON.parse(localStorage.getItem('atelier-preview:theme') || 'null') || {
  preference: 'system', fontSize: 14, codeFontSize: 11, terminalFontSize: 13,
  textFontFamily: '', codeFontFamily: '', terminalFontFamily: '',
};
const ctx = {
  effect(setup) { const off = setup(); if (typeof off === 'function') effects.push(off); return off; },
  inject() {},
  provide(name, value) { this[name] = value; },
  on(event, callback) {
    if (!events.has(event)) events.set(event, new Set());
    events.get(event).add(callback);
    return () => events.get(event).delete(callback);
  },
  emit(event, snapshot) { for (const callback of [...events.get(event) ?? []]) callback(snapshot); },
  configForms: { get: () => ({
    getSnapshot: () => ({ value: durable }), subscribe: () => () => {},
    set(key, value) {
      durable[key] = value;
      localStorage.setItem('atelier-preview:theme', JSON.stringify(durable));
      return Promise.resolve();
    },
  }) },
  locale: {
    register(namespace, values) { dictionaries.set(namespace, values); return () => dictionaries.delete(namespace); },
    bind(namespace) { return (key) => dictionaries.get(namespace)?.[language]?.[key] ?? dictionaries.get(namespace)?.en?.[key] ?? key; },
  },
  slots: {
    inject(name, setup) { if (['main', 'sidebar.panellist'].includes(name)) setup(); },
    register(options, component) { entries.set(options.name, { options, component }); return () => entries.delete(options.name); },
  },
};
window.__ModuleLoader__ = { load(module) {
  const sdk = module.factory((name) => {
    if (name === 'react') return React;
    if (name === '@deepseek-ai/dsh-client-store') return { defineStore: (spec) => spec };
    return {};
  });
  sdk.apply(ctx);
} };
await new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = '/sdk.js'; script.onload = resolve; script.onerror = reject;
  document.head.appendChild(script);
});
let applied = [];
const present = (snapshot) => {
  document.documentElement.style.colorScheme = snapshot.active.colorScheme;
  document.body.toggleAttribute('data-ds-dark-theme', snapshot.active.colorScheme === 'dark');
  for (const name of applied) document.body.style.removeProperty(name);
  applied = Object.keys(snapshot.active.tokens);
  for (const [name, value] of Object.entries(snapshot.active.tokens)) document.body.style.setProperty(name, value);
  document.body.style.setProperty('--dsh-content-font-size', `${snapshot.fontSizes.text}px`);
};
ctx.on('theme/change', present);
present(ctx.theme.getTheme());
apply(ctx);
const { options, component } = entries.get('main');
const root = createRoot(document.getElementById('gallery'));
root.render(React.createElement(component, { ...options.inject(), t: ctx.locale.bind(options.locale) }));
for (const button of document.querySelectorAll('[data-native]')) {
  button.addEventListener('click', () => ctx.theme.setTheme(button.dataset.native));
}
window.atelierPreview = {
  theme: ctx.theme,
  dispose() { root.unmount(); for (const off of effects.reverse()) off(); },
};

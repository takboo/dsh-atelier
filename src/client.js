import { PLUGIN_ID } from './identity.js';
import React from 'react';
import { NS, en, zh } from './locale.js';
import { THEMES, makeTokens } from './themes.js';
import { AtelierIcon, Gallery } from './gallery.js';
import { createThemeController } from './runtime.js';
import GLOBAL_CSS from './styles/global.css';

export const inject = ['slots', 'locale', 'theme'];

export function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'atelier dictionaries');
  for (const definition of THEMES) {
    ctx.effect(() => ctx.theme.register({
      id: `atelier-${definition.id}`, colorScheme: definition.scheme, tokens: makeTokens(definition),
    }), `atelier ${definition.id} theme`);
  }
  ctx.effect(() => {
    const tag = document.createElement('style');
    tag.dataset.plugin = PLUGIN_ID;
    tag.textContent = GLOBAL_CSS;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, 'atelier global stylesheet');

  let controller;
  ctx.effect(() => {
    controller = createThemeController({
      theme: ctx.theme,
      subscribeTheme: (listener) => ctx.on('theme/change', listener),
      getStorage: () => window.localStorage,
      setStyle: (id) => {
        if (id) document.body.dataset.atelierStyle = id;
        else delete document.body.dataset.atelierStyle;
        delete document.body.dataset.atelierReducedTransparency;
      },
    });
    return () => controller.dispose();
  }, 'atelier selection and persistence');

  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist', id: 'atelier', order: 30,
    label: () => ctx.locale.bind(NS)('nav'), locale: NS,
  }, AtelierIcon));
  ctx.slots.inject('main', () => ctx.slots.register({
    name: 'main', key: 'atelier', locale: NS,
    inject: () => ({
      getSnapshot: controller.getSnapshot, subscribe: controller.subscribe,
      onSelect: controller.select, onModeChange: controller.setMode, onReset: controller.reset,
    }),
  }, (props) => React.createElement(Gallery, props)));
}

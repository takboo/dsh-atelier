import React from 'react';
import { THEMES } from './themes.js';
import { DEFAULT_PREFERENCES, resolveActive } from './preferences.js';
import PAGE_CSS from './styles/gallery.css';

const h = React.createElement;

export function AtelierIcon({ size = 20 }) {
  return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }),
    h('path', { d: 'm4 7.5 8 4.5 8-4.5M12 12v9', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round' }),
    h('rect', { x: 10, y: 1, width: 4, height: 4, fill: 'currentColor' }));
}

function Preview({ definition, t }) {
  const c = definition.colors;
  const style = {
    '--p-base': c.base, '--p-surface': c.surface, '--p-raised': c.raised, '--p-sidebar': c.sidebar,
    '--p-text': c.text, '--p-muted': c.muted, '--p-border': c.strongBorder, '--p-accent': c.accent,
    '--p-accent-2': c.secondary, '--p-accent-3': c.tertiary, '--p-radius': `${definition.radii[2]}px`,
    '--p-shadow': definition.shadow, '--p-selection': c.selection, '--p-code': c.code,
  };
  return h('div', { className: 'atelier-preview', 'data-preview': definition.id, style, 'aria-hidden': true },
    h('div', { className: 'atelier-window' },
      h('div', { className: 'atelier-window-top' },
        h('div', { className: 'atelier-dots' }, [0, 1, 2].map((i) => h('span', { className: 'atelier-dot', key: i }))),
        h('div', { className: 'atelier-preview-tabs' },
          h('span', { className: 'atelier-preview-tab atelier-preview-tab-active' }, t('previewChat')),
          h('span', { className: 'atelier-preview-tab' }, t('previewFiles')))),
      h('div', { className: 'atelier-window-body' },
        h('div', { className: 'atelier-window-side' },
          h('span', { className: 'atelier-preview-brand' }),
          h('span', { className: 'atelier-preview-nav atelier-preview-nav-active' }, t('previewChat')),
          h('span', { className: 'atelier-preview-nav' }, t('previewFiles'))),
        h('div', { className: 'atelier-window-main' },
          h('div', { className: 'atelier-preview-message' }, t('previewMessage')),
          h('code', { className: 'atelier-preview-code' }, 'style.apply();'),
          h('div', { className: 'atelier-preview-input' },
            h('span', null, t('previewPrompt')), h('span', { className: 'atelier-preview-send' }, '↑'))))));
}

export function Gallery({ t, getSnapshot, subscribe, onSelect, onModeChange, onReset }) {
  const { preferences, systemDark } = React.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [filter, setFilter] = React.useState('all');
  const pair = preferences || DEFAULT_PREFERENCES;
  const activeId = resolveActive(preferences, systemDark);
  const active = THEMES.find((item) => item.id === activeId);
  return h('div', { className: 'atelier-root' }, h('style', null, PAGE_CSS), h('main', { className: 'atelier-shell' },
    h('header', { className: 'atelier-header' },
      h('div', null,
        h('div', { className: 'atelier-eyebrow' }, t('eyebrow')),
        h('h1', { className: 'atelier-title' }, t('title')),
        h('p', { className: 'atelier-subtitle' }, t('subtitle'))),
      h('div', { className: 'atelier-current' },
        h('div', { className: 'atelier-current-label' }, t('current')),
        h('div', { className: 'atelier-current-name' }, active ? t(`${active.id}.name`) : t('native')),
        active ? h('div', { className: 'atelier-current-scheme' },
          pair.mode === 'system' ? t(systemDark ? 'systemDark' : 'systemLight') : t(active.scheme)) : null)),
    h('section', { className: 'atelier-appearance', 'aria-label': t('appearance') },
      h('div', { className: 'atelier-mode-row' },
        h('span', { className: 'atelier-section-label' }, t('appearance')),
        h('div', { className: 'atelier-segmented', role: 'group', 'aria-label': t('appearance') },
          ['light', 'dark', 'system'].map((mode) => h('button', {
            type: 'button', key: mode, className: preferences?.mode === mode ? 'atelier-mode-active' : '',
            'aria-pressed': preferences ? preferences.mode === mode : false, onClick: () => onModeChange(mode),
          }, t(mode))))),
      h('div', { className: 'atelier-pair' }, ['light', 'dark'].map((scheme) => h('div', {
        className: `atelier-pair-slot ${activeId === pair[scheme] ? 'atelier-pair-current' : ''}`, key: scheme,
      },
        h('span', null, t(`${scheme}Theme`)),
        h('strong', null, t(`${pair[scheme]}.name`)))))),
    h('div', { className: 'atelier-filter', role: 'group', 'aria-label': t('filter') },
      ['all', 'light', 'dark'].map((id) => h('button', {
        type: 'button', key: id, className: filter === id ? 'atelier-filter-active' : '',
        'aria-pressed': filter === id, onClick: () => setFilter(id),
      }, t(id)))),
    h('div', { className: 'atelier-grid' }, THEMES.filter((definition) => filter === 'all' || definition.scheme === filter).map((definition) => {
      const isActive = activeId === definition.id;
      const isPaired = preferences?.[definition.scheme] === definition.id;
      const index = THEMES.indexOf(definition);
      return h('button', {
        type: 'button', key: definition.id,
        className: `atelier-card ${isPaired ? 'atelier-card-active' : ''} ${isActive ? 'atelier-card-current' : ''}`,
        'aria-pressed': isPaired, 'aria-label': `${t(`${definition.scheme}Theme`)}: ${t(`${definition.id}.name`)}`,
        onClick: () => onSelect(definition.id),
      },
        h(Preview, { definition, t }),
        h('div', { className: 'atelier-card-copy' },
          h('div', { className: 'atelier-card-meta' },
            h('span', null, `${String(index + 1).padStart(2, '0')} — ${definition.scheme.toUpperCase()} / ${t(`${definition.id}.tag`)}`),
            isPaired ? h('span', { className: 'atelier-check', title: isActive ? t('applied') : t('waiting') }, '✓') : null),
          h('h2', { className: 'atelier-card-title' }, t(`${definition.id}.name`)),
          h('p', { className: 'atelier-card-description' }, t(`${definition.id}.description`))));
    })),
    h('footer', { className: 'atelier-footer' },
      h('div', { className: 'atelier-font-note' }, t('fontNote')),
      h('div', { className: 'atelier-actions' },
        h('button', { type: 'button', className: 'atelier-reset', onClick: onReset, disabled: !preferences }, t('reset'))))));
}

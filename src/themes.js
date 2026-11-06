export const THEMES = [
  {
    id: 'pixel', scheme: 'dark', radii: [0, 0, 0, 0, 0, 0], corner: 'square', shadow: 'inset 2px 2px 0 #ffffff12,inset -2px -2px 0 #00000042,3px 3px 0 #00000052',
    colors: {
      base: '#171a17', surface: '#252a24', raised: '#32382e', overlay: '#3d4538', sidebar: '#29241d',
      text: '#f2f0df', muted: '#b4b29f', faint: '#7f8675', border: '#4a5142', strongBorder: '#727b60',
      accent: '#7da453', accentText: '#10170d', secondary: '#82b7c9', tertiary: '#d9a84e', selection: '#3c5130',
      success: '#8fbd68', error: '#c36b54', warning: '#e0b65e', code: '#151914',
    },
  },
  {
    id: 'paper', scheme: 'light', radii: [6, 10, 14, 20, 24, 28], corner: 'round', shadow: '0 8px 24px #4d473214',
    colors: {
      base: '#f4f0e6', surface: '#fffdf7', raised: '#ece5d6', overlay: '#fffaf0', sidebar: '#e9e4d6',
      text: '#29372f', muted: '#66766b', faint: '#929e94', border: '#d9d2c2', strongBorder: '#bdb5a3',
      accent: '#3d7255', accentText: '#fffdf7', secondary: '#b8623f', tertiary: '#c49332', selection: '#dce7d6',
      success: '#437d5c', error: '#b64d43', warning: '#a96f22', code: '#f0ebdf',
    },
  },
  {
    id: 'midnight', scheme: 'dark', radii: [6, 10, 14, 18, 22, 28], corner: 'superellipse(2)', shadow: '0 10px 32px #03000866',
    colors: {
      base: '#0b0914', surface: '#151125', raised: '#1d1732', overlay: '#292044', sidebar: '#100c1d',
      text: '#f4f0ff', muted: '#aaa0c7', faint: '#786f93', border: '#382d56', strongBorder: '#5b4d80',
      accent: '#73e6ff', accentText: '#071319', secondary: '#c38bff', tertiary: '#ff72b6', selection: '#29264d',
      success: '#64edbd', error: '#ff6f91', warning: '#f7bf6a', code: '#0d0b18',
    },
  },
  {
    id: 'bauhaus', scheme: 'light', radii: [2, 4, 6, 8, 10, 12], corner: 'round', shadow: '0 12px 30px #302b1f14',
    colors: {
      base: '#f2efe7', surface: '#fffdf6', raised: '#e8e3d7', overlay: '#fffdf6', sidebar: '#ece8de',
      text: '#171714', muted: '#5d5a51', faint: '#898579', border: '#c8c1b4', strongBorder: '#8f8879',
      accent: '#e4472f', accentText: '#fffdf6', secondary: '#2058a8', tertiary: '#d9a918', selection: '#f0d66580',
      success: '#2e6d4f', error: '#c53428', warning: '#a56d0d', code: '#e8e3d7',
    },
  },
  {
    id: 'mono', scheme: 'dark', radii: [2, 4, 6, 8, 10, 12], corner: 'round', shadow: 'none',
    colors: {
      base: '#090909', surface: '#111111', raised: '#1a1a19', overlay: '#242423', sidebar: '#0d0d0c',
      text: '#f5f5f2', muted: '#a3a39d', faint: '#71716b', border: '#292927', strongBorder: '#41413d',
      accent: '#f5f5f2', accentText: '#090909', secondary: '#c5c5be', tertiary: '#85857e', selection: '#30302d',
      success: '#b5d6bd', error: '#e5a5a5', warning: '#d8c9a3', code: '#111110',
    },
  },
  {
    id: 'celadon', scheme: 'light', radii: [4, 8, 12, 16, 20, 24], corner: 'superellipse(1.4)', shadow: '0 12px 30px #203d3312,inset 0 1px 0 #ffffffb8',
    colors: {
      base: '#f3f2eb', surface: '#fffef8', raised: '#e6ece4', overlay: '#fffef9', sidebar: '#e3ebe3',
      text: '#18352f', muted: '#526c63', faint: '#81948a', border: '#ccd8ce', strongBorder: '#9fb5a7',
      accent: '#b9533f', accentText: '#fffaf2', secondary: '#37766a', tertiary: '#aa8750', selection: '#d8e5d9',
      success: '#4d8064', error: '#b9533f', warning: '#a77a35', code: '#e5ede7',
    },
  },
];

const mix = (color, amount, other = 'transparent') => `color-mix(in srgb, ${color} ${amount}%, ${other})`;

export function makeTokens(definition) {
  const c = definition.colors;
  const tokens = {};
  const set = (name, value) => { tokens[`--dsw-${name}`] = value; };
  const colors = {
    'alias-bg-base': c.base, 'alias-bg-document-preview': c.raised, 'alias-bg-document-selection': c.selection,
    'alias-label-document-preview': c.muted, 'alias-bg-layer-1': c.surface, 'alias-bg-layer-2': c.raised,
    'alias-bg-layer-3': c.overlay, 'alias-bg-module-platform': c.raised, 'alias-bg-multi-select': c.selection,
    'alias-bg-overlay': c.overlay, 'alias-bg-skeleton': mix(c.text, 7),
    'alias-border-l1': c.border, 'alias-border-l2-darkmode-thin': c.border, 'alias-border-l2': c.border,
    'alias-border-l3': c.strongBorder, 'alias-border-l4': c.strongBorder,
    'alias-brand-primary-invert': c.accentText, 'alias-brand-primary': c.accent, 'alias-brand-text': c.accent,
    'alias-brand-primary-new-colorprimary-new-color': c.accent,
    'alias-button-contrast-fill': c.text, 'alias-button-elevated-fill': c.surface,
    'alias-button-floating-fill': c.surface, 'alias-button-floating-hover': c.raised,
    'alias-button-ghost-active-border': c.accent, 'alias-button-ghost-active-fill': c.selection,
    'alias-button-ghost-active-hover': c.raised, 'alias-button-info-fill': c.secondary,
    'alias-button-info-hover': mix(c.secondary, 82, c.text), 'alias-button-primary-dimmed': c.selection,
    'alias-button-primary-fill': c.accent, 'alias-button-primary-hover': mix(c.accent, 84, c.text),
    'alias-interactive-bg-active': mix(c.accent, 18), 'alias-interactive-bg-hover-accent': mix(c.accent, 13),
    'alias-interactive-bg-hover-solid': c.raised, 'alias-interactive-bg-hover': mix(c.accent, 8),
    'alias-label-caption': c.faint, 'alias-label-deep-diving': c.secondary,
    'alias-label-deep-diving-shimmer': mix(c.secondary, 55), 'alias-label-dimmed': c.faint,
    'alias-label-primary-bluish': c.text, 'alias-label-primary-dimmed': c.muted,
    'alias-label-primary-foreground': c.accentText, 'alias-label-primary-inverted': c.base,
    'alias-label-primary': c.text, 'alias-label-secondary': c.muted, 'alias-label-tertiary': c.faint,
    'alias-menu-icon': c.muted, 'alias-link': c.secondary,
    'alias-markdown-citation': c.selection, 'alias-markdown-code-block-banner': c.raised,
    'alias-markdown-code-block': c.code, 'alias-markdown-code-segment-selected': c.surface,
    'alias-markdown-code-segment-unselected': c.raised, 'alias-markdown-inline-code': c.code,
    'alias-markdown-placeholder': c.raised, 'alias-markdown-tag': c.selection,
    'alias-scrollbar-bg-l1': c.strongBorder, 'alias-scrollbar-bg-l2': c.strongBorder,
    'alias-scrollbar-hover-l1': c.muted, 'alias-scrollbar-hover-l2': c.muted,
    'alias-state-business-primary': c.secondary, 'alias-state-business-tertiary': c.selection,
    'alias-state-error-primary': c.error, 'alias-state-error-secondary': mix(c.error, 72),
    'alias-state-idle-primary': c.faint, 'alias-state-success-primary': c.success,
    'alias-state-success-secondary': mix(c.success, 72), 'alias-state-success-tertiary': mix(c.success, 16),
    'alias-state-warn-label': c.warning, 'alias-state-warn-primary': c.warning,
    'alias-state-warn-secondary': mix(c.warning, 72), 'alias-state-warn-tertiary': mix(c.warning, 16),
    'alias-switch-thumb': c.surface, 'alias-toast-bg': c.text, 'alias-toast-label': c.base,
    'alias-tooltip-bg': c.text, 'alias-tooltip-key-bg': mix(c.text, 82, c.base),
    'alias-turn-trigger-bg': c.code, 'alias-turn-trigger-bg-hover': c.raised,
    'alias-menu-group-header-fill': c.overlay, 'alias-settings-card-fill': c.surface,
    'alias-settings-card-stroke': c.border,
    'specific-bubble-highlight': mix(c.secondary, 26), 'specific-bubble': c.selection,
    'specific-input-major': c.surface, 'specific-login-input': c.raised, 'specific-menu': c.overlay,
    'specific-selector': c.raised, 'specific-sidebar-fill': c.sidebar,
    'specific-sidebar-nav-item-active-accent': c.selection, 'specific-sidebar-nav-item-active': c.selection,
    'specific-sidebar-nav-item-hover': mix(c.accent, 9), 'specific-tip': c.raised,
    'elevation-stroke-color': c.border,
  };
  for (const [name, value] of Object.entries(colors)) set(name, value);
  ['xs', 'sm', 'md', 'lg', 'xl', 'panel'].forEach((name, index) => set(`radius-${name}`, `${definition.radii[index]}px`));
  set('corner-shape', definition.corner);
  ['lv1', 'lv1-blur', 'lv2', 'lv3'].forEach((name) => set(`shadow-${name}`, definition.shadow));
  set('linear-gradient-think', `linear-gradient(180deg, ${c.surface} 20%, ${mix(c.surface, 0)} 100%)`);
  set('linear-think-select', `linear-gradient(180deg, ${c.raised} 20%, ${mix(c.raised, 0)} 100%)`);
  const syntax = {
    constant: c.secondary, string: c.success, comment: c.faint, keyword: c.tertiary,
    parameter: c.warning, function: c.accent, 'string-expression': c.success,
    punctuation: c.muted, link: c.secondary,
  };
  for (const [name, value] of Object.entries(syntax)) tokens[`--shiki-token-${name}`] = value;
  return tokens;
}

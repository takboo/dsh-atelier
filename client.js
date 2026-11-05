window.__ModuleLoader__.load({
  id: '@local/dsh-atelier',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const NS = 'atelier';
    const STORAGE_KEY = 'dsh-atelier:style';
    const NATIVE_KEY = 'dsh-atelier:native-preference';
    const BUILTIN = new Set(['light', 'dark', 'system']);

    const en = {
      nav: 'Atelier', eyebrow: 'DSH / VISUAL DIRECTIONS', title: 'Choose your atmosphere.',
      subtitle: 'Six complete visual languages. One workspace. Your type settings stay yours.',
      current: 'Now showing', native: 'DSH native', nativeNote: 'The original DSH appearance is active.',
      applied: 'Applied to the entire app', use: 'Use this style', reset: 'Restore native',
      fontNote: 'Text, code, and terminal fonts and sizes remain controlled by DSH Settings.',
      previewChat: 'Chat', previewFiles: 'Files',
      previewMessage: 'Make every pixel intentional.', previewPrompt: 'Ask anything…',
      appearance: 'Appearance', light: 'Light', dark: 'Dark', system: 'Follow system', all: 'All styles',
      lightTheme: 'Light theme', darkTheme: 'Dark theme', filter: 'Filter styles',
      systemLight: 'System is light', systemDark: 'System is dark', waiting: 'Saved for this appearance',
      'pixel.name': 'Blockrealm', 'pixel.tag': 'BLOCK / CRAFT', 'pixel.description': 'Grass, stone, timber, and torchlight. A tactile block world built for big ideas.',
      'paper.name': 'Paper Garden', 'paper.tag': 'TACTILE / BOTANICAL', 'paper.description': 'Warm paper, sage ink, and softened edges. A calm desk with room to think.',
      'midnight.name': 'Midnight Neon', 'midnight.tag': 'LUMINOUS / NOCTURNAL', 'midnight.description': 'Ultraviolet surfaces traced in cyan and pink. Focused, cinematic, after-hours energy.',
      'bauhaus.name': 'Bauhaus Workshop', 'bauhaus.tag': 'GEOMETRIC / PRIMARY', 'bauhaus.description': 'Primary pigments, honest geometry, and bold rules. Form follows imagination.',
      'mono.name': 'Mono Study', 'mono.tag': 'ESSENTIAL / EDITORIAL', 'mono.description': 'Black, white, and nothing extra. An exacting canvas where content takes the lead.',
      'celadon.name': 'Celadon Studio', 'celadon.tag': 'CERAMIC / VERDANT', 'celadon.description': 'Warm porcelain, jade glaze, pine ink, and cinnabar seals. Quiet craftsmanship for focused work.',
    };
    const zh = {
      nav: '风格画廊', eyebrow: 'DSH / 视觉企划', title: '为思想，选一种氛围。',
      subtitle: '六种完整的视觉语言，同一个工作空间。你的字体设置，始终由你掌握。',
      current: '当前风格', native: 'DSH 原生', nativeNote: '正在使用 DSH 原生外观。',
      applied: '已应用到整个应用', use: '应用这套风格', reset: '恢复原生',
      fontNote: '正文、代码与终端的字体和字号，仍由 DSH 设置独立控制。',
      previewChat: '会话', previewFiles: '文件',
      previewMessage: '让每一处细节都有意图。', previewPrompt: '输入你的想法…',
      appearance: '外观模式', light: '浅色', dark: '深色', system: '跟随系统', all: '全部风格',
      lightTheme: '浅色主题', darkTheme: '深色主题', filter: '筛选风格',
      systemLight: '系统当前为浅色', systemDark: '系统当前为深色', waiting: '已保存到对应外观',
      'pixel.name': '方块远征', 'pixel.tag': '方块 / 建造', 'pixel.description': '草木、岩石、泥土与火把微光。把天马行空的灵感，建造成立体的方块世界。',
      'paper.name': '纸上花园', 'paper.tag': '触感 / 植物', 'paper.description': '暖纸、苔绿与柔和边缘。像一张安静的书桌，让思绪自然生长。',
      'midnight.name': '午夜霓虹', 'midnight.tag': '流光 / 夜色', 'midnight.description': '深紫表面勾勒青蓝与紫粉高光。专注、电影感，还有一点午夜能量。',
      'bauhaus.name': '包豪斯工坊', 'bauhaus.tag': '几何 / 三原色', 'bauhaus.description': '原色、几何与大胆轮廓。形式追随功能，也追随想象力。',
      'mono.name': '黑白极简', 'mono.tag': '纯粹 / 编辑', 'mono.description': '黑、白，以及恰到好处的一切。让内容成为唯一的主角。',
      'celadon.name': '青瓷造物', 'celadon.tag': '青瓷 / 器物', 'celadon.description': '白瓷、青玉、松烟墨与朱砂印。以温润器物之美，安放专注而清晰的思想。',
    };

    const THEMES = [
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

    function makeTokens(definition) {
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

    const GLOBAL_CSS = `
      body[data-atelier-style] ::selection{background:var(--dsw-alias-bg-document-selection);color:var(--dsw-alias-label-primary)}
      body[data-atelier-style] [data-composer-card],body[data-atelier-style] [class*="_panelRow"],body[data-atelier-style] [data-chat-flow-kind="user"] [class*="_bubble"]{transition:border-color .18s ease,box-shadow .18s ease,background-color .18s ease}
      html[data-platform="darwin"] body[data-atelier-style] [class*="_sidebarCol"]{background:var(--dsw-specific-sidebar-fill)}

      body[data-atelier-style="pixel"]{--dsh-scrollbar-width:8px}
      body[data-atelier-style="pixel"] *::-webkit-scrollbar-thumb{border-radius:0}
      body[data-atelier-style="pixel"] .atelier-root,body[data-atelier-style="pixel"] [class*="kiGsTW_root"]{background-color:#171a17;background-image:linear-gradient(45deg,#ffffff03 25%,transparent 25%,transparent 75%,#ffffff03 75%),linear-gradient(45deg,#00000008 25%,transparent 25%,transparent 75%,#00000008 75%);background-position:0 0,8px 8px;background-size:16px 16px}
      html[data-platform="darwin"] body[data-atelier-style="pixel"] [class*="_sidebarCol"]{background-color:#29241d;background-image:linear-gradient(90deg,#ffffff04 50%,transparent 50%),linear-gradient(#0000000a 50%,transparent 50%);background-size:12px 12px}
      html[data-platform] body[data-atelier-style="pixel"] [class~="kB3qhq_newSession"]{border:2px solid #141a12;background:#6f934a;box-shadow:inset 0 4px 0 #96bd66,inset 0 -4px 0 #455e30,3px 3px 0 #00000066}
      body[data-atelier-style="pixel"] [class*="_panelRow"]{border:2px solid transparent;box-shadow:none}
      body[data-atelier-style="pixel"] [class*="_panelRow"][class*="_panelActive"]{border-color:#a8b39a;background:#414b36;box-shadow:inset 2px 2px 0 #ffffff14,inset -2px -2px 0 #00000038}
      body[data-atelier-style="pixel"] [data-composer-card]{border:2px solid #0d110d;background:#2b3029;box-shadow:inset 2px 2px 0 #68705c,inset -2px -2px 0 #141812,4px 4px 0 #00000052}
      body[data-atelier-style="pixel"] [data-chat-flow-kind="user"] [class*="_bubble"]{border:2px solid #161b13;background:#3c5130;box-shadow:inset 2px 2px 0 #ffffff12,inset -2px -2px 0 #00000038,3px 3px 0 #00000045}
      body[data-atelier-style="pixel"] pre{border:2px solid #0d110d;border-left:4px solid #d9a84e;background:#151914;box-shadow:inset 2px 2px 0 #ffffff0a,3px 3px 0 #00000045}
      body[data-atelier-style="pixel"] [class*="_tabActive"]{box-shadow:inset 0 -3px 0 #d9a84e}

      body[data-atelier-style="paper"] .atelier-root,body[data-atelier-style="paper"] [class*="kiGsTW_root"]{background-color:#f4f0e6;background-image:radial-gradient(#29372f09 .65px,transparent .8px);background-size:6px 6px}
      html[data-platform] body[data-atelier-style="paper"] [class~="kB3qhq_newSession"]{border:1px solid #bdb5a3;background:#fffdf7;box-shadow:0 3px 10px #4d473214}
      body[data-atelier-style="paper"] [class*="_panelRow"][class*="_panelActive"]{border-radius:5px 14px 14px 5px;background:#dce7d6;box-shadow:inset 3px 0 #3d7255}
      body[data-atelier-style="paper"] [data-composer-card]{border:1px solid #d9d2c2;border-top:3px double #3d7255;background:#fffdf7;box-shadow:0 12px 30px #4d473214}
      body[data-atelier-style="paper"] [data-chat-flow-kind="user"] [class*="_bubble"]{border:1px solid #d9d2c2;border-radius:22px 22px 5px 22px;box-shadow:0 4px 12px #4d47320d}
      body[data-atelier-style="paper"] pre{border:1px solid #d9d2c2;border-left:3px solid #3d7255;box-shadow:0 5px 16px #4d47320d}
      body[data-atelier-style="paper"] [class*="_tabActive"]{box-shadow:inset 0 -2px 0 #3d7255}

      body[data-atelier-style="midnight"]{--dsw-menu-backdrop-filter:blur(28px) saturate(170%)}
      body[data-atelier-style="midnight"] .atelier-root,body[data-atelier-style="midnight"] [class*="kiGsTW_root"]{background-color:#0b0914;background-image:radial-gradient(circle at 12% 0%,#c38bff16,transparent 38%),radial-gradient(circle at 90% 88%,#73e6ff12,transparent 42%)}
      html[data-platform="darwin"] body[data-atelier-style="midnight"] [class*="_sidebarCol"]{background:linear-gradient(160deg,#c38bff12,transparent 45%),#100c1d}
      html[data-platform] body[data-atelier-style="midnight"] [class~="kB3qhq_newSession"]{border:1px solid #73e6ff80;background:#1d1732;box-shadow:0 0 18px #73e6ff18}
      body[data-atelier-style="midnight"] [class*="_panelRow"][class*="_panelActive"]{background:#29264d;box-shadow:inset 2px 0 #73e6ff,0 0 16px #73e6ff12}
      body[data-atelier-style="midnight"] [data-composer-card]{border:1px solid #c38bff80;background:#151125e8;box-shadow:0 0 32px #c38bff1c,inset 0 1px 0 #73e6ff33}
      body[data-atelier-style="midnight"] [data-chat-flow-kind="user"] [class*="_bubble"]{border:1px solid #ff72b65c;background:#29264d;box-shadow:0 0 20px #ff72b612}
      body[data-atelier-style="midnight"] pre{border:1px solid #382d56;border-left:2px solid #c38bff;box-shadow:0 0 22px #c38bff12}
      body[data-atelier-style="midnight"] [class*="_tabActive"]{box-shadow:inset 0 -2px 0 #73e6ff,0 4px 12px -6px #73e6ff}

      body[data-atelier-style="bauhaus"] .atelier-root,body[data-atelier-style="bauhaus"] [class*="kiGsTW_root"]{background-color:#f2efe7;background-image:radial-gradient(circle at calc(100% - 34px) 34px,#d9a918 0 10px,transparent 11px),linear-gradient(135deg,transparent 98%,#2058a8 98%)}
      html[data-platform="darwin"] body[data-atelier-style="bauhaus"] [class*="_sidebarCol"]{background:#ece8de;border-right:1px solid #c8c1b4}
      html[data-platform] body[data-atelier-style="bauhaus"] [class~="kB3qhq_newSession"]{border:1px solid #8f8879;border-left:5px solid #e4472f;background:#fffdf6;color:#171714;box-shadow:none}
      body[data-atelier-style="bauhaus"] [class*="_panelRow"][class*="_panelActive"]{border-radius:2px;background:#f0d66566;box-shadow:inset 4px 0 #e4472f}
      body[data-atelier-style="bauhaus"] [data-composer-card]{border:1px solid #c8c1b4;border-top:4px solid #2058a8;background:#fffdf6;box-shadow:0 12px 30px #302b1f14}
      body[data-atelier-style="bauhaus"] [data-chat-flow-kind="user"] [class*="_bubble"]{border:1px solid #c8c1b4;border-radius:4px 18px 18px 18px;background:#f0d66566;box-shadow:none}
      body[data-atelier-style="bauhaus"] pre{border:0;border-left:4px solid #e4472f;border-radius:4px;box-shadow:none}
      body[data-atelier-style="bauhaus"] [class*="_tabActive"]{box-shadow:inset 0 -2px 0 #2058a8}

      body[data-atelier-style="mono"] .atelier-root,body[data-atelier-style="mono"] [class*="kiGsTW_root"]{background:#090909}
      html[data-platform="darwin"] body[data-atelier-style="mono"] [class*="_sidebarCol"]{background:#0d0d0c;border-right:1px solid #41413d}
      html[data-platform] body[data-atelier-style="mono"] [class~="kB3qhq_newSession"]{border:1px solid #f5f5f2;border-radius:0;background:transparent;box-shadow:none}
      body[data-atelier-style="mono"] [class*="_panelRow"][class*="_panelActive"]{border-radius:0;background:transparent;box-shadow:inset 2px 0 #f5f5f2}
      body[data-atelier-style="mono"] [data-composer-card]{border:1px solid #41413d;border-radius:0;background:#111111;box-shadow:none}
      body[data-atelier-style="mono"] [data-chat-flow-kind="user"] [class*="_bubble"]{border:1px solid #41413d;border-radius:0;background:transparent;box-shadow:none}
      body[data-atelier-style="mono"] pre{border:1px solid #292927;border-radius:0;box-shadow:none}
      body[data-atelier-style="mono"] [class*="_tabActive"]{box-shadow:inset 0 -2px 0 #f5f5f2}

      body[data-atelier-style="celadon"] .atelier-root,body[data-atelier-style="celadon"] [class*="kiGsTW_root"]{background-color:#f3f2eb;background-image:linear-gradient(115deg,transparent 49.7%,#68827108 50%,transparent 50.3%),linear-gradient(25deg,transparent 49.7%,#68827106 50%,transparent 50.3%);background-size:97px 83px,113px 107px}
      html[data-platform="darwin"] body[data-atelier-style="celadon"] [class*="_sidebarCol"]{background:linear-gradient(125deg,#edf2e9,#dce7df);border-right:1px solid #ccd8ce}
      html[data-platform] body[data-atelier-style="celadon"] [class~="kB3qhq_newSession"]{border:1px solid #9e4031;border-radius:7px;background:#b9533f;color:#fffaf2;box-shadow:inset 0 1px 0 #d98470,0 4px 12px #b9533f24}
      html[data-platform] body[data-atelier-style="celadon"] [class~="kB3qhq_newSession"] [class*="_newSessionContent"]{color:#fffaf2}
      body[data-atelier-style="celadon"] [class*="_panelRow"][class*="_panelActive"]{border-radius:4px 12px 12px 4px;background:#d8e5d9;box-shadow:inset 3px 0 #b9533f}
      body[data-atelier-style="celadon"] [data-composer-card]{border:1px solid #b9cabe;border-radius:18px;background:#fffef8;box-shadow:inset 0 1px 0 #fff,0 12px 30px #203d3314}
      body[data-atelier-style="celadon"] [data-chat-flow-kind="user"] [class*="_bubble"]{border:1px solid #ccd8ce;border-radius:18px 18px 6px 18px;background:#e5ede7;box-shadow:0 4px 14px #203d330d}
      body[data-atelier-style="celadon"] [data-menu-material]{border:1px solid #ccd8ce;background:#fffef9;box-shadow:0 16px 40px #203d3324}
      body[data-atelier-style="celadon"] pre{border:1px solid #ccd8ce;border-left:3px solid #aa8750;border-radius:8px;background:#e5ede7;box-shadow:none}
      body[data-atelier-style="celadon"] [class*="_tabActive"]{box-shadow:inset 0 -2px 0 #b9533f}
      @media (prefers-reduced-motion:reduce){body[data-atelier-style] [data-composer-card],body[data-atelier-style] [class*="_panelRow"],body[data-atelier-style] [data-chat-flow-kind="user"] [class*="_bubble"]{transition:none}}
    `;

    const PAGE_CSS = `
      .atelier-root{box-sizing:border-box;min-height:100%;overflow:auto;padding:42px 42px 52px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}
      .atelier-shell{max-width:1180px;margin:0 auto}.atelier-header{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:34px}
      .atelier-eyebrow{margin-bottom:12px;color:var(--dsw-alias-brand-text);font-size:10px;font-weight:650;letter-spacing:.2em}
      .atelier-title{margin:0;font-size:clamp(28px,3.4vw,46px);font-weight:560;letter-spacing:-.045em;line-height:1.08}
      .atelier-subtitle{max-width:580px;margin:14px 0 0;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.7}
      .atelier-current{flex:none;min-width:176px;padding:15px 17px;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1)}
      .atelier-current-label{display:flex;align-items:center;gap:7px;color:var(--dsw-alias-label-secondary);font-size:10px;letter-spacing:.08em}
      .atelier-current-label:before{content:'';width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-brand-primary)}
      .atelier-current-name{margin-top:8px;font-size:15px;font-weight:600}.atelier-current-scheme{margin-top:5px;color:var(--dsw-alias-label-tertiary);font-size:10px}
      .atelier-appearance{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:18px;padding:16px 18px;border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);background:var(--dsw-alias-bg-layer-1)}
      .atelier-mode-row{display:flex;align-items:center;gap:16px}.atelier-section-label{color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600}
      .atelier-segmented{display:flex;padding:3px;border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-2)}.atelier-segmented button,.atelier-filter button{border:0;border-radius:var(--dsw-radius-sm);padding:6px 11px;color:var(--dsw-alias-label-secondary);background:transparent;cursor:pointer;font:inherit;font-size:11px}.atelier-segmented .atelier-mode-active{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);box-shadow:var(--dsw-shadow-lv1)}
      .atelier-pair{display:flex;gap:10px}.atelier-pair-slot{min-width:130px;padding:7px 11px;border-left:2px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-tertiary);font-size:9px}.atelier-pair-slot strong{display:block;margin-top:3px;color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:560}.atelier-pair-current{border-left-color:var(--dsw-alias-brand-primary)}.atelier-pair-current strong{color:var(--dsw-alias-label-primary)}
      .atelier-filter{display:flex;gap:5px;margin:0 0 16px}.atelier-filter .atelier-filter-active{color:var(--dsw-alias-brand-text);background:var(--dsw-alias-interactive-bg-hover-accent)}
      .atelier-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,270px),1fr));gap:18px}
      .atelier-card{position:relative;min-width:0;overflow:hidden;padding:0;text-align:left;color:inherit;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg);cursor:pointer;box-shadow:var(--dsw-shadow-lv1);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
      .atelier-card:hover{transform:translateY(-3px);border-color:var(--dsw-alias-border-l3);box-shadow:var(--dsw-shadow-lv2)}
      .atelier-card:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:3px}
      .atelier-card-active{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 1px var(--dsw-alias-brand-primary),var(--dsw-shadow-lv1)}
      body[data-atelier-style="celadon"] .atelier-card,body[data-atelier-style="celadon"] .atelier-current,body[data-atelier-style="celadon"] .atelier-reset,body[data-atelier-style="celadon"] .atelier-appearance{border-color:#ccd8ce;background:#fffef8;box-shadow:inset 0 1px 0 #fff,0 12px 30px #203d3312}
      body[data-atelier-style="celadon"] .atelier-card-active{border-color:#b9533f;box-shadow:0 0 0 1px #b9533f33,0 12px 30px #203d3312}
      .atelier-preview{position:relative;height:204px;overflow:hidden;background-color:var(--p-base);border-bottom:1px solid var(--p-border)}
      .atelier-preview[data-preview="pixel"]{background-image:linear-gradient(90deg,#ffffff08 50%,transparent 50%),linear-gradient(0deg,#342d22 0 42%,#6f934a 42% 54%,#82b7c9 54%);background-size:12px 100%,100% 100%}
      .atelier-preview[data-preview="paper"]{background-image:radial-gradient(#3d725512 .7px,transparent .7px);background-size:7px 7px}
      .atelier-preview[data-preview="midnight"]{background-image:radial-gradient(circle at 18% 15%,#c38bff30,transparent 42%),radial-gradient(circle at 85% 75%,#73e6ff24,transparent 45%)}
      .atelier-preview[data-preview="bauhaus"]:before{content:'';position:absolute;width:74px;height:74px;border-radius:50%;left:-24px;top:-25px;background:var(--p-accent-3)}
      .atelier-preview[data-preview="bauhaus"]:after{content:'';position:absolute;width:48px;height:48px;right:13px;top:15px;background:var(--p-accent);transform:rotate(14deg)}
      .atelier-preview[data-preview="mono"]{background-image:linear-gradient(90deg,transparent 49.8%,#ffffff09 50%,transparent 50.2%)}
      .atelier-preview[data-preview="celadon"]{background-color:#f3f2eb;background-image:linear-gradient(115deg,transparent 49.7%,#6882710a 50%,transparent 50.3%),linear-gradient(25deg,transparent 49.7%,#68827108 50%,transparent 50.3%);background-size:97px 83px,113px 107px}
      .atelier-preview[data-preview="celadon"]:before{content:'';position:absolute;width:76px;height:76px;right:-20px;top:-22px;border-radius:50%;background:#dce7df;border:1px solid #b9cabe;box-shadow:inset 0 0 0 7px #edf2e9}
      .atelier-preview[data-preview="celadon"]:after{content:'';position:absolute;width:18px;height:18px;left:20px;bottom:12px;border-radius:2px;background:#b9533f;box-shadow:inset 0 0 0 3px #d98470}
      .atelier-window{position:absolute;inset:24px 22px 0;overflow:hidden;border:1px solid var(--p-border);border-radius:var(--p-radius) var(--p-radius) 0 0;background:var(--p-surface);box-shadow:var(--p-shadow)}
      .atelier-window-top{height:27px;display:flex;align-items:center;justify-content:space-between;padding:0 9px;border-bottom:1px solid var(--p-border);background:var(--p-raised)}
      .atelier-dots{display:flex;gap:4px}.atelier-dot{width:5px;height:5px;border-radius:50%;background:var(--p-muted)}.atelier-dot:first-child{background:var(--p-accent)}.atelier-dot:nth-child(2){background:var(--p-accent-2)}.atelier-dot:nth-child(3){background:var(--p-accent-3)}
      .atelier-preview-tabs{display:flex;align-self:stretch;gap:9px}.atelier-preview-tab{display:flex;align-items:center;color:var(--p-muted);font-size:7px}.atelier-preview-tab-active{color:var(--p-text);box-shadow:inset 0 -2px 0 var(--p-accent)}
      .atelier-window-body{display:grid;grid-template-columns:54px 1fr;height:calc(100% - 27px)}
      .atelier-window-side{padding:13px 7px;background:var(--p-sidebar);border-right:1px solid var(--p-border)}
      .atelier-preview-brand{display:block;width:15px;height:5px;margin:0 0 13px 5px;background:var(--p-text)}
      .atelier-preview-nav{display:block;padding:4px 5px;margin-bottom:3px;color:var(--p-muted);font-size:7px;border-radius:var(--p-radius)}
      .atelier-preview-nav-active{color:var(--p-text);background:var(--p-selection);box-shadow:inset 2px 0 var(--p-accent)}
      .atelier-window-main{padding:15px 13px;color:var(--p-text)}
      .atelier-preview-message{margin-bottom:8px;font-size:10px;font-weight:560;letter-spacing:-.02em}
      .atelier-preview-code{display:inline-block;margin-bottom:13px;padding:3px 6px;color:var(--p-accent-2);background:var(--p-code);border-left:2px solid var(--p-accent);font-size:7px;line-height:1.4}
      .atelier-preview-input{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 7px;color:var(--p-muted);background:var(--p-base);border:1px solid var(--p-border);border-radius:var(--p-radius);font-size:7px}
      .atelier-preview-send{display:grid;place-items:center;width:15px;height:15px;flex:none;border-radius:var(--p-radius);color:var(--p-base);background:var(--p-accent);font-size:9px}
      .atelier-preview[data-preview="pixel"] .atelier-window{border:2px solid #141a12;box-shadow:inset 2px 2px 0 #ffffff14,inset -2px -2px 0 #00000042,4px 4px 0 #00000052}
      .atelier-preview[data-preview="pixel"] .atelier-preview-input{border:2px solid #141a12;box-shadow:inset 2px 2px 0 #68705c,inset -2px -2px 0 #141812}
      .atelier-preview[data-preview="paper"] .atelier-preview-input{border-top:2px double var(--p-accent)}
      .atelier-preview[data-preview="midnight"] .atelier-window{box-shadow:0 0 24px #c38bff24}.atelier-preview[data-preview="midnight"] .atelier-preview-input{border-color:var(--p-accent-2);box-shadow:0 0 12px #c38bff24}
      .atelier-preview[data-preview="bauhaus"] .atelier-window{border:1px solid var(--p-border);box-shadow:0 12px 30px #302b1f14}.atelier-preview[data-preview="bauhaus"] .atelier-preview-input{border:1px solid var(--p-border);border-top:3px solid var(--p-accent-2);box-shadow:none}
      .atelier-preview[data-preview="mono"] .atelier-window,.atelier-preview[data-preview="mono"] .atelier-preview-input{border-radius:0;box-shadow:none}
      .atelier-preview[data-preview="celadon"] .atelier-window{border:1px solid #b9cabe;background:#fffef8;box-shadow:inset 0 1px 0 #fff,0 14px 28px #203d331c}
      .atelier-preview[data-preview="celadon"] .atelier-preview-input{border:1px solid #b9cabe;background:#fffef8;box-shadow:inset 0 1px 0 #fff,0 4px 10px #203d330d}
      .atelier-preview[data-preview="celadon"] .atelier-preview-send{background:#b9533f}
      .atelier-card-copy{padding:19px 20px 21px}.atelier-card-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;color:var(--dsw-alias-label-tertiary);font-size:9px;font-weight:600;letter-spacing:.12em}
      .atelier-check{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;color:var(--dsw-alias-label-primary-foreground);background:var(--dsw-alias-brand-primary);font-size:12px;letter-spacing:0}
      .atelier-card-title{margin:10px 0 7px;font-size:19px;font-weight:580;letter-spacing:-.025em}.atelier-card-description{min-height:42px;margin:0;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1.75}
      .atelier-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:28px;padding-top:22px;border-top:1px solid var(--dsw-alias-border-l1)}
      .atelier-font-note{max-width:600px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:1.65}
      .atelier-reset{flex:none;padding:8px 13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-sm);cursor:pointer;font:inherit;font-size:11px}
      .atelier-reset:hover:not(:disabled){border-color:var(--dsw-alias-brand-primary)}.atelier-reset:disabled{opacity:.4;cursor:default}
      .atelier-actions{display:flex;align-items:center;justify-content:flex-end;gap:14px;flex:none}
      @media(max-width:760px){.atelier-root{padding:28px 20px 38px}.atelier-header{align-items:flex-start;flex-direction:column;margin-bottom:24px}.atelier-current{width:100%;box-sizing:border-box}.atelier-appearance{align-items:flex-start;flex-direction:column}.atelier-pair{width:100%}.atelier-pair-slot{flex:1;min-width:0}.atelier-grid{grid-template-columns:1fr}.atelier-footer{align-items:flex-start;flex-direction:column}.atelier-card-description{min-height:0}}
      @media(prefers-reduced-motion:reduce){.atelier-card{transition:none}.atelier-card:hover{transform:none}}
    `;

    function AtelierIcon({ size = 20 }) {
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

    function Gallery({ t, getPreferences, getSystemDark, subscribeSystem, onSelect, onModeChange, onReset }) {
      const [preferences, setPreferences] = React.useState(getPreferences);
      const [filter, setFilter] = React.useState('all');
      const [systemDark, setSystemDark] = React.useState(getSystemDark);
      React.useEffect(() => subscribeSystem(() => setSystemDark(getSystemDark())), []);
      const choose = (id) => setPreferences(onSelect(id));
      const changeMode = (mode) => setPreferences(onModeChange(mode));
      const reset = () => { setPreferences(null); onReset(); };
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
            h('div', { className: 'atelier-current-name' }, active ? t(`styles.${active.id}.name`) : t('native')),
            active ? h('div', { className: 'atelier-current-scheme' },
              pair.mode === 'system' ? t(systemDark ? 'systemDark' : 'systemLight') : t(active.scheme)) : null)),
        h('section', { className: 'atelier-appearance', 'aria-label': t('appearance') },
          h('div', { className: 'atelier-mode-row' },
            h('span', { className: 'atelier-section-label' }, t('appearance')),
            h('div', { className: 'atelier-segmented', role: 'group', 'aria-label': t('appearance') },
              ['light', 'dark', 'system'].map((mode) => h('button', {
                type: 'button', key: mode, className: preferences?.mode === mode ? 'atelier-mode-active' : '',
                'aria-pressed': preferences ? preferences.mode === mode : false, onClick: () => changeMode(mode),
              }, t(mode))))),
          h('div', { className: 'atelier-pair' }, ['light', 'dark'].map((scheme) => h('div', {
            className: `atelier-pair-slot ${activeId === pair[scheme] ? 'atelier-pair-current' : ''}`, key: scheme,
          },
            h('span', null, t(`${scheme}Theme`)),
            h('strong', null, t(`styles.${pair[scheme]}.name`)))))),
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
            'aria-pressed': isPaired, 'aria-label': `${t(`${definition.scheme}Theme`)}: ${t(`styles.${definition.id}.name`)}`,
            onClick: () => choose(definition.id),
          },
            h(Preview, { definition, t }),
            h('div', { className: 'atelier-card-copy' },
              h('div', { className: 'atelier-card-meta' },
                h('span', null, `${String(index + 1).padStart(2, '0')} — ${definition.scheme.toUpperCase()} / ${t(`styles.${definition.id}.tag`)}`),
                isPaired ? h('span', { className: 'atelier-check', title: isActive ? t('applied') : t('waiting') }, '✓') : null),
              h('h2', { className: 'atelier-card-title' }, t(`styles.${definition.id}.name`)),
              h('p', { className: 'atelier-card-description' }, t(`styles.${definition.id}.description`))));
        })),
        h('footer', { className: 'atelier-footer' },
          h('div', { className: 'atelier-font-note' }, t('fontNote')),
          h('div', { className: 'atelier-actions' },
            h('button', { type: 'button', className: 'atelier-reset', onClick: reset, disabled: !preferences }, t('reset'))))));
    }

    const DEFAULT_PREFERENCES = { mode: 'system', light: 'celadon', dark: 'midnight' };
    const themeForScheme = (id, scheme) => THEMES.some((theme) => theme.id === id && theme.scheme === scheme);
    function resolveActive(preferences, dark) {
      if (!preferences) return null;
      const scheme = preferences.mode === 'system' ? (dark ? 'dark' : 'light') : preferences.mode;
      return preferences[scheme];
    }

    function readPreferences() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const legacyId = raw === 'liquid' ? 'celadon' : raw;
        if (THEMES.some((theme) => theme.id === legacyId)) {
          const scheme = THEMES.find((theme) => theme.id === legacyId).scheme;
          return { ...DEFAULT_PREFERENCES, mode: scheme, [scheme]: legacyId };
        }
        const value = JSON.parse(raw);
        if (!value || !['light', 'dark', 'system'].includes(value.mode)) return null;
        const light = value.light === 'liquid' ? 'celadon' : value.light;
        if (!themeForScheme(light, 'light') || !themeForScheme(value.dark, 'dark')) return null;
        return { mode: value.mode, light, dark: value.dark };
      } catch { return null; }
    }

    function writePreferences(preferences) {
      try {
        if (preferences) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        else window.localStorage.removeItem(STORAGE_KEY);
      } catch { /* The live switch still works when storage is unavailable. */ }
    }

    function readNativePreference(fallback) {
      try {
        const saved = window.localStorage.getItem(NATIVE_KEY);
        if (BUILTIN.has(saved)) return saved;
      } catch { /* Use the current built-in preference. */ }
      return BUILTIN.has(fallback) ? fallback : 'system';
    }

    function writeNativePreference(preference) {
      try { window.localStorage.setItem(NATIVE_KEY, preference); } catch { /* Keep the live preference. */ }
    }

    return {
      inject: ['slots', 'locale', 'theme'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'atelier dictionaries');
        const t = (key) => ctx.locale.bind(NS)(key.startsWith('styles.') ? key.slice(7) : key);
        for (const definition of THEMES) {
          ctx.effect(() => ctx.theme.register({
            id: `atelier-${definition.id}`, colorScheme: definition.scheme, tokens: makeTokens(definition),
          }), `atelier ${definition.id} theme`);
        }
        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = '@local/dsh-atelier';
          tag.textContent = GLOBAL_CSS;
          document.head.appendChild(tag);
          return () => tag.remove();
        }, 'atelier global stylesheet');

        const initialTheme = ctx.theme.getTheme();
        let preferences = readPreferences();
        const previousId = initialTheme.active.id.startsWith('atelier-') ? initialTheme.active.id.slice(8) : null;
        const orphanedId = previousId === 'liquid' ? 'celadon' : previousId;
        if (!preferences && THEMES.some((theme) => theme.id === orphanedId)) {
          const scheme = THEMES.find((theme) => theme.id === orphanedId).scheme;
          preferences = { ...DEFAULT_PREFERENCES, mode: scheme, [scheme]: orphanedId };
          writePreferences(preferences);
        }
        const nativePreference = readNativePreference(initialTheme.preference);
        writeNativePreference(nativePreference);
        let systemDark = initialTheme.active.colorScheme === 'dark';
        let selected = null;
        let appliedSystemTheme = null;
        let disposeSystemOverrides = null;
        const clearSystemOverrides = () => {
          const dispose = disposeSystemOverrides;
          disposeSystemOverrides = null;
          appliedSystemTheme = null;
          dispose?.();
        };
        const updateSystemOverrides = (id) => {
          if (appliedSystemTheme === id) return;
          appliedSystemTheme = id;
          const disposePrevious = disposeSystemOverrides;
          disposeSystemOverrides = null;
          disposePrevious?.();
          const definition = THEMES.find((theme) => theme.id === id);
          const tokens = Object.fromEntries(Object.entries(makeTokens(definition)).map(([name, value]) => [
            name, { light: value, dark: value },
          ]));
          disposeSystemOverrides = ctx.theme.overrideTokens('@local/dsh-atelier/system', tokens);
        };
        const applyPreferences = () => {
          if (!preferences) {
            selected = null;
            clearSystemOverrides();
            delete document.body.dataset.atelierStyle;
            return;
          }
          if (preferences.mode === 'system') {
            if (ctx.theme.getTheme().preference !== 'system') {
              ctx.theme.setTheme('system');
              return;
            }
            const snapshot = ctx.theme.getTheme();
            systemDark = snapshot.active.colorScheme === 'dark';
            selected = preferences[systemDark ? 'dark' : 'light'];
            updateSystemOverrides(selected);
            document.body.dataset.atelierStyle = selected;
            return;
          }
          selected = preferences[preferences.mode];
          clearSystemOverrides();
          document.body.dataset.atelierStyle = selected;
          ctx.theme.setTheme(`atelier-${selected}`);
        };
        const commit = (next) => {
          preferences = next;
          writePreferences(next);
          applyPreferences();
          return next;
        };
        const select = (id) => {
          const definition = THEMES.find((theme) => theme.id === id);
          if (!definition) return preferences;
          const next = { ...(preferences || DEFAULT_PREFERENCES), [definition.scheme]: id };
          if (!preferences || next.mode !== 'system') next.mode = definition.scheme;
          return commit(next);
        };
        const changeMode = (mode) => commit({ ...(preferences || DEFAULT_PREFERENCES), mode });
        const reset = () => {
          preferences = null;
          writePreferences(null);
          applyPreferences();
          ctx.theme.setTheme(nativePreference);
        };
        ctx.effect(() => {
          const sync = (snapshot) => {
            if (snapshot.preference === 'system') systemDark = snapshot.active.colorScheme === 'dark';
            applyPreferences();
          };
          const off = ctx.on('theme/change', sync);
          sync(ctx.theme.getTheme());
          return () => {
            off();
            clearSystemOverrides();
            delete document.body.dataset.atelierStyle;
            delete document.body.dataset.atelierReducedTransparency; // Clean up versions before Celadon.
          };
        }, 'atelier selection and persistence');

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist', id: 'atelier', order: 30, label: () => t('nav'), locale: NS,
        }, AtelierIcon));
        ctx.slots.inject('main', () => ctx.slots.register({
          name: 'main', key: 'atelier', locale: NS,
          inject: () => ({
            t, getPreferences: () => preferences, getSystemDark: () => systemDark,
            subscribeSystem: (listener) => ctx.on('theme/change', listener),
            onSelect: select, onModeChange: changeMode, onReset: reset,
          }),
        }, (props) => h(Gallery, props)));
      },
    };
  },
});

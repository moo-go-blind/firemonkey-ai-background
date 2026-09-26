(() => {
  'use strict';

  const APP_ID = 'yk-ai-bg';
  const STYLE_ID = APP_ID + '-compat-current-2026-09-26';
  const A = 'yk-ai-current-assistant';
  const U = 'yk-ai-current-user';
  const SHELL = 'yk-ai-current-shell';
  const CLEAR_BLUR = 'yk-ai-current-clear-blur';
  const CLEAR_USER_SHELL = 'yk-ai-current-clear-user-shell';
  const MENU_PANEL = 'yk-ai-current-menu-panel';
  const CLEAR_TOP = 'yk-ai-current-clear-top';
  const SITE = location.hostname === 'chatgpt.com' ? 'chatgpt' :
    location.hostname === 'gemini.google.com' ? 'gemini' : '';

  if (!SITE || window.top !== window.self) return;

  let timer = 0;

  function addStyle() {
    if (document.getElementById(STYLE_ID) || !document.documentElement) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* 以前の互換クラスが残っていても、見た目への影響を止める */
      html.yk-ai-bg-on .yk-ai-assistant-bubble,
      html.yk-ai-bg-on .yk-ai-user-bubble,
      html.yk-ai-bg-on .yk-ai-bg-assistant-v3,
      html.yk-ai-bg-on .yk-ai-bg-user-v3 {
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* 現行UI用の本文吹き出し */
      html.yk-ai-bg-on .${A},
      html.yk-ai-bg-on .${U} {
        display: inline-block !important;
        width: auto !important;
        box-sizing: border-box !important;
        border: 1px solid rgba(255,255,255,var(--yk-ai-border-opacity,.18)) !important;
        box-shadow: 0 4px 18px rgba(0,0,0,.14) !important;
        backdrop-filter: blur(var(--yk-ai-glass-blur,9px)) !important;
        -webkit-backdrop-filter: blur(var(--yk-ai-glass-blur,9px)) !important;
        overflow-wrap: anywhere !important;
      }

      html.yk-ai-bg-on .${A} {
        max-width: calc(100vw - 52px) !important;
        margin-left: 10px !important;
        margin-right: auto !important;
        padding: 10px 12px !important;
        border-radius: 17px !important;
        background: rgba(28,28,30,var(--yk-ai-assistant,.72)) !important;
      }

      html.yk-ai-bg-on .${U} {
        max-width: calc(100vw - 84px) !important;
        margin-left: auto !important;
        margin-right: 10px !important;
        padding: 9px 12px !important;
        border-radius: 19px !important;
        background: rgba(48,49,55,var(--yk-ai-user,.78)) !important;
      }

      html.yk-ai-bg-on .${A} > *,
      html.yk-ai-bg-on .${U} > * {
        background-color: transparent !important;
      }

      /* Geminiの新UIで会話全体に付くblur面だけを解除 */
      html.yk-ai-bg-on.yk-ai-site-gemini .${CLEAR_BLUR},
      html.yk-ai-bg-on.yk-ai-site-gemini .${CLEAR_USER_SHELL} {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* DOM名が変わってもメニュー外殻は読める濃さを維持 */
      html.yk-ai-bg-on .${MENU_PANEL} {
        background: rgba(31,31,34,.97) !important;
        background-color: rgba(31,31,34,.97) !important;
        background-image: none !important;
        border: 1px solid rgba(255,255,255,.08) !important;
        border-radius: 16px !important;
        box-shadow: 0 12px 34px rgba(0,0,0,.42) !important;
        filter: none !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
      }

      /* ChatGPT上端の半透明ヘッダーは背景を見せつつ、ぼかしだけ解除 */
      html.yk-ai-bg-on.yk-ai-site-chatgpt .${CLEAR_TOP} {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        filter: none !important;
        background-image: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt .${CLEAR_TOP}::before,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .${CLEAR_TOP}::after {
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        filter: none !important;
        background-image: none !important;
      }

      /* ---------- ChatGPT 2026-09-26 ---------- */
      html.yk-ai-bg-on.yk-ai-site-chatgpt,
      html.yk-ai-bg-on.yk-ai-site-chatgpt body,
      html.yk-ai-bg-on.yk-ai-site-chatgpt main,
      html.yk-ai-bg-on.yk-ai-site-chatgpt main#main,
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread,
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .bg-surface-primary,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .bg-token-main-surface-primary {
        background-color: transparent !important;
        background-image: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container::before,
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container::after,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade::before,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade::after {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
        -webkit-mask-image: none !important;
        mask-image: none !important;
      }

      /* 入力欄本体だけは暗い面を維持 */
      html.yk-ai-bg-on.yk-ai-site-chatgpt [data-composer-surface="true"] {
        background: rgba(31,31,34,.94) !important;
        background-color: rgba(31,31,34,.94) !important;
        border: 1px solid rgba(255,255,255,.06) !important;
        border-radius: 28px !important;
        box-shadow: 0 5px 22px rgba(0,0,0,.22) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt .${SHELL} {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* ---------- Gemini ---------- */
      html.yk-ai-bg-on.yk-ai-site-gemini main,
      html.yk-ai-bg-on.yk-ai-site-gemini chat-window,
      html.yk-ai-bg-on.yk-ai-site-gemini .chat-window,
      html.yk-ai-bg-on.yk-ai-site-gemini conversation-container,
      html.yk-ai-bg-on.yk-ai-site-gemini .conversation-container,
      html.yk-ai-bg-on.yk-ai-site-gemini infinite-scroller,
      html.yk-ai-bg-on.yk-ai-site-gemini .chat-history,
      html.yk-ai-bg-on.yk-ai-site-gemini .scroll-container,
      html.yk-ai-bg-on.yk-ai-site-gemini .content-container,
      html.yk-ai-bg-on.yk-ai-site-gemini model-response,
      html.yk-ai-bg-on.yk-ai-site-gemini user-query,
      html.yk-ai-bg-on.yk-ai-site-gemini .response-container,
      html.yk-ai-bg-on.yk-ai-site-gemini .query-content {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-gemini main::before,
      html.yk-ai-bg-on.yk-ai-site-gemini main::after,
      html.yk-ai-bg-on.yk-ai-site-gemini chat-window::before,
      html.yk-ai-bg-on.yk-ai-site-gemini chat-window::after,
      html.yk-ai-bg-on.yk-ai-site-gemini conversation-container::before,
      html.yk-ai-bg-on.yk-ai-site-gemini conversation-container::after {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        filter: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-gemini .${SHELL} {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      /* ---------- メニュー類は透明化しない ---------- */
      html.yk-ai-bg-on [role="menu"],
      html.yk-ai-bg-on [data-radix-menu-content],
      html.yk-ai-bg-on .mat-mdc-menu-panel,
      html.yk-ai-bg-on .mat-mdc-menu-content,
      html.yk-ai-bg-on .cdk-overlay-pane [role="menu"] {
        background: rgba(31,31,34,.97) !important;
        background-color: rgba(31,31,34,.97) !important;
        background-image: none !important;
        border: 1px solid rgba(255,255,255,.08) !important;
        border-radius: 16px !important;
        box-shadow: 0 12px 34px rgba(0,0,0,.42) !important;
        filter: none !important;
        backdrop-filter: blur(10px) !important;
        -webkit-backdrop-filter: blur(10px) !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function visible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 10 && r.height > 8 &&
      s.display !== 'none' && s.visibility !== 'hidden';
  }

  function clearCurrentClasses() {
    document.querySelectorAll(
      '.' + A + ',.' + U + ',.' + SHELL + ',.' +
      CLEAR_BLUR + ',.' + CLEAR_USER_SHELL + ',.' + MENU_PANEL + ',.' + CLEAR_TOP
    ).forEach((el) => {
      el.classList.remove(A, U, SHELL, CLEAR_BLUR, CLEAR_USER_SHELL, MENU_PANEL, CLEAR_TOP);
    });
  }

  function smallestVisible(root, selectors) {
    if (!(root instanceof Element)) return null;
    const list = [];
    for (const selector of selectors) {
      root.querySelectorAll(selector).forEach((el) => {
        if (!visible(el)) return;
        const text = String(el.innerText || el.textContent || '').trim();
        if (!text) return;
        const r = el.getBoundingClientRect();
        if (r.height > Math.max(420, innerHeight * .48)) return;
        list.push(el);
      });
    }
    if (!list.length) return null;
    list.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      return ar.width * ar.height - br.width * br.height;
    });
    return list[0];
  }

  function clearChatGptTopBlur() {
    if (SITE !== 'chatgpt') return;

    const candidates = new Set();

    document.querySelectorAll(
      'header, [class*="header"], [class*="sticky"], [class*="top-"], [class*="backdrop"]'
    ).forEach((element) => candidates.add(element));

    [
      [innerWidth * .15, 12],
      [innerWidth * .50, 12],
      [innerWidth * .85, 12],
      [innerWidth * .50, 70]
    ].forEach(([x, y]) => {
      let current = document.elementFromPoint(x, Math.min(y, innerHeight - 1));
      for (let depth = 0;
        current && current !== document.body && current !== document.documentElement && depth < 6;
        depth += 1) {
        candidates.add(current);
        current = current.parentElement;
      }
    });

    candidates.forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      if (element.closest('[role="dialog"],[role="menu"],aside,nav')) return;

      const rect = element.getBoundingClientRect();
      const nearTop = rect.top <= 120 && rect.bottom >= 0;
      const broad = rect.width >= innerWidth * .55;
      const headerHeight = rect.height >= 34 && rect.height <= 150;

      if (!nearTop || !broad || !headerHeight) return;

      const style = getComputedStyle(element);
      const fx = [
        style.backdropFilter || '',
        style.webkitBackdropFilter || '',
        style.filter || ''
      ].join(' ').toLowerCase();

      if (fx.includes('blur(')) element.classList.add(CLEAR_TOP);
    });
  }

  function markChatGPT() {
    const assistants = document.querySelectorAll(
      'section[data-turn="assistant"], [data-message-author-role="assistant"]'
    );
    assistants.forEach((root) => {
      const target = smallestVisible(root, [
        '.markdown',
        '[class*="markdown"]',
        '.prose',
        '[data-message-content]'
      ]);
      if (target) target.classList.add(A);
    });

    const users = document.querySelectorAll(
      'section[data-turn="user"], [data-message-author-role="user"]'
    );
    users.forEach((root) => {
      let target = root.querySelector('.user-message-bubble-color');
      if (!visible(target)) {
        target = smallestVisible(root, [
          '[data-testid="collapsible-user-message-content"]',
          '.whitespace-pre-wrap',
          '[class*="user-message"]'
        ]);
      }
      if (target) target.classList.add(U);
    });

    const composer = document.querySelector(
      '#prompt-textarea[contenteditable="true"], div#prompt-textarea.ProseMirror'
    );
    if (composer) markOuterShell(composer, '[data-composer-surface="true"]');
  }

  function hasRealBlur(element) {
    if (!(element instanceof HTMLElement)) return false;
    const style = getComputedStyle(element);
    const value = [
      style.backdropFilter || '',
      style.webkitBackdropFilter || '',
      style.filter || ''
    ].join(' ').toLowerCase();

    if (!value.includes('blur(')) return false;
    return !/blur\(\s*0(?:px|rem|em)?\s*\)/.test(value);
  }

  function isOverlayLike(element) {
    if (!(element instanceof Element)) return true;
    return Boolean(
      element.closest(
        '[role="menu"],[role="dialog"],dialog,.cdk-overlay-container,' +
        '.cdk-overlay-pane,[data-radix-popper-content-wrapper],' +
        'rich-textarea,input-area,input-area-v2,header,nav,aside'
      )
    );
  }

  function clearGeminiConversationBlur() {
    if (SITE !== 'gemini') return;

    const candidates = new Set();

    document.querySelectorAll(
      'model-response,user-query,main,chat-window,conversation-container,infinite-scroller'
    ).forEach((anchor) => {
      let current = anchor;
      for (let depth = 0;
        current && current !== document.body && current !== document.documentElement && depth < 9;
        depth += 1) {
        candidates.add(current);
        current = current.parentElement;
      }
    });

    [
      [innerWidth * .5, innerHeight * .38],
      [innerWidth * .25, innerHeight * .52],
      [innerWidth * .75, innerHeight * .52]
    ].forEach(([x, y]) => {
      let current = document.elementFromPoint(x, y);
      for (let depth = 0;
        current && current !== document.body && current !== document.documentElement && depth < 8;
        depth += 1) {
        candidates.add(current);
        current = current.parentElement;
      }
    });

    candidates.forEach((element) => {
      if (!(element instanceof HTMLElement) || isOverlayLike(element)) return;
      if (!hasRealBlur(element)) return;

      const rect = element.getBoundingClientRect();
      const broad = rect.width >= innerWidth * .68;
      const tall = rect.height >= innerHeight * .25;
      const central = rect.top < innerHeight * .82 && rect.bottom > innerHeight * .20;

      if (broad && tall && central) element.classList.add(CLEAR_BLUR);
    });
  }

  function isDarkBackground(element) {
    if (!(element instanceof HTMLElement)) return false;
    const color = String(getComputedStyle(element).backgroundColor || '');
    const values = color.match(/[\d.]+/g);
    if (!values || values.length < 3) return false;

    const r = Number(values[0]);
    const g = Number(values[1]);
    const b = Number(values[2]);
    const a = values.length >= 4 ? Number(values[3]) : 1;

    return a > .28 && r < 72 && g < 72 && b < 78;
  }

  function clearGeminiUserOuterShell(root, leaf) {
    if (!(root instanceof Element)) return;

    const candidates = new Set([root]);
    let current = leaf instanceof Element ? leaf.parentElement : root.firstElementChild;

    for (let depth = 0; current && depth < 6; depth += 1) {
      candidates.add(current);
      if (current === root) break;
      current = current.parentElement;
    }

    root.querySelectorAll(':scope > *, :scope > * > *').forEach((element) => {
      candidates.add(element);
    });

    candidates.forEach((element) => {
      if (!(element instanceof HTMLElement) || element === leaf) return;
      if (element.closest('[role="menu"],[role="dialog"],.cdk-overlay-pane')) return;

      const rect = element.getBoundingClientRect();
      if (rect.width < 42 || rect.height < 34) return;
      if (rect.width > innerWidth * .72 || rect.height > 240) return;

      const style = getComputedStyle(element);
      const radius = parseFloat(style.borderTopLeftRadius) || 0;

      if ((radius >= 14 && isDarkBackground(element)) || hasRealBlur(element)) {
        element.classList.add(CLEAR_USER_SHELL);
      }
    });
  }

  function markOpenMenus() {
    const menus = document.querySelectorAll(
      '[role="menu"],[data-radix-menu-content],.mat-mdc-menu-panel,.mat-mdc-menu-content'
    );

    menus.forEach((menu) => {
      if (!(menu instanceof HTMLElement) || !visible(menu)) return;

      menu.classList.add(MENU_PANEL);

      let current = menu.parentElement;
      for (let depth = 0; current && depth < 3; depth += 1) {
        const style = getComputedStyle(current);
        const rect = current.getBoundingClientRect();
        const positioned = style.position === 'fixed' || style.position === 'absolute';
        if (positioned && rect.width >= menu.getBoundingClientRect().width * .9) {
          current.classList.add(MENU_PANEL);
          break;
        }
        current = current.parentElement;
      }
    });
  }

  function markGemini() {
    document.querySelectorAll('model-response').forEach((root) => {
      const target = smallestVisible(root, [
        '.model-response-text',
        '.markdown',
        '[class*="response-content"]',
        'message-content'
      ]);
      if (target) target.classList.add(A);
    });

    document.querySelectorAll('user-query').forEach((root) => {
      const target = smallestVisible(root, [
        '.query-text',
        '.query-content',
        '[class*="query-content"]'
      ]);
      if (target) {
        target.classList.add(U);
        clearGeminiUserOuterShell(root, target);
      }
    });

    clearGeminiConversationBlur();

    const composer = document.querySelector(
      'rich-textarea [contenteditable="true"], div.ql-editor, [aria-label="Enter a prompt here"], [contenteditable="true"][role="textbox"]'
    );
    if (composer) markOuterShell(composer, 'rich-textarea, input-area, input-area-v2');
  }

  function markOuterShell(input, protectedSelector) {
    let current = input.parentElement;
    for (let depth = 0; current && current !== document.body &&
      current !== document.documentElement && depth < 9; depth += 1) {

      if (current.matches(protectedSelector) ||
          current.closest(protectedSelector) === current) {
        current = current.parentElement;
        continue;
      }

      const r = current.getBoundingClientRect();
      const broad = r.width >= innerWidth * .80;
      const nearBottom = r.bottom >= innerHeight - Math.max(190, innerHeight * .20);
      const sized = r.height >= 70 && r.height <= Math.min(560, innerHeight * .55);

      if (broad && nearBottom && sized) current.classList.add(SHELL);
      current = current.parentElement;
    }
  }

  function scan() {
    timer = 0;
    if (!document.body) return;
    addStyle();
    clearCurrentClasses();

    if (SITE === 'chatgpt') {
      markChatGPT();
      clearChatGptTopBlur();
    } else {
      markGemini();
    }

    markOpenMenus();
  }

  function schedule(delay = 60) {
    clearTimeout(timer);
    timer = window.setTimeout(() => requestAnimationFrame(scan), delay);
  }

  function start() {
    scan();

    const observer = new MutationObserver(() => schedule());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('pageshow', () => schedule(0), true);
    window.addEventListener('resize', () => schedule(80), { passive: true });
    window.addEventListener('popstate', () => schedule(50), { passive: true });
    window.addEventListener('hashchange', () => schedule(50), { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) schedule(0);
    }, true);

    window.setTimeout(() => schedule(0), 500);
    window.setTimeout(() => schedule(0), 1600);
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
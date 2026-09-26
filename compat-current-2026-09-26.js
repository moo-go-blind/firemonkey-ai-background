(() => {
  'use strict';

  const APP_ID = 'yk-ai-bg';
  const STYLE_ID = APP_ID + '-compat-current-2026-09-26';
  const A = 'yk-ai-current-assistant';
  const U = 'yk-ai-current-user';
  const SHELL = 'yk-ai-current-shell';
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
    document.querySelectorAll('.' + A + ',.' + U + ',.' + SHELL).forEach((el) => {
      el.classList.remove(A, U, SHELL);
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
      if (target) target.classList.add(U);
    });

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

    if (SITE === 'chatgpt') markChatGPT();
    else markGemini();
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
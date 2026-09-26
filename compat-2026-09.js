(() => {
  'use strict';

  const APP_ID = 'yk-ai-bg';
  const ROOT_ID = `${APP_ID}-root`;
  const PANEL_ID = `${APP_ID}-panel`;
  const STYLE_ID = `${APP_ID}-compat-2026-09-style`;
  const SURFACE_CLASS = 'yk-ai-bg-surface-clear-v3';
  const ASSISTANT_CLASS = 'yk-ai-bg-assistant-v3';
  const USER_CLASS = 'yk-ai-bg-user-v3';
  const COMPOSER_SHELL_CLASS = 'yk-ai-bg-composer-shell-v3';
  const SITE = location.hostname === 'chatgpt.com' ? 'chatgpt' :
    location.hostname === 'gemini.google.com' ? 'gemini' : '';

  if (!SITE || window.top !== window.self) return;

  let scanTimer = 0;
  let scanning = false;

  const CHATGPT = Object.freeze({
    assistant: '[data-message-author-role="assistant"]',
    user: '[data-message-author-role="user"]',
    composer: '#prompt-textarea, textarea[name="prompt-textarea"], form[data-type="unified-composer"] [contenteditable="true"], [contenteditable="true"][role="textbox"]',
    semanticSurfaces: 'main, main#main, [role="main"], #thread'
  });

  const GEMINI = Object.freeze({
    assistant: 'model-response, message-content, .model-response-text, .response-content',
    user: 'user-query, .query-text, .user-query, [data-message-author="user"]',
    composer: 'rich-textarea [contenteditable="true"], div.ql-editor, [aria-label="Enter a prompt here"], [contenteditable="true"][role="textbox"]',
    semanticSurfaces: 'main, chat-window, .chat-window, conversation-container, .conversation-container, infinite-scroller, .chat-history, .scroll-container, .content-container'
  });

  function addStyle() {
    if (document.getElementById(STYLE_ID) || !document.documentElement) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html.yk-ai-bg-on .${SURFACE_CLASS},
      html.yk-ai-bg-on .${COMPOSER_SHELL_CLASS} {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt main,
      html.yk-ai-bg-on.yk-ai-site-chatgpt main#main,
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread,
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade {
        background-color: transparent !important;
        background-image: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade::after {
        background: transparent !important;
        background-color: transparent !important;
      }

      html.yk-ai-bg-on .yk-ai-assistant-bubble:not(.${ASSISTANT_CLASS}),
      html.yk-ai-bg-on .yk-ai-user-bubble:not(.${USER_CLASS}) {
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        border-radius: 0 !important;
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      html.yk-ai-bg-on .${ASSISTANT_CLASS},
      html.yk-ai-bg-on .${USER_CLASS} {
        box-sizing: border-box !important;
        border: 1px solid rgba(255,255,255,var(--yk-ai-border-opacity,.18)) !important;
        box-shadow: 0 4px 18px rgba(0,0,0,.14) !important;
        backdrop-filter: blur(var(--yk-ai-glass-blur,9px)) !important;
        -webkit-backdrop-filter: blur(var(--yk-ai-glass-blur,9px)) !important;
        overflow-wrap: anywhere;
      }

      html.yk-ai-bg-on .${ASSISTANT_CLASS} {
        max-width: min(100%, calc(100vw - 52px)) !important;
        margin-left: 10px !important;
        margin-right: auto !important;
        padding: 10px 12px !important;
        border-radius: 17px !important;
        background: rgba(28,28,30,var(--yk-ai-assistant,.72)) !important;
      }

      html.yk-ai-bg-on .${USER_CLASS} {
        max-width: min(100%, calc(100vw - 84px)) !important;
        margin-left: auto !important;
        margin-right: 10px !important;
        padding: 9px 12px !important;
        border-radius: 19px !important;
        background: rgba(48,49,55,var(--yk-ai-user,.78)) !important;
      }

      html.yk-ai-bg-on .${ASSISTANT_CLASS} > *,
      html.yk-ai-bg-on .${USER_CLASS} > * {
        background-color: transparent !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt form[data-type="unified-composer"],
      html.yk-ai-bg-on.yk-ai-site-chatgpt #prompt-textarea,
      html.yk-ai-bg-on.yk-ai-site-gemini rich-textarea,
      html.yk-ai-bg-on.yk-ai-site-gemini input-area,
      html.yk-ai-bg-on.yk-ai-site-gemini input-area-v2 {
        isolation: isolate;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function isOurUi(element) {
    if (!(element instanceof Element)) return false;
    if (element.id && element.id.startsWith(APP_ID)) return true;
    return Boolean(element.closest(`#${ROOT_ID}, #${PANEL_ID}, #${APP_ID}-edit-layer, #${APP_ID}-edit-done`));
  }

  function isExcludedSurface(element) {
    if (!(element instanceof HTMLElement) || isOurUi(element)) return true;
    if (element.matches('header, nav, aside, button, input, textarea, dialog, [role="dialog"]')) return true;
    if (element.closest('header, nav, aside, dialog, [role="dialog"]')) return true;
    if (element.matches(`.${ASSISTANT_CLASS}, .${USER_CLASS}`)) return true;
    return false;
  }

  function markBroadAncestorSurfaces(anchor, maxDepth = 9) {
    if (!(anchor instanceof Element)) return;
    let current = anchor.parentElement;
    for (let depth = 0; current && current !== document.body && current !== document.documentElement && depth < maxDepth; depth += 1) {
      if (!isExcludedSurface(current)) {
        const rect = current.getBoundingClientRect();
        const broad = rect.width >= innerWidth * 0.72;
        const tall = rect.height >= Math.min(260, innerHeight * 0.24);
        const occupiesViewport = rect.top < innerHeight * 0.82 && rect.bottom > innerHeight * 0.18;
        if (broad && tall && occupiesViewport) current.classList.add(SURFACE_CLASS);
      }
      current = current.parentElement;
    }
  }

  function firstUseful(root, selectors) {
    if (!(root instanceof Element)) return null;
    for (const selector of selectors) {
      const element = root.querySelector(selector);
      if (element) return element;
    }
    return null;
  }

  function closestBubble(element) {
    if (!(element instanceof Element)) return null;
    return element.closest('.user-message-bubble-color, [class*="user-message-bubble"], [class*="message-surface"]');
  }

  function markChatGptMessages() {
    document.querySelectorAll(CHATGPT.assistant).forEach((root) => {
      const content = firstUseful(root, ['.markdown','[class*="markdown"]','.prose','[data-message-content]']);
      const target = content || root.querySelector(':scope > div > div') || root.firstElementChild || root;
      if (target instanceof HTMLElement) target.classList.add(ASSISTANT_CLASS);
      markBroadAncestorSurfaces(root);
    });

    document.querySelectorAll(CHATGPT.user).forEach((root) => {
      const content = firstUseful(root, [
        '[data-testid="collapsible-user-message-root"]',
        '[data-testid="collapsible-user-message-content"]',
        '.user-message-bubble-color',
        '.whitespace-pre-wrap',
        '[class*="user-message"]'
      ]);
      const bubble = closestBubble(content) || root.querySelector('.user-message-bubble-color');
      const target = bubble || content || root.firstElementChild || root;
      if (target instanceof HTMLElement) target.classList.add(USER_CLASS);
      markBroadAncestorSurfaces(root);
    });

    document.querySelectorAll(CHATGPT.semanticSurfaces).forEach((element) => {
      if (element instanceof HTMLElement && !isExcludedSurface(element)) element.classList.add(SURFACE_CLASS);
    });

    const composer = document.querySelector(CHATGPT.composer);
    if (composer) markComposerShell(composer);
  }

  function uniqueRoots(selector) {
    const roots = [];
    const seen = new Set();
    document.querySelectorAll(selector).forEach((element) => {
      let root = element;
      if (element.matches('.model-response-text, .response-content, message-content')) {
        root = element.closest('model-response') || element;
      } else if (element.matches('.query-text, .user-query, [data-message-author="user"]')) {
        root = element.closest('user-query') || element;
      }
      if (!seen.has(root)) { seen.add(root); roots.push(root); }
    });
    return roots;
  }

  function markGeminiMessages() {
    uniqueRoots(GEMINI.assistant).forEach((root) => {
      const target = firstUseful(root, ['.markdown','.model-response-text','.response-content','message-content','.response-container']) || root;
      if (target instanceof HTMLElement) target.classList.add(ASSISTANT_CLASS);
      markBroadAncestorSurfaces(root);
    });

    uniqueRoots(GEMINI.user).forEach((root) => {
      const target = firstUseful(root, ['.query-content','.query-text','[class*="query-content"]']) || root;
      if (target instanceof HTMLElement) target.classList.add(USER_CLASS);
      markBroadAncestorSurfaces(root);
    });

    document.querySelectorAll(GEMINI.semanticSurfaces).forEach((element) => {
      if (element instanceof HTMLElement && !isExcludedSurface(element)) element.classList.add(SURFACE_CLASS);
    });

    const composer = document.querySelector(GEMINI.composer);
    if (composer) markComposerShell(composer);
  }

  function markComposerShell(composer) {
    if (!(composer instanceof Element)) return;
    let current = composer.closest('form') || composer.parentElement;
    for (let depth = 0; current && current !== document.body && current !== document.documentElement && depth < 7; depth += 1) {
      if (isOurUi(current)) break;
      const rect = current.getBoundingClientRect();
      const broad = rect.width >= innerWidth * 0.78;
      const nearBottom = rect.bottom >= innerHeight - Math.max(160, innerHeight * 0.18);
      const shellSized = rect.height >= 70 && rect.height <= Math.min(520, innerHeight * 0.52);
      const isActualComposer = current.matches('form[data-type="unified-composer"], rich-textarea, input-area, input-area-v2');
      if (!isActualComposer && broad && nearBottom && shellSized) current.classList.add(COMPOSER_SHELL_CLASS);
      current = current.parentElement;
    }
  }

  function markCenterSurface() {
    if (!document.documentElement.classList.contains('yk-ai-bg-on')) return;
    const points = [[innerWidth*.50,innerHeight*.42],[innerWidth*.25,innerHeight*.45],[innerWidth*.75,innerHeight*.45]];
    for (const [x,y] of points) {
      let current = document.elementFromPoint(x,y);
      for (let depth=0; current && current!==document.body && current!==document.documentElement && depth<8; depth+=1) {
        if (!isExcludedSurface(current)) {
          const rect = current.getBoundingClientRect();
          if (rect.width >= innerWidth*.82 && rect.height >= innerHeight*.35) current.classList.add(SURFACE_CLASS);
        }
        current = current.parentElement;
      }
    }
  }

  function cleanupDisconnectedClasses() {
    document.querySelectorAll(`.${ASSISTANT_CLASS}, .${USER_CLASS}, .${SURFACE_CLASS}, .${COMPOSER_SHELL_CLASS}`).forEach((element) => {
      if (!(element instanceof HTMLElement)) return;
      const rect = element.getBoundingClientRect();
      if (!element.isConnected || rect.width === 0 || rect.height === 0) {
        element.classList.remove(ASSISTANT_CLASS,USER_CLASS,SURFACE_CLASS,COMPOSER_SHELL_CLASS);
      }
    });
  }

  function scan() {
    scanTimer = 0;
    if (scanning || !document.body || !document.documentElement) return;
    scanning = true;
    try {
      addStyle();
      cleanupDisconnectedClasses();
      if (SITE === 'chatgpt') markChatGptMessages();
      else markGeminiMessages();
      markCenterSurface();
    } catch (error) {
      console.warn('[AI Background compat 2026-09] scan failed', error);
    } finally { scanning = false; }
  }

  function scheduleScan(delay = 70) {
    clearTimeout(scanTimer);
    scanTimer = window.setTimeout(() => requestAnimationFrame(scan), delay);
  }

  function start() {
    addStyle();
    scan();
    const observer = new MutationObserver(() => scheduleScan());
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('pageshow', () => scheduleScan(0), true);
    window.addEventListener('resize', () => scheduleScan(80), { passive: true });
    window.addEventListener('popstate', () => scheduleScan(50), { passive: true });
    window.addEventListener('hashchange', () => scheduleScan(50), { passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleScan(0); }, true);
    window.setTimeout(() => scheduleScan(0), 500);
    window.setTimeout(() => scheduleScan(0), 1600);
  }

  if (document.body) start();
  else {
    const ready = () => {
      if (!document.body) return;
      document.removeEventListener('DOMContentLoaded', ready);
      document.removeEventListener('readystatechange', ready);
      start();
    };
    document.addEventListener('DOMContentLoaded', ready);
    document.addEventListener('readystatechange', ready);
  }
})();

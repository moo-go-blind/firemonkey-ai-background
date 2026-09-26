(() => {
  'use strict';

  const APP_ID = 'yk-ai-bg';
  const STYLE_ID = APP_ID + '-hotfix-2026-09-26-style';
  const A = 'yk-ai-assistant-leaf-v4';
  const U = 'yk-ai-user-leaf-v4';
  const SHELL = 'yk-ai-composer-shell-v4';
  const SITE = location.hostname === 'chatgpt.com' ? 'chatgpt' :
    location.hostname === 'gemini.google.com' ? 'gemini' : '';

  if (!SITE || window.top !== window.self) return;

  let timer = 0;

  function addStyle() {
    if (document.getElementById(STYLE_ID) || !document.documentElement) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* 旧判定が大きなコンテナを吹き出し化しても、いったん完全に解除する */
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
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }

      html.yk-ai-bg-on .${A},
      html.yk-ai-bg-on .${U} {
        box-sizing: border-box !important;
        width: fit-content !important;
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

      /* 2026-09-26 ChatGPT: 新UIの黒背景・下部フェード */
      html.yk-ai-bg-on.yk-ai-site-chatgpt [class~="bg-surface-primary"],
      html.yk-ai-bg-on.yk-ai-site-chatgpt [class~="bg-token-main-surface-primary"],
      html.yk-ai-bg-on.yk-ai-site-chatgpt [class~="dark:bg-token-bg-secondary-surface"],
      html.yk-ai-bg-on.yk-ai-site-chatgpt [class~="bg-(--sidebar-surface-primary)"],
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .${SHELL},
      html.yk-ai-bg-on.yk-ai-site-gemini .${SHELL} {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
      }

      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container::before,
      html.yk-ai-bg-on.yk-ai-site-chatgpt #thread-bottom-container::after,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade::before,
      html.yk-ai-bg-on.yk-ai-site-chatgpt .content-fade::after {
        background: transparent !important;
        background-color: transparent !important;
        background-image: none !important;
        box-shadow: none !important;
      }

      /* Geminiの会話面。入力ボックス自体は残す */
      html.yk-ai-bg-on.yk-ai-site-gemini main,
      html.yk-ai-bg-on.yk-ai-site-gemini chat-window,
      html.yk-ai-bg-on.yk-ai-site-gemini .chat-window,
      html.yk-ai-bg-on.yk-ai-site-gemini conversation-container,
      html.yk-ai-bg-on.yk-ai-site-gemini .conversation-container,
      html.yk-ai-bg-on.yk-ai-site-gemini infinite-scroller,
      html.yk-ai-bg-on.yk-ai-site-gemini .chat-history,
      html.yk-ai-bg-on.yk-ai-site-gemini .scroll-container,
      html.yk-ai-bg-on.yk-ai-site-gemini .content-container {
        background-color: transparent !important;
        background-image: none !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function visible(el) {
    if (!(el instanceof HTMLElement)) return false;
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 16 && r.height > 8 && s.display !== 'none' && s.visibility !== 'hidden';
  }

  function reasonableBubble(el) {
    if (!visible(el)) return false;
    const r = el.getBoundingClientRect();
    return r.width <= innerWidth * .96 &&
      r.height <= Math.max(420, innerHeight * .52) &&
      String(el.innerText || el.textContent || '').trim().length > 0;
  }

  function pick(root, selectors) {
    if (!(root instanceof Element)) return null;
    const found = [];
    for (const selector of selectors) {
      root.querySelectorAll(selector).forEach((el) => {
        if (reasonableBubble(el)) found.push(el);
      });
    }
    if (!found.length) return reasonableBubble(root) ? root : null;
    found.sort((a,b) => {
      const ar=a.getBoundingClientRect(), br=b.getBoundingClientRect();
      return ar.width*ar.height - br.width*br.height;
    });
    return found[0];
  }

  function clearLargeLegacyBubbles() {
    document.querySelectorAll(
      '.yk-ai-assistant-bubble,.yk-ai-user-bubble,.yk-ai-bg-assistant-v3,.yk-ai-bg-user-v3'
    ).forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const r=el.getBoundingClientRect();
      if (r.height > Math.max(430, innerHeight*.55) || r.width > innerWidth*.98) {
        el.classList.remove(
          'yk-ai-assistant-bubble','yk-ai-user-bubble',
          'yk-ai-bg-assistant-v3','yk-ai-bg-user-v3'
        );
      }
    });
  }

  function markChatGPT() {
    document.querySelectorAll('[data-message-author-role="assistant"]').forEach((root) => {
      const target = pick(root, [
        '.markdown',
        '[class*="markdown"]',
        '.prose',
        '[data-message-content]'
      ]);
      if (target) target.classList.add(A);
    });

    document.querySelectorAll('[data-message-author-role="user"]').forEach((root) => {
      let target = root.querySelector('.user-message-bubble-color');
      if (!target) target = pick(root, [
        '[data-testid="collapsible-user-message-content"]',
        '.whitespace-pre-wrap',
        '[class*="user-message"]'
      ]);
      if (target) target.classList.add(U);
    });

    clearComposerShell([
      '#prompt-textarea',
      'div#prompt-textarea.ProseMirror',
      'form[data-type="unified-composer"] [contenteditable="true"]',
      '[contenteditable="true"][role="textbox"]'
    ]);
  }

  function markGemini() {
    document.querySelectorAll('model-response').forEach((root) => {
      const target = pick(root, [
        '.model-response-text',
        '.markdown',
        '[class*="response-content"]',
        'message-content'
      ]);
      if (target) target.classList.add(A);
    });

    document.querySelectorAll('user-query').forEach((root) => {
      const target = pick(root, [
        '.query-text',
        '.query-content',
        '[class*="query-content"]'
      ]);
      if (target) target.classList.add(U);
    });

    clearComposerShell([
      'rich-textarea [contenteditable="true"]',
      'div.ql-editor',
      '[aria-label="Enter a prompt here"]',
      '[contenteditable="true"][role="textbox"]'
    ]);
  }

  function clearComposerShell(selectors) {
    let input = null;
    for (const selector of selectors) {
      input = document.querySelector(selector);
      if (input && visible(input)) break;
      input = null;
    }
    if (!input) return;

    let current = input.parentElement;
    for (let depth=0; current && current!==document.body && current!==document.documentElement && depth<9; depth+=1) {
      const r=current.getBoundingClientRect();
      const broad=r.width >= innerWidth*.78;
      const nearBottom=r.bottom >= innerHeight - Math.max(180,innerHeight*.20);
      const sizeOk=r.height >= 70 && r.height <= Math.min(560,innerHeight*.55);
      const actualInput =
        current.matches('form[data-type="unified-composer"],rich-textarea,input-area,input-area-v2') ||
        current.id === 'prompt-textarea';
      if (!actualInput && broad && nearBottom && sizeOk) current.classList.add(SHELL);
      current=current.parentElement;
    }
  }

  function scan() {
    timer=0;
    if (!document.body) return;
    addStyle();
    document.querySelectorAll('.'+A+',.'+U).forEach((el)=>el.classList.remove(A,U));
    clearLargeLegacyBubbles();
    if (SITE==='chatgpt') markChatGPT();
    else markGemini();
  }

  function schedule(delay=60) {
    clearTimeout(timer);
    timer=window.setTimeout(()=>requestAnimationFrame(scan),delay);
  }

  function start() {
    scan();
    const observer=new MutationObserver(()=>schedule());
    observer.observe(document.body,{childList:true,subtree:true});
    window.addEventListener('pageshow',()=>schedule(0),true);
    window.addEventListener('resize',()=>schedule(80),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(0);},true);
    window.setTimeout(()=>schedule(0),500);
    window.setTimeout(()=>schedule(0),1600);
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded',start,{once:true});
})();
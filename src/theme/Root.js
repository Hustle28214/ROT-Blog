import React, { useEffect } from 'react';
import { useLocation } from '@docusaurus/router';

/**
 * 全局外观增强（只做「外观」，不改主题逻辑）：
 * 1. html[data-scrolled] —— 滚动后导航背景加深
 * 2. --read-progress   —— 顶部 2px 阅读进度
 * 3. html[data-active-section] —— 区块高亮（页面内存在 [data-nav-section] 时生效）
 * 4. “/” 聚焦搜索框
 * 5. 代码块语言标签（.cbLang）
 * 全部监听 passive + rAF 节流，尊重 prefers-reduced-motion。
 */

/** 给代码块补语言标签 */
function labelCodeBlocks() {
  document.querySelectorAll('.theme-code-block').forEach((block) => {
    if (block.dataset.cbLabeled === '1') return;
    const code = block.querySelector('code');
    if (!code) return;
    const cls = Array.from(code.classList).find((c) => c.startsWith('language-'));
    const lang = cls ? cls.slice('language-'.length) : '';
    if (!lang) return;
    block.dataset.cbLabeled = '1';
    const badge = document.createElement('span');
    badge.className = 'cbLang';
    badge.textContent = lang.toUpperCase();
    block.appendChild(badge);
  });
}

export default function Root({ children }) {
  const location = useLocation();

  /* 滚动状态 / 阅读进度 / 区块高亮 */
  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      root.dataset.scrolled = y > 8 ? 'true' : 'false';

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      root.style.setProperty('--read-progress', progress.toFixed(4));

      const sections = document.querySelectorAll('[data-nav-section]');
      if (sections.length === 0) {
        delete root.dataset.activeSection;
        return;
      }
      let current = '';
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 160) current = section.id;
      });
      if (current) root.dataset.activeSection = current;
      else delete root.dataset.activeSection;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  /* “/” 聚焦搜索框 */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      const input = document.querySelector('.navbar__search input');
      if (!input) return;
      event.preventDefault();
      input.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  /* 代码块语言标签（路由变化后重新注入） */
  useEffect(() => {
    const timer = window.setTimeout(labelCodeBlocks, 80);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <div className="readProgress" aria-hidden="true" />
      {children}
    </>
  );
}

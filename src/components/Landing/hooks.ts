import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export interface SiteStats {
  fileCount?: number;
  totalWordCount?: number;
  totalReadingTime?: number;
  countedFiles?: number;
  byInstance?: Record<string, { files: number; words: number }>;
  generatedAt?: string;
}

/** 读取构建期生成的全站统计（static/api/docs/stats.json） */
export function useSiteStats(): SiteStats | null {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/docs/stats.json')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        /* 统计失败时静默降级为占位符 */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
}

/** 滚动进入视口时一次性 reveal；尊重系统减弱动效设置 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(): RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

export function formatWords(count?: number): string {
  if (typeof count !== 'number') return '—';
  return `${(count / 10000).toFixed(1)} 万`;
}

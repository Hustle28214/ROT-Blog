import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import Link from '@docusaurus/Link';
import graph from '../../../data/home-stack-graph.json';
import { toolTags } from '../../../data/homeData';
import { useReveal } from '../hooks';

interface RawNode {
  id: string;
  type: 'category' | 'sub';
  name: string;
  en: string;
  color: string;
  count: number;
  docPath: string;
}

interface RawLink {
  source: string;
  target: string;
  kind: 'tree' | 'cross';
}

interface SimNode extends RawNode {
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
}

interface SimLink {
  s: SimNode;
  t: SimNode;
  kind: string;
}

const raw = graph as unknown as {
  total: number;
  nodes: RawNode[];
  links: RawLink[];
};

const legend = raw.nodes
  .filter((n) => n.type === 'category')
  .sort((a, b) => b.count - a.count);

function radiusOf(count: number, type: RawNode['type']) {
  return type === 'category'
    ? 8 + Math.sqrt(count) * 0.65
    : 3.5 + Math.sqrt(count) * 1.2;
}

function rgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * 技术栈图谱：自实现力导向布局（Canvas，30fps 限帧，可暂停）。
 * 数据与 🔎技能 页同源；悬停高亮邻域，点击跳转到对应文档。
 */
export default function StackGraph({ showcase }: { showcase: boolean }) {
  const sectionRef = useReveal<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showcaseRef = useRef(showcase);
  useEffect(() => {
    showcaseRef.current = showcase;
  }, [showcase]);
  const pausedRef = useRef(false);
  const hoverRef = useRef<SimNode | null>(null);
  const dragRef = useRef<{ node: SimNode; moved: boolean } | null>(null);
  const simRef = useRef<{ nodes: SimNode[]; links: SimLink[] } | null>(null);
  const drawRef = useRef<(() => void) | null>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [hoveredEn, setHoveredEn] = useState<string | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const build = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const byId = new Map<string, SimNode>();
      const nodes: SimNode[] = raw.nodes.map((n) => {
        const node: SimNode = {
          ...n,
          r: radiusOf(n.count, n.type),
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          ax: 0,
          ay: 0,
        };
        byId.set(n.id, node);
        return node;
      });

      const hubs = nodes.filter((n) => n.type === 'category');
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) * 0.3;

      [...hubs]
        .sort((a, b) => b.count - a.count)
        .forEach((n, i) => {
          const a = (i / hubs.length) * Math.PI * 2 - Math.PI / 2;
          n.ax = cx + Math.cos(a) * R * 1.25;
          n.ay = cy + Math.sin(a) * R;
          n.x = n.ax + (Math.random() - 0.5) * 20;
          n.y = n.ay + (Math.random() - 0.5) * 20;
        });

      for (const s of nodes.filter((n) => n.type === 'sub')) {
        const hub = byId.get(`cat:${s.en}`);
        const a = Math.random() * Math.PI * 2;
        const rr = 25 + Math.random() * 35;
        s.ax = (hub?.ax ?? cx) + Math.cos(a) * rr;
        s.ay = (hub?.ay ?? cy) + Math.sin(a) * rr;
        s.x = s.ax;
        s.y = s.ay;
      }

      simRef.current = {
        nodes,
        links: raw.links
          .map((l) => ({ s: byId.get(l.source)!, t: byId.get(l.target)!, kind: l.kind }))
          .filter((l) => l.s && l.t),
      };
    };

    const tick = (alpha: number) => {
      const sim = simRef.current;
      if (!sim) return;
      const { nodes, links } = sim;

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) {
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
          }
          const d = Math.sqrt(Math.max(d2, 1));
          let f = 1800 / d2;
          if (f > 8) f = 8;
          const ux = dx / d;
          const uy = dy / d;
          a.vx -= ux * f * alpha;
          a.vy -= uy * f * alpha;
          b.vx += ux * f * alpha;
          b.vy += uy * f * alpha;

          const min = a.r + b.r + 3;
          if (d < min) {
            const push = (min - d) * 0.5;
            a.x -= ux * push;
            a.y -= uy * push;
            b.x += ux * push;
            b.y += uy * push;
          }
        }
      }

      for (const l of links) {
        const dx = l.t.x - l.s.x;
        const dy = l.t.y - l.s.y;
        const d = Math.max(1, Math.hypot(dx, dy));
        const L = l.kind === 'cross' ? 210 : 58 + l.t.r;
        const k = l.kind === 'cross' ? 0.004 : 0.03;
        const f = (d - L) * k * alpha;
        const ux = dx / d;
        const uy = dy / d;
        l.s.vx += ux * f;
        l.s.vy += uy * f;
        l.t.vx -= ux * f;
        l.t.vy -= uy * f;
      }

      for (const n of nodes) {
        n.vx += (n.ax - n.x) * 0.02 * alpha;
        n.vy += (n.ay - n.y) * 0.02 * alpha;
        n.vx += (w / 2 - n.x) * 0.0022;
        n.vy += (h / 2 - n.y) * 0.0022;
        n.vx *= 0.86;
        n.vy *= 0.86;

        const sp = Math.hypot(n.vx, n.vy);
        if (sp > 12) {
          n.vx = (n.vx / sp) * 12;
          n.vy = (n.vy / sp) * 12;
      }
        n.x += n.vx;
        n.y += n.vy;

        const m = n.r + 6;
        n.x = Math.max(m, Math.min(w - m, n.x));
        n.y = Math.max(m, Math.min(h - m, n.y));
      }
    };

    const draw = () => {
      const sim = simRef.current;
      if (!sim) return;
      const { nodes, links } = sim;
      const hover = hoverRef.current;
      ctx.clearRect(0, 0, w, h);

      // 展示模式：领域节点周围加柔和光晕；日常模式保持干净
      if (showcaseRef.current) {
        for (const n of nodes) {
          if (n.type !== 'category') continue;
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4.5);
          glow.addColorStop(0, rgba(n.color, 0.16));
          glow.addColorStop(1, rgba(n.color, 0));
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const near = new Set<string>();
      if (hover) {
        near.add(hover.id);
        for (const l of links) {
          if (l.s.id === hover.id) near.add(l.t.id);
          if (l.t.id === hover.id) near.add(l.s.id);
        }
      }

      for (const l of links) {
        if (l.kind !== 'cross') continue;
        const active = hover != null && (l.s.id === hover.id || l.t.id === hover.id);
        ctx.save();
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = active ? 'rgba(94,234,212,0.55)' : 'rgba(255,255,255,0.10)';
        ctx.lineWidth = active ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(l.s.x, l.s.y);
        ctx.lineTo(l.t.x, l.t.y);
        ctx.stroke();
        ctx.restore();
      }

      for (const l of links) {
        if (l.kind !== 'tree') continue;
        const active = hover != null && (l.s.id === hover.id || l.t.id === hover.id);
        ctx.strokeStyle = active ? 'rgba(94,234,212,0.5)' : 'rgba(139,152,167,0.18)';
        ctx.lineWidth = active ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(l.s.x, l.s.y);
        ctx.lineTo(l.t.x, l.t.y);
        ctx.stroke();
      }

      for (const n of nodes) {
        const dim = hover != null && !near.has(n.id);
        ctx.globalAlpha = dim ? 0.3 : 1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(255,255,255,0.18)';
        ctx.stroke();

        if (n === hover) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(94,234,212,0.8)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        if (n.type === 'category' || n.count >= 10 || n === hover) {
          ctx.font =
            n.type === 'category'
              ? '600 12px "DreamHanSerif", "Songti SC", serif'
              : '11px "DreamHanSerif", "Songti SC", serif';
          ctx.fillStyle = dim ? 'rgba(139,152,167,0.6)' : 'rgba(230,237,243,0.92)';
          ctx.fillText(n.name, n.x, n.y + n.r + 11);
        }
      }
      ctx.globalAlpha = 1;
    };

    drawRef.current = draw;

    const settle = (n: number) => {
      for (let i = 0; i < n; i += 1) tick(1);
      draw();
    };

    build();
    settle(reduced ? 400 : 140);

    /* 静态模式（减弱动效 或 日常模式）：算好布局就停，只在悬停时补帧 */
    if (reduced || !showcase) {
      const ro0 = new ResizeObserver(() => {
        build();
        settle(reduced ? 400 : 140);
      });
      ro0.observe(canvas);
      return () => ro0.disconnect();
    }

    let raf = 0;
    let last = 0;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (ts - last < 33) return; // ~30fps
      last = ts;
      if (!pausedRef.current) tick(0.35);
      draw(); // 暂停时仍需重绘，保证悬停高亮生效
    };
    raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      build();
      settle(140);
    });
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reduced, showcase]);

  /* 静态模式下，悬停变化需要手动补一帧 */
  useEffect(() => {
    if (reduced || !showcase) drawRef.current?.();
  }, [hoveredEn, reduced, showcase]);

  const pointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const sim = simRef.current;
    if (!sim) return;
    if (dragRef.current) {
      dragRef.current.node.x = pointerPos(e).x;
      dragRef.current.node.y = pointerPos(e).y;
      dragRef.current.moved = true;
      return;
    }
    const { x, y } = pointerPos(e);
    const hit = sim.nodes.find((n) => Math.hypot(n.x - x, n.y - y) <= n.r + 4);
    hoverRef.current = hit ?? null;
    setHoveredEn(hit ? hit.en : null);
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const sim = simRef.current;
    if (!sim) return;
    const { x, y } = pointerPos(e);
    const hit = sim.nodes.find((n) => Math.hypot(n.x - x, n.y - y) <= n.r + 4);
    if (hit) {
      dragRef.current = { node: hit, moved: false };
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
  };

  const onUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (drag && !drag.moved && drag.node.docPath) {
      window.location.href = `/docs/${drag.node.docPath}`;
    }
  };

  return (
    <section className="sec" id="stack" ref={sectionRef}>
      <header className="secHead">
        <span className="secEyebrow mono">01 / STACK</span>
        <h2>技术栈图谱</h2>
      </header>

      <ul className="tagRow toolRow" aria-label="语言与工具">
        {toolTags.map((t) => (
          <li key={t} className="tag mono">
            {t}
          </li>
        ))}
      </ul>

      <div className="graphPanel">
        <div className="graphHead mono">
          <span>graph · {raw.nodes.length} nodes · {raw.total} skills</span>
          <div className="graphTools">
            <span className="graphHint">拖动 · 悬停 · 点击打开</span>
            <button
              className="graphPause"
              onClick={() => setPaused((p) => !p)}
              aria-pressed={paused}
              title={paused ? '播放' : '暂停'}
            >
              {paused ? '▶' : '❚❚'}
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="graphCanvas"
          role="img"
          aria-label={`技术栈图谱，共 ${raw.total} 个知识节点`}
          onPointerMove={onMove}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerLeave={() => {
            hoverRef.current = null;
            setHoveredEn(null);
          }}
        />

        <ul className="graphLegend">
          {legend.map((n) => (
            <li
              className={`legendItem${hoveredEn === n.en ? ' is-active' : ''}`}
              key={n.en}
            >
              <i style={{ background: n.color }} aria-hidden="true" />
              <span className="legendZh">{n.name}</span>
              <span className="legendCount mono">{n.count}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="treeFoot mono">
        <Link to="/Skill">查看完整技能图谱 →</Link>
      </p>
    </section>
  );
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type View = 'terminal' | 'arch' | 'trajectory';

const VIEW_LABEL: Record<View, string> = {
  terminal: '终端',
  arch: '架构',
  trajectory: '轨迹',
};

interface LogLine {
  t: string;
  c: 'cmd' | 'info' | 'ok' | 'warn' | 'done';
}

const LOG_LINES: LogLine[] = [
  { t: '$ ros2 launch mybot_bringup sim.launch.py', c: 'cmd' },
  { t: '[INFO] [component_container]: loading: lidar, imu, odom', c: 'info' },
  { t: '[INFO] [controller_server]: configure -> activate (dwb)', c: 'info' },
  { t: '[INFO] [amcl]: initial pose set (0, 0, 0)', c: 'info' },
  { t: '[WARN] [planner_server]: scan timeout 0.42s -> replanning', c: 'warn' },
  { t: '[INFO] [traj]: T=1.80s |v|max=1.20m/s |a|max=2.5m/s^2', c: 'info' },
  { t: '[INFO] [ekf]: cov trace = 3.2e-3 (ok)', c: 'ok' },
  { t: '[INFO] [ctrl]: xte=0.031m  heading_err=0.4deg', c: 'ok' },
  { t: 'goal reached (2.40, 1.15)  in 12.4s', c: 'done' },
];

/** 打字进度用「总字符数」单一计数器表示，避免多份行/列状态互相打架 */
const TOTAL_CHARS = LOG_LINES.reduce((n, l) => n + l.t.length, 0);
const LINE_ENDS = LOG_LINES.reduce<number[]>((acc, l, i) => {
  acc.push(l.t.length + (i > 0 ? acc[i - 1] : 0));
  return acc;
}, []);

/** 三次贝塞尔轨迹：传感器噪声般的起点，平滑收敛到目标点 */
const P0 = { x: 30, y: 230 };
const P1 = { x: 150, y: 60 };
const P2 = { x: 330, y: 250 };
const P3 = { x: 460, y: 70 };

function bezier(t: number) {
  const u = 1 - t;
  return {
    x: u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x,
    y: u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y,
  };
}

function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, moving: boolean) {
  ctx.clearRect(0, 0, w, h);

  // 坐标网格
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 轨迹
  ctx.strokeStyle = 'rgba(94,234,212,0.75)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(P0.x, P0.y);
  ctx.bezierCurveTo(P1.x, P1.y, P2.x, P2.y, P3.x, P3.y);
  ctx.stroke();

  // 起点 / 目标
  ctx.fillStyle = 'rgba(139,152,167,0.9)';
  ctx.fillRect(P0.x - 3, P0.y - 3, 6, 6);
  ctx.fillStyle = 'rgba(124,255,178,0.9)';
  ctx.fillRect(P3.x - 3, P3.y - 3, 6, 6);
  ctx.font = '10px "SF Mono", ui-monospace, Menlo, monospace';
  ctx.fillStyle = 'rgba(139,152,167,0.7)';
  ctx.fillText('start', P0.x + 6, P0.y - 6);
  ctx.fillText('goal', P3.x - 34, P3.y - 8);

  // 运动点与拖尾
  if (moving) {
    for (let i = 1; i <= 8; i++) {
      const tp = Math.max(0, t - i * 0.012);
      const p = bezier(tp);
      ctx.fillStyle = `rgba(56,189,248,${0.28 - i * 0.03})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    const p = bezier(t);
    ctx.fillStyle = 'rgba(56,189,248,0.95)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function SystemPanel({ showcase }: { showcase: boolean }) {
  const [view, setView] = useState<View>('terminal');
  const [paused, setPaused] = useState(false);
  const [typed, setTyped] = useState(0);
  const typedRef = useRef(0);
  const reduced = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  /* 鼠标轻微视差：仅展示模式 + 桌面精确指针，幅度 ≤5px */
  useEffect(() => {
    if (!showcase || reduced) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const el = panelRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty('--px', String(Math.max(-1, Math.min(1, dx)) * 5));
      el.style.setProperty('--py', String(Math.max(-1, Math.min(1, dy)) * 4));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [showcase, reduced]);

  /* 终端打字机：可暂停、可跳过；reduced-motion 直接静态展示 */
  useEffect(() => {
    if (view !== 'terminal') return;
    if (reduced) {
      typedRef.current = TOTAL_CHARS;
      setTyped(TOTAL_CHARS);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    typedRef.current = 0;
    setTyped(0);

    const step = () => {
      if (cancelled) return;
      if (pausedRef.current) {
        timer = setTimeout(step, 160);
        return;
      }
      typedRef.current += 1;
      setTyped(typedRef.current);
      if (typedRef.current >= TOTAL_CHARS) return; // 播完即停，不循环
      const atLineEnd = LINE_ENDS.includes(typedRef.current);
      timer = setTimeout(step, atLineEnd ? 340 : 20);
    };
    timer = setTimeout(step, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [view, reduced]);

  const skipTyping = () => {
    if (typedRef.current < TOTAL_CHARS) {
      typedRef.current = TOTAL_CHARS;
      setTyped(TOTAL_CHARS);
    }
  };

  /* 轨迹视图：Canvas 限帧 30fps，可暂停 */
  useEffect(() => {
    if (view !== 'trajectory') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    if (reduced) {
      drawScene(ctx, w, h, 1, false);
      return;
    }
    let t = 0;
    let raf = 0;
    let last = 0;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (ts - last < 33) return; // ~30fps
      last = ts;
      if (pausedRef.current) return;
      t = (t + 0.0035) % 1;
      drawScene(ctx, w, h, t, true);
    };
    drawScene(ctx, w, h, 0, true);
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [view, reduced]);

  const showPause = view !== 'arch' && !reduced;

  /* 由单一进度推导出可见行，保证索引永不越界 */
  const visibleLines = useMemo(() => {
    let remain = typed;
    const out: { text: string; c: string }[] = [];
    for (const line of LOG_LINES) {
      if (remain <= 0) break;
      const take = Math.min(line.t.length, remain);
      out.push({ text: line.t.slice(0, take), c: line.c });
      remain -= line.t.length;
    }
    return out;
  }, [typed]);

  const isTyping = !reduced && typed > 0 && typed < TOTAL_CHARS;

  return (
    <div className="sp-panel" ref={panelRef}>
      <div className="sp-head">
        <span className="sp-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="sp-title">leyan@lab: ~/system</span>
        <div className="sp-tabs" role="tablist" aria-label="面板视图">
          {(Object.keys(VIEW_LABEL) as View[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              className={`sp-tab${view === v ? ' is-active' : ''}`}
              onClick={() => setView(v)}
            >
              {VIEW_LABEL[v]}
            </button>
          ))}
        </div>
        {showPause && (
          <button
            className="sp-pause"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            title={paused ? '播放' : '暂停'}
          >
            {paused ? '▶' : '❚❚'}
          </button>
        )}
      </div>

      <div className="sp-body">
        {view === 'terminal' && (
          <div
            className="sp-terminal mono"
            onClick={skipTyping}
            title="点击跳过打字"
            role="log"
            aria-label="模拟终端输出"
          >
            {visibleLines.map((line, i) => (
              <div key={i} className={`sp-line is-${line.c}`}>
                {line.text}
                {isTyping && i === visibleLines.length - 1 && (
                  <span className="sp-cursor" aria-hidden="true" />
                )}
              </div>
            ))}
            {visibleLines.length === 0 && (
              <div className="sp-line is-info">
                <span className="sp-cursor" aria-hidden="true" />
              </div>
            )}
          </div>
        )}

        {view === 'arch' && (
          <div className="sp-arch" aria-label="系统架构示意">
            <div className="sp-archSensors mono">
              <span>LiDAR</span>
              <span>IMU</span>
              <span>ENC</span>
            </div>
            <div className="sp-archLink" aria-hidden="true" />
            <div className="sp-archFlow">
              <span className="sp-node">EKF<br />融合定位</span>
              <span className="sp-arrow" aria-hidden="true">→</span>
              <span className="sp-node">Planner<br />A* / DWB</span>
              <span className="sp-arrow" aria-hidden="true">→</span>
              <span className="sp-node">Ctrl<br />PID / MPC</span>
              <span className="sp-arrow" aria-hidden="true">→</span>
              <span className="sp-node">Actuator<br />ESC ×4</span>
            </div>
            <div className="sp-archDash" aria-hidden="true" />
          </div>
        )}

        {view === 'trajectory' && (
          <canvas ref={canvasRef} className="sp-canvas" aria-label="轨迹规划示意" />
        )}
      </div>

      <div className="sp-foot mono">
        <span>est@50Hz · ctrl@200Hz · planner@10Hz</span>
        <span>
          {view === 'trajectory' ? 'canvas @30fps' : view === 'terminal' ? 'click to skip' : 'static'}
        </span>
      </div>
    </div>
  );
}

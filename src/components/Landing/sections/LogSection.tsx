import React from 'react';
import { logs } from '../../../data/homeData';
import { useReveal } from '../hooks';

/** 实验日志 / 最近动态 */
export default function LogSection() {
  const ref = useReveal<HTMLElement>();

  return (
    <section className="sec" id="log" ref={ref}>
      <header className="secHead">
        <span className="secEyebrow mono">02 / LOG</span>
        <h2>实验日志</h2>
        <p>最近在折腾什么，按月记。</p>
      </header>

      <ol className="logList">
        {logs.map((l, i) => (
          <li key={i}>
            <span className="logDate mono">{l.date}</span>
            <span className="logText">{l.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

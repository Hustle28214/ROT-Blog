import React from 'react';
import Link from '@docusaurus/Link';
import SystemPanel from '../SystemPanel/SystemPanel';
import { formatWords, useSiteStats } from '../hooks';

/**
 * Hero 区：左侧信息（一句话定位 / 简介 / CTA / 数据），
 * 右侧抽象系统面板。移除了原先压在插画上的浮层卡片。
 */
export default function HeadIntro({ showcase }: { showcase: boolean }) {
  const stats = useSiteStats();

  return (
    <section className="hero" id="top">
      <div className="heroGlowA" aria-hidden="true" />
      <div className="heroGlowB" aria-hidden="true" />

      <div className="heroWrap">
        <div className="heroCopy">
          <span className="heroEyebrow rise d0">
            <i aria-hidden="true" />
            PROGRAMMER · ROBOTICS ENGINEER
          </span>

          <h1 className="heroTitle rise d1">
            搞机器人的
            <span className="heroName">白灯塔</span>
          </h1>
          <p className="heroEn rise d2">BUILD THINGS THAT MOVE — AND LAST</p>

          <p className="heroLead rise d2">
            咔咔，小机器人向你问好！
          </p>

          <div className="heroActions rise d3">
            <Link className="btnPrimary" to="/docs/category/computering">
              进入技术栈
            </Link>
            <Link className="btnGhost" href="#log">
              最近动态 →
            </Link>
          </div>

          <dl className="heroStats rise d4">
            <div>
              <dt>文章</dt>
              <dd>{stats?.fileCount ?? '—'}</dd>
            </div>
            <div>
              <dt>字数</dt>
              <dd>{formatWords(stats?.totalWordCount)}</dd>
            </div>
            <div>
              <dt>文档库</dt>
              <dd>
                {stats?.byInstance ? Object.keys(stats.byInstance).length : '3'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="heroPanel rise d2">
          <SystemPanel showcase={showcase} />
        </div>
      </div>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HeadIntro from '../components/Landing/HeadIntro/HeadIntro';
import StackGraph from '../components/Landing/sections/StackGraph';
import LogSection from '../components/Landing/sections/LogSection';
import ContactSection from '../components/Landing/sections/ContactSection';
import '../css/landing.css';

type Mode = 'daily' | 'showcase';

const MODE_KEY = 'landing-mode';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [mode, setMode] = useState<Mode>('daily');

  useEffect(() => {
    try {
      if (localStorage.getItem(MODE_KEY) === 'showcase') setMode('showcase');
    } catch {
      /* 隐私模式等场景下忽略 */
    }
  }, []);

  const toggleMode = () => {
    setMode((cur) => {
      const next: Mode = cur === 'daily' ? 'showcase' : 'daily';
      try {
        localStorage.setItem(MODE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <Layout
      title={siteConfig.title}
      description="机器人工程师的个人主页：技术栈、实验日志与联系方式。"
    >
      <main className={`landing${mode === 'showcase' ? ' landing--showcase' : ''}`}>
        <button
          className="modeToggle"
          onClick={toggleMode}
          aria-pressed={mode === 'showcase'}
          title="日常模式：低动效；展示模式：光晕与视差增强"
        >
          {mode === 'showcase' ? '● 展示模式' : '○ 日常模式'}
        </button>

        <HeadIntro showcase={mode === 'showcase'} />
        <StackGraph showcase={mode === 'showcase'} />
        <LogSection />
        <ContactSection />
      </main>
    </Layout>
  );
}

import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({ className, ...props }) {
  const [stats, setStats] = React.useState({ wordCount: 0, readingTime: 0 });

  React.useEffect(() => {
    const updateStats = () => {
      if (window.tocStatistic) {
        setStats(window.tocStatistic);
      }
    };

    updateStats();
    window.addEventListener('tocStatisticUpdate', updateStats);
    return () => window.removeEventListener('tocStatisticUpdate', updateStats);
  }, []);

  return (
    <div className={clsx(styles.tableOfContentsWrapper, 'thin-scrollbar', className)}>
      <div className={styles.tableOfContents}>
        <TOCItems
          {...props}
          linkClassName={LINK_CLASS_NAME}
          linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
        />
        <div className={styles.tocFooter}>
          <p>本文字数：{stats.wordCount} 字</p>
          <p>预计阅读时间：{stats.readingTime} 分钟</p>
          <a href="https://github.com/Hustle28214/ROT-Blog/issues">有问题？请向我提出issue</a>
        </div>
      </div>
    </div>
  );
}
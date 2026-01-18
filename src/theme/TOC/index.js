import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({ className, ...props }) {
  const [stats, setStats] = React.useState({ 
    wordCount: 0, 
    readingTime: 0 
  });
  const [totalStats, setTotalStats] = React.useState({ 
    totalWordCount: 0, 
    totalReadingTime: 0 
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 更新当前文档的统计
    const updateStats = () => {
      if (window.tocStatistic) {
        setStats(window.tocStatistic);
      }
    };
    updateStats();
    window.addEventListener('tocStatisticUpdate', updateStats);

    // 获取全站统计信息 (现在改为从静态文件加载)
    const fetchTotalStats = async () => {
      try {
        // 从构建时生成的静态文件获取数据
        const response = await fetch('/api/docs/stats.json');
        
        if (response.ok) {
          const data = await response.json();
          setTotalStats({
            totalWordCount: data.totalWordCount || 0,
            totalReadingTime: data.totalReadingTime || 0
          });
        } else {
          console.error('无法获取统计数据，HTTP状态:', response.status);
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalStats();

    return () => {
      window.removeEventListener('tocStatisticUpdate', updateStats);
    };
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

          <hr className={styles.divider} />

          {loading ? (
            <p className={styles.statsText}>统计信息加载中...</p>
          ) : (
            <>
              <p className={styles.statsText}>
                全站总字数：{totalStats.totalWordCount.toLocaleString()} 字
              </p>
            </>
          )}

          <a href="https://github.com/Hustle28214/ROT-Blog/issues">
            有问题？请向我提出issue
          </a>
        </div>
      </div>
    </div>
  );
}
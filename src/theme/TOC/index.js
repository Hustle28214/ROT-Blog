import React from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';
import styles from './styles.module.css';

const LINK_CLASS_NAME = 'table-of-contents__link toc-highlight';
const LINK_ACTIVE_CLASS_NAME = 'table-of-contents__link--active';

export default function TOC({ className, wordCount, readingTime, ...props }) {
  return (
    <div className={clsx(styles.tableOfContentsWrapper, 'thin-scrollbar', className)}>
      <div className={styles.tableOfContents}>
        <TOCItems
          {...props}
          linkClassName={LINK_CLASS_NAME}
          linkActiveClassName={LINK_ACTIVE_CLASS_NAME}
        />
        <div className={styles.tocFooter}>
          <p>本文字数：{wordCount} 字</p>
          <p>预计阅读时间：{readingTime} 分钟</p>
        </div>
      </div>
    </div>
  );
}
import React, { useEffect } from 'react';

export default function WordCount({ children }) {
  useEffect(() => {
    // 使用 setTimeout 确保在下一个事件循环中执行，
    // 这样可以确保 children 已经被渲染
    setTimeout(() => {
      const content = document.querySelector('.wordCount-content');
      if (content) {
        const text = content.innerText || content.textContent;
        const wordCount = text.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 230);

        window.tocStatistic = { wordCount, readingTime };
        window.dispatchEvent(new Event('tocStatisticUpdate'));
      }
    }, 0);
  }, [children]);

  return <div className="wordCount-content">{children}</div>;
}
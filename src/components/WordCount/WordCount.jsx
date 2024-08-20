import React, { useLayoutEffect } from 'react';

export default function WordCount({ children }) {
  useLayoutEffect(() => {
    const updateWordCount = () => {
      const content = document.querySelector('.wordCount-content');
      if (content) {
        const text = content.innerText || content.textContent;
        console.log('获取的文本:', text); // 调试信息
        
        // 统计中文字符
        const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
        
        // 统计英文单词
        const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ')
                                 .split(/\s+/)
                                 .filter(word => /[a-zA-Z]/.test(word)).length;
        
        // 统计数字（每个数字都视为一个单位）
        const numbers = (text.match(/\d/g) || []).length;
        
        // 统计标点符号
        const punctuations = (text.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~。，、；：？！…—·ˉ¨''""々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g) || []).length;
        
        // 总字数为中文字符数、英文单词数、数字数和标点符号数的总和
        const wordCount = chineseChars + englishWords + numbers + punctuations;
        
        console.log('计算的字数:', wordCount); // 调试信息
        console.log('中文字符:', chineseChars);
        console.log('英文单词:', englishWords);
        console.log('数字:', numbers);
        console.log('标点符号:', punctuations);
        
        const readingTime = Math.ceil(wordCount / 230);

        window.tocStatistic = { wordCount, readingTime };
        window.dispatchEvent(new Event('tocStatisticUpdate'));
      }
    };

    // 立即更新
    updateWordCount();

    // 如果内容可能发生变化，使用 MutationObserver 进行监听
    const observer = new MutationObserver(updateWordCount);
    const content = document.querySelector('.wordCount-content');
    if (content) {
      observer.observe(content, { childList: true, subtree: true });
    }

    return () => {
      if (content) {
        observer.disconnect();
      }
    };
  }, [children]);

  return <div className="wordCount-content">{children}</div>;
}
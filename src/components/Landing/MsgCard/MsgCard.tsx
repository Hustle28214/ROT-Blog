import { useState, useEffect } from 'react';
import { Tilt } from '@jdion/tilt-react';
import styles from './styles.module.css'; // 需要创建对应的CSS模块文件
import React from 'react';

const animationClasses = [
  styles.springIn,
  styles.slideUp,
  styles.bounce
];

export const MsgCard = () => {
  const [randomText, setRandomText] = useState('');
  const [animate, setAnimate] = useState(false);

  // 预设文本池
  const texts = [
    '嘘，她正在思考进程锁为什么又互斥了...🤕',
    '嘘，她正在调试速度环参数...🤖',
    '嘘，她正在纠结下班吃什么...😋',
    '嘘，她正在追踪野指针的去向...🔍',
    '嘘，她正在重构回调地狱...🌀'
  ];

  useEffect(() => {
    // 初始化立即执行
    updateText();
    
    // 定时器设置
    const timer = setInterval(updateText, 10000);
    
    return () => clearInterval(timer);
  }, []);

  const updateText = () => {
    setAnimate(true);
    const randomIndex = Math.floor(Math.random() * texts.length);
    setRandomText(texts[randomIndex]);
    
  };
  
  return (
    <Tilt 
      style={{ height: 250, width: 250 }}
    >
      <div 
        className={styles.container}
        onAnimationEnd={() => setAnimate(false)}
      >
        <div className={`${styles.text} ${animate ? styles.pop : ''}`}>
          {randomText || '正在初始化...'}
        </div>
      </div>
    </Tilt>
  );
};

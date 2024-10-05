import React, { useState, useEffect, useRef } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; // Import the styles
import rainSound from '../../mp3/rain.mp3'; // Provide the correct path
import birdSound from '../../mp3/bird.mp3';
import './Button.css'; // 引入按钮样式
import './ProgressBar.css'; // 引入进度条样式
import './Timer.css'; // 引入新的样式文件

const Timer = () => {
  const [inputMinutes, setInputMinutes] = useState(1); // Default 1 minute
  const [inputSeconds, setInputSeconds] = useState(0); // Default 0 seconds
  const [remainingTime, setRemainingTime] = useState(inputMinutes * 60 + inputSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const timerRef = useRef(null);
  const soundRef = useRef(null);
  const FireSoundRef = useRef(null);
  const birdSoundRef = useRef(null);
  const fullscreenButtonRef = useRef(null);

  const requestFullscreen = () => {
    const element = document.documentElement; // 选择整个文档元素

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { // Firefox
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) { // Chrome, Safari and Opera
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) { // IE/Edge
      element.msRequestFullscreen();
    }
  };
  useEffect(() => {
    // Initialize sound
    soundRef.current = new Audio(rainSound);
    soundRef.current.loop = true; // Loop the white noise
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setRemainingTime(0);
            if (isSoundOn) {
              soundRef.current.pause();
              soundRef.current.currentTime = 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && remainingTime !== 0) {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRunning, remainingTime, isSoundOn]);

  const handleStart = () => {
    const totalSeconds = inputMinutes * 60 + inputSeconds;
    if (totalSeconds > 0) {
      setRemainingTime(totalSeconds);
      setIsRunning(true);
      if (isSoundOn) {
        soundRef.current.play();
      }
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    if (isSoundOn) {
      soundRef.current.pause();
    }
  };

  const handleResume = () => {
    setIsRunning(true);
    if (isSoundOn) {
      soundRef.current.play();
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    const totalSeconds = inputMinutes * 60 + inputSeconds;
    setRemainingTime(totalSeconds);
    if (isSoundOn) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;
    }
  };

  const handleChangeMinutes = (event) => {
    setInputMinutes(parseInt(event.target.value) || 0);
  };

  const handleChangeSeconds = (event) => {
    setInputSeconds(Math.max(0, Math.min(59, parseInt(event.target.value) || 0))); // Ensure seconds is between 0 and 59
  };

  const handleToggleSound = () => {
    setIsSoundOn(prev => {
      const newSoundState = !prev;
      if (newSoundState) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
      return newSoundState;
    });
  };

  const handleBirdSound = () => {
    setIsSoundOn(prev => {
      const newSoundState = !prev;
      if (newSoundState) {
        birdSoundRef.current.play();
      } else {
        birdSoundRef.current.pause();
      }
      return newSoundState;
    });
  };

  useEffect(() => {
    // Initialize sound
    birdSoundRef.current = new Audio(birdSound);
    birdSoundRef.current.loop = true; // Loop the white noise
  }, []);
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>专注眼前，静水流深。</h1>
      <div className="time-input-container" style={{ marginBottom: '20px' }}>
        <input
          type="number"
          value={inputMinutes}
          onChange={handleChangeMinutes}
          min="0"
          placeholder="分钟"
          className="time-input" // 应用新样式
        />
        <div className="time-divider" /> {/* 分隔符 */}
        <input
          type="number"
          value={inputSeconds}
          onChange={handleChangeSeconds}
          min="0"
          max="59"
          placeholder="秒"
          className="time-input" // 应用新样式
        />
      </div>
      <div className="circular-progress-bar">
        <CircularProgressbar
          className="circular-progress-bar" // 应用 CSS 类名
          value={(inputMinutes * 60 + inputSeconds - remainingTime) / (inputMinutes * 60 + inputSeconds) * 100}
          text={formatTime(remainingTime)}
          styles={{root: {},text:{fill: '#1989ac',},path:{stroke:'#ffde25'},trail: {stroke: '#283e56'},}}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button className="button" onClick={handleStart} disabled={isRunning}>开始</button>
        <button className="button" onClick={handlePause} disabled={!isRunning}>暂停</button>
        <button className="button" onClick={handleResume} disabled={isRunning || remainingTime === inputMinutes * 60 + inputSeconds}>恢复</button>
        <button className="button" onClick={handleStop} disabled={!isRunning && remainingTime === inputMinutes * 60 + inputSeconds}>停止</button>
        <button className="button" onClick={handleToggleSound}>
          {isSoundOn ? '雨停' : '下雨'}
        </button>
        <button className="button" onClick={handleBirdSound}>
          {isSoundOn ? '休息' : '啼鸣'}
        </button>
        <button className="button" ref={fullscreenButtonRef} onClick={requestFullscreen}>进入全屏</button>
      </div>
    </div>
  );
};

export default Timer;
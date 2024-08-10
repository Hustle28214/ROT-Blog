// VideoPlayer.jsx
import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ src, width = '100%', height = 'auto' }) => {
  // 添加 autoplay=0 确保视频不自动播放
  const videoSrc = src.includes('?') ? `${src}&autoplay=0` : `${src}?autoplay=0`;

  return (
    <div className="video-container" style={{ width, height }}>
      <iframe
        src={videoSrc}
        width="100%"
        height="100%"
        border="0"
        frameBorder="0"
        scrolling="no"
        allowFullScreen
        title="Video Player"
      ></iframe>
    </div>
  );
};

export default VideoPlayer;
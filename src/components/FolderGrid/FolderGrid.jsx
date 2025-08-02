import React, { useState } from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './FolderGrid.css';

const FolderGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // 示例文件夹数据 - 5xN 布局
  const folders = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: `文件夹 ${i + 1}`,
    icon: './static/img/file.png', 
    videoUrl: `https://example.com/video${i + 1}.mp4`
  }));

  const handleFolderClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideoPlayer(true);
  };

  const handleBack = () => {
    setShowVideoPlayer(false);
    setSelectedVideo(null);
  };

  // 5列网格布局
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '20px',
    padding: '20px'
  };

  return (
    <div className="folder-app-container">
      {showVideoPlayer ? (
        <div className="video-view">
          <button onClick={handleBack} className="back-button">
            ← 返回文件夹
          </button>
          <div className="video-wrapper">
            <VideoPlayer src={selectedVideo} />
          </div>
        </div>
      ) : (
        <div style={gridStyle}>
          {folders.map((folder) => (
            <div 
              key={folder.id} 
              className="folder-item"
              onClick={() => handleFolderClick(folder.videoUrl)}
            >
              <img 
                src={folder.icon} 
                alt={folder.name} 
                className="folder-icon"
              />
              <span className="folder-name">{folder.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FolderGrid;
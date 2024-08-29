import React, { useRef } from 'react'; // 添加 useRef 的导入
import Timer from '../components/Timer/Timer';
import './Chan.module.css'; // 导入 CSS 模块

function Chan() {
  return (
    <div className="fullScreen">
      <br></br>
      <br></br>
      <br></br>
      
      <Timer />
      
    </div>
  );
}

export default Chan;
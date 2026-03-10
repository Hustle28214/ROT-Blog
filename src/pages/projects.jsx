import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';

// 代码雨背景组件
function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // 设置canvas大小为窗口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 字符集 - 使用编程相关字符
    const chars = "01{}[]<>()/*-+=!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = canvas.width / fontSize;

    // 每列的y坐标
    const drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    // 绘制代码雨
    function draw() {
      // 半透明黑色背景，产生拖尾效果
      ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0"; // 绿色代码
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        // 随机字符
        const text = charArray[Math.floor(Math.random() * charArray.length)];

        // 绘制字符
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // 如果到达底部或者随机数，重置到顶部
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    // 动画循环
    const interval = setInterval(draw, 33);

    // 窗口大小改变时重置canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
}

// 桌面图标组件
function DesktopIcon({ title, onClick, isDarkMode, icon = "📁", color = "rgba(0, 0, 0, 0)" }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '20px',
        borderRadius: '0px',
        textAlign: 'center',
        width: '120px',
        transition: 'all 0.3s ease',
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'transparent', // 设置为透明
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        // 移除背景色和模糊效果
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        // 移除背景色和模糊效果
      }}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '0px',
          backgroundColor: 'transparent', // 图标背景设置为透明
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          boxShadow: 'none', // 移除阴影
          backdropFilter: 'none', // 移除模糊效果
          border: 'none', // 移除边框
        }}
      >
        {icon}
      </div>
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        backdropFilter: 'none', // 移除文字背景的模糊效果
      }}>
        {title}
      </div>
    </div>
  );
}

// 视频卡片组件 - 全新的设计
function VideoCard({ video, onClick, isDarkMode }) {
  const themeStyles = {
    background: isDarkMode ? 'rgba(42, 42, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    text: isDarkMode ? 'white' : '#333',
    textSecondary: isDarkMode ? '#ccc' : '#666',
    border: isDarkMode ? '#444' : '#e0e0e0',
    accent: video.color,
  };

  return (
    <div
      style={{
        background: themeStyles.background,
        borderRadius: '16px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: `2px solid ${themeStyles.border}`,
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 12px 30px rgba(0,0,0,0.3), 0 0 0 2px ${video.color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
      }}
    >
      {/* 装饰性渐变条 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${video.color} 0%, ${video.color}99 50%, ${video.color}33 100%)`,
      }} />

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: '15px',
        gap: '15px',
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '12px',
          backgroundColor: video.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          flexShrink: 0,
          boxShadow: `0 4px 12px ${video.color}40`,
        }}>
          {video.icon}
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 5px 0',
            color: themeStyles.text,
            fontSize: '18px',
            fontWeight: 'bold',
            lineHeight: '1.3',
          }}>
            {video.name}
          </h3>
          <p style={{
            margin: 0,
            color: themeStyles.textSecondary,
            fontSize: '14px',
            lineHeight: '1.4',
          }}>
            {video.creator}
          </p>
        </div>
      </div>

      <div style={{
        flex: 1,
        marginBottom: '15px',
      }}>
        <p style={{
          margin: 0,
          color: themeStyles.textSecondary,
          fontSize: '14px',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {video.description}
        </p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
      }}>
        <span style={{
          fontSize: '12px',
          color: video.color,
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '6px',
          backgroundColor: `${video.color}20`,
        }}>
          {video.type}
        </span>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          color: themeStyles.textSecondary,
          fontSize: '12px',
        }}>
          <span>🎬</span>
          <span>{video.episodes}</span>
        </div>
      </div>

      {/* 悬停时的播放按钮 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(0.8)',
        opacity: 0,
        transition: 'all 0.3s ease',
        pointerEvents: 'none',
      }} className="video-play-overlay">
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: `${video.color}cc`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px',
          backdropFilter: 'blur(10px)',
        }}>
          ▶
        </div>
      </div>

      <style jsx>{`
        div:hover .video-play-overlay {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      `}</style>
    </div>
  );
}

// README.md 编辑器组件
function ReadmeEditor({ isOpen, onClose, isDarkMode, content, onContentChange }) {
  const themeStyles = {
    background: isDarkMode ? '#1a1a1a' : 'white',
    text: isDarkMode ? 'white' : '#333',
    textSecondary: isDarkMode ? '#ccc' : '#666',
    border: isDarkMode ? '#333' : '#e0e0e0',
    buttonBackground: isDarkMode ? '#333' : '#f5f5f5',
    buttonHover: isDarkMode ? '#444' : '#e0e0e0',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)',
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
          zIndex: 998,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'auto',
          backgroundColor: themeStyles.background,
          borderRadius: '12px',
          padding: '30px',
          zIndex: 999,
          boxShadow: `0 8px 32px ${themeStyles.shadow}`,
          border: `1px solid ${themeStyles.border}`,
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: `2px solid ${themeStyles.border}`,
          paddingBottom: '15px',
        }}>
          <h2 style={{ margin: 0, color: themeStyles.text, fontSize: '24px' }}>
            README.md
          </h2>
          <button
            style={{
              background: 'none',
              border: 'none',
              fontSize: '2rem',
              cursor: 'pointer',
              color: themeStyles.text,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = themeStyles.buttonBackground;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'none';
            }}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: themeStyles.textSecondary, marginBottom: '10px' }}>
            支持 Markdown 语法，你可以在这里写任何内容：
          </p>

        </div>

        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          style={{
            width: '100%',
            height: '300px',
            padding: '15px',
            borderRadius: '8px',
            border: `1px solid ${themeStyles.border}`,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
            color: themeStyles.text,
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'vertical',
            fontFamily: 'monospace',
          }}
          placeholder={`# 欢迎来到我的项目空间！

星标实在是不够用了！所以做了一个项目页，把我喜欢的和我正在做的项目放进去。你可以：

## 🚀 项目分类
- **机器人项目** - 各种机器人相关开发
- **嵌入式项目** - 硬件和嵌入式系统
- **Web应用** - 网站和Web工具
- **处理器项目** - AI编译器和底层优化
- **软件项目** - 桌面和移动应用

## 💡 使用说明
点击桌面图标浏览项目，每个项目都有详细的技术说明。

---
*最后更新: ${new Date().toLocaleDateString()}*`}
        />

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            style={{
              background: themeStyles.buttonBackground,
              border: `1px solid ${themeStyles.border}`,
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: themeStyles.text,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = themeStyles.buttonHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.background = themeStyles.buttonBackground;
            }}
            onClick={() => {
              localStorage.removeItem('readme-content');
              onContentChange('');
            }}
          >
            重置
          </button>
          <button
            style={{
              background: '#007acc',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              color: 'white',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#005a9e';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#007acc';
            }}
            onClick={onClose}
          >
            保存并关闭
          </button>
        </div>
      </div>
    </>
  );
}

// 项目数据
const projectData = {
  
  "Liked": {
    "categories": [
      {
        "name": "Web开发",
        "projects": [
          {
            "name": "React",
            "description": "用于构建用户界面的JavaScript库",
            "icon": "⚛️",
            "link": "https://reactjs.org",
            "color": "#61DAFB"
          },
          {
            "name": "Vue.js",
            "description": "渐进式JavaScript框架",
            "icon": "🌿",
            "link": "https://vuejs.org",
            "color": "#42B883"
          },
          {
            "name": "Next.js",
            "description": "React全栈框架",
            "icon": "▲",
            "link": "https://nextjs.org",
            "color": "#000000"
          }
        ]
      },
      {
        "name": "机器学习",
        "projects": [
          {
            "name": "TensorFlow",
            "description": "端到端机器学习平台",
            "icon": "🧠",
            "link": "https://tensorflow.org",
            "color": "#FF6F00"
          },
          {
            "name": "PyTorch",
            "description": "开源机器学习框架",
            "icon": "🔥",
            "link": "https://pytorch.org",
            "color": "#EE4C2C"
          }
        ]
      },
      {
        "name": "操作系统",
        "projects": [
          {
            "name": "Linux",
            "description": "我需要说什么吗",
            "icon": "🐧",
            "link": "https://github.com/torvalds/linux.git",
            "color": "#FCC624"
          }
        ]
      },
      {
        "name": "编译器",
        "projects": [
          {
            "name": "GCC",
            "description": "无需多言",
            "icon": "🔧",
            "link": "https://github.com/gcc-mirror/gcc.git",
            "color": "#0277BD"
          },
          {
            "name": "Rust",
            "description": "它是未来",
            "icon": "🦀",
            "link": "https://github.com/rust-lang/rust.git",
            "color": "#DEA584"
          }
        ]
      },
      {
        "name": "仿真求解",
        "projects": [
          {
            "name": "Octave",
            "description": "类似Matlab的平替",
            "icon": "📊",
            "link": "https://github.com/gnu-octave/octave.git",
            "color": "#0790C9"
          }
        ]
      },
      {
        "name": "机器人解算库",
        "projects": [{
          "name": "Sophus",
            "description": "李群李代数位姿解算库",
            "icon": "📦",
            "link": "https://github.com/strasdat/Sophus",
            "color": "#8E44AD"},
        ],
        
      },
      {
        "name": "具身智能导航",
        "projects": [{
          "name": "Embodied-AI-Guide",
            "description": "具身智能工作导航",
            "icon": "📦",
            "link": "https://github.com/TianxingChen/Embodied-AI-Guide",
            "color": "#8E44AD"},
        ],
        
      },
      
      {
        "name": "物理引擎",
        "projects": [
          {
            "name": "Box2D",
            "description": "2D游戏物理引擎",
            "icon": "📦",
            "link": "https://github.com/erincatto/box2d.git",
            "color": "#8E44AD"
          },
          {
            "name": "Physac",
            "description": "2D游戏物理引擎",
            "icon": "⚡",
            "link": "https://github.com/victorfisac/Physac.git",
            "color": "#3498DB"
          },
          {
            "name": "Bullet3",
            "description": "开源机器人仿真引擎",
            "icon": "🔫",
            "link": "https://github.com/bulletphysics/bullet3.git",
            "color": "#E74C3C"
          },
          {
            "name": "Mujoco",
            "description": "开源机器人仿真平台",
            "icon": "🤖",
            "link": "https://github.com/google-deepmind/mujoco.git",
            "color": "#2ECC71"
          },
          {
            "name": "Jolt",
            "description": "刚体碰撞检测引擎",
            "icon": "💥",
            "link": "https://github.com/jrouwe/JoltPhysics.git",
            "color": "#F39C12"
          }
        ]
      }
    ]
  },
  
  "Self": {
    categories: [
      {
        name: "机器人项目",
        projects: [
          {
            name: "轮腿机器人",
            description: "基于VMC控制的轮腿自平衡机器人",
            icon: "🤖",
            color: "#f7734a",
            details: "本项目由我独立开发中，机械结构参考了苏黎世联邦理工的Ascento机器人，髋关节和腿关节的设计使用了近似霍肯连杆机构，并采用了Pyslvs来解算最优杆长。控制部分，采用航模24V电池供电，设计了一款反并B540C限流二极管的分电板以及串口转接板，未来计划使用FreeRTOS进行任务管理，所以主控芯片采用了存储容量更大的STM32H723VGT6，关节电机采用达妙3507无刷直驱，轮毂电机采用了达妙3510无刷直驱，主要计划采用CAN通信来驱动关节电机和轮毂电机，目前控制部分还在调试。在MATLAB进行移动仿真，考虑到轮腿机器人本身是一个倒立摆，算法采用的是LQR计算期望腿长（质心与轮心垂直距离），计划采用VMC监测关节夹角变量来控制关节电机输出力矩。"
          },
          {
            name: "ROS智能小车",
            description: "基于ROS的自主移动机器人，实现SLAM建图和路径规划",
            icon: "🚗",
            link: "/docs/robotics/ros-car",
            color: "#4a6cf7",
            details: "本项目是基于STM32H103联想工控机的ROS小车，任务是完成家庭场景下的物品配送，底盘是无刷直流电机驱动麦克纳姆轮，由于场地较小，出于性能考虑采用了Gmapping作为SLAM建图方法。考虑到识别的稳定性，利用labelImg做了一套小型的家用常见物品数据集，小车主要采用YOLOv5作为训练模型，并将预训练模型写成launch脚本文件以快速使用。YOLOv5训练轮次在200轮左右，经过30轮测试，识别准确率在96%以上。将语音识别指令结合到分居室任务中去，通过ASRPRO语音识别板来接收需要分拣的物品指令，接到指令后将物品配送到对应房间。路径规划选择了A*算法，它的综合表现比RRT更“决绝”，不易出现反复思考更快路径的现象。"
          },
          {
            name: "STM32F103平衡车",
            description: "基于STM32F103开发的PID自平衡车",
            icon: "🛞",
            color: "#7388A3",
            details: "基于STM32F103开发的PID自平衡车，在上面做了ROS的开发，主要用A*算法和RRT算法做路径规划，实现避障，由于测试之后发现A* 算法表现更稳定，所以最终采用的是A*算法。用小车上面的激光雷达做了跟随模式，我实现跟随模式的思路主要是定义一个最近的点，找出需要跟随的点的距离和角度，同时在判断是否“跟踪中”之前设定一个阈值做硬件消抖。在这辆平衡车上还做了位置式PID控制，经过测试显示调整直立环能达到一个较好的平衡效果，微调速度环能在人为拿放的干扰下达到平衡时间更短。"
          },
          {
            name: "自主机器人具身智能执行方法",
            description: "基于Voxposer方案的双臂机器人具身智能执行方法",
            icon: "🦾",
            color: "#FFD306",
            details: "本项目在启元实验室开发，主要包含双臂模仿学习、机器人视觉系统、模仿学习数据采集与验证系统与智能机器人自主操作系统。在项目中，我主要担任智能机器人自主操作系统的开发者，使用Coppeliasim与ROS联合开发，在voxposer项目的基础上，部署双臂机器人实机，通过相机视觉感知、ROS话题发布和接收设计、前端实现，3D代价地图项目目前处于方案执行阶段，已试行成功”文本指令- 机械臂自主理解操作”方案，结合Code as Policies提供的方案进行了递归代码生成优化。通过感知融合，从抓取方块到抓取插头等不规则物件。同时负责流程实现的文档和测试日志整理。项目已被北京理工大学成功验收。"
          },
          {
            name: "人形机器人动作重定向",
            description: "基于Voxposer方案的双臂机器人具身智能执行方法",
            icon: "🦿",
            color: "#548C00",
            details: "本项目主要使用Ubisoft ZeroEggs和CMU开源数据集完成对宇树G1机器人模型的动作重定向，其原理是使用适配于AMC 标准的机器人的骨架，使用优化函数，从AMC标准的24个自由度映射到29个自由度。项目主要攻克的难点在于设计了解IK 模块完成逆运动学解算，并处理了肢体长度差异和修正运动学约束，使用CasADi提供的ipopt求解器，设计了目标函数：50 * 位置误差 + 旋转误差 + 0.15 * 平滑项 + 0.025 * 正则化损失，使得G1机器人重定向后的动作更加自然；并且利用了四元数，设计了BVH格式转换AMC格式的模块，使得项目通用性更好。项目适配了ROS，可以在RVIZ中进行骨架运动可视化，基于Qt 5设计了用户界面可以随时暂停/播放动作帧。"
          },
          {
            name: "魔方机器人",
            description: "基于Arduino Nano和Mg90S舵机的魔方机器人",
            icon: "🟪",
            color: "#5151A2",
            details: "参与北京化工大学第五届魔方机器人创意大赛，参与了项目的调试、开发部分，使用模块主要为Arduino Nano开发板，控制双臂双指机器人的旋动。我在本项目中主要负责了下位机的调试，用延时函数做了硬件消抖，使用了PWM调整占空比来控制双臂舵机在恰当时机旋转，调整相机色调值适应现场光源，最终魔方机器人可以在20步以内，30秒之内复原魔方。"
          },
          {
            name: "基于YDLidar-SDK的激光点云图",
            description: "基于YDLidar-SDK，使用OpenCV实现的点云图，支持C++/Python",
            icon: "⛯",
            link: "https://github.com/Hustle28214/YDLidar-SDK",
            color: "#272727",
            details: "本项目是基于基于YDLidar-SDK，使用OpenCV实现的点云图，支持C++/Python。实机为Tmini-Plus，修正了部分SDK中的错误，同时添加了点云图显示。"
          },
        ]
      },
      {
        name: "嵌入式项目",
        projects: [
          {
            name: "CosmoLink",
            description: "基于树莓派和Vision Pro的VR逗猫遥控小车",
            icon: "🚘",
            link: "https://aiagent2025.com/projects/gi7t4zmlra2b",
            color: "#FFD608",
            details: "本项目是在中国最大的硬件黑客松Rebuild Z上开发，获得最复杂技术栈奖与机器人二次开发赛道三等奖。耗时4天，我担任硬件开发者之一；基于树莓派搭建差速4轮逗猫小车，配套开发了Vision Pro图传、监控网页以及遥控APP。在小车前方搭建了二自由度SG90舵机云台，可实现一定范围的逗猫功能。遥控延迟在300Ms左右，基本实现了实时控制。基于L298N直流电机驱动模块，使用马达搭载旋转激光头、水泵出水以及开关仓门，可实现激光逗猫、干湿喂食功能。基于ESP32扩展模块，可实现小智AI对话以及状态上报云服务器，以及低功耗蓝牙（BLE）开关遥控。"
          },
          {
            name: "觅星",
            description: "一款基于涂鸦T5-E1 AI开发板的AI指南针",
            icon: "🧭",
            link: "https://github.com/Hustle28214/TUYA-T5-E1-FindStar",
            color: "#C199E0",
            details: "本项目是在中国最大的黑客松AdventureX 2025上开发，耗时3天，项目由我一人开发，另一个人担任UI与逐帧动画设计；基于赛道指定使用的TUYA T5-E1开发板，使用QMC5883L磁力计+MPU6050陀螺仪作为磁北标准和精度控制，数值来源于通过组合读取01H～06H的xyz轴寄存器大小端，使用TuyaOpen标准库实现I2C（软件I2C）外设驱动，实现基础的指南效果，精度在1°～2°左右；基于4LineSPI（硬件SPI）的1.28寸 gc9a01 TFT显示屏，使用LVGL进行屏幕开发；基于在此基础上，使用涂鸦云开发者平台，基于Qwen 3接口建立了天文知识Agent，不仅可以基于天文语料回答天文领域基本问题，采用硬件部署的算法实现月亮方位计算，从而通过文本上云的接口，赋予Agent实时回答月出月落，日出日落时间等问题。项目获涂鸦智能以及多家独立机构采访，获登涂鸦智能季度财报，并在明日生活指南：AI硬件的超前构想取得三等奖。"
          },
          {
            name: "多传感器AI对话机械臂",
            description: "基于小智ai框架，实现了多传感器状态数据处理和反馈",
            icon: "🤖",
            link: "https://github.com/Hustle28214/xiaozhi-esp32",
            color: "#4a6cf7",
            details: "本项目分为两部分，一部分为基于NVIDIA Jetson Nano+STM32开发的舵机机械臂平台，采用PID控制算法精确控制末端摄像头的移动，以及采用RGB颜色识别算法，控制机械臂实现方块拾取与人脸识别等功能。一部分基于基于ESP32S3 N16R8开发，基于小智ai框架，在esp-idf环境下实现了多传感器通过小智ai提供的MCP工具来反馈传感器状态。主要实现的传感器是max30102心率血氧传感器（I2C）、hcsr04超声波传感器（trig/echo）、EMG肌肉电传感器（模拟输入/输出）的外设驱动和基本处理算法，驱动层使用最新i2c外设标准库i2c_master库编写。由于raw数据数值抖动范围较大，我们通过中值滤波、滑动平均的方法来抑制数值抖动，准确率在90%左右。并且，实现了UDP发送到云服务器做数据处理的功能。"
          },

          {
            name: "温湿度监控智能风扇",
            description: "基于Arduino Uno R3和DHT22传感器实现的温湿度监控智能风扇",
            icon: "🌀",
            link: "/docs/robotics/visual-slam",
            color: "#6BBCCF",
            details: "本项目基于Arduino Uno R3和DHT22传感器实现了一款温湿度监控智能风扇，通过DHT22传感器监测温度，并传递到Arduino Uno开发板上，接入然也物联实现数据可视化和可控性。考虑到开发的快捷性，使用了Node-RED编写模块控制。本人在项目全过程中独立完成项目的大部分开发内容，如Arduino硬件代码编写、Node-RED可视化代码编写，然也物联接口、数据库的建立和管理、硬件组装和协调开发。"
          },
          {
            name: "ESP-IDF-ICM-42670-P驱动",
            description: "基于ESP-IDF框架的ICM-42670-P传感器驱动",
            icon: "✈️",
            link: "https://github.com/Hustle28214/ESP-IDF-ICM-42670-P",
            color: "#f7734a",
            details: "基于ESP-IDF框架的ICM-42670-P传感器驱动，实现了I2C接口的读写，以及基本的传感器数据读取及卡尔曼滤波处理。精度在1%内。"
          },
          {
            name: "ModBus通讯模拟",
            description: "基于Python的ModBus通讯模拟和Arduino实现",
            icon: "🏗️",
            link: "https://github.com/Hustle28214/ModbusPySim",
            color: "#94CCC3",
            details: "基于Python的ModBus通讯模拟，实现了ModBus主从设备的通讯，并且在ESP32实现了Modbus通讯和浮点数处理。"
          },
          {
            name: "旋转LED时钟",
            description: "基于Arduino Uno R3和LED实现的旋转时钟",
            icon: "⏲️",
            color: "#FB6571",
            details: "基于Arduino Uno R3和LED实现的旋转时钟，通过自设计的LED PCB，基于视觉残留效应和字模技术实现了LED旋转时钟的效果。"
          },
        ]
      },
      {
        name: "Web应用",
        projects: [
          {
            name: "智能博客平台",
            description: "基于Docusaurus的个人博客",
            icon: "📝",
            link: "https://rot-blog.vercel.app",
            color: "#3ecc5f",
            details: "使用静态文档页面生成框架Docusaurus搭建，并且使用MDX格式来使部分页面可在Markdown语言的基础上使用React组件，丰富页面内容。采用本地修改+Git+远程读取Github仓库内容的方式，使用Vercel远程读取Github仓库并部署到Vercel的服务器上。支持RSS订阅，支持Markdown页面内嵌入视频。使用了motion插件来做星空动效，通过近似圆形来模拟出粒子，定义Canvas判断光标象限位置，实现磁吸效果，实现光标移动跟随。除此之外设计了一款配套的NFC(NTAG215湿标)钥匙扣挂件，作为NFC名片。"
          },
          {
            name: "2024 IGEM Wiki",
            description: "2024 IGEM BUCT-China团队Wiki",
            icon: "🧬",
            link: "https://2024.igem.wiki/buct-china/",
            color: "#B8DF6A",
            details: "作为项目的主要开发者，主导网站的设计、开发及维护。采用较新的Docusaurus与MDX技术，构建易于使用、灵活且高效的文档展示平台。实现了基于React的组件库，自主设计并实现其动效与外观，从而提高了开发效率，使代码易于维护。采用移动优先的响应式设计策略，确保不同屏幕设备获得最佳的用户体验。运用模块化设计原则，增强代码的可维护性和可扩展性。与设计团队紧密协作，通过Figma快速原型设计与反馈，确保视觉设计满足功能需求。"
          },
          {
            name: "Σ掌心",
            description: "Trae Solo北京站冠军作品，基于Vite实现的AI掌纹分析工具",
            icon: "🔮",
            link: "https://palmistry-analysis-io.vercel.app/",
            color: "#f7734a",
            details: "Trae Solo北京站冠军作品，此作品基于Trae Solo开发，采用React + TypeScript + Vite实现，LLM API支持为Groq/OpenAI，实现了基于视觉模型识别->分析掌纹命理->多种趣味测试的功能。"
          },
          {
            name: "在线紫微斗数算命",
            description: "免费的在线紫微斗数算命平台，可根据时间起卦",
            icon: "💻",
            link: "https://zhou-yi-qi-gua-website.vercel.app/",
            color: "#9b59b6",
            details: "基于Dart语言实现，支持谶语解读。"
          },

        ]
      },
      {
        name: "处理器项目",
        projects: [
          {
            name: "TinyInfiniTensor",
            description: "一个迷你AI编译器，基于C++搭建计算图进行推理计算。",
            icon: "📝",
            link: "https://github.com/Hustle28214/TinyInfiniTensor",
            color: "#3ecc5f",
            details: "本项目是OpenCamp训练营由清华主导的项目，这是一个迷你AI编译器，基于C++搭建计算图进行推理计算，支持CPU计算，在AMD Ryzen 7上表现优良。我在本项目中完成了内存分配器、transpose/clip/concat/cast算子的形状推导、矩阵乘形状推导、双向广播和简单的图优化规则实现。图优化核心在于消除冗余操作和融合等效计算来优化计算图，合并连续转置Transpose转置与Transpose-MatMul矩阵乘法融合；而Allocator内存分配器是通过维护一个有序的空闲块映射表，采用首次适应算法分配内存，释放时合并相邻块，同时处理内存对齐，最终在需要时一次性分配足够的物理内存来分配内存。"
          },
        ]
      },
      {
        name: "软件项目",
        projects: [
          {
            name: "荧光探针图像处理工具",
            description: "一个基于Python的荧光探针图像处理工具",
            icon: "🔎",
            link: "https://gitlab.igem.org/2024/software-tools/buct-china",
            color: "#3ecc5f",
            details: "项目已刊登于Small期刊。主要职责：担任独立开发者，负责从项目构思到实现的全流程开发与优化。技术实现：在开发过程中，应用了Python的丰富库生态，包括NumPy、Pandas等进行数据处理，以及OpenCV、Matplotlib进行图像处理。通过机器学习的”训练 / 测试”理念，有效优化了图像分析的置信区间选择，并通过大样本量测试验证了算法的稳定性和有效性。算法优化：使用统计学方法和图像处理技术相结合，设计了”正态分布统计筛选荧光点 + 局部非最大抑制”算法，大大提高了荧光点检测的准确度和效率。产品功能：提供一键批量处理功能，显著提升了用户的工作效率。系统自带报告生成功能，可导出详细的统计数据和分析结果。"
          },
          {
            name: "类基因检测商城APP",
            description: "基于vue3+uni-app框架的类基因检测商城APP",
            icon: "🏬",
            color: "#B8DF6A",
            details: "作为项目的主要开发者，主导APP的设计、开发及维护。利用uni - app框架的跨平台特性，实现了多端运行，覆盖了iOS、Android、HarmonyOS。并且使用原生JS 优化了小程序、快应用平台的表现。通过Vue.js进行组件化开发，形成了一套可复用的Vue.js组件。实现商品分类、搜索、购物车、订单管理等核心商城功能。实现从试剂盒购买、扫码绑定试剂盒、检测结果反馈、报告查看的流程。使用懒加载技术和图片优化策略，减少APP加载时间，增强用户体验。通过数据缓存和本地存储，优化网络请求，提高页面响应速度。"
          },
          {
            name: "Arxiv-Float: 桌面文献速递",
            description: "基于Ollama+PyQt6的Arxiv桌面文献速递助手",
            icon: "🏬",
            link:"https://github.com/Hustle28214/arxiv-float",
            color: "#B8DF6A",
            details: "Arxiv Float 是一款面向机器人/人工智能领域研究者的桌面应用，能够实时获取 arXiv 最新论文，利用大语言模型生成中文摘要，并提供 PDF 聊天、代码仓库查询、全局技术路线图等深度功能，帮助您快速把握领域动态。"
          },
        ]
      }
    ]
  },
  
  "Archives": {
    "categories": [
      {
        "name": "计算机体系",
        "projects": [
          {
            "name": "计算机体系结构基础",
            "description": "一本开源的计组指南",
            "icon": "🏛️",
            "link": "https://foxsen.github.io/archbase/",
            "color": "#2E86AB"
          },
          {
            "name": "408考研archive",
            "description": "偏应试的一个仓库",
            "icon": "🎯",
            "link": "https://github.com/CodePanda66/CSPostgraduate-408.git",
            "color": "#A23B72"
          },
          {
            "name": "CSDiy",
            "description": "北大学长CS自学课程地图",
            "icon": "🗺️",
            "link": "https://csdiy.wiki/%E6%B7%B1%E5%BA%A6%E7%94%9F%E6%88%90%E6%A8%A1%E5%9E%8B/roadmap/",
            "color": "#F18F01"
          },
          {
            "name": "CS/EE Courses Map",
            "description": "UC Berkeley 课程地图",
            "icon": "🎓",
            "link": "https://hkn.eecs.berkeley.edu/courseguides",
            "color": "#003262"
          },
          {
            "name": "EE-CS Courses at Stanford",
            "description": "Stanford EE/CS 课程地图",
            "icon": "🌲",
            "link": "https://ee.stanford.edu/eecs",
            "color": "#8C1515"
          },
          {
            name: "ECE Courses at CMU",
            description: "CMU EE/CS 课程地图",
            icon: "📚",
            link: "https://courses.ece.cmu.edu/",
            color: "#e74c3c"
          },
        ]
      },
      {
        "name": "强化学习",
        "projects": [
          {
            "name": "动手学强化学习",
            "description": "一本开源的RL实践指南",
            "icon": "🎮",
            "link": "https://hrl.boyuai.com/",
            "color": "#00A896"
          },
          
          {
            "name": "Spinning Up",
            "description": "OpenAI 开源深度强化学习教程",
            "icon": "🎮",
            "link": "https://spinningup.openai.com/en/latest/index.html",
            "color": "#fcb70a"
          },
        ]
      },
      {
        "name": "硬件",
        "projects": [
          {
            "name": "ESP-IDF编程指南",
            "description": "ESP-IDF的官方编程指南",
            "icon": "🔌",
            "link": "https://docs.espressif.com/projects/esp-idf/zh_CN/stable/esp32/get-started/index.html",
            "color": "#D1495B"
          },
          {
            "name": "FPGA Tutorial",
            "description": "FPGA的入门指南",
            "icon": "⚡",
            "link": "https://github.com/LeiWang1999/FPGA.git",
            "color": "#6A4C93"
          },
          {
            "name": "Digital Lab",
            "description": "中科大计算机学院实验手册",
            "icon": "🔬",
            "link": "https://soc.ustc.edu.cn/Digital/2025/lab3/FPGAOL/",
            "color": "#1982C4"
          },
          {
            "name": "PA",
            "description": "南大计算机系统基础实验",
            "icon": "🛠️",
            "link": "https://ysyx.oscc.cc/docs/ics-pa/",
            "color": "#FF595E"
          }
        ]
      }
    ]
  },
  "Books": {
    "categories": [
      {
        "name": "计算机体系",
        "projects": [
          {
            "name": "计算机体系结构基础",
            "description": "一本开源的计组指南",
            "icon": "📚",
            "link": "https://foxsen.github.io/archbase/",
            "color": "#4361EE"
          }
        ]
      },
      {
        "name": "硬件",
        "projects": [
          {
            "name": "电子技术基础-模拟部分",
            "description": "模电经典教材",
            "icon": "📈",
            "link": "https://z-library.ec/book/21096687/e3ecc9/%E7%94%B5%E5%AD%90%E6%8A%80%E6%9C%AF%E5%9F%BA%E7%A1%80-%E6%A8%A1%E6%8B%9F%E9%83%A8%E5%88%86-%E7%AC%AC%E5%85%AD%E7%89%88.html",
            "color": "#F3722C"
          },
          {
            "name": "电子技术基础-数字部分",
            "description": "数电经典教材",
            "icon": "🔢",
            "link": "https://zh.z-library.ec/book/18839371/55c938/%E7%94%B5%E5%AD%90%E6%8A%80%E6%9C%AF%E5%9F%BA%E7%A1%80-%E6%95%B0%E5%AD%97%E9%83%A8%E5%88%86-%E7%AC%AC%E5%85%AD%E7%89%88.html",
            "color": "#43AA8B"
          },
          {
            "name": "电子技术基础-数字部分-学习辅导",
            "description": "知识点总结",
            "icon": "💡",
            "link": "https://icourse.club/uploads/files/552f5aed4a34696b9fa54dba6ddb6cb503f11e03.pdf",
            "color": "#F9C74F"
          },
          {
            "name": "RISC-V ISA Manual",
            "description": "RISC-V指令集手册",
            "icon": "🔄",
            "link": "https://github.com/riscv/riscv-isa-manual/releases/download/20240411/unpriv-isa-asciidoc.pdf",
            "color": "#577590"
          },
          {
            "name": "Arm v8",
            "description": "Arm v8架构手册",
            "icon": "🛡️",
            "link": "https://developer.arm.com/documentation/ddi0553/latest/",
            "color": "#277DA1"
          },
          {
            "name": "半导体物理学",
            "description": "半导体物理教材",
            "icon": "🔋",
            "link": "https://z-library.ec/book/12066614/64423b/%E5%8D%8A%E5%AF%BC%E4%BD%93%E7%89%A9%E7%90%86%E5%AD%A6-%E5%88%98%E6%81%A9%E7%A7%91-%E7%AC%AC%E4%B8%83%E7%89%88.html",
            "color": "#4D908E"
          },
          {
            "name": "模拟CMOS集成电路",
            "description": "必看经典",
            "icon": "💎",
            "link": "https://z-library.ec/book/11858644/dacdeb/%E6%A8%A1%E6%8B%9Fcmos%E9%9B%86%E6%88%90%E7%94%B5%E8%B7%AF-%E7%AC%AC%E4%BA%8C%E7%89%88-%E6%8B%89%E6%89%8E%E7%BB%B4.html",
            "color": "#F9844A"
          },
          {
            "name": "开关电源设计",
            "description": "必看经典",
            "icon": "🔋",
            "link": "https://z-library.ec/book/22344808/20882c/%E7%B2%BE%E9%80%9A%E5%BC%80%E5%85%B3%E7%94%B5%E6%BA%90%E8%AE%BE%E8%AE%A1%E7%AC%AC2%E7%89%88.html",
            "color": "#90BE6D"
          },
          {
            "name": "电磁兼容导论",
            "description": "必看经典",
            "icon": "🌀",
            "link": "https://api.eestar.com/article/share/2021/10/0640e202110231006056608.pdf",
            "color": "#577590"
          },
          {
            "name": "Bluetooth",
            "description": "蓝牙学习指南",
            "icon": "📱",
            "link": "https://www.bluetooth.com/bluetooth-resources/?types=study-guide",
            "color": "#2D7DD2"
          },
          {
            "name": "电磁场与电磁波",
            "description": "电磁经典",
            "icon": "🧲",
            "link": "https://zh.z-library.ec/book/29070128/8b1656/%E7%94%B5%E7%A3%81%E5%9C%BA%E4%B8%8E%E7%94%B5%E7%A3%81%E6%B3%A2-%E7%AC%AC2%E7%89%88.html",
            "color": "#2D7DD2"
          },
          {
            "name": "信号与系统",
            "description": "工科屠龙术",
            "icon": "📶",
            "link": "https://zh.z-library.ec/book/29070128/8b1656/%E7%94%B5%E7%A3%81%E5%9C%BA%E4%B8%8E%E7%94%B5%E7%A3%81%E6%B3%A2-%E7%AC%AC2%E7%89%88.html",
            "color": "#2D7DD2"
          },
          {
            "name":"电机、拖动及电力系统",
            "description": "写的很好的电机学教材",
            "icon":"🔥",
            "link":"https://z-library.ec/book/115915980/af03a4/%E7%94%B5%E6%9C%BA%E6%8B%96%E5%8A%A8%E5%8F%8A%E7%94%B5%E5%8A%9B%E7%B3%BB%E7%BB%9F%E5%8E%9F%E4%B9%A6%E7%AC%AC6%E7%89%88.html",
            "color":"#2D7DD2",
          },
          {
            "name":"微波工程",
            "description": "也是屠龙术",
            "icon":"📶",
            "link":"https://z-library.ec/book/24810117/3f5dfa/%E5%BE%AE%E6%B3%A2%E5%B7%A5%E7%A8%8B%E7%AC%AC%E5%9B%9B%E7%89%88.html",
            "color":"#2D7DD2",
          },
          {
            "name":"天线手册",
            "description": "业余无线电的案头书",
            "icon":"📶",
            "link":"https://z-library.ec/book/27787943/fb16a7/%E5%A4%A9%E7%BA%BF%E6%89%8B%E5%86%8C.html",
            "color":"#2D7DD2",
          }
        ]
      }
    ]
  },
  "Video": {
    "categories": [
      {
        "name": "机器人",
        "projects": [
          {
            "name": "基于强化学习的机器人控制",
            "creator": "CLEAR_LAB",
            "description": "SDM5008高等机器人控制",
            "icon": "🤖",
            "link": "https://www.bilibili.com/video/BV1wPyfYHEmE/?share_source=copy_web&vd_source=8b2bc57e71349607b55c9fde6b078ebd",
            "color": "#FF6B6B",
            "type": "系列课程",
            "episodes": "12"
          },
          {
            "name": "基于旋量理论的机器人控制",
            "creator": "CLEAR_LAB",
            "description": "MEE5114 Advanced Control for Robotics 高等机器人控制",
            "icon": "⚙️",
            "link": "https://www.bilibili.com/video/BV1CY411V74R/?share_source=copy_web&vd_source=8b2bc57e71349607b55c9fde6b078ebd",
            "color": "#4ECDC4",
            "type": "系列课程",
            "episodes": "25"
          },
          {
            "name": "深度强化学习",
            "creator": "UC Berkeley",
            "description": "CS285 Deep Reinforcement Learning",
            "icon": "🧠",
            "link": "https://youtube.com/playlist?list=PL_iWQOsE6TfVYGEGiAOMaOzzv41Jfm_Ps&si=xDIp69E3nOd4MQOo",
            "color": "#9B5DE5",
            "type": "系列课程",
            "episodes": "99"
          }
        ]
      },
      {
        "name": "物理引擎",
        "projects": [
          {
            "name": "高级物理引擎实战指南",
            "creator": "胡渊鸣",
            "description": "GAMES201：高级物理引擎实战指南2020",
            "icon": "🎮",
            "link": "https://www.bilibili.com/video/BV1ZK411H7Hc/?share_source=copy_web&vd_source=8b2bc57e71349607b55c9fde6b078ebd",
            "color": "#00BBF9",
            "type": "引擎开发",
            "episodes": "10",
            "details": "胡渊鸣，无需多言"
          },
          {
            "name": "现代计算机图形学入门",
            "creator": "闫令琪",
            "description": "GAMES101 现代计算机图形学入门",
            "icon": "🖥️",
            "link": "https://www.bilibili.com/video/BV1X7411F744/?share_source=copy_web&vd_source=8b2bc57e71349607b55c9fde6b078ebd",
            "color": "#00F5D4",
            "type": "图形学",
            "episodes": "23"
          },
          {
            "name": "现代游戏引擎",
            "creator": "王希",
            "description": "GAMES104-现代游戏引擎：从入门到实践",
            "icon": "🎯",
            "link": "https://www.bilibili.com/video/BV1oU4y1R7Km/?share_source=copy_web&vd_source=8b2bc57e71349607b55c9fde6b078ebd",
            "color": "#FB5607",
            "type": "引擎开发",
            "episodes": "23"
          }
        ]
      },
      {
        "name": "硬件与嵌入式",
        "projects": [
          {
            "name": "相控阵雷达制作",
            "creator": "Jon Kraft",
            "description": "制作一台属于自己的无人机跟踪雷达",
            "icon": "📡",
            "link": "https://youtu.be/igrN_wd_g74?si=aEBprLR-hvWHdR3i",
            "color": "#FFBE0B",
            "type": "硬件制作",
            "episodes": "50+"
          },
          {
            "name": "Andreas Spiess传感器教程",
            "creator": "Andreas Spiess",
            "description": "ESP32、Arduino等嵌入式开发实战教程，涵盖各种传感器应用",
            "icon": "🔧",
            "link": "https://www.youtube.com/c/AndreasSpiess",
            "color": "#8338EC",
            "type": "物联网",
            "episodes": "300+",
            "details": "Andreas Spiess的嵌入式系统教程，专注于ESP32、Arduino等平台的实战应用，涵盖各种传感器和通信协议。"
          }
        ]
      },
      {
        "name": "AI与机器学习",
        "projects": [
          {
            "name": "Two Minute Papers学术速递",
            "creator": "Two Minute Papers",
            "description": "用通俗语言介绍最新的AI研究论文，保持技术前沿性",
            "icon": "📰",
            "link": "https://www.youtube.com/c/KárolyZsolnai",
            "color": "#06D6A0",
            "type": "学术前沿",
            "episodes": "400+",
            "details": "Károly Zsolnai博士创建的频道，用简洁易懂的方式介绍计算机图形学、AI等领域的最新研究论文。"
          },
          {
            "name": "Agentic AI",
            "creator": "Andrew Ng",
            "description": "吴恩达智能体教程",
            "icon": "🤖",
            "link": "https://www.bilibili.com/video/BV1aaxyz8ELY/?share_source=copy_web&vd_source=8b2bc57e71349607b55c9fde6b078ebd",
            "color": "#118AB2",
            "type": "学术前沿",
            "episodes": "31"
          },
          {
            "name": "Sentdex Python机器学习",
            "creator": "Sentdex",
            "description": "Python机器学习实战教程，从基础到深度学习应用",
            "icon": "🐍",
            "link": "https://www.youtube.com/c/sentdex",
            "color": "#EF476F",
            "type": "机器学习",
            "episodes": "1000+",
            "details": "Harrison Kinsley的Python编程和机器学习教程，涵盖从基础数据分析到深度学习的各种实战项目。"
          }
        ]
      }
    ]
  }
  
};

export default function Projects() {
  const [openFolder, setOpenFolder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [readmeOpen, setReadmeOpen] = useState(false);
  const [readmeContent, setReadmeContent] = useState('');

  // 从本地存储加载README内容
  useEffect(() => {
    const savedContent = localStorage.getItem('readme-content');
    if (savedContent) {
      setReadmeContent(savedContent);
    }
  }, []);

  // 保存README内容到本地存储
  const handleReadmeContentChange = (content) => {
    setReadmeContent(content);
    localStorage.setItem('readme-content', content);
  };

  // 检测系统主题
  useEffect(() => {
    const checkDarkMode = () => {
      if (typeof window !== 'undefined') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(isDark);
      }
    };

    checkDarkMode();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);

    return () => {
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleProjectClick = (project) => {
    if (project.link && openFolder === 'Video') {
      // 对于视频项目，直接打开链接
      window.open(project.link, '_blank');
    } else {
      setSelectedProject(project);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedProject(null);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const closeAll = () => {
    setOpenFolder(null);
    setSelectedCategory(null);
    setSelectedProject(null);
  };

  // 主题样式配置
  const themeStyles = {
    background: isDarkMode ? '#1a1a1a' : 'white',
    text: isDarkMode ? 'white' : '#333',
    textSecondary: isDarkMode ? '#ccc' : '#666',
    textTertiary: isDarkMode ? '#999' : '#888',
    border: isDarkMode ? '#333' : '#e0e0e0',
    borderLight: isDarkMode ? '#444' : '#e9ecef',
    cardBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    cardHover: isDarkMode ? '#333' : '#fff',
    buttonBackground: isDarkMode ? '#333' : '#f5f5f5',
    buttonHover: isDarkMode ? '#444' : '#e0e0e0',
    shadow: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.15)',
    closeButton: isDarkMode ? '#ccc' : '#666',
  };

  return (
    <Layout title="项目" description="项目桌面环境">
      <div style={{
        padding: '30px',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 代码雨背景 */}
        <MatrixBackground />

        {/* 半透明遮罩层，让内容更清晰 */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)'
            : 'linear-gradient(45deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
          zIndex: 1,
        }} />

        {/* 调试信息 */}
        <div style={{
          position: 'fixed',
          top: '15px',
          left: '15px',
          background: 'rgba(0,0,0,0.8)',
          color: '#0F0',
          padding: '12px 16px',
          borderRadius: '8px',
          zIndex: 1000,
          fontSize: '14px',
          fontFamily: 'monospace',
          border: '1px solid #0F0',
          textShadow: '0 0 5px #0F0',
        }}>
          状态: {openFolder || '桌面'} {selectedCategory ? `> ${selectedCategory}` : ''} {selectedProject ? `> ${selectedProject.name}` : ''}
        </div>

        <div style={{
          display: 'flex',
          gap: '30px',
          padding: '30px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* 喜欢的项目 */}
          <DesktopIcon
            title="Liked"
            onClick={() => setOpenFolder('Liked')}
            isDarkMode={isDarkMode}
            icon="💖"
            color="rgba(0, 0, 0, 0)"
          />

          {/* 个人项目 */}
          <DesktopIcon
            title="Self"
            onClick={() => setOpenFolder('Self')}
            isDarkMode={isDarkMode}
            icon="📁"
            color="rgba(0, 0, 0, 0)"
          />

          {/* 新增的视频栏目 */}
          <DesktopIcon
            title="Video"
            onClick={() => setOpenFolder('Video')}
            isDarkMode={isDarkMode}
            icon="🎬"
            color="rgba(0, 0, 0, 0)"
          />

          <DesktopIcon
            title="Archives"
            onClick={() => setOpenFolder('Archives')}
            isDarkMode={isDarkMode}
            icon="🧭"
            color="rgba(0, 0, 0, 0)"
          />

          <DesktopIcon
            title="Books"
            onClick={() => setOpenFolder('Books')}
            isDarkMode={isDarkMode}
            icon="📖"
            color="rgba(0, 0, 0, 0)"
          />


          {/* README.md 文件 */}
          <DesktopIcon
            title="README.md"
            onClick={() => setReadmeOpen(true)}
            isDarkMode={isDarkMode}
            icon="📄"
            color="rgba(0, 0, 0, 0)"
          />
        </div>

        {/* README 编辑器 */}
        <ReadmeEditor
          isOpen={readmeOpen}
          onClose={() => setReadmeOpen(false)}
          isDarkMode={isDarkMode}
          content={readmeContent}
          onContentChange={handleReadmeContentChange}
        />

        {/* 文件夹视图 */}
        {openFolder && (
          <>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)',
                zIndex: 998,
              }}
              onClick={closeAll}
            />
            <div
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '85%',
                maxWidth: '1000px',
                maxHeight: '85vh',
                overflow: 'auto',
                backgroundColor: themeStyles.background,
                borderRadius: '12px',
                padding: '30px',
                zIndex: 999,
                boxShadow: `0 8px 32px ${themeStyles.shadow}`,
                border: `1px solid ${themeStyles.border}`,
              }}
            >
              {/* 头部导航 */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
                borderBottom: `2px solid ${themeStyles.border}`,
                paddingBottom: '15px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {selectedCategory && (
                    <button
                      style={{
                        background: themeStyles.buttonBackground,
                        border: `1px solid ${themeStyles.border}`,
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: themeStyles.text,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = themeStyles.buttonHover;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = themeStyles.buttonBackground;
                      }}
                      onClick={handleBackToCategories}
                    >
                      ← 返回
                    </button>
                  )}
                  {selectedProject && (
                    <button
                      style={{
                        background: themeStyles.buttonBackground,
                        border: `1px solid ${themeStyles.border}`,
                        borderRadius: '8px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        color: themeStyles.text,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = themeStyles.buttonHover;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = themeStyles.buttonBackground;
                      }}
                      onClick={handleBackToProjects}
                    >
                      ← 返回
                    </button>
                  )}
                  <h2 style={{
                    margin: 0,
                    color: themeStyles.text,
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {selectedProject ? selectedProject.name : selectedCategory || openFolder}
                  </h2>
                </div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '2rem',
                    cursor: 'pointer',
                    color: themeStyles.closeButton,
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = themeStyles.buttonBackground;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                  }}
                  onClick={closeAll}
                >
                  ×
                </button>
              </div>

              {/* 内容区域 */}
              <div>
                {!selectedCategory && !selectedProject && (
                  // 分类列表
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '25px'
                  }}>
                    {projectData[openFolder].categories.map((category, index) => (
                      <div
                        key={index}
                        style={{
                          textAlign: 'center',
                          cursor: 'pointer',
                          padding: '20px',
                          borderRadius: '12px',
                          backgroundColor: themeStyles.cardBackground,
                          border: `2px solid ${themeStyles.borderLight}`,
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() => handleCategoryClick(category.name)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = `0 8px 20px ${themeStyles.shadow}`;
                          e.currentTarget.style.backgroundColor = themeStyles.cardHover;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.backgroundColor = themeStyles.cardBackground;
                        }}
                      >
                        <div style={{
                          width: '80px',
                          height: '80px',
                          backgroundColor: '#007acc',
                          borderRadius: '12px',
                          margin: '0 auto 15px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '32px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                          {openFolder === 'Video' ? '🎥' : '📂'}
                        </div>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          marginBottom: '8px',
                          color: themeStyles.text
                        }}>
                          {category.name}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: themeStyles.textSecondary,
                          fontWeight: '500'
                        }}>
                          {category.projects.length} 个{openFolder === 'Video' ? '视频' : '项目'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCategory && !selectedProject && (
                  // 项目/视频列表
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: openFolder === 'Video'
                      ? 'repeat(auto-fill, minmax(320px, 1fr))'
                      : 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '25px'
                  }}>
                    {projectData[openFolder].categories
                      .find(cat => cat.name === selectedCategory)
                      ?.projects.map((project, index) => (
                        openFolder === 'Video' ? (
                          <VideoCard
                            key={index}
                            video={project}
                            onClick={() => handleProjectClick(project)}
                            isDarkMode={isDarkMode}
                          />
                        ) : (
                          <div
                            key={index}
                            style={{
                              padding: '20px',
                              borderRadius: '12px',
                              backgroundColor: themeStyles.cardBackground,
                              border: `2px solid ${project.color}`,
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => handleProjectClick(project)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-5px)';
                              e.currentTarget.style.boxShadow = `0 8px 25px ${themeStyles.shadow}`;
                              e.currentTarget.style.backgroundColor = themeStyles.cardHover;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'none';
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.backgroundColor = themeStyles.cardBackground;
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                              <div style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: project.color,
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '24px',
                                marginRight: '15px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                              }}>
                                {project.icon}
                              </div>
                              <h3 style={{
                                margin: 0,
                                fontSize: '20px',
                                color: themeStyles.text,
                                fontWeight: 'bold'
                              }}>
                                {project.name}
                              </h3>
                            </div>
                            <p style={{
                              fontSize: '14px',
                              color: themeStyles.textSecondary,
                              margin: 0,
                              lineHeight: '1.5'
                            }}>
                              {project.description}
                            </p>
                          </div>
                        )
                      ))}
                  </div>
                )}

                {selectedProject && (
                  // 项目详情
                  <div style={{ padding: '15px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '25px',
                      padding: '25px',
                      backgroundColor: themeStyles.cardBackground,
                      borderRadius: '12px',
                      border: `2px solid ${selectedProject.color}`
                    }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: selectedProject.color,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '32px',
                        marginRight: '20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}>
                        {selectedProject.icon}
                      </div>
                      <div>
                        <h3 style={{
                          margin: '0 0 10px 0',
                          color: themeStyles.text,
                          fontSize: '28px',
                          fontWeight: 'bold'
                        }}>
                          {selectedProject.name}
                        </h3>
                        <p style={{
                          margin: 0,
                          color: themeStyles.textSecondary,
                          fontSize: '16px',
                          fontWeight: '500'
                        }}>
                          {selectedProject.description}
                        </p>
                      </div>
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                      <h4 style={{
                        color: themeStyles.text,
                        marginBottom: '15px',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        {openFolder === 'Video' ? '视频详情' : '项目详情'}
                      </h4>
                      <p style={{
                        lineHeight: '1.7',
                        color: themeStyles.textTertiary,
                        backgroundColor: themeStyles.cardBackground,
                        padding: '20px',
                        borderRadius: '8px',
                        fontSize: '16px',
                        border: `1px solid ${themeStyles.borderLight}`,
                        whiteSpace: 'pre-line'
                      }}>
                        {selectedProject.details}
                      </p>
                    </div>

                    {selectedProject.link && (
                      <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                          style={{
                            backgroundColor: selectedProject.color,
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'none';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                          }}
                          onClick={() => window.open(selectedProject.link, '_blank')}
                        >
                          {openFolder === 'Video' ? '观看视频' : '查看项目'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
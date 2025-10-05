import React from 'react';
import styles from './DesktopIcon.module.css';
import Link from '@docusaurus/Link';
import { useColorMode } from '@docusaurus/theme-common';

/**
 * 桌面图标风格的项目组件
 * @param {Object} props 组件属性
 * @param {string} props.title 项目标题
 * @param {string} props.description 项目描述
 * @param {string} props.icon 图标名称或URL
 * @param {string} props.link 项目链接
 * @param {string} props.iconDark 暗色模式下的图标（可选）
 * @param {string} props.color 图标背景颜色（可选）
 * @returns {JSX.Element} 桌面图标组件
 */
export default function DesktopIcon({ 
  title, 
  description, 
  icon, 
  link, 
  iconDark,
  color = '#4a6cf7'
}) {
  const { colorMode } = useColorMode();
  const isDarkTheme = colorMode === 'dark';
  
  // 如果提供了暗色模式图标并且当前是暗色模式，则使用暗色图标
  const iconSrc = isDarkTheme && iconDark ? iconDark : icon;
  
  // 生成随机的渐变背景色（如果没有提供颜色）
  const bgColor = color || `hsl(${Math.random() * 360}, 70%, 65%)`;
  const bgStyle = {
    backgroundColor: bgColor,
    backgroundImage: `linear-gradient(135deg, ${bgColor} 0%, ${adjustColor(bgColor, -20)} 100%)`
  };

  return (
    <Link to={link} className={styles.iconLink}>
      <div className={styles.desktopIcon}>
        <div className={styles.iconContainer} style={bgStyle}>
          {iconSrc ? (
            <img 
              src={iconSrc} 
              alt={title} 
              className={styles.icon} 
            />
          ) : (
            <div className={styles.placeholderIcon}>
              {title.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.iconTitle}>{title}</div>
        {description && <div className={styles.iconDescription}>{description}</div>}
      </div>
    </Link>
  );
}

/**
 * 调整颜色的亮度
 * @param {string} color - HEX或HSL颜色字符串
 * @param {number} amount - 调整量（正数增加亮度，负数减少亮度）
 * @returns {string} 调整后的颜色
 */
function adjustColor(color, amount) {
  // 如果是HSL格式
  if (color.includes('hsl')) {
    const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (hslMatch) {
      const h = parseInt(hslMatch[1]);
      const s = parseInt(hslMatch[2]);
      const l = Math.max(0, Math.min(100, parseInt(hslMatch[3]) + amount));
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
  }
  
  // 如果是HEX格式或其他，返回稍微暗一点的颜色
  return color;
}

/**
 * 项目分类组件，以桌面图标方式展示项目
 * @param {Object} props 组件属性
 * @param {string} props.title 分类标题
 * @param {string} props.description 分类描述
 * @param {Array} props.projects 项目列表
 * @returns {JSX.Element} 项目分类组件
 */
export function ProjectIcons({ title, description, projects }) {
  return (
    <div className={styles.projectCategory}>
      <h2 className={styles.categoryTitle}>{title}</h2>
      {description && <p className={styles.categoryDescription}>{description}</p>}
      
      <div className={styles.iconsGrid}>
        {projects.map((project, index) => (
          <DesktopIcon
            key={index}
            title={project.title}
            description={project.description}
            icon={project.icon}
            iconDark={project.iconDark}
            link={project.link}
            color={project.color}
          />
        ))}
      </div>
    </div>
  );
}
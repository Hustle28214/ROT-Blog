// src/components/SkillGraph/SkillNode.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SkillNode = ({
    node,
    onClick,
    onHover,
    isSelected,
    isHovered
}) => {
    const getNodeColor = () => {
        const colorMap = {
            Computering: '#3B82F6',
            Robotics: '#10B981',
            Mathematics: '#8B5CF6',
            Mechanics: '#F59E0B',
            Electronic: '#EF4444',
            Control: '#EC4899',
            Machinery: '#06B6D4',
            Sensor: '#84CC16',
            Paper: '#F97316',
            PLC: '#6366F1'
        };
        return colorMap[node.category] || node.color || '#6B7280';
    };

    const getNodeSize = () => {
        // 基于节点类型和级别的大小
        const baseSizes = {
            category: 25,
            subcategory: 18,
            skill: 12
        };

        const levelMultipliers = {
            beginner: 0.8,
            intermediate: 1.0,
            advanced: 1.2,
            expert: 1.4
        };

        const baseSize = baseSizes[node.type] || 15;
        const multiplier = levelMultipliers[node.level] || 1.0;

        return baseSize * multiplier;
    };

    const getNodeEffects = () => {
        const color = getNodeColor();

        // 选中状态的光晕效果
        if (isSelected) {
            return {
                filter: `drop-shadow(0 0 8px ${color}80)`,
                stroke: '#000',
                strokeWidth: 3
            };
        }

        // 悬停状态的光晕效果
        if (isHovered) {
            return {
                filter: `drop-shadow(0 0 6px ${color}60)`,
                stroke: '#374151',
                strokeWidth: 2
            };
        }

        // 默认状态的微光晕
        return {
            filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))`,
            stroke: 'transparent',
            strokeWidth: 1
        };
    };

    const nodeVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.6
            }
        },
        hover: {
            scale: 1.3,
            transition: { duration: 0.2 }
        },
        selected: {
            scale: 1.4,
            transition: { duration: 0.2 }
        }
    };

    const nodeSize = getNodeSize();
    const effects = getNodeEffects();

    return (
        <motion.g
            className="skill-node"
            variants={nodeVariants}
            initial="initial"
            animate={isSelected ? "selected" : isHovered ? "hover" : "animate"}
            whileHover="hover"
            onClick={(e) => {
                e.stopPropagation();
                onClick(node);
            }}
            onMouseEnter={() => onHover(node)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: 'pointer' }}
            transform={`translate(${node.x}, ${node.y})`}
        >
            {/* 外圈光晕 */}
            {isSelected && (
                <circle
                    r={nodeSize + 8}
                    fill="none"
                    stroke={getNodeColor()}
                    strokeWidth="2"
                    strokeOpacity="0.3"
                />
            )}

            {/* 主节点 */}
            <circle
                r={nodeSize}
                fill={getNodeColor()}
                stroke={effects.stroke}
                strokeWidth={effects.strokeWidth}
                style={{ filter: effects.filter }}
                className="node-circle"
            />

            {/* 进度环（如果有进度） */}
            {node.progress > 0 && node.progress < 100 && (
                <circle
                    r={nodeSize + 3}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray={`${(node.progress / 100) * 2 * Math.PI * (nodeSize + 3)} ${2 * Math.PI * (nodeSize + 3)}`}
                    transform="rotate(-90)"
                />
            )}

            {/* 状态指示器 */}
            {node.status === 'mastered' && (
                <circle
                    r={nodeSize / 2}
                    fill="#10B981"
                    stroke="#fff"
                    strokeWidth="2"
                    filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))"
                />
            )}

            {node.status === 'learning' && (
                <circle
                    r={nodeSize / 3}
                    fill="#F59E0B"
                    stroke="#fff"
                    strokeWidth="1.5"
                />
            )}

            {/* 节点标签 */}
            <motion.text
                textAnchor="middle"
                dy={nodeSize + 20}
                fontSize={getTextSize(node)}
                fontWeight={node.type === 'category' ? 'bold' : 'normal'}
                fill={isSelected ? "#000" : "#374151"}
                initial={{ opacity: 0, y: 5 }}
                animate={{
                    opacity: isSelected || isHovered || node.type === 'category' ? 1 : 0.7,
                    y: 0
                }}
                transition={{ duration: 0.3 }}
                className="node-label"
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    textShadow: isSelected ? '0 0 4px white, 0 0 4px white' : '0 0 2px white'
                }}
            >
                {node.title}
            </motion.text>

            {/* 级别标签 */}
            {(isSelected || isHovered) && node.level && (
                <motion.text
                    textAnchor="middle"
                    dy={nodeSize + 35}
                    fontSize="9"
                    fill="#6B7280"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="level-label"
                    style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                        textShadow: '0 0 2px white'
                    }}
                >
                    {node.level}
                </motion.text>
            )}
        </motion.g>
    );
};

// 文字大小计算
const getTextSize = (node) => {
    switch (node.type) {
        case 'category': return 14;
        case 'subcategory': return 12;
        case 'skill': return 10;
        default: return 11;
    }
};

export default SkillNode;
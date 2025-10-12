// src/components/SkillGraph/ForceDirectedGraph.jsx
import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useForceLayout } from '../../hooks/useForceLayout';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';

// ✅ 单独提取 NodeComponent 并用 React.memo 优化
const NodeComponent = React.memo(({
    node,
    isSelected,
    isHovered,
    onNodeClick,
    onNavigateDoc,
    onHover
}) => {
    const baseSize = getNodeSize(node);
    const hoverSize = isHovered ? baseSize * 1.3 : baseSize;

    return (
        <g
            className="node-group"
            onClick={(e) => onNodeClick(node, e)}
            onDoubleClick={() => onNavigateDoc(node.docPath)}
            onMouseEnter={() => onHover(node, true)}
            onMouseLeave={() => onHover(node, false)}
            style={{ cursor: 'pointer' }}
        >
            {/* 选中光环 */}
            {isSelected && (
                <circle
                    r={hoverSize + 6}
                    fill="none"
                    stroke={getNodeColor(node)}
                    strokeWidth="2"
                    strokeOpacity="0.4"
                />
            )}

            {/* 节点阴影 */}
            <circle
                r={hoverSize}
                fill={getNodeColor(node)}
                filter="url(#node-shadow)"
                opacity={0.8}
            />

            {/* 节点主体 */}
            <circle
                r={hoverSize - 1}
                fill={getNodeColor(node)}
                stroke="#ffffff"
                strokeWidth={isSelected ? 3 : 2}
            />

            {/* 高光 */}
            <circle
                r={hoverSize - 4}
                fill="url(#node-gradient)"
                opacity="0.3"
            />

            {/* 进度环 */}
            {node.progress > 0 && node.progress < 100 && (
                <circle
                    r={hoverSize + 2}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeDasharray={`${(node.progress / 100) * 2 * Math.PI * (hoverSize + 2)} ${2 * Math.PI * (hoverSize + 2)}`}
                    transform="rotate(-90)"
                />
            )}

            {/* 掌握状态 */}
            {node.status === 'mastered' && (
                <circle
                    r={hoverSize / 2.5}
                    fill="#10B981"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                />
            )}

            {/* 节点标签 */}
            <text
                textAnchor="middle"
                dy={hoverSize + 16}
                fontSize={getTextSize(node)}
                fontWeight={node.type === 'category' ? 'bold' : 'normal'}
                className="node-label"
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.3)'
                }}
            >
                {node.title}
            </text>

            {/* 级别标签 */}
            {(isSelected || isHovered) && node.level && node.type === 'skill' && (
                <text
                    textAnchor="middle"
                    dy={hoverSize + 30}
                    fontSize="9"
                    className="node-level-label"
                    fontWeight="500"
                    style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                        textShadow: '0 1px 1px rgba(0,0,0,0.3)'
                    }}
                >
                    {node.level}
                </text>
            )}
        </g>
    );
}, (prevProps, nextProps) => {
    // 只有关键属性变化才重渲染
    return (
        prevProps.node.id === nextProps.node.id &&
        prevProps.isSelected === nextProps.isSelected &&
        prevProps.isHovered === nextProps.isHovered
    );
});

const ForceDirectedGraph = ({
    nodes,
    links,
    width = 1600,
    height = 1200,
    selectedNode,
    hoveredNode,
    centerOnCategory,
    onNodeClick,
    onNavigateDoc,
    onSelectNode,
    onHoverNode
}) => {
    const { simulation, stopSimulation, restartSimulation, fixNode, unfixNode } = useForceLayout(nodes, links, width, height);
    const [isSimulationRunning, setIsSimulationRunning] = useState(true);
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
    const [filteredCategory, setFilteredCategory] = useState(null);

    const svgRef = useRef(null);
    const zoomContainerRef = useRef(null);
    const zoomBehaviorRef = useRef(null);
    const isDragging = useRef(false);
    const nodeRefs = useRef(new Map());
    const linkRefs = useRef(new Map());

    // 过滤节点和链接
    const { displayNodes, displayLinks, categoryCenter } = useMemo(() => {
        if (!filteredCategory) {
            const validNodes = nodes.map(node => ({
                ...node,
                x: node.x ?? width / 2 + (Math.random() - 0.5) * 400,
                y: node.y ?? height / 2 + (Math.random() - 0.5) * 400
            }));

            const validLinks = links.filter(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return validNodes.some(n => n.id === sourceId) && validNodes.some(n => n.id === targetId);
            });

            return {
                displayNodes: validNodes,
                displayLinks: validLinks,
                categoryCenter: null
            };
        }

        const categoryNodes = nodes.filter(node =>
            node.category === filteredCategory ||
            (node.type === 'category' && node.id === filteredCategory)
        );

        const getRelatedNodes = (startNodes, allNodes, allLinks) => {
            const relatedNodeIds = new Set(startNodes.map(n => n.id));
            let changed = true;

            while (changed) {
                changed = false;
                allLinks.forEach(link => {
                    const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                    const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                    const sourceInSet = relatedNodeIds.has(sourceId);
                    const targetInSet = relatedNodeIds.has(targetId);

                    if (sourceInSet && !targetInSet) {
                        relatedNodeIds.add(targetId);
                        changed = true;
                    } else if (!sourceInSet && targetInSet) {
                        relatedNodeIds.add(sourceId);
                        changed = true;
                    }
                });
            }

            return allNodes.filter(node => relatedNodeIds.has(node.id));
        };

        const filteredNodes = getRelatedNodes(categoryNodes, nodes, links);
        const validNodes = filteredNodes.map(node => ({
            ...node,
            x: node.x ?? width / 2 + (Math.random() - 0.5) * 400,
            y: node.y ?? height / 2 + (Math.random() - 0.5) * 400
        }));

        const validLinks = links.filter(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return validNodes.some(n => n.id === sourceId) && validNodes.some(n => n.id === targetId);
        });

        let center = null;
        const mainCategoryNode = validNodes.find(node =>
            (node.type === 'category' && node.category === filteredCategory) ||
            (node.type === 'category' && node.id === filteredCategory)
        );

        if (mainCategoryNode) {
            center = { x: mainCategoryNode.x, y: mainCategoryNode.y };
        } else if (validNodes.length > 0) {
            const sumX = validNodes.reduce((sum, node) => sum + (node.x || 0), 0);
            const sumY = validNodes.reduce((sum, node) => sum + (node.y || 0), 0);
            center = {
                x: sumX / validNodes.length,
                y: sumY / validNodes.length
            };
        }

        return {
            displayNodes: validNodes,
            displayLinks: validLinks,
            categoryCenter: center
        };
    }, [nodes, links, width, height, filteredCategory]);

    // 处理 centerOnCategory
    useEffect(() => {
        if (centerOnCategory && centerOnCategory !== filteredCategory) {
            setFilteredCategory(centerOnCategory);
            stopSimulation();
        }
    }, [centerOnCategory, filteredCategory, stopSimulation]);

    // 自动居中分类
    useEffect(() => {
        if (categoryCenter && zoomBehaviorRef.current && svgRef.current) {
            const svg = select(svgRef.current);
            setTimeout(() => {
                const bounds = calculateGraphBounds(displayNodes);
                const graphWidth = bounds.maxX - bounds.minX;
                const graphHeight = bounds.maxY - bounds.minY;
                const scale = Math.min(
                    (width - 100) / graphWidth,
                    (height - 100) / graphHeight,
                    2
                );
                const targetX = width / 2 - categoryCenter.x * scale;
                const targetY = height / 2 - categoryCenter.y * scale;
                svg.transition()
                    .duration(1000)
                    .call(zoomBehaviorRef.current.transform, zoomIdentity
                        .translate(targetX, targetY)
                        .scale(scale)
                    );
            }, 500);
        }
    }, [categoryCenter, displayNodes, width, height]);

    // 初始化缩放
    useEffect(() => {
        if (!svgRef.current || !zoomContainerRef.current || displayNodes.length === 0) return;

        const svg = select(svgRef.current);
        const zoomContainer = select(zoomContainerRef.current);

        svg.on('.zoom', null);
        const zoomBehavior = zoom()
            .scaleExtent([0.1, 4])
            .on('start', () => {
                isDragging.current = true;
                svg.style('cursor', 'grabbing');
            })
            .on('zoom', (event) => {
                const { x, y, k } = event.transform;
                setTransform({ x, y, k });
                zoomContainer.attr('transform', `translate(${x},${y}) scale(${k})`);
            })
            .on('end', () => {
                isDragging.current = false;
                svg.style('cursor', 'grab');
            });

        zoomBehaviorRef.current = zoomBehavior;
        svg.call(zoomBehavior)
            .on('dblclick.zoom', null)
            .style('cursor', 'grab');

        if (!filteredCategory) {
            setTimeout(() => {
                try {
                    const bounds = calculateGraphBounds(displayNodes);
                    const initialTransform = calculateInitialTransform(bounds, width, height);
                    svg.call(zoomBehavior.transform, zoomIdentity
                        .translate(initialTransform.x, initialTransform.y)
                        .scale(initialTransform.k)
                    );
                } catch (error) {
                    console.error('Initial transform error:', error);
                    svg.call(zoomBehavior.transform, zoomIdentity
                        .translate(width / 2, height / 2)
                        .scale(0.8)
                    );
                }
            }, 300);
        }
    }, [displayNodes, width, height, filteredCategory]);

    // ✅ 核心修复：ticked 中检查 DOM 是否仍连接
    useEffect(() => {
        if (!simulation) return;

        const ticked = () => {
            // 更新链接
            displayLinks.forEach(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                const sourceNode = simulation.nodes().find(n => n.id === sourceId);
                const targetNode = simulation.nodes().find(n => n.id === targetId);
                if (sourceNode && targetNode) {
                    const sx = isValidNumber(sourceNode.fx) ? sourceNode.fx : sourceNode.x;
                    const sy = isValidNumber(sourceNode.fy) ? sourceNode.fy : sourceNode.y;
                    const tx = isValidNumber(targetNode.fx) ? targetNode.fx : targetNode.x;
                    const ty = isValidNumber(targetNode.fy) ? targetNode.fy : targetNode.y;

                    if (isValidNumber(sx) && isValidNumber(sy) && isValidNumber(tx) && isValidNumber(ty)) {
                        const lineId = `link-${link.id || `${sourceId}-${targetId}`}`;
                        const line = document.getElementById(lineId);
                        if (line) {
                            line.setAttribute('x1', sx);
                            line.setAttribute('y1', sy);
                            line.setAttribute('x2', tx);
                            line.setAttribute('y2', ty);
                        }
                    }
                }
            });

            // 更新节点
            simulation.nodes().forEach(node => {
                const posX = isValidNumber(node.fx) ? node.fx : node.x;
                const posY = isValidNumber(node.fy) ? node.fy : node.y;

                if (isValidNumber(posX) && isValidNumber(posY)) {
                    const nodeEl = nodeRefs.current.get(node.id);
                    // ✅ 关键：检查元素是否仍在 DOM 中
                    if (nodeEl && nodeEl.isConnected) {
                        nodeEl.setAttribute('transform', `translate(${posX},${posY})`);
                    }
                }
            });
        };

        simulation.on('tick', ticked);
        return () => simulation.on('tick', null);
    }, [simulation, displayLinks]);

    // 检查模拟状态
    useEffect(() => {
        if (simulation && displayNodes.length > 0) {
            const hasValidPositions = simulation.nodes().some(node =>
                isValidNumber(node.x) && isValidNumber(node.y) &&
                !(Math.abs(node.x - width / 2) < 1 && Math.abs(node.y - height / 2) < 1)
            );
            if (hasValidPositions) {
                setIsSimulationRunning(false);
            }
        }
    }, [simulation, displayNodes, width, height]);

    // 重置视图
    const resetView = useCallback(() => {
        if (svgRef.current && displayNodes.length > 0 && zoomBehaviorRef.current) {
            const svg = select(svgRef.current);
            if (filteredCategory) {
                setFilteredCategory(null);
                setTimeout(() => {
                    const bounds = calculateGraphBounds(nodes);
                    const initialTransform = calculateInitialTransform(bounds, width, height);
                    svg.transition()
                        .duration(750)
                        .call(zoomBehaviorRef.current.transform, zoomIdentity
                            .translate(initialTransform.x, initialTransform.y)
                            .scale(initialTransform.k)
                        );
                }, 100);
            } else {
                try {
                    const bounds = calculateGraphBounds(displayNodes);
                    const initialTransform = calculateInitialTransform(bounds, width, height);
                    svg.transition()
                        .duration(750)
                        .call(zoomBehaviorRef.current.transform, zoomIdentity
                            .translate(initialTransform.x, initialTransform.y)
                            .scale(initialTransform.k)
                        );
                } catch (error) {
                    console.error('Reset view error:', error);
                    svg.transition()
                        .duration(750)
                        .call(zoomBehaviorRef.current.transform, zoomIdentity
                            .translate(0, 0)
                            .scale(1)
                        );
                }
            }
        }
    }, [displayNodes, nodes, width, height, filteredCategory]);

    // 节点点击
    const handleNodeClick = useCallback((node, event) => {
        if (!isDragging.current) {
            event.stopPropagation();
            stopSimulation(true);
            if (node.type === 'category') {
                setFilteredCategory(node.category || node.id);
            }
            onSelectNode(node);
        }
        isDragging.current = false;
    }, [stopSimulation, onSelectNode]);

    // 背景点击
    const handleBackgroundClick = useCallback((event) => {
        if (!isDragging.current && event.target === event.currentTarget) {
            stopSimulation();
            onSelectNode(null);
        }
        isDragging.current = false;
    }, [stopSimulation, onSelectNode]);

    // 清除分类过滤
    const clearCategoryFilter = useCallback(() => {
        setFilteredCategory(null);
        onSelectNode(null);
    }, [onSelectNode]);

    // 悬停处理
    const handleNodeHover = useCallback((node, isHovering) => {
        if (isHovering) {
            fixNode(node.id);
            onHoverNode(node);
        } else {
            unfixNode(node.id);
            onHoverNode(null);
        }
    }, [onHoverNode, fixNode, unfixNode]);

    return (
        <div className="force-graph-container">
            <div className="graph-controls">
                <button onClick={resetView} className="control-btn" title="重置视图 (R)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                    </svg>
                </button>

                {filteredCategory && (
                    <button onClick={clearCategoryFilter} className="control-btn back-btn" title="返回全部视图 (ESC)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                    </button>
                )}

                <div className="zoom-info">
                    缩放: {Math.round(transform.k * 100)}%
                    {filteredCategory && ` | 查看: ${filteredCategory}`}
                </div>

                {isSimulationRunning && (
                    <div className="simulation-indicator">
                        布局计算中...
                    </div>
                )}

                <div className="usage-tip">
                    提示: 拖拽移动，滚轮缩放，R重置，ESC返回
                </div>
            </div>

            <svg
                ref={svgRef}
                width={width}
                height={height}
                className="skill-graph force-directed"
                style={{
                    background: 'var(--ifm-background-color)',
                    cursor: 'grab'
                }}
                onClick={handleBackgroundClick}
            >
                <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <path d="M 50 0 L 0 0 0 50" fill="none" stroke="var(--ifm-color-emphasis-200)" strokeWidth="0.5" />
                    </pattern>
                    <filter id="node-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
                    </filter>
                    <radialGradient id="node-gradient" cx="0.3" cy="0.3" r="0.7">
                        <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                    </radialGradient>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />
                <rect width="100%" height="100%" fill="transparent" style={{ cursor: 'grab' }} />

                <g ref={zoomContainerRef}>
                    {/* 链接 */}
                    {displayLinks.map((link) => {
                        const id = link.id || `${typeof link.source === 'object' ? link.source.id : link.source}-${typeof link.target === 'object' ? link.target.id : link.target}`;
                        return (
                            <line
                                key={`link-${id}`}
                                id={`link-${id}`}
                                stroke={getLinkColor(link)}
                                strokeWidth={1}
                                strokeDasharray={link.type === 'prerequisite' ? '5,5' : 'none'}
                                opacity={0.4}
                                className="graph-link"
                            />
                        );
                    })}

                    {/* 节点 - 使用优化后的组件 */}
                    {displayNodes.map(node => {
                        const isSelected = selectedNode?.id === node.id;
                        const isHovered = hoveredNode?.id === node.id;
                        return (
                            <g
                                key={node.id}
                                ref={el => {
                                    if (el) {
                                        nodeRefs.current.set(node.id, el);
                                    } else {
                                        nodeRefs.current.delete(node.id);
                                    }
                                }}
                            >
                                <NodeComponent
                                    node={node}
                                    isSelected={isSelected}
                                    isHovered={isHovered}
                                    onNodeClick={handleNodeClick}
                                    onNavigateDoc={onNavigateDoc}
                                    onHover={handleNodeHover}
                                />
                            </g>
                        );
                    })}
                </g>

                <text
                    x={10}
                    y={height - 10}
                    fontSize={11}
                    className="usage-hint"
                >
                    {filteredCategory
                        ? `查看 ${filteredCategory} 分类 • 拖拽移动 • 滚轮缩放 • ESC返回全部视图`
                        : '拖拽移动 • 滚轮缩放 • 点击分类节点查看详情 • 双击节点查看文档'
                    }
                </text>

                {displayNodes.length === 0 && nodes.length > 0 && (
                    <text
                        x={width / 2}
                        y={height / 2}
                        textAnchor="middle"
                        fontSize={16}
                        className="error-message"
                    >
                        无法计算节点位置，请尝试刷新页面
                    </text>
                )}
            </svg>
        </div>
    );
};

// 工具函数（保持不变）
const getNodeColor = (node) => {
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

const getNodeSize = (node) => {
    const baseSizes = {
        category: 28,
        subcategory: 20,
        skill: 14
    };
    const levelMultipliers = {
        beginner: 0.9,
        intermediate: 1.0,
        advanced: 1.1,
        expert: 1.2
    };
    const baseSize = baseSizes[node.type] || 16;
    const multiplier = levelMultipliers[node.level] || 1.0;
    return baseSize * multiplier;
};

const getTextSize = (node) => {
    switch (node.type) {
        case 'category': return 14;
        case 'subcategory': return 12;
        case 'skill': return 10;
        default: return 11;
    }
};

const getLinkColor = (link) => {
    switch (link.type) {
        case 'prerequisite': return '#EF4444';
        case 'contains': return '#9CA3AF';
        case 'related': return '#8B5CF6';
        case 'applies_to': return '#10B981';
        default: return '#6B7280';
    }
};

const calculateGraphBounds = (nodes) => {
    if (nodes.length === 0) return { minX: 0, maxX: 1000, minY: 0, maxY: 800 };
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(node => {
        if (isValidNumber(node.x) && isValidNumber(node.y)) {
            minX = Math.min(minX, node.x);
            maxX = Math.max(maxX, node.x);
            minY = Math.min(minY, node.y);
            maxY = Math.max(maxY, node.y);
        }
    });
    const padding = 100;
    if (isFinite(minX)) {
        minX -= padding;
        maxX += padding;
        minY -= padding;
        maxY += padding;
    } else {
        minX = 0; maxX = 1000; minY = 0; maxY = 800;
    }
    return { minX, maxX, minY, maxY };
};

const calculateInitialTransform = (bounds, width, height) => {
    const { minX, maxX, minY, maxY } = bounds;
    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    if (graphWidth <= 0 || graphHeight <= 0) {
        return { x: width / 2, y: height / 2, k: 0.8 };
    }
    const padding = 80;
    const scale = Math.min(
        Math.max(0.1, (width - padding * 2) / graphWidth),
        Math.max(0.1, (height - padding * 2) / graphHeight),
        1
    );
    const translateX = (width - graphWidth * scale) / 2 - minX * scale;
    const translateY = (height - graphHeight * scale) / 2 - minY * scale;
    return {
        x: isFinite(translateX) ? translateX : 0,
        y: isFinite(translateY) ? translateY : 0,
        k: isFinite(scale) ? scale : 0.8
    };
};

const isValidNumber = (value) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export default ForceDirectedGraph;
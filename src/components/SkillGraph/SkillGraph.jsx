// src/components/SkillGraph/SkillGraph.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { useSkillData } from '../../hooks/useSkillData';
import ForceDirectedGraph from './ForceDirectedGraph';
import './skill-graph.css';

const SkillGraph = ({
    width = 1600,
    height = 1200,
    onNodeClick
}) => {
    const { nodes: allNodes, links: allLinks } = useSkillData();
    const [selectedNode, setSelectedNode] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [centerOnCategory, setCenterOnCategory] = useState(null);

    console.log('SkillGraph data:', { nodes: allNodes.length, links: allLinks.length });

    // 获取所有分类
    const categories = useMemo(() => {
        const cats = [...new Set(allNodes.map(node => node.category))].filter(Boolean);
        return ['all', ...cats];
    }, [allNodes]);

    // 根据选择的分类过滤节点和链接
    const { filteredNodes, filteredLinks } = useMemo(() => {
        if (selectedCategory === 'all') {
            return {
                filteredNodes: allNodes,
                filteredLinks: allLinks,
                categoryNodes: allNodes.filter(n => n.type === 'category')
            };
        }

        // 只显示选中分类的节点
        const categoryNodes = allNodes.filter(node =>
            node.category === selectedCategory
        );

        // 获取这些节点的ID
        const categoryNodeIds = new Set(categoryNodes.map(node => node.id));

        // 只保留连接都在当前分类内的链接
        const categoryLinks = allLinks.filter(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            return categoryNodeIds.has(sourceId) && categoryNodeIds.has(targetId);
        });

        return {
            filteredNodes: categoryNodes,
            filteredLinks: categoryLinks,
            categoryNodes: [categoryNodes.find(n => n.type === 'category' && n.category === selectedCategory)].filter(Boolean)
        };
    }, [allNodes, allLinks, selectedCategory]);

    const handleNodeClick = useCallback((node) => {
        console.log('Node clicked:', node);
        setSelectedNode(node);
        onNodeClick?.(node);
    }, [onNodeClick]);

    const navigateToDoc = useCallback((docPath) => {
        if (!docPath) {
            console.warn('No document path provided');
            return;
        }
        console.log('Navigating to:', docPath);

        // 移除可能的文件扩展名，确保路径正确
        const cleanPath = docPath.replace(/\.mdx?$/, '');
        window.location.href = `/docs/${cleanPath}`;
    }, []);

    const handleHoverNode = useCallback((node) => {
        setHoveredNode(node);
    }, []);

    const handleCategoryChange = useCallback((category) => {
        setSelectedCategory(category);
        setSelectedNode(null);
        setCenterOnCategory(category === 'all' ? null : category);
    }, []);

    return (
        <div className="skill-graph-container">
            {/* 控制面板 */}
            <div className="skill-graph-controls">
                <div className="category-filter">
                    <span className="filter-label">分类筛选:</span>
                    <div className="category-buttons">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => handleCategoryChange(category)}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                style={category !== 'all' ? {
                                    backgroundColor: getCategoryColor(category) + '20',
                                    color: getCategoryColor(category),
                                    borderColor: getCategoryColor(category)
                                } : {}}
                            >
                                {category === 'all' ? '全部' : category}
                                {category !== 'all' && (
                                    <span className="node-count">
                                        {allNodes.filter(n => n.category === category).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="skill-graph-stats">
                    <span>节点: {filteredNodes.length}</span>
                    <span>链接: {filteredLinks.length}</span>
                    {selectedCategory !== 'all' && <span>分类: {selectedCategory}</span>}
                    {selectedNode && <span>选中: {selectedNode.title}</span>}
                </div>
            </div>

            {/* 力导向图 */}
            <ForceDirectedGraph
                nodes={filteredNodes}
                links={filteredLinks}
                width={width}
                height={height}
                selectedNode={selectedNode}
                hoveredNode={hoveredNode}
                centerOnCategory={centerOnCategory}
                onNodeClick={handleNodeClick}
                onNavigateDoc={navigateToDoc}
                onSelectNode={setSelectedNode}
                onHoverNode={handleHoverNode}
            />

            {/* 节点详情面板 */}
            {selectedNode && (
                <NodeDetailPanel
                    node={selectedNode}
                    onClose={() => setSelectedNode(null)}
                    onNavigate={() => navigateToDoc(selectedNode.docPath)}
                />
            )}
        </div>
    );
};

// 节点详情面板组件
const NodeDetailPanel = ({ node, onClose, onNavigate }) => {
    const hasValidDoc = node.docPath && node.type !== 'category';

    return (
        <div className="node-detail-panel">
            <div className="panel-header">
                <h3>{node.title}</h3>
                <button onClick={onClose} className="close-btn">×</button>
            </div>

            <div className="panel-content">
                <div className="node-meta">
                    <span
                        className="category-tag"
                        style={{
                            backgroundColor: (node.color || getCategoryColor(node.category)) + '20',
                            color: node.color || getCategoryColor(node.category)
                        }}
                    >
                        {node.category}
                    </span>
                    {node.subcategory && (
                        <span className="subcategory-tag">{node.subcategory}</span>
                    )}
                    <span className={`level-badge ${node.level}`}>{node.level}</span>
                    <span className={`type-badge ${node.type}`}>{node.type}</span>
                </div>

                {node.description && (
                    <div className="node-description">
                        {node.description}
                    </div>
                )}

                {node.tags && node.tags.length > 0 && (
                    <div className="node-tags">
                        <span className="tags-label">标签:</span>
                        {node.tags.map(tag => (
                            <span key={tag} className="tag">{tag}</span>
                        ))}
                    </div>
                )}

                {node.progress !== undefined && (
                    <div className="progress-section">
                        <span className="progress-label">进度:</span>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${node.progress}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{node.progress}%</span>
                    </div>
                )}

                {hasValidDoc ? (
                    <button onClick={onNavigate} className="navigate-btn">
                        查看文档
                    </button>
                ) : (
                    <button className="navigate-btn disabled" disabled>
                        无对应文档
                    </button>
                )}
            </div>
        </div>
    );
};

// 辅助函数
const getCategoryColor = (category) => {
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
        PLC: '#6366F1',
        all: '#6B7280'
    };
    return colorMap[category] || '#6B7280';
};

export default SkillGraph;
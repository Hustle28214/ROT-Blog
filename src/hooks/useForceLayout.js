import { useCallback, useEffect, useRef } from 'react';
import { forceSimulation, forceManyBody, forceCenter, forceLink, forceCollide } from 'd3-force';
const isValidNumber = (value) => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
};
export const useForceLayout = (nodes, links, width, height) => {
    const simulationRef = useRef(null);

    useEffect(() => {
        if (!nodes.length) return;

        const validNodes = nodes.map(node => ({
            ...node,
            x: node.x || width / 2 + (Math.random() - 0.5) * 400,
            y: node.y || height / 2 + (Math.random() - 0.5) * 400
        }));

        const validLinks = links.map(link => ({
            ...link,
            source: typeof link.source === 'object' ? link.source.id : link.source,
            target: typeof link.target === 'object' ? link.target.id : link.target
        }));

        const simulation = forceSimulation(validNodes)
            .force('charge', forceManyBody().strength(-800))
            .force('center', forceCenter(width / 2, height / 2))
            .force('link', forceLink(validLinks)
                .id(d => d.id)
                .distance(100)
                .strength(0.5))
            .force('collide', forceCollide().radius(d => {
                const base = d.type === 'category' ? 28 : d.type === 'subcategories' ? 20 : 14;
                return base * 1.2;
            }).strength(0.8))
            .alphaDecay(0.02);

        simulationRef.current = simulation;

        return () => {
            simulation.stop();
        };
    }, [nodes, links, width, height]);

    const fixNode = useCallback((nodeId) => {
        if (simulationRef.current) {
            const node = simulationRef.current.nodes().find(n => n.id === nodeId);
            if (node && isValidNumber(node.x) && isValidNumber(node.y)) {
                node.fx = node.x;
                node.fy = node.y;
                simulationRef.current.alpha(0.3).restart();
            }
        }
    }, []);

    const unfixNode = useCallback((nodeId) => {
        if (simulationRef.current) {
            const node = simulationRef.current.nodes().find(n => n.id === nodeId);
            if (node) {
                node.fx = null;
                node.fy = null;
            }
        }
    }, []);

    // 停止模拟
    const stopSimulation = useCallback((immediate = false) => {
        if (simulationRef.current) {
            if (immediate) {
                simulationRef.current.stop();
                simulationRef.current.alphaTarget(0);
                simulationRef.current.alpha(0);
            } else {
                simulationRef.current.alphaTarget(0);
            }
        }
    }, []);

    // 重启模拟
    const restartSimulation = useCallback(() => {
        if (simulationRef.current) {
            simulationRef.current.alphaTarget(0.3);
            simulationRef.current.alpha(0.3);
            simulationRef.current.restart();
        }
    }, []);

    return {
        simulation: simulationRef.current,
        stopSimulation,
        restartSimulation,
        fixNode,
        unfixNode
    };
};
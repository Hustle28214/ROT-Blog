import React from 'react';
import { motion } from 'framer-motion';

const SkillLink = ({ link, selectedNode, hoveredNode }) => {
    const source = typeof link.source === 'object' ? link.source : { x: 0, y: 0 };
    const target = typeof link.target === 'object' ? link.target : { x: 0, y: 0 };

    const isActive = selectedNode &&
        ((source.id === selectedNode.id) || (target.id === selectedNode.id));

    const isHovered = hoveredNode &&
        ((source.id === hoveredNode.id) || (target.id === hoveredNode.id));

    const linkVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: isActive ? 0.8 : isHovered ? 0.6 : 0.3,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.line
            x1={source.x}
            y1={source.y}
            x2={target.x}
            y2={target.y}
            stroke={link.type === 'prerequisite' ? '#EF4444' : '#9CA3AF'}
            strokeWidth={isActive ? 3 : isHovered ? 2 : 1}
            strokeDasharray={link.type === 'prerequisite' ? '5,5' : 'none'}
            variants={linkVariants}
            initial="initial"
            animate="animate"
        />
    );
};

export default SkillLink;
// 在页面中使用 - 确保使用默认导入
import React from 'react';
import Layout from '@theme/Layout';
import SkillGraph from '@site/src/components/SkillGraph'; // 导入目录，会自动找index.js

export default function SkillGraphPage() {
    const handleNodeClick = (node) => {
        console.log('选中节点:', node);
    };

    return (
        <Layout title="技能图谱" description="我的技术知识网络">
            <div style={{ padding: '2rem' }}>
               
                <SkillGraph
                    width={1400}
                    height={900}
                    onNodeClick={handleNodeClick}
                />
            </div>
        </Layout>
    );
}
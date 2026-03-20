const fs = require('fs');
const path = require('path');

// 配置
const DOCS_DIR = path.join(__dirname, '../docs'); // 根据实际位置调整
const OUTPUT_FILE = path.join(__dirname, '../src/data/skill-data.json'); // 输出路径

// 颜色映射（可按需调整）
const CATEGORY_COLORS = {
  CAE: '#A78BFA',
  Computering: '#3B82F6',
  Control: '#10B981',
  Electronic: '#EF4444',
  Machinery: '#F59E0B',
  Materials: '#EC4899',
  Mathematics: '#8B5CF6',
  Mechanics: '#6B7280',
  Paper: '#F97316',
  Robotics: '#06B6D4',
  Sensor: '#84CC16',
  Synbio: '#14B8A6',
};

// 忽略的文件/目录
const IGNORE = ['_category_.json', '__pycache__', 'node_modules', '.git'];

// 存储节点和链接
let nodes = [];
let links = [];

// 生成唯一ID（使用路径）
function generateId(relPath) {
  return relPath.replace(/[\\/.]/g, '-').replace(/^-/, '');
}

// 递归扫描目录
function scanDir(dirPath, relPath, parentId, parentType, category) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (IGNORE.includes(item)) continue;

    const fullPath = path.join(dirPath, item);
    const itemRelPath = relPath ? `${relPath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // 目录节点
      const nodeId = generateId(itemRelPath);
      const nodeTitle = item;
      const nodeType = parentType === 'category' ? 'subcategory' : 'topic';
      nodes.push({
        id: nodeId,
        title: nodeTitle,
        category: category || nodeTitle, // 顶层目录作为 category
        type: nodeType,
        color: CATEGORY_COLORS[category] || '#CCCCCC',
        docPath: itemRelPath,
        progress: 60, // 可自定义
      });
      if (parentId) {
        links.push({ source: parentId, target: nodeId, type: 'contains' });
      }
      // 递归进入子目录
      scanDir(fullPath, itemRelPath, nodeId, nodeType, category || nodeTitle);
    } else if (stat.isFile() && (item.endsWith('.mdx') || item.endsWith('.md'))) {
      // 文件节点（技能）
      const nodeId = generateId(itemRelPath.replace(/\.mdx?$/, ''));
      const nodeTitle = item.replace(/\.mdx?$/, '').replace(/^\d+-/, ''); // 去除编号前缀
      const level = guessLevel(itemRelPath); // 可根据路径深度或文件名判断等级
      nodes.push({
        id: nodeId,
        title: nodeTitle,
        category: category || 'Unknown',
        type: 'skill',
        level: level,
        color: CATEGORY_COLORS[category] || '#CCCCCC',
        docPath: itemRelPath.replace(/\.mdx?$/, ''),
        progress: Math.floor(Math.random() * 100), // 随机进度，可改为真实数据
        tags: [], // 可自行补充
      });
      if (parentId) {
        links.push({ source: parentId, target: nodeId, type: 'contains' });
      }
    }
  }
}

// 简单判断难度等级（示例）
function guessLevel(filePath) {
  if (filePath.includes('beginner') || filePath.includes('入门')) return 'beginner';
  if (filePath.includes('advanced') || filePath.includes('高级')) return 'advanced';
  return 'intermediate';
}

// 清理重复节点（确保 ID 唯一）
function deduplicateNodes() {
  const seen = new Set();
  nodes = nodes.filter(node => {
    if (seen.has(node.id)) return false;
    seen.add(node.id);
    return true;
  });
}

// 添加一些知识关联（可选）
function addKnowledgeRelations() {
  // 示例：数学与机器学习的关系
  addRelation(
    'Mathematics-线性代数-矩阵及其运算',
    'Computering-机器学习-AAAMLP-SupervisedLearning监督学习',
    'prerequisite'
  );
  // 更多关联可按需添加...
}

function addRelation(sourceId, targetId, type) {
  const source = nodes.find(n => n.id === sourceId);
  const target = nodes.find(n => n.id === targetId);
  if (source && target) {
    links.push({ source: sourceId, target: targetId, type, strength: 0.6 });
  }
}

// 主函数
function main() {
  nodes = [];
  links = [];

  // 扫描顶层目录
  const topDirs = fs.readdirSync(DOCS_DIR).filter(d => {
    const full = path.join(DOCS_DIR, d);
    return fs.statSync(full).isDirectory() && !IGNORE.includes(d);
  });

  for (const topDir of topDirs) {
    const category = topDir;
    const nodeId = category; // 直接用名称作为 ID
    nodes.push({
      id: nodeId,
      title: category,
      category: category,
      type: 'category',
      level: 'expert',
      color: CATEGORY_COLORS[category] || '#CCCCCC',
      docPath: category,
      progress: 100,
    });
    scanDir(path.join(DOCS_DIR, topDir), category, nodeId, 'category', category);
  }

  deduplicateNodes();
  addKnowledgeRelations();

  // 输出 JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ nodes, links }, null, 2));
  console.log(`技能数据已生成到 ${OUTPUT_FILE}`);
}

main();
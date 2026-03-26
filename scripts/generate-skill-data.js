const fs = require('fs');
const path = require('path');

// 配置
const DOCS_DIR = path.join(__dirname, '../docs'); // 项目根目录下的 docs
const OUTPUT_FILE = path.join(__dirname, '../src/data/skill-data.json');

const CATEGORY_COLORS = {
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
  CAE: '#A78BFA',
};

const IGNORE = ['_category_.json', '__pycache__', 'node_modules', '.git'];

let nodes = [];
let links = [];

function generateId(relPath) {
  return relPath.replace(/[\\/.]/g, '-').replace(/^-/, '');
}

function normalizeDocPathForRoute(itemRelPath) {
  const withoutExt = itemRelPath.replace(/\.mdx?$/, '');
  const segments = withoutExt.split('/');
  const lastIndex = segments.length - 1;
  segments[lastIndex] = segments[lastIndex].replace(/^\d+-/, '');
  return segments.join('/');
}

function scanDir(dirPath, relPath, parentId, parentType, category) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    if (IGNORE.includes(item)) continue;

    const fullPath = path.join(dirPath, item);
    const itemRelPath = relPath ? `${relPath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const nodeId = generateId(itemRelPath);
      const nodeTitle = item;
      const nodeType = parentType === 'category' ? 'subcategory' : 'topic';
      nodes.push({
        id: nodeId,
        title: nodeTitle,
        category: category || nodeTitle,
        type: nodeType,
        color: CATEGORY_COLORS[category] || '#CCCCCC',
        docPath: itemRelPath,
        progress: 60,
      });
      if (parentId) {
        links.push({ source: parentId, target: nodeId, type: 'contains' });
      }
      scanDir(fullPath, itemRelPath, nodeId, nodeType, category || nodeTitle);
    } else if (stat.isFile() && (item.endsWith('.mdx') || item.endsWith('.md'))) {
      const nodeId = generateId(itemRelPath.replace(/\.mdx?$/, ''));
      const nodeTitle = item.replace(/\.mdx?$/, '').replace(/^\d+-/, '');
      nodes.push({
        id: nodeId,
        title: nodeTitle,
        category: category || 'Unknown',
        type: 'skill',
        level: 'intermediate',
        color: CATEGORY_COLORS[category] || '#CCCCCC',
        docPath: normalizeDocPathForRoute(itemRelPath),
        progress: Math.floor(Math.random() * 100),
        tags: [],
      });
      if (parentId) {
        links.push({ source: parentId, target: nodeId, type: 'contains' });
      }
    }
  }
}

function main() {
  console.log('🚀 开始生成技能图谱数据...');
  console.log('文档目录:', DOCS_DIR);
  console.log('输出文件:', OUTPUT_FILE);

  // 检查 docs 目录是否存在
  if (!fs.existsSync(DOCS_DIR)) {
    console.error(`❌ 错误: docs 目录不存在: ${DOCS_DIR}`);
    process.exit(1);
  }

  // 确保输出目录存在
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 创建输出目录: ${outputDir}`);
  }

  nodes = [];
  links = [];

  const topDirs = fs.readdirSync(DOCS_DIR).filter(d => {
    const full = path.join(DOCS_DIR, d);
    return fs.statSync(full).isDirectory() && !IGNORE.includes(d);
  });

  console.log('📂 找到顶级目录:', topDirs);

  for (const topDir of topDirs) {
    const category = topDir;
    const nodeId = category;
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

  // 去重
  const seen = new Set();
  nodes = nodes.filter(node => {
    if (seen.has(node.id)) return false;
    seen.add(node.id);
    return true;
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ nodes, links }, null, 2));
  console.log(`✅ 技能数据已写入: ${OUTPUT_FILE}`);
  console.log(`📊 节点数: ${nodes.length}, 链接数: ${links.length}`);
}

main();
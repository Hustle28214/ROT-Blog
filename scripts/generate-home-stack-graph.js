/**
 * 生成首页「技术栈图谱」数据。
 * 数据源：src/data/skill-data.json（与 🔎技能 页同源）
 * 输出：src/data/home-stack-graph.json
 *
 * 用法：node scripts/generate-home-stack-graph.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const srcPath = path.join(root, 'src/data/skill-data.json');
const outPath = path.join(root, 'src/data/home-stack-graph.json');

const LABEL = {
  Computering: '计算机',
  Electronic: '电子',
  Robotics: '机器人',
  Control: '控制',
  Mathematics: '数学',
  Materials: '材料',
  Machinery: '机械',
  Mechanics: '力学',
  Sensor: '传感器',
  Optics: '光学',
  Paper: '论文',
  Synbio: '合成生物学',
};

/** 跨领域关联（网状）：体现知识之间的耦合，而不是孤立分类 */
const CROSS_LINKS = [
  ['Robotics/机器人操作系统与中间件', 'Computering/操作系统'],
  ['Robotics/感知与建图', 'Mathematics/概率论与数理统计'],
  ['Robotics/机器人控制与运动控制', 'Control/自动控制原理'],
  ['Robotics/感知与建图', 'Computering/数字图像处理'],
  ['Robotics/感知与建图', 'Computering/计算机图形学'],
  ['Control/强化学习', 'Computering/AI Infra'],
  ['Control/MPC模型预测控制', 'Mathematics/最优化问题'],
  ['Electronic/嵌入式', 'Computering/操作系统'],
  ['Electronic/信号与系统', 'Mathematics/复变函数与积分变换'],
  ['Electronic/元器件设计', 'Materials/半导体器件'],
  ['Electronic/嵌入式', 'Robotics/机器人操作系统与中间件'],
  ['Sensor/传感器与机器人感知技术', 'Robotics/感知与建图'],
  ['Machinery/机械设计', 'Mechanics/理论力学'],
];

function main() {
  const data = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  const cats = new Map();

  for (const n of data.nodes) {
    if (n.type === 'category') {
      cats.set(n.category, { en: n.category, color: n.color, subs: new Map() });
    }
  }

  for (const n of data.nodes) {
    if (n.type !== 'skill' || !n.docPath) continue;
    const parts = n.docPath.split('/');
    const cat = cats.get(parts[0]);
    if (!cat) continue;
    const subName = parts[1] || '其他';
    const sub = cat.subs.get(subName) ?? {
      name: subName,
      count: 0,
      docPath: parts.slice(0, 2).join('/'),
    };
    sub.count += 1;
    cat.subs.set(subName, sub);
  }

  const nodes = [];
  const links = [];
  let total = 0;

  const ordered = [...cats.values()]
    .map((c) => ({
      ...c,
      count: [...c.subs.values()].reduce((a, s) => a + s.count, 0),
    }))
    .sort((a, b) => b.count - a.count);

  for (const c of ordered) {
    const hubId = `cat:${c.en}`;
    nodes.push({
      id: hubId,
      type: 'category',
      name: LABEL[c.en] ?? c.en,
      en: c.en,
      color: c.color,
      count: c.count,
      docPath: c.en,
    });
    total += c.count;

    const subs = [...c.subs.values()].sort((a, b) => b.count - a.count);
    for (const s of subs) {
      const subId = `sub:${c.en}/${s.name}`;
      nodes.push({
        id: subId,
        type: 'sub',
        name: s.name,
        en: c.en,
        color: c.color,
        count: s.count,
        docPath: s.docPath,
      });
      links.push({ source: hubId, target: subId, kind: 'tree' });
    }
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  for (const [a, b] of CROSS_LINKS) {
    const s = `sub:${a}`;
    const t = `sub:${b}`;
    if (nodeIds.has(s) && nodeIds.has(t)) {
      links.push({ source: s, target: t, kind: 'cross' });
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    total,
    nodes,
    links,
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(
    `generated ${path.relative(root, outPath)}: ${nodes.length} nodes, ${links.length} links, ${total} skills`,
  );
}

main();

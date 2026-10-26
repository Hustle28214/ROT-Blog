/**
 * 首页内容数据 —— 全部集中在这里，方便日常维护。
 * 原则：不编造指标，拿不准的用占位符（'—' 或 '待填'）。
 */

/** 日常使用的语言与工具（手工维护） */
export const toolTags: string[] = [
  'C/C++', 'Python', 'TypeScript', 'Rust (学习)',
  'ROS 2', 'Nav2', 'Gazebo', 'SLAM (学习)',
  'STM32', 'ESP32', 'FreeRTOS', 'CAN',
  'OpenCV', 'EKF / 滤波', 'PyTorch (入门)',
  'React', 'Node.js', 'Docusaurus',
  'Git', 'Docker', 'Linux', 'CI/CD', 'LaTeX',
];

export interface KnowledgeSub {
  name: string;
  count: number;
}

export interface KnowledgeCategory {
  /** 中文显示名 */
  name: string;
  /** skill-data.json 里的英文分类名 */
  en: string;
  /** 与技能图谱一致的分类色 */
  color: string;
  /** 该领域下的知识节点数（type === 'skill'） */
  count: number;
  /** 子分类及节点数，按数量降序 */
  subs: KnowledgeSub[];
}

/**
 * 知识体系 —— 由 src/data/skill-data.json 统计生成（与 🔎技能 图谱同源）。
 * 重新生成：node scripts（统计 skill 节点按 一级/二级 docPath 分组计数）。
 */
export const knowledgeTree: KnowledgeCategory[] = [
  {
    name: '计算机', en: 'Computering', color: '#3B82F6', count: 461,
    subs: [
      { name: '编程语言', count: 89 }, { name: 'AI Infra', count: 79 },
      { name: '并行计算与分布式系统', count: 36 }, { name: '操作系统', count: 35 },
      { name: '计算机图形学', count: 30 }, { name: '数据结构', count: 26 },
      { name: '设计模式', count: 26 }, { name: '算法', count: 25 },
      { name: '数据库系统', count: 20 }, { name: '数字图像处理', count: 17 },
      { name: '软件测试', count: 16 }, { name: '计算机网络', count: 15 },
      { name: '信息安全', count: 14 }, { name: '编译原理', count: 13 },
      { name: '计算机组成原理', count: 7 }, { name: '通信原理', count: 5 },
      { name: 'WEB开发', count: 4 }, { name: '实用工作流', count: 3 },
      { name: '虚拟化容器', count: 1 },
    ],
  },
  {
    name: '电子', en: 'Electronic', color: '#EF4444', count: 160,
    subs: [
      { name: '嵌入式', count: 62 }, { name: '元器件设计', count: 36 },
      { name: '电子技术基础', count: 25 }, { name: '信号与系统', count: 22 },
      { name: 'FPGA', count: 9 }, { name: 'ASIC', count: 1 },
      { name: 'EDA', count: 1 }, { name: '低功耗开发', count: 1 },
      { name: '微波工程', count: 1 }, { name: '电池管理系统', count: 1 },
      { name: '电磁场与电磁波', count: 1 },
    ],
  },
  {
    name: '机器人', en: 'Robotics', color: '#06B6D4', count: 137,
    subs: [
      { name: '机器人控制与运动控制', count: 75 }, { name: '机器人学基础', count: 23 },
      { name: '感知与建图', count: 20 }, { name: '机器人操作系统与中间件', count: 15 },
      { name: '机器人不同构型实践', count: 4 },
    ],
  },
  {
    name: '控制', en: 'Control', color: '#10B981', count: 68,
    subs: [
      { name: '自动控制原理', count: 34 }, { name: '强化学习', count: 13 },
      { name: '现代控制理论', count: 7 }, { name: '机电传动控制', count: 5 },
      { name: '模仿学习', count: 5 }, { name: 'MPC模型预测控制', count: 1 },
      { name: 'Simulink', count: 1 }, { name: '微机原理', count: 1 },
      { name: '高阶控制理论', count: 1 },
    ],
  },
  {
    name: '数学', en: 'Mathematics', color: '#8B5CF6', count: 47,
    subs: [
      { name: '概率论与数理统计', count: 16 }, { name: '微积分', count: 15 },
      { name: '旋量代数与李群李代数', count: 8 }, { name: '线性代数', count: 6 },
      { name: '复变函数与积分变换', count: 1 }, { name: '最优化问题', count: 1 },
    ],
  },
  {
    name: '材料', en: 'Materials', color: '#EC4899', count: 37,
    subs: [
      { name: '半导体器件', count: 15 }, { name: '半导体物理学', count: 13 },
      { name: '高分子化学', count: 9 },
    ],
  },
  {
    name: '机械', en: 'Machinery', color: '#F59E0B', count: 13,
    subs: [
      { name: '机械设计', count: 11 }, { name: 'Pyslvs', count: 1 },
      { name: '机械设计经典五十问', count: 1 },
    ],
  },
  {
    name: '传感器', en: 'Sensor', color: '#84CC16', count: 7,
    subs: [
      { name: '传感器与机器人感知技术', count: 6 }, { name: '视触觉传感器', count: 1 },
    ],
  },
  {
    name: '光学', en: 'Optics', color: '#CCCCCC', count: 4,
    subs: [{ name: '工程光学', count: 4 }],
  },
  {
    name: '力学', en: 'Mechanics', color: '#6B7280', count: 3,
    subs: [{ name: '刚体动力学', count: 2 }, { name: 'Adams', count: 1 }],
  },
  {
    name: '论文', en: 'Paper', color: '#F97316', count: 3,
    subs: [{ name: '论文复现', count: 3 }],
  },
  {
    name: '合成生物学', en: 'Synbio', color: '#14B8A6', count: 2,
    subs: [{ name: '生物信息学', count: 1 }, { name: '化信问题', count: 1 }],
  },
];

export const knowledgeTotal = knowledgeTree.reduce((n, c) => n + c.count, 0);

export interface LogEntry {
  date: string;
  text: string;
}

export const logs: LogEntry[] = [
  { date: '2026-10', text: '首页重构：信息优先的系统面板，默认低动效，可切展示模式。' },
  { date: '2026-10', text: '新建「电池充电管理」分类：AW32001E（Awinic 线性充电 + 电源路径）。' },
  { date: '2026-10', text: 'TPS22969 负载开关文档上线，图片迁移到 COS 对象存储。' },
  { date: '2026-10', text: '构建优化：堆上限 2GB → 8GB，SSG 并发降为 2，解决千页构建 OOM。' },
];

export const email = 'hackitlilwave@outlook.com';

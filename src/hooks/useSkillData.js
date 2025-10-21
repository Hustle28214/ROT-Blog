import { useMemo } from 'react';

export const useSkillData = () => {
    return useMemo(() => {
        try {
            const data = generateCompleteDocsData();
            validateData(data);
            return data;
        } catch (error) {
            console.error('获取技能数据失败:', error);
            return { nodes: [], links: [] };
        }
    }, []);
};

const validateData = (data) => {
    const { nodes, links } = data;
    nodes.forEach(node => {
        if (!node.id) {
            console.warn('Node missing id:', node);
            node.id = `node-${Math.random().toString(36).substr(2, 9)}`;
        }
        if (!node.title) {
            console.warn('Node missing title:', node);
            node.title = '未命名节点';
        }
        if (!node.category) {
            console.warn('Node missing category:', node);
            node.category = 'other';
        }
        if (!node.type) {
            console.warn('Node missing type:', node);
            node.type = 'skill';
        }
        if (node.docPath) {
            node.docPath = cleanDocPath(node.docPath);
        }
    });

    const validLinks = links.filter(link => {
        const sourceExists = nodes.some(n => n.id === link.source);
        const targetExists = nodes.some(n => n.id === link.target);
        if (!sourceExists || !targetExists) {
            console.warn('Invalid link - missing nodes:', link);
            return false;
        }
        return true;
    });
    data.links = validLinks;
    console.log('Data validation complete:', {
        nodes: nodes.length,
        links: validLinks.length
    });
    return data;
};

const cleanDocPath = (path) => {
    if (!path) return '';
    let cleanPath = path.replace(/\.mdx?$/, '');
    cleanPath = cleanPath.replace(/\d+-/g, '');
    cleanPath = cleanPath.replace(/^\//, '');
    return cleanPath;
};

const generateCompleteDocsData = () => {
    const nodes = [];
    const links = [];


    const categories = {
    'Computering': {
        color: '#3B82F6',
        docPath: 'Computering/计算机科学与技术',
        subcategories: {
            '操作系统': {
                docPath: 'Computering/操作系统',
                topics: {
                    'Linux': {
                        docPath: 'Computering/操作系统/Linux',
                        skills: {
                            'Shell基础': { docPath: 'Computering/操作系统/Linux/Shell', level: 'beginner', tags: ['linux', 'shell'] },
                            'Shell工具与脚本': { docPath: 'Computering/操作系统/Linux/Shell工具与脚本', level: 'intermediate', tags: ['linux', 'scripting'] },
                            'Linux系统简介': { docPath: 'Computering/操作系统/Linux/Linux系统简介', level: 'beginner', tags: ['linux'] },
                            'Linux文件系统': { docPath: 'Computering/操作系统/Linux/Linux文件系统', level: 'intermediate', tags: ['linux', 'filesystem'] },
                            'Shell压缩命令': { docPath: 'Computering/操作系统/Linux/Shell压缩命令', level: 'beginner', tags: ['linux', 'compression'] }
                        }
                    },
                    'Linux驱动开发': {
                        docPath: 'Computering/操作系统/Linux/Linux驱动开发',
                        skills: {
                            '字符设备驱动框架': { docPath: 'Computering/操作系统/Linux/Linux驱动开发/字符设备驱动框架', level: 'advanced', tags: ['linux', 'driver'] }
                        }
                    },
                    'QEMU': {
                        docPath: 'Computering/操作系统/QEMU',
                        skills: {
                            'Hypervisor（虚拟机监控器）': { docPath: 'Computering/操作系统/QEMU/Hypervisor（虚拟机监控器）', level: 'intermediate', tags: ['qemu', 'virtualization'] },
                            '面向对象建模': { docPath: 'Computering/操作系统/QEMU/面向对象建模', level: 'intermediate', tags: ['qemu', 'modeling'] }
                        }
                    }
                }
            },
            'WEB开发': {
                docPath: 'Computering/WEB开发',
                topics: {
                    'Docusaurus': {
                        docPath: 'Computering/WEB开发/Docusaurus',
                        skills: {
                            'Plugins': { docPath: 'Computering/WEB开发/Docusaurus/Plugins', level: 'intermediate', tags: ['docusaurus'] },
                            'Swizzle': { docPath: 'Computering/WEB开发/Docusaurus/Swizzle', level: 'advanced', tags: ['docusaurus'] },
                            'Vercel联合部署': { docPath: 'Computering/WEB开发/Docusaurus/Vercel联合部署', level: 'intermediate', tags: ['deployment'] }
                        }
                    }
                },
                skills: {
                    'WEB技能树': { docPath: 'Computering/WEB开发/WEB技能树', level: 'intermediate', tags: ['web'] }
                }
            },
            '信息安全': {
                docPath: 'Computering/信息安全',
                topics: {
                    '密码学': {
                        docPath: 'Computering/信息安全/密码学',
                        skills: {
                            '密码基础': { docPath: 'Computering/信息安全/密码学/密码基础', level: 'intermediate', tags: ['crypto'] }
                        }
                    }
                }
            },
            '实用工作流': {
                docPath: 'Computering/实用工作流',
                skills: {
                    'Markdown入门': { docPath: 'Computering/实用工作流/8分钟入门Markdown', level: 'beginner', tags: ['markdown'] },
                    'Git版本控制': { docPath: 'Computering/实用工作流/Git', level: 'intermediate', tags: ['git'] }
                }
            },
            '并行计算与分布式系统': {
                docPath: 'Computering/并行计算与分布式系统',
                topics: {
                    'Fine-tunning': {
                        docPath: 'Computering/并行计算与分布式系统/Fine-tunning',
                        skills: {
                            'P-tuning和Adapter': { docPath: 'Computering/并行计算与分布式系统/Fine-tunning/P-tuning和Adapter', level: 'advanced', tags: ['fine-tuning'] },
                            '全量微调': { docPath: 'Computering/并行计算与分布式系统/Fine-tunning/全量微调', level: 'advanced', tags: ['fine-tuning'] },
                            '显存计算': { docPath: 'Computering/并行计算与分布式系统/Fine-tunning/显存计算', level: 'advanced', tags: ['gpu'] },
                            '模型评估': { docPath: 'Computering/并行计算与分布式系统/Fine-tunning/模型评估', level: 'intermediate', tags: ['evaluation'] }
                        }
                    },
                    'GPU编程': {
                        docPath: 'Computering/并行计算与分布式系统/GPU编程',
                        skills: {
                            'CUDA基础': { docPath: 'Computering/并行计算与分布式系统/GPU编程/CUDA基础', level: 'intermediate', tags: ['gpu', 'cuda'] }
                        }
                    },
                    'RLHF技术': {
                        docPath: 'Computering/并行计算与分布式系统/RLHF技术',
                        skills: {
                            'DPO和PPO算法': { docPath: 'Computering/并行计算与分布式系统/RLHF技术/DPO和PPO算法', level: 'advanced', tags: ['rlhf'] },
                            'Reward Model': { docPath: 'Computering/并行计算与分布式系统/RLHF技术/Reward Model', level: 'advanced', tags: ['reward'] },
                            'RLHF': { docPath: 'Computering/并行计算与分布式系统/RLHF技术/RLHF', level: 'advanced', tags: ['rlhf'] }
                        }
                    },
                    '协同进化计算与多智能体系统': {
                        docPath: 'Computering/并行计算与分布式系统/协同进化计算与多智能体系统',
                        skills: {
                            '绪论': { docPath: 'Computering/并行计算与分布式系统/协同进化计算与多智能体系统/绪论', level: 'intermediate', tags: ['multi-agent'] }
                        }
                    },
                    '模型分布式训练和并行计算': {
                        docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算',
                        skills: {
                            'MOE并行与Deepspeed': { docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/MOE并行与Deepspeed', level: 'advanced', tags: ['distributed'] },
                            '多维混合并行与自动并行': { docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/多维混合并行与自动并行', level: 'advanced', tags: ['parallel'] },
                            '数据并行和模型并行': { docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/数据并行和模型并行', level: 'intermediate', tags: ['parallel'] },
                            '流水线并行与张量并行': { docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/流水线并行与张量并行', level: 'advanced', tags: ['pipeline'] }
                        }
                    },
                    '调度算法': {
                        docPath: 'Computering/并行计算与分布式系统/调度算法',
                        skills: {
                            '调度算法简介': { docPath: 'Computering/并行计算与分布式系统/调度算法/调度算法简介', level: 'intermediate', tags: ['scheduling'] }
                        }
                    },
                    '高性能计算HPC': {
                        docPath: 'Computering/并行计算与分布式系统/高性能计算HPC',
                        skills: {
                            'HIP异构编程模型': { docPath: 'Computering/并行计算与分布式系统/高性能计算HPC/HIP异构编程模型', level: 'advanced', tags: ['hpc'] },
                            '优化程序性能方法概览': { docPath: 'Computering/并行计算与分布式系统/高性能计算HPC/优化程序性能方法概览', level: 'intermediate', tags: ['optimization'] }
                        }
                    }
                }
            },
            '数字图像处理': {
                docPath: 'Computering/数字图像处理',
                skills: {
                    '数字图像基础': { docPath: 'Computering/数字图像处理/数字图像基础', level: 'intermediate', tags: ['image'] },
                    '数字图像特征': { docPath: 'Computering/数字图像处理/数字图像特征', level: 'intermediate', tags: ['features'] },
                    '离散二维处理': { docPath: 'Computering/数字图像处理/离散二维处理', level: 'advanced', tags: ['2d'] },
                    '图像改进': { docPath: 'Computering/数字图像处理/图像改进', level: 'intermediate', tags: ['enhancement'] },
                    '图像分析': { docPath: 'Computering/数字图像处理/图像分析', level: 'advanced', tags: ['analysis'] },
                    '图像处理软件': { docPath: 'Computering/数字图像处理/图像处理软件', level: 'beginner', tags: ['software'] },
                    'YOLOv10速通': { docPath: 'Computering/数字图像处理/速通yoloV10', level: 'advanced', tags: ['yolo'] }
                }
            },
            '数据结构': {
                docPath: 'Computering/数据结构',
                skills: {
                            'KMP': { docPath: 'Computering/数据结构/KMP', level: 'advanced', tags: ['string'] },
                            'Trie': { docPath: 'Computering/数据结构/Trie', level: 'intermediate', tags: ['trie'] },
                            '栈': { docPath: 'Computering/数据结构/栈', level: 'beginner', tags: ['stack'] },
                            '链表与邻接表': { docPath: 'Computering/数据结构/链表与邻接表', level: 'intermediate', tags: ['linked-list'] },
                            '队列': { docPath: 'Computering/数据结构/队列', level: 'beginner', tags: ['queue'] },
                            '数据结构概述': { docPath: 'Computering/数据结构/数据结构', level: 'intermediate', tags: ['overview'] },
                        }
                            
                },
            },
            '算法': {
                docPath: 'Computering/算法',
                skills: {
                    '算法': { docPath: 'Computering/算法/算法', level: 'intermediate', tags: ['algorithm'] }
                },
                topics: {
                    '搜索': {
                        docPath: 'Computering/算法/搜索',
                        skills: {
                            'A星': { docPath: 'Computering/算法/搜索/A星', level: 'intermediate', tags: ['search'] },
                            'BFS': { docPath: 'Computering/算法/搜索/BFS', level: 'beginner', tags: ['search'] },
                            'DFS': { docPath: 'Computering/算法/搜索/DFS', level: 'beginner', tags: ['search'] },
                            'IDA星': { docPath: 'Computering/算法/搜索/IDA星', level: 'advanced', tags: ['search'] },
                            '双向搜索': { docPath: 'Computering/算法/搜索/双向搜索', level: 'intermediate', tags: ['search'] },
                            '启发式搜索': { docPath: 'Computering/算法/搜索/启发式搜索', level: 'intermediate', tags: ['search'] },
                            '回溯法': { docPath: 'Computering/算法/搜索/回溯法', level: 'intermediate', tags: ['search'] },
                            '迭代加深搜索': { docPath: 'Computering/算法/搜索/迭代加深搜索', level: 'advanced', tags: ['search'] }
                        }
                    },
                    '算法基础': {
                        docPath: 'Computering/算法/算法基础',
                        skills: {
                            '二分': { docPath: 'Computering/算法/算法基础/二分', level: 'beginner', tags: ['binary-search'] },
                            '前缀和 & 差分': { docPath: 'Computering/算法/算法基础/前缀和 & 差分', level: 'intermediate', tags: ['prefix-sum'] },
                            '排序': { docPath: 'Computering/算法/算法基础/排序', level: 'beginner', tags: ['sorting'] },
                            '简单DP': { docPath: 'Computering/算法/算法基础/简单DP', level: 'intermediate', tags: ['dp'] },
                            '贪心': { docPath: 'Computering/算法/算法基础/贪心', level: 'intermediate', tags: ['greedy'] }
                        }
                    }
                }
            },
            '机器学习': {
                docPath: 'Computering/机器学习',
                topics: {
                    'AAAMLP': {
                        docPath: 'Computering/机器学习/AAAMLP',
                        skills: {
                            '监督学习': { docPath: 'Computering/机器学习/AAAMLP/SupervisedLearning监督学习', level: 'intermediate', tags: ['ml'] },
                            '交叉验证': { docPath: 'Computering/机器学习/AAAMLP/CrossValidation交叉验证', level: 'intermediate', tags: ['evaluation'] },
                            '评估指标': { docPath: 'Computering/机器学习/AAAMLP/EvaluationMetrics评估指标', level: 'intermediate', tags: ['metrics'] },
                            '组织机器学习项目': { docPath: 'Computering/机器学习/AAAMLP/ArrangingMLProjects组织机器学习', level: 'intermediate', tags: ['mlops'] },
                            '处理分类变量': { docPath: 'Computering/机器学习/AAAMLP/ApproachingCategoricalVar处理分类变量', level: 'intermediate', tags: ['preprocessing'] },
                            '特征工程': { docPath: 'Computering/机器学习/AAAMLP/FeatureEngineering特征工程', level: 'intermediate', tags: ['feature'] },
                            '特征选择': { docPath: 'Computering/机器学习/AAAMLP/FeatureSelection特征选择', level: 'intermediate', tags: ['selection'] },
                            '超参数优化': { docPath: 'Computering/机器学习/AAAMLP/HyperparameterOptimization超参数优化', level: 'advanced', tags: ['tuning'] },
                            '图像分类和分割': { docPath: 'Computering/机器学习/AAAMLP/ApproachingImageClassification&Segmentation图像分类和分割', level: 'advanced', tags: ['cv'] },
                            '文本分类或回归': { docPath: 'Computering/机器学习/AAAMLP/ApproachingTextClassification&Regression文本分类或回归', level: 'advanced', tags: ['nlp'] },
                            '组合和堆叠': { docPath: 'Computering/机器学习/AAAMLP/ApproachingEnsembling&Stacking组合和堆叠', level: 'advanced', tags: ['ensemble'] },
                            '可重复代码和模型': { docPath: 'Computering/机器学习/AAAMLP/ApproachingReproducibleCode&ModelServing可重复代码和模型', level: 'intermediate', tags: ['reproducibility'] },
                            '阅读提示': { docPath: 'Computering/机器学习/AAAMLP/阅读本系列的提示', level: 'beginner', tags: ['guide'] }
                        }
                    },
                    
                    '推荐系统': {
                        docPath: 'Computering/机器学习/推荐系统',
                        skills: {
                            '概述': { docPath: 'Computering/机器学习/推荐系统/概述', level: 'intermediate', tags: ['recsys'] },
                            '协同过滤': { docPath: 'Computering/机器学习/推荐系统/协同过滤', level: 'intermediate', tags: ['cf'] }
                        }
                    },
                    '深度学习': {
                        docPath: 'Computering/机器学习/深度学习',
                        skills: {
                            '深度学习概览': { docPath: 'Computering/机器学习/深度学习/深度学习概览', level: 'intermediate', tags: ['dl'] },
                            'BP神经网络': { docPath: 'Computering/机器学习/深度学习/BP神经网络', level: 'advanced', tags: ['nn'] },
                            'LSTM': { docPath: 'Computering/机器学习/深度学习/LSTM', level: 'advanced', tags: ['rnn'] }
                        }
                    }
                }
            },
            '编程语言': {
                docPath: 'Computering/编程语言',
                topics: {
                    'C++': {
                        docPath: 'Computering/编程语言/C++',
                        skills: {
                            'C++概述': { docPath: 'Computering/编程语言/C++/C++概述', level: 'beginner', tags: ['cpp'] },
                            'C++程序组成': { docPath: 'Computering/编程语言/C++/C++程序的基本组成', level: 'beginner', tags: ['cpp'] },
                            '标识符和数据类型': { docPath: 'Computering/编程语言/C++/标识符和数据类型', level: 'beginner', tags: ['cpp'] }
                        }
                    },
                    'STL': {
                        docPath: 'Computering/编程语言/C++/STL',
                        skills: {
                            'vector': { docPath: 'Computering/编程语言/C++/STL/vector', level: 'intermediate', tags: ['stl'] }
                        }
                    },
                    'Rust': {
                        docPath: 'Computering/编程语言/Rust',
                        skills: {
                            'Rust基础语法': { docPath: 'Computering/编程语言/Rust/Rust基础语法', level: 'intermediate', tags: ['rust'] }
                        }
                    },
                    '项目：实现一个OJ': {
                        docPath: 'Computering/编程语言/项目：实现一个OJ',
                        skills: {
                            '调研、技术选型': { docPath: 'Computering/编程语言/项目：实现一个OJ/调研、技术选型', level: 'intermediate', tags: ['project'] }
                        }
                    },
                    '鸿蒙': {
                        docPath: 'Computering/编程语言/鸿蒙',
                        skills: {
                            'ArkTS': { docPath: 'Computering/编程语言/鸿蒙/ArkTS', level: 'intermediate', tags: ['harmonyos'] }
                        }
                    }
                },
                skills: {
                    '编程语言概述': { docPath: 'Computering/编程语言/编程语言', level: 'beginner', tags: ['programming'] }
                }
            },
            '编译原理': {
                docPath: 'Computering/编译原理',
                skills: {
                    'TinyC': { docPath: 'Computering/编译原理/TinyC', level: 'advanced', tags: ['compiler'] }
                }
            },
            '虚拟化容器': {
                docPath: 'Computering/虚拟化容器',
                skills: {
                    'Kubernetes扫盲': { docPath: 'Computering/虚拟化容器/kubernetes扫盲', level: 'intermediate', tags: ['k8s'] }
                }
            },
            '计算机网络': {
                docPath: 'Computering/计算机网络',
                skills: {
                    '数据通信': { docPath: 'Computering/计算机网络/数据通信', level: 'intermediate', tags: ['network'] },
                    '广域通信网': { docPath: 'Computering/计算机网络/广域通信网', level: 'intermediate', tags: ['wan'] },
                    '局域网和城域网': { docPath: 'Computering/计算机网络/局域网和城域网', level: 'intermediate', tags: ['lan'] },
                    '无线通信网': { docPath: 'Computering/计算机网络/无线通信网', level: 'intermediate', tags: ['wireless'] },
                    '下一代互联网': { docPath: 'Computering/计算机网络/下一代互联网', level: 'advanced', tags: ['ipv6'] },
                    '网络安全': { docPath: 'Computering/计算机网络/网络安全', level: 'intermediate', tags: ['security'] },
                    '网络操作系统与服务器': { docPath: 'Computering/计算机网络/网络操作系统与服务器', level: 'intermediate', tags: ['nos'] },
                    '组网技术': { docPath: 'Computering/计算机网络/组网技术', level: 'intermediate', tags: ['networking'] },
                    '网络管理': { docPath: 'Computering/计算机网络/网络管理', level: 'intermediate', tags: ['management'] },
                    '软件工程': { docPath: 'Computering/计算机网络/软件工程', level: 'intermediate', tags: ['se'] },
                    '知识产权和标准化': { docPath: 'Computering/计算机网络/知识产权和标准化', level: 'beginner', tags: ['ip'] },
                    'DNS使用问题': { docPath: 'Computering/计算机网络/漫谈DNS使用问题', level: 'intermediate', tags: ['dns'] },
                    '代理Proxy': { docPath: 'Computering/计算机网络/浅说代理Proxy', level: 'intermediate', tags: ['proxy'] },
                    '传统发邮件方式': { docPath: 'Computering/计算机网络/如何用传统的方式发邮件', level: 'intermediate', tags: ['email'] }
                }
            }
        },
    'Control': {
        color: '#10B981',
        docPath: 'Control/控制理论',
        subcategories: {
            '强化学习': {
                docPath: 'Control/强化学习',
                skills: {
                    '马尔可夫决策过程': { docPath: 'Control/强化学习/马尔可夫决策过程', level: 'intermediate', tags: ['mdp'] },
                    '动态规划算法': { docPath: 'Control/强化学习/动态规划算法', level: 'advanced', tags: ['dp'] },
                    '时序差分算法': { docPath: 'Control/强化学习/时序差分算法', level: 'advanced', tags: ['td'] },
                    'Dyna-Q算法': { docPath: 'Control/强化学习/Dyna-Q算法', level: 'advanced', tags: ['dyna'] },
                    'DQN算法': { docPath: 'Control/强化学习/DQN算法', level: 'advanced', tags: ['dqn'] },
                    'DQN改进算法': { docPath: 'Control/强化学习/DQN改进算法', level: 'advanced', tags: ['deep-rl'] },
                    '策略梯度算法': { docPath: 'Control/强化学习/策略梯度算法', level: 'advanced', tags: ['pg'] },
                    'Actor-Critic算法': { docPath: 'Control/强化学习/Actor-Critic算法', level: 'advanced', tags: ['ac'] },
                    'TRPO算法': { docPath: 'Control/强化学习/TRPO算法', level: 'advanced', tags: ['trpo'] },
                    'PPO算法': { docPath: 'Control/强化学习/PPO算法', level: 'advanced', tags: ['ppo'] },
                    'DDPG算法': { docPath: 'Control/强化学习/DDPG算法', level: 'advanced', tags: ['ddpg'] },
                    'SAC算法': { docPath: 'Control/强化学习/SAC算法', level: 'advanced', tags: ['sac'] }
                }
            },
            '模仿学习': {
                docPath: 'Control/模仿学习',
                skills: {
                    '行为克隆': { docPath: 'Control/模仿学习/行为克隆', level: 'intermediate', tags: ['bc'] },
                    '对抗式模仿学习': { docPath: 'Control/模仿学习/对抗式模仿学习', level: 'advanced', tags: ['gail'] },
                    '环境模仿': { docPath: 'Control/模仿学习/环境模仿', level: 'advanced', tags: ['environment'] }
                }
            },
            '自动控制原理': {
                docPath: 'Control/自动控制原理',
                topics: {
                    '自动控制概念': {
                        docPath: 'Control/自动控制原理/自动控制概念',
                        skills: {
                            '自动控制的一般概念': { docPath: 'Control/自动控制原理/自动控制概念/自动控制的一般概念', level: 'beginner', tags: ['basics'] },
                            '控制系统的数学模型': { docPath: 'Control/自动控制原理/自动控制概念/控制系统的数学模型', level: 'intermediate', tags: ['modeling'] }
                        }
                    },
                    '数学模型': {
                        docPath: 'Control/自动控制原理/数学模型',
                        skills: {
                            '传递函数': { docPath: 'Control/自动控制原理/数学模型/传递函数', level: 'intermediate', tags: ['transfer'] },
                            '信号流图、系统传递函数': { docPath: 'Control/自动控制原理/数学模型/信号流图、系统传递函数', level: 'intermediate', tags: ['signal-flow'] },
                            '控制系统复域数学模型': { docPath: 'Control/自动控制原理/数学模型/控制系统复域数学模型', level: 'intermediate', tags: ['complex-model'] },
                            '结构图及等效变换': { docPath: 'Control/自动控制原理/数学模型/结构图及等效变换', level: 'intermediate', tags: ['block-diagram'] }
                        }
                    },
                    '线性系统时域分析与校正': {
                        docPath: 'Control/自动控制原理/线性系统时域分析与校正',
                        skills: {
                            '一阶、过阻尼二阶系统动态性能': { docPath: 'Control/自动控制原理/线性系统时域分析与校正/一阶、过阻尼二阶系统动态性能', level: 'intermediate', tags: ['time-domain'] },
                            '欠阻尼二阶系统动态性能指标': { docPath: 'Control/自动控制原理/线性系统时域分析与校正/欠阻尼二阶系统动态性能指标', level: 'intermediate', tags: ['time-domain'] },
                            '线性系统的动态误差和时域校正': { docPath: 'Control/自动控制原理/线性系统时域分析与校正/线性系统的动态误差和时域校正', level: 'advanced', tags: ['error'] },
                            '线性系统的稳态误差（静态）': { docPath: 'Control/自动控制原理/线性系统时域分析与校正/线性系统的稳态误差（静态）', level: 'intermediate', tags: ['steady-state'] },
                            '高阶系统动态性能': { docPath: 'Control/自动控制原理/线性系统时域分析与校正/高阶系统动态性能', level: 'advanced', tags: ['high-order'] }
                        }
                    },
                    '根轨迹法': {
                        docPath: 'Control/自动控制原理/根轨迹法',
                        skills: {
                            '基本概念、绘制法则': { docPath: 'Control/自动控制原理/根轨迹法/基本概念、绘制法则', level: 'intermediate', tags: ['root-locus'] },
                            '利用根轨迹分析系统性能': { docPath: 'Control/自动控制原理/根轨迹法/利用根轨迹分析系统性能', level: 'advanced', tags: ['analysis'] },
                            '广义根轨迹': { docPath: 'Control/自动控制原理/根轨迹法/广义根轨迹', level: 'advanced', tags: ['generalized'] }
                        }
                    },
                    '线性系统频域分析与校正': {
                        docPath: 'Control/自动控制原理/线性系统频域分析与校正',
                        skills: {
                            'Bode图': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/Bode图', level: 'advanced', tags: ['bode'] },
                            'Nyquist图': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/Nyquist图', level: 'advanced', tags: ['nyquist'] },
                            '开环对数幅频特性分析系统性能': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/开环对数幅频特性分析系统性能', level: 'advanced', tags: ['open-loop'] },
                            '稳定裕度': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/稳定裕度', level: 'advanced', tags: ['margin'] },
                            '闭环频率特性分析系统性能': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/闭环频率特性分析系统性能', level: 'advanced', tags: ['closed-loop'] },
                            '频域稳定判据': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/频域稳定判据', level: 'advanced', tags: ['stability'] },
                            '相角超前校正': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/相角超前校正', level: 'intermediate', tags: ['lead'] },
                            '相角滞后校正': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/相角滞后校正', level: 'intermediate', tags: ['lag'] },
                            '滞后超前校正、PID校正': { docPath: 'Control/自动控制原理/线性系统频域分析与校正/滞后超前校正、PID校正', level: 'advanced', tags: ['lag-lead'] }
                        }
                    },
                    '线性离散系统分析与校正': {
                        docPath: 'Control/自动控制原理/线性离散系统分析与校正',
                        skills: {
                            '离散系统、信号采样与保持': { docPath: 'Control/自动控制原理/线性离散系统分析与校正/离散系统、信号采样与保持', level: 'intermediate', tags: ['discrete'] },
                            'z变换': { docPath: 'Control/自动控制原理/线性离散系统分析与校正/z变换', level: 'advanced', tags: ['z-transform'] },
                            '离散系统数学模型': { docPath: 'Control/自动控制原理/线性离散系统分析与校正/离散系统数学模型', level: 'advanced', tags: ['model'] },
                            '稳定性分析': { docPath: 'Control/自动控制原理/线性离散系统分析与校正/稳定性分析', level: 'advanced', tags: ['stability'] },
                            '稳态误差、动态性能分析': { docPath: 'Control/自动控制原理/线性离散系统分析与校正/稳态误差、动态性能分析', level: 'advanced', tags: ['performance'] },
                            '模拟化校正、数字校正': { docPath: 'Control/自动控制原理/线性离散系统分析与校正/模拟化校正、数字校正', level: 'advanced', tags: ['correction'] }
                        }
                    },
                    '非线性控制系统分析': {
                        docPath: 'Control/自动控制原理/非线性控制系统分析',
                        skills: {
                            '相平面法': { docPath: 'Control/自动控制原理/非线性控制系统分析/相平面法', level: 'advanced', tags: ['phase-plane'] },
                            '描述函数法': { docPath: 'Control/自动控制原理/非线性控制系统分析/描述函数法', level: 'advanced', tags: ['describing-function'] },
                            '改善非线性系统性能措施': { docPath: 'Control/自动控制原理/非线性控制系统分析/改善非线性系统性能措施', level: 'advanced', tags: ['improvement'] }
                        }
                    }
                },
                skills: {
                    'PID控制': { docPath: 'Control/自动控制原理/PID', level: 'intermediate', tags: ['pid'] }
                }
            },
            'Simulink': {
                docPath: 'Control/Simulink',
                skills: {
                    'Simulink入门': { docPath: 'Control/Simulink/Simulink入门', level: 'beginner', tags: ['simulink'] }
                }
            },
            '微机原理': {
                docPath: 'Control/微机原理',
                skills: {
                    '计算机组成概览': { docPath: 'Control/微机原理/计算机组成概览', level: 'intermediate', tags: ['computer-architecture'] }
                }
            },
            '机电传动控制': {
                docPath: 'Control/机电传动控制',
                skills: {
                    '概述': { docPath: 'Control/机电传动控制/概述', level: 'beginner', tags: ['overview'] },
                    '动力学基础': { docPath: 'Control/机电传动控制/机电传动系统的动力学基础', level: 'intermediate', tags: ['dynamics'] },
                    '直流电机': { docPath: 'Control/机电传动控制/直流电机的工作原理及特性', level: 'intermediate', tags: ['dc-motor'] },
                    '交流电机': { docPath: 'Control/机电传动控制/交流电机的工作原理及其特性', level: 'intermediate', tags: ['ac-motor'] },
                    '控制电机': { docPath: 'Control/机电传动控制/控制电机', level: 'advanced', tags: ['control-motor'] }
                }
            },
            '现代控制理论': {
                docPath: 'Control/现代控制理论',
                skills: {
                    '绪论': { docPath: 'Control/现代控制理论/绪论', level: 'beginner', tags: ['overview'] },
                    '状态空间表达式': { docPath: 'Control/现代控制理论/控制系统的状态空间表达式', level: 'intermediate', tags: ['state-space'] },
                    '状态空间解': { docPath: 'Control/现代控制理论/控制系统状态空间表达式的解', level: 'advanced', tags: ['solution'] },
                    '能控性和能观性': { docPath: 'Control/现代控制理论/线性控制系统的能控性和能观性', level: 'advanced', tags: ['controllability'] },
                    '李雅普诺夫方法': { docPath: 'Control/现代控制理论/稳定性与李雅普诺夫方法', level: 'advanced', tags: ['lyapunov'] },
                    '线性系统综合': { docPath: 'Control/现代控制理论/线性定常系统的综合', level: 'advanced', tags: ['synthesis'] },
                    '最优控制': { docPath: 'Control/现代控制理论/最优控制', level: 'advanced', tags: ['optimal'] }
                }
            },
            '高阶控制理论': {
                docPath: 'Control/高阶控制理论',
                skills: {
                    '连续系统离散化': { docPath: 'Control/高阶控制理论/连续系统离散化', level: 'advanced', tags: ['discretization'] },
                    '动态系统分析': { docPath: 'Control/高阶控制理论/动态系统分析', level: 'advanced', tags: ['dynamic'] },
                    '系统的可控性': { docPath: 'Control/高阶控制理论/系统的可控性', level: 'advanced', tags: ['controllability'] }
                }
            }
        }
    },
    'Electronic': {
        color: '#EF4444',
        docPath: 'Electronic/电子科学与技术',
        subcategories: {
            '嵌入式': {
                docPath: 'Electronic/嵌入式',
                topics: {
                    'STM32': {
                        docPath: 'Electronic/嵌入式/STM32',
                        skills: {
                            'GPIO': { docPath: 'Electronic/嵌入式/STM32/GPIO', level: 'beginner', tags: ['stm32'] },
                            'EXTI外部中断': { docPath: 'Electronic/嵌入式/STM32/EXTI外部中断', level: 'intermediate', tags: ['interrupt'] },
                            'PWM驱动': { docPath: 'Electronic/嵌入式/STM32/PWM驱动', level: 'intermediate', tags: ['pwm'] },
                            'TIM输出比较': { docPath: 'Electronic/嵌入式/STM32/TIM输出比较', level: 'intermediate', tags: ['timer'] },
                            'TIM输入捕获': { docPath: 'Electronic/嵌入式/STM32/TIM输入捕获', level: 'intermediate', tags: ['capture'] },
                            'TIM编码器接口': { docPath: 'Electronic/嵌入式/STM32/TIM编码器接口', level: 'intermediate', tags: ['encoder'] },
                            'ADC模数转换器': { docPath: 'Electronic/嵌入式/STM32/ADC模数转换器', level: 'intermediate', tags: ['adc'] },
                            'DMA直接存储器存取': { docPath: 'Electronic/嵌入式/STM32/DMA直接存储器存取', level: 'intermediate', tags: ['dma'] },
                            'USART串口协议': { docPath: 'Electronic/嵌入式/STM32/USART串口协议', level: 'intermediate', tags: ['uart'] },
                            'USART外设': { docPath: 'Electronic/嵌入式/STM32/USART外设', level: 'intermediate', tags: ['uart'] },
                            'I2C通信协议': { docPath: 'Electronic/嵌入式/STM32/I2C通信协议', level: 'intermediate', tags: ['i2c'] },
                            'SPI通信协议': { docPath: 'Electronic/嵌入式/STM32/SPI通信协议', level: 'intermediate', tags: ['spi'] },
                            'MPU6050': { docPath: 'Electronic/嵌入式/STM32/MPU6050', level: 'advanced', tags: ['sensor'] },
                            'OLED调试': { docPath: 'Electronic/嵌入式/STM32/OLED调试', level: 'intermediate', tags: ['display'] },
                            'TIM定时中断': { docPath: 'Electronic/嵌入式/STM32/TIM定时中断', level: 'intermediate', tags: ['timer'] },
                            'W25Q64': { docPath: 'Electronic/嵌入式/STM32/W25Q64', level: 'intermediate', tags: ['flash'] },
                            'RTC实时时钟': { docPath: 'Electronic/嵌入式/STM32/RTC实时时钟', level: 'intermediate', tags: ['rtc'] },
                            'PWR电源控制': { docPath: 'Electronic/嵌入式/STM32/PWR电源控制', level: 'intermediate', tags: ['power'] },
                            'WDG看门狗': { docPath: 'Electronic/嵌入式/STM32/WDG看门狗', level: 'intermediate', tags: ['watchdog'] },
                            'FLASH闪存': { docPath: 'Electronic/嵌入式/STM32/FLASH闪存', level: 'intermediate', tags: ['flash'] }
                        }
                    },
                    'FreeRTOS': {
                        docPath: 'Electronic/嵌入式/FreeRTOS',
                        skills: {
                            'FreeRTOS初步': { docPath: 'Electronic/嵌入式/FreeRTOS/FreeRTOS初步', level: 'intermediate', tags: ['rtos'] }
                        }
                    }
                },
                skills: {
                    '蓝桥杯嵌入式速通': { docPath: 'Electronic/嵌入式/速通蓝桥杯嵌入式', level: 'intermediate', tags: ['embedded'] }
                }
            },
            '信号与系统': {
                docPath: 'Electronic/信号与系统',
                skills: {
                    '信号与系统': { docPath: 'Electronic/信号与系统/信号与系统', level: 'beginner', tags: ['signals'] },
                    '线性时不变系统': { docPath: 'Electronic/信号与系统/线性时不变系统', level: 'intermediate', tags: ['lti'] },
                    '傅里叶级数': { docPath: 'Electronic/信号与系统/周期信号的傅里叶级数表示', level: 'intermediate', tags: ['fourier'] },
                    '连续时间傅里叶变换': { docPath: 'Electronic/信号与系统/连续时间傅里叶变换', level: 'advanced', tags: ['ft'] },
                    '离散时间傅里叶变换': { docPath: 'Electronic/信号与系统/离散时间傅里叶变换', level: 'advanced', tags: ['dtft'] },
                    '时域和频域特性': { docPath: 'Electronic/信号与系统/信号与系统的时域和频域特性', level: 'intermediate', tags: ['domain'] },
                    '采样': { docPath: 'Electronic/信号与系统/采样', level: 'intermediate', tags: ['sampling'] },
                    '通信系统': { docPath: 'Electronic/信号与系统/通信系统', level: 'intermediate', tags: ['communication'] },
                    '拉普拉斯变换': { docPath: 'Electronic/信号与系统/拉普拉斯变换', level: 'advanced', tags: ['laplace'] },
                    '卡尔曼滤波器': { docPath: 'Electronic/信号与系统/卡尔曼滤波器MATLAB实现', level: 'advanced', tags: ['kalman'] }
                }
            },
            'FPGA': {
                docPath: 'Electronic/FPGA',
                topics: {
                    'Verilog': {
                        docPath: 'Electronic/FPGA/Verilog',
                        skills: {
                            'Verilog简介': { docPath: 'Electronic/FPGA/Verilog/Verilog简介', level: 'beginner', tags: ['verilog'] },
                            'Verilog语法基础': { docPath: 'Electronic/FPGA/Verilog/Verilog语法基础', level: 'intermediate', tags: ['verilog'] }
                        }
                    }
                }
            },
            'FOC': {
                docPath: 'Electronic/FOC',
                skills: {
                    '标幺值': { docPath: 'Electronic/FOC/标幺值', level: 'intermediate', tags: ['foc'] },
                    '克拉克变换与帕克变换': { docPath: 'Electronic/FOC/克拉克变换与帕克变换', level: 'advanced', tags: ['transform'] },
                    '开环调速': { docPath: 'Electronic/FOC/开环调速', level: 'intermediate', tags: ['speed'] }
                }
            },
            '滤波器设计': {
                docPath: 'Electronic/滤波器设计',
                skills: {
                    '滤波器设计概述': { docPath: 'Electronic/滤波器设计/滤波器设计概述', level: 'beginner', tags: ['filter'] },
                    '频率响应与时间响应特性': { docPath: 'Electronic/滤波器设计/滤波器的频率响应与时间响应特性', level: 'intermediate', tags: ['response'] }
                }
            },
            '电源设计': {
                docPath: 'Electronic/电源设计',
                skills: {
                    '电源系统介绍': { docPath: 'Electronic/电源设计/电源系统介绍', level: 'beginner', tags: ['power'] }
                }
            }
        }
    },
    'Materials': {
        color: '#EC4899',
        docPath: 'Materials/材料科学与工程',
        subcategories: {
            '半导体器件': {
                docPath: 'Materials/半导体器件',
                skills: {
                    '固体晶格结构': { docPath: 'Materials/半导体器件/01-固体晶格结构', level: 'advanced', tags: ['semiconductor'] },
                    '量子力学初步': { docPath: 'Materials/半导体器件/02-量子力学初步', level: 'advanced', tags: ['quantum'] },
                    '固体量子理论初步': { docPath: 'Materials/半导体器件/03-固体量子理论初步', level: 'advanced', tags: ['solid-state'] },
                    '平衡半导体': { docPath: 'Materials/半导体器件/04-平衡半导体', level: 'advanced', tags: ['equilibrium'] },
                    '载流子输运现象': { docPath: 'Materials/半导体器件/05-载流子输运现象', level: 'advanced', tags: ['transport'] },
                    '半导体中的非平衡过剩载流子': { docPath: 'Materials/半导体器件/06-半导体中的非平衡过剩载流子', level: 'advanced', tags: ['non-equilibrium'] },
                    'pn结': { docPath: 'Materials/半导体器件/07-pn结', level: 'advanced', tags: ['pn-junction'] },
                    'pn结二极管': { docPath: 'Materials/半导体器件/08-pn结二极管', level: 'advanced', tags: ['diode'] },
                    '金属半导体和半导体异质结': { docPath: 'Materials/半导体器件/09-金属半导体和半导体异质结', level: 'advanced', tags: ['heterojunction'] },
                    '双极晶体管': { docPath: 'Materials/半导体器件/10-双极晶体管', level: 'advanced', tags: ['bjt'] },
                    'MOSFET基础': { docPath: 'Materials/半导体器件/11-MOSFET基础', level: 'advanced', tags: ['mosfet'] },
                    'MOSFET概念深入': { docPath: 'Materials/半导体器件/12-MOSFET概念深入', level: 'advanced', tags: ['mosfet'] },
                    '结型场效应晶体管': { docPath: 'Materials/半导体器件/13-结型场效应晶体管', level: 'advanced', tags: ['jfet'] },
                    '光器件': { docPath: 'Materials/半导体器件/14-光器件', level: 'advanced', tags: ['optoelectronics'] },
                    '半导体功率器件': { docPath: 'Materials/半导体器件/15-半导体功率器件', level: 'advanced', tags: ['power-device'] }
                }
            },
            '半导体物理学': {
                docPath: 'Materials/半导体物理学',
                skills: {
                    '半导体中的电子状态': { docPath: 'Materials/半导体物理学/半导体中的电子状态', level: 'advanced', tags: ['semiconductor'] },
                    '半导体中杂质和缺陷能级': { docPath: 'Materials/半导体物理学/半导体中杂质和缺陷能级', level: 'advanced', tags: ['defects'] },
                    '半导体中载流子的统计分布': { docPath: 'Materials/半导体物理学/半导体中载流子的统计分布', level: 'advanced', tags: ['carrier'] },
                    '半导体的导电性': { docPath: 'Materials/半导体物理学/半导体的导电性', level: 'advanced', tags: ['conductivity'] },
                    '非平衡载流子': { docPath: 'Materials/半导体物理学/非平衡载流子', level: 'advanced', tags: ['non-equilibrium'] },
                    'pn结': { docPath: 'Materials/半导体物理学/pn结', level: 'advanced', tags: ['pn-junction'] },
                    '金属和半导体的接触': { docPath: 'Materials/半导体物理学/金属和半导体的接触', level: 'advanced', tags: ['contact'] },
                    '半导体表面与MIS结构': { docPath: 'Materials/半导体物理学/半导体表面与MIS结构', level: 'advanced', tags: ['surface'] },
                    '半导体异质结构': { docPath: 'Materials/半导体物理学/半导体异质结构', level: 'advanced', tags: ['heterostructure'] },
                    '半导体的光学性质和光电与发光现象': { docPath: 'Materials/半导体物理学/半导体的光学性质和光电与发光现象', level: 'advanced', tags: ['optical'] },
                    '半导体的热电性质': { docPath: 'Materials/半导体物理学/半导体的热电性质', level: 'advanced', tags: ['thermoelectric'] },
                    '半导体磁和压阻效应': { docPath: 'Materials/半导体物理学/半导体磁和压阻效应', level: 'advanced', tags: ['magnetic'] },
                    '非晶态半导体': { docPath: 'Materials/半导体物理学/非晶态半导体', level: 'advanced', tags: ['amorphous'] }
                }
            }
        }
    },
    'Mathematics': {
        color: '#8B5CF6',
        docPath: 'Mathematics/数学基础',
        subcategories: {
            '微积分': {
                docPath: 'Mathematics/微积分',
                skills: {
                    '微积分': { docPath: 'Mathematics/微积分/微积分', level: 'beginner', tags: ['calculus'] },
                    '不定积分': { docPath: 'Mathematics/微积分/不定积分', level: 'intermediate', tags: ['integral'] },
                    '定积分': { docPath: 'Mathematics/微积分/定积分', level: 'intermediate', tags: ['definite'] },
                    '多元函数极限、连续与微分': { docPath: 'Mathematics/微积分/多元函数的极限、连续与微分', level: 'advanced', tags: ['multivariable'] },
                    '多元函数微积分学综合': { docPath: 'Mathematics/微积分/多元函数微积分学综合', level: 'advanced', tags: ['multivariable'] },
                    '微分中值定理': { docPath: 'Mathematics/微积分/微分中值定理', level: 'advanced', tags: ['mvt'] },
                    '微分方程': { docPath: 'Mathematics/微积分/微分方程', level: 'advanced', tags: ['ode'] },
                    '级数': { docPath: 'Mathematics/微积分/级数', level: 'advanced', tags: ['series'] },
                    '线面积分': { docPath: 'Mathematics/微积分/线面积分', level: 'advanced', tags: ['integral'] }
                }
            },
            '线性代数': {
                docPath: 'Mathematics/线性代数',
                skills: {
                    '行列式': { docPath: 'Mathematics/线性代数/行列式', level: 'intermediate', tags: ['determinant'] },
                    '矩阵及其运算': { docPath: 'Mathematics/线性代数/矩阵及其运算', level: 'intermediate', tags: ['matrix'] },
                    '矩阵的初等变换与线性方程组': { docPath: 'Mathematics/线性代数/矩阵的初等变换与线性方程组', level: 'intermediate', tags: ['equation'] },
                    '向量组的线性相关性': { docPath: 'Mathematics/线性代数/向量组的线性相关性', level: 'advanced', tags: ['dependence'] },
                    '相似矩阵及二次型': { docPath: 'Mathematics/线性代数/相似矩阵及二次型', level: 'advanced', tags: ['similarity'] },
                    '线性空间与线性变换': { docPath: 'Mathematics/线性代数/线性空间与线性变换', level: 'advanced', tags: ['space'] }
                }
            },
            '概率论与数理统计': {
                docPath: 'Mathematics/概率论与数理统计',
                skills: {
                    '基本概念': { docPath: 'Mathematics/概率论与数理统计/基本概念', level: 'beginner', tags: ['probability'] },
                    '随机变量及其分布': { docPath: 'Mathematics/概率论与数理统计/随机变量及其分布', level: 'intermediate', tags: ['distribution'] },
                    '多维随机变量及其分布': { docPath: 'Mathematics/概率论与数理统计/多维随机变量及其分布', level: 'advanced', tags: ['multivariate'] },
                    '随机变量的数字特征': { docPath: 'Mathematics/概率论与数理统计/随机变量的数字特征', level: 'intermediate', tags: ['expectation'] },
                    '大数定律及中心极限定理': { docPath: 'Mathematics/概率论与数理统计/大数定律及中心极限定理', level: 'advanced', tags: ['limit'] },
                    '参数估计': { docPath: 'Mathematics/概率论与数理统计/参数估计', level: 'intermediate', tags: ['estimation'] },
                    '假设检验': { docPath: 'Mathematics/概率论与数理统计/假设检验', level: 'intermediate', tags: ['testing'] },
                    '样本及抽样分布': { docPath: 'Mathematics/概率论与数理统计/样本及抽样分布', level: 'intermediate', tags: ['sampling'] },
                    '方差分析及回归分析': { docPath: 'Mathematics/概率论与数理统计/方差分析及回归分析', level: 'advanced', tags: ['anova'] },
                    '时间序列分析': { docPath: 'Mathematics/概率论与数理统计/时间序列分析', level: 'advanced', tags: ['time-series'] },
                    '平稳随机过程': { docPath: 'Mathematics/概率论与数理统计/平稳随机过程', level: 'advanced', tags: ['process'] },
                    '随机过程': { docPath: 'Mathematics/概率论与数理统计/随机过程', level: 'advanced', tags: ['process'] },
                    '马尔科夫链': { docPath: 'Mathematics/概率论与数理统计/马尔科夫链', level: 'advanced', tags: ['markov'] },
                    'bootstrap方法': { docPath: 'Mathematics/概率论与数理统计/bootstrap方法', level: 'advanced', tags: ['bootstrap'] },
                    'R的应用': { docPath: 'Mathematics/概率论与数理统计/R的应用', level: 'intermediate', tags: ['r'] }
                }
            },
            '旋量代数与李群李代数': {
                docPath: 'Mathematics/旋量代数与李群李代数',
                skills: {
                    '绪论': { docPath: 'Mathematics/旋量代数与李群李代数/绪论', level: 'beginner', tags: ['lie'] },
                    '直线几何': { docPath: 'Mathematics/旋量代数与李群李代数/直线几何', level: 'intermediate', tags: ['geometry'] },
                    '位移算子、指数映射与李群': { docPath: 'Mathematics/旋量代数与李群李代数/位移算子、指数映射与李群', level: 'advanced', tags: ['exponential'] },
                    '旋量代数与李代数及李运算': { docPath: 'Mathematics/旋量代数与李群李代数/旋量代数与李代数及李运算', level: 'advanced', tags: ['algebra'] },
                    '互易性与旋量系': { docPath: 'Mathematics/旋量代数与李群李代数/互易性与旋量系', level: 'advanced', tags: ['reciprocity'] },
                    '旋量系关联关系理论': { docPath: 'Mathematics/旋量代数与李群李代数/旋量系关联关系理论', level: 'advanced', tags: ['relation'] },
                    '旋量系对偶原理与分解定理': { docPath: 'Mathematics/旋量代数与李群李代数/旋量系对偶原理与分解定理', level: 'advanced', tags: ['duality'] },
                    '旋量系零空间构造理论': { docPath: 'Mathematics/旋量代数与李群李代数/旋量系零空间构造理论', level: 'advanced', tags: ['null-space'] }
                }
            }
        }
    },
    'Robotics': {
        color: '#06B6D4',
        docPath: 'Robotics/机器人学',
        subcategories: {
            '机器人不同构型实践': {
                docPath: 'Robotics/机器人不同构型实践',
                skills: {
                    'rikibotROS小车': { docPath: 'Robotics/机器人不同构型实践/rikibotROS小车', level: 'intermediate', tags: ['robot'] },
                    '云津日记': { docPath: 'Robotics/机器人不同构型实践/云津日记', level: 'intermediate', tags: ['project'] }
                }
            },
            '高等机器人控制': {
                docPath: 'Robotics/高等机器人控制',
                skills: {
                    '非线性控制在机器人中的应用': { docPath: 'Robotics/高等机器人控制/非线性控制在机器人中的应用', level: 'advanced', tags: ['nonlinear-control'] }
                }
            },
            'ROS': {
                docPath: 'Robotics/ROS',
                skills: {
                    'ROS基本操作': { docPath: 'Robotics/ROS/ROS基本操作', level: 'beginner', tags: ['ros'] },
                    '话题通信机制': { docPath: 'Robotics/ROS/话题通信机制', level: 'intermediate', tags: ['communication'] },
                    'ROS安装流程': { docPath: 'Robotics/ROS/ROS安装流程', level: 'beginner', tags: ['install'] },
                    'ROS': { docPath: 'Robotics/ROS/ROS', level: 'beginner', tags: ['ros'] },
                    'Coppeliasim': { docPath: 'Robotics/ROS/Coppeliasim', level: 'intermediate', tags: ['simulation'] },
                    'Coppeliasim基本操作': { docPath: 'Robotics/ROS/Coppeliasim基本操作', level: 'intermediate', tags: ['simulation'] },
                    '总复习': { docPath: 'Robotics/ROS/总复习', level: 'advanced', tags: ['review'] }
                }
            },
            '机器人学导论': {
                docPath: 'Robotics/机器人学导论',
                skills: {
                    '空间描述与变换': { docPath: 'Robotics/机器人学导论/空间描述与变换', level: 'intermediate', tags: ['kinematics'] },
                    '机器人正运动学': { docPath: 'Robotics/机器人学导论/机器人正运动学', level: 'intermediate', tags: ['forward'] },
                    '机器人逆运动学': { docPath: 'Robotics/机器人学导论/机器人逆运动学', level: 'advanced', tags: ['inverse'] }
                }
            },
            '机器人运动控制': {
                docPath: 'Robotics/机器人运动控制',
                skills: {
                    '概述': { docPath: 'Robotics/机器人运动控制/概述', level: 'beginner', tags: ['overview'] },
                    '机器人系统构成': { docPath: 'Robotics/机器人运动控制/机器人系统构成', level: 'intermediate', tags: ['system'] },
                    '数学模型': { docPath: 'Robotics/机器人运动控制/数学模型', level: 'intermediate', tags: ['model'] },
                    '机器人运动学基础': { docPath: 'Robotics/机器人运动控制/机器人运动学基础', level: 'intermediate', tags: ['kinematics'] },
                    '机器人系统电学设计': { docPath: 'Robotics/机器人运动控制/机器人系统电学设计', level: 'intermediate', tags: ['electrical'] },
                    '机器人底层控制': { docPath: 'Robotics/机器人运动控制/机器人底层控制', level: 'advanced', tags: ['low-level'] },
                    '机器人上层控制': { docPath: 'Robotics/机器人运动控制/机器人上层控制', level: 'advanced', tags: ['high-level'] },
                    '移动机器人路径规划': { docPath: 'Robotics/机器人运动控制/移动机器人路径规划', level: 'advanced', tags: ['planning'] },
                    '机器人视觉': { docPath: 'Robotics/机器人运动控制/机器人视觉', level: 'advanced', tags: ['vision'] }
                }
            },
            '视觉SLAM十四讲': {
                docPath: 'Robotics/视觉SLAM十四讲',
                skills: {
                    'Eigen实验': { docPath: 'Robotics/视觉SLAM十四讲/Eigen实验', level: 'intermediate', tags: ['slam'] }
                }
            }
        }
    },
    'Machinery': {
        color: '#F59E0B',
        docPath: 'Machinery/机械设计',
        subcategories: {
            '机械设计': {
                docPath: 'Machinery/机械设计',
                skills: {
                    '平面机构的自由度和速度分析': { docPath: 'Machinery/机械设计/平面机构的自由度和速度分析', level: 'intermediate', tags: ['mechanism'] },
                    '平面连杆机构': { docPath: 'Machinery/机械设计/平面连杆机构', level: 'intermediate', tags: ['linkage'] },
                    '凸轮机构': { docPath: 'Machinery/机械设计/凸轮机构', level: 'intermediate', tags: ['cam'] },
                    '齿轮机构': { docPath: 'Machinery/机械设计/齿轮机构', level: 'intermediate', tags: ['gear'] },
                    '轮系': { docPath: 'Machinery/机械设计/轮系', level: 'intermediate', tags: ['train'] },
                    '连接': { docPath: 'Machinery/机械设计/连接', level: 'intermediate', tags: ['fastener'] },
                    '齿轮传动': { docPath: 'Machinery/机械设计/齿轮传动', level: 'intermediate', tags: ['transmission'] },
                    '蜗杆传动': { docPath: 'Machinery/机械设计/蜗杆传动', level: 'advanced', tags: ['worm'] },
                    '带传动': { docPath: 'Machinery/机械设计/带传动', level: 'intermediate', tags: ['belt'] },
                    '轴': { docPath: 'Machinery/机械设计/轴', level: 'intermediate', tags: ['shaft'] },
                    '滚动轴承': { docPath: 'Machinery/机械设计/滚动轴承', level: 'intermediate', tags: ['bearing'] }
                }
            },
            'Pyslvs': {
                docPath: 'Machinery/Pyslvs',
                skills: {
                    'Pyslvs使用教程': { docPath: 'Machinery/Pyslvs/Pyslvs使用教程', level: 'intermediate', tags: ['pyslvs'] }
                }
            }
        }
    },
    'Mechanics': {
        color: '#6B7280',
        docPath: 'Mechanics/力学',
        subcategories: {
            '刚体动力学': {
                docPath: 'Mechanics/刚体动力学',
                topics: {
                    'RBDL': {
                        docPath: 'Mechanics/刚体动力学/RBDL',
                        skills: {
                            'Dynamics': { docPath: 'Mechanics/刚体动力学/RBDL/Dynamics', level: 'advanced', tags: ['rbdl'] },
                            'Details': { docPath: 'Mechanics/刚体动力学/RBDL/Details', level: 'advanced', tags: ['rbdl'] }
                        }
                    }
                }
            },
            'Adams': {
                docPath: 'Mechanics/Adams',
                skills: {
                    'Adams入门教程': { docPath: 'Mechanics/Adams/Adams入门教程', level: 'intermediate', tags: ['adams'] }
                }
            }
        }
    },
    'Paper': {
        color: '#F97316',
        docPath: 'Paper',
        subcategories: {
            '论文复现': {
                docPath: 'Paper/论文复现',
                skills: {
                    'CodeAsPolicies': { docPath: 'Paper/论文复现/CodeAsPolicies-JackyLiang等', level: 'advanced', tags: ['paper'] },
                    'ViT': { docPath: 'Paper/论文复现/ViT-Alexey Dosovitskiy等', level: 'advanced', tags: ['vision'] },
                    'Voxposer': { docPath: 'Paper/论文复现/Voxposer-李飞飞等', level: 'advanced', tags: ['robotics'] }
                }
            }
        }
    },
    'PLC': {
        color: '#6366F1',
        docPath: 'PLC',
        subcategories: {
            'Siemens PLC': {
                docPath: 'PLC',
                skills: {
                    'Siemens PLC': { docPath: 'PLC/Siemens PLC', level: 'intermediate', tags: ['plc'] }
                }
            }
        }
    },
    'Sensor': {
        color: '#84CC16',
        docPath: 'Sensor/仪器科学与技术',
        subcategories: {
            '传感器与机器人感知技术': {
                docPath: 'Sensor/传感器与机器人感知技术',
                skills: {
                    '概述': { docPath: 'Sensor/传感器与机器人感知技术/概述', level: 'beginner', tags: ['sensor'] },
                    '传感器信号采集及数据处理技术': { docPath: 'Sensor/传感器与机器人感知技术/传感器信号采集及数据处理技术', level: 'intermediate', tags: ['signal'] },
                    '机器人内部传感器': { docPath: 'Sensor/传感器与机器人感知技术/机器人内部传感器', level: 'intermediate', tags: ['internal'] },
                    '机器人外部传感器': { docPath: 'Sensor/传感器与机器人感知技术/机器人外部传感器', level: 'intermediate', tags: ['external'] },
                    '智能传感器及新型传感器': { docPath: 'Sensor/传感器与机器人感知技术/智能传感器及新型传感器', level: 'advanced', tags: ['smart'] },
                    '机器人及机械臂上传感器的应用示例': { docPath: 'Sensor/传感器与机器人感知技术/机器人及机械臂上传感器的应用示例', level: 'intermediate', tags: ['application'] }
                }
            }
        }
    },
    'Synbio': {
        color: '#14B8A6',
        docPath: 'Synbio/生物信息学',
        subcategories: {
            '生物信息学': {
                docPath: 'Synbio',
                skills: {
                    '生物信息学': { docPath: 'Synbio/生物信息学', level: 'intermediate', tags: ['bio'] },
                    '化信问题解决': { docPath: 'Synbio/记替朋友解决的一个化信问题', level: 'intermediate', tags: ['chemistry'] }
                }
            }
        }
    }
};

    Object.keys(categories).forEach(category => {
    const categoryInfo = categories[category];
    // Category 节点
    nodes.push({
        id: category,
        title: category,
        category: category,
        type: 'category',
        level: 'expert',
        color: categoryInfo.color,
        docPath: categoryInfo.docPath,
        progress: 100
    });

    const subcategories = categoryInfo.subcategories || {};
    Object.keys(subcategories).forEach(subcategory => {
        const subcategoryInfo = subcategories[subcategory];
        const subId = `${category}-${subcategory}`;
        // Subcategory 节点
        nodes.push({
            id: subId,
            title: subcategory,
            category: category,
            type: 'subcategory',
            color: categoryInfo.color,
            docPath: subcategoryInfo.docPath,
            progress: 80
        });
        links.push({ source: category, target: subId, type: 'contains' });

        // === 处理 topics（新增）===
        const topics = subcategoryInfo.topics || {};
        Object.keys(topics).forEach(topic => {
            const topicInfo = topics[topic];
            const topicId = `${subId}-${topic}`;
            nodes.push({
                id: topicId,
                title: topic,
                category: category,
                type: 'topics',  // 注意类型是 'topics'
                color: categoryInfo.color,
                docPath: topicInfo.docPath,
                progress: 60
            });
            links.push({ source: subId, target: topicId, type: 'contains' });

            const skills = topicInfo.skills || {};
            Object.keys(skills).forEach(skillName => {
                const skillInfo = skills[skillName];
                const skillId = `${topicId}-${skillName}`;
                nodes.push({
                    id: skillId,
                    title: skillName,
                    category: category,
                    type: 'skill',
                    level: skillInfo.level,
                    color: categoryInfo.color,
                    docPath: skillInfo.docPath,
                    progress: Math.random() * 100
                });
                links.push({ source: topicId, target: skillId, type: 'contains' });
            });
        });

        // === 兼容无 topic 的 direct skills ===
        const directSkills = subcategoryInfo.skills || {};
        Object.keys(directSkills).forEach(skillName => {
            const skillInfo = directSkills[skillName];
            const skillId = `${subId}-${skillName}`;
            nodes.push({
                id: skillId,
                title: skillName,
                category: category,
                type: 'skill',
                level: skillInfo.level,
                color: categoryInfo.color,
                docPath: skillInfo.docPath,
                progress: Math.random() * 100
            });
            links.push({ source: subId, target: skillId, type: 'contains' });
        });
    });
});

    // 添加知识关联
    addKnowledgeRelations(nodes, links);

    console.log('Generated complete docs data:', {
        nodes: nodes.length,
        links: links.length,
        samplePaths: nodes.slice(0, 5).map(n => ({ title: n.title, path: n.docPath }))
    });
    return { nodes, links };
};

// 添加知识关联
const addKnowledgeRelations = (nodes, links) => {
    // 数学与机器学习的关系
    addRelation(nodes, links,
        'Mathematics-线性代数-矩阵运算',
        'Computering-机器学习-监督学习',
        'prerequisite'
    );

    // 控制理论与机器人
    addRelation(nodes, links,
        'Mathematics-微积分-微分方程',
        'Control-现代控制理论-状态空间解',
        'related'
    );

    // 电子与嵌入式
    addRelation(nodes, links,
        'Electronic-信号与系统-傅里叶级数',
        'Electronic-嵌入式-蓝桥杯嵌入式速通',
        'applies_to'
    );

    // 计算机与机器人
    addRelation(nodes, links,
        'Computering-编程语言-C++概述',
        'Robotics-ROS-ROS基本操作',
        'prerequisite'
    );

    // 数学与信号处理
    addRelation(nodes, links,
        'Mathematics-概率论与数理统计-基本概念',
        'Electronic-信号与系统-信号与系统概述',
        'related'
    );

    addRelation(nodes, links,
        'Machinery-机械设计-平面机构自由度',
        'Robotics-机器人学导论-正运动学',
        'prerequisite'
    );

    // 力学与机械
    addRelation(nodes, links,
        'Mechanics-刚体动力学-RBDL Dynamics',
        'Machinery-机械设计-齿轮传动',
        'applies_to'
    );

    // 传感器与机器人
    addRelation(nodes, links,
        'Sensor-传感器与机器人感知技术-外部传感器',
        'Robotics-机器人运动控制-系统构成',
        'related'
    );

    // 控制与PLC
    addRelation(nodes, links,
        'Control-自动控制原理-PID控制',
        'PLC-Siemens PLC-Siemens PLC',
        'applies_to'
    );
};

const addRelation = (nodes, links, sourceId, targetId, type) => {
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);

    if (source && target) {
        links.push({
            source: sourceId,
            target: targetId,
            type: type,
            strength: 0.6
        });
    } else {
        console.warn(`Cannot create relation: ${sourceId} -> ${targetId}, nodes not found`);
    }
};
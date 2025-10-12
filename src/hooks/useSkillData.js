// src/hooks/useSkillData.js
import { useMemo } from 'react';

export const useSkillData = () => {
    return useMemo(() => {
        try {
            const data = generateCompleteDocsData();

            // 验证数据完整性
            validateData(data);

            return data;
        } catch (error) {
            console.error('获取技能数据失败:', error);
            return { nodes: [], links: [] };
        }
    }, []);
};

// 数据验证函数
const validateData = (data) => {
    const { nodes, links } = data;

    // 验证节点
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

        // 验证文档路径
        if (node.docPath) {
            node.docPath = cleanDocPath(node.docPath);
        }
    });

    // 验证链接
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

// 清理文档路径函数 - 移除数字前缀和文件扩展名
const cleanDocPath = (path) => {
    if (!path) return '';

    // 移除文件扩展名
    let cleanPath = path.replace(/\.mdx?$/, '');

    // 移除数字前缀（如 "01-"）
    cleanPath = cleanPath.replace(/\d+-/g, '');

    // 确保路径不以斜杠开头
    cleanPath = cleanPath.replace(/^\//, '');

    return cleanPath;
};

// 基于你的完整docs结构生成数据
const generateCompleteDocsData = () => {
    const nodes = [];
    const links = [];

    // 完整的分类结构，与你的docs目录完全对应
    const categories = {
        'Computering': {
            color: '#3B82F6',
            docPath: 'Computering/计算机科学与技术',
            subcategories: {
                'Linux': {
                    docPath: 'Computering/Linux',
                    skills: {
                        'Shell基础': {
                            docPath: 'Computering/Linux/Shell',
                            level: 'beginner',
                            tags: ['shell', 'linux']
                        },
                        'Shell工具与脚本': {
                            docPath: 'Computering/Linux/Shell工具与脚本',
                            level: 'intermediate',
                            tags: ['scripting', 'tools']
                        },
                        'Linux系统简介': {
                            docPath: 'Computering/Linux/Linux系统简介',
                            level: 'beginner',
                            tags: ['system']
                        },
                        'Linux文件系统': {
                            docPath: 'Computering/Linux/Linux文件系统',
                            level: 'intermediate',
                            tags: ['filesystem']
                        },
                        'Shell压缩命令': {
                            docPath: 'Computering/Linux/Shell压缩命令',
                            level: 'beginner',
                            tags: ['compression']
                        },
                        '字符设备驱动框架': {
                            docPath: 'Computering/Linux/Linux驱动开发/字符设备驱动框架',
                            level: 'advanced',
                            tags: ['driver', 'kernel']
                        }
                    }
                },
                'WEB开发': {
                    docPath: 'Computering/WEB开发',
                    skills: {
                        'WEB技能树': {
                            docPath: 'Computering/WEB开发/WEB技能树',
                            level: 'intermediate',
                            tags: ['web', 'overview']
                        },
                        'Docusaurus插件': {
                            docPath: 'Computering/WEB开发/Docusaurus/Plugins',
                            level: 'intermediate',
                            tags: ['docusaurus', 'plugins']
                        },
                        'Docusaurus Swizzle': {
                            docPath: 'Computering/WEB开发/Docusaurus/Swizzle',
                            level: 'advanced',
                            tags: ['docusaurus', 'customization']
                        },
                        'Vercel部署': {
                            docPath: 'Computering/WEB开发/Docusaurus/Vercel联合部署',
                            level: 'intermediate',
                            tags: ['deployment', 'vercel']
                        }
                    }
                },
                '信息安全': {
                    docPath: 'Computering/信息安全',
                    skills: {
                        '密码基础': {
                            docPath: 'Computering/信息安全/密码学/密码基础',
                            level: 'intermediate',
                            tags: ['crypto', 'security']
                        }
                    }
                },
                '实用工作流': {
                    docPath: 'Computering/实用工作流',
                    skills: {
                        'Markdown入门': {
                            docPath: 'Computering/实用工作流/8分钟入门Markdown',
                            level: 'beginner',
                            tags: ['markdown', 'writing']
                        },
                        'Git版本控制': {
                            docPath: 'Computering/实用工作流/Git',
                            level: 'intermediate',
                            tags: ['git', 'version-control']
                        }
                    }
                },
                '并行计算与分布式系统': {
                    docPath: 'Computering/并行计算与分布式系统',
                    skills: {
                        'P-tuning和Adapter': {
                            docPath: 'Computering/并行计算与分布式系统/Fine-tunning/P-tuning和Adapter',
                            level: 'advanced',
                            tags: ['fine-tuning', 'efficiency']
                        },
                        '全量微调': {
                            docPath: 'Computering/并行计算与分布式系统/Fine-tunning/全量微调',
                            level: 'advanced',
                            tags: ['fine-tuning']
                        },
                        '显存计算': {
                            docPath: 'Computering/并行计算与分布式系统/Fine-tunning/显存计算',
                            level: 'advanced',
                            tags: ['gpu', 'memory']
                        },
                        '模型评估': {
                            docPath: 'Computering/并行计算与分布式系统/Fine-tunning/模型评估',
                            level: 'intermediate',
                            tags: ['evaluation', 'metrics']
                        },
                        'CUDA基础': {
                            docPath: 'Computering/并行计算与分布式系统/GPU编程/CUDA基础',
                            level: 'intermediate',
                            tags: ['gpu', 'cuda']
                        },
                        'DPO和PPO算法': {
                            docPath: 'Computering/并行计算与分布式系统/RLHF技术/DPO和PPO算法',
                            level: 'advanced',
                            tags: ['rlhf', 'alignment']
                        },
                        'Reward Model': {
                            docPath: 'Computering/并行计算与分布式系统/RLHF技术/Reward Model',
                            level: 'advanced',
                            tags: ['rlhf', 'reward']
                        },
                        'RLHF': {
                            docPath: 'Computering/并行计算与分布式系统/RLHF技术/RLHF',
                            level: 'advanced',
                            tags: ['rlhf', 'alignment']
                        },
                        '绪论': {
                            docPath: 'Computering/并行计算与分布式系统/协同进化计算与多智能体系统/绪论',
                            level: 'intermediate',
                            tags: ['multi-agent', 'evolution']
                        },
                        'MOE并行与Deepspeed': {
                            docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/MOE并行与Deepspeed',
                            level: 'advanced',
                            tags: ['distributed', 'moe']
                        },
                        '多维混合并行与自动并行': {
                            docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/多维混合并行与自动并行',
                            level: 'advanced',
                            tags: ['parallel', 'automation']
                        },
                        '数据并行和模型并行': {
                            docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/数据并行和模型并行',
                            level: 'intermediate',
                            tags: ['parallel', 'distributed']
                        },
                        '流水线并行与张量并行': {
                            docPath: 'Computering/并行计算与分布式系统/模型分布式训练和并行计算/流水线并行与张量并行',
                            level: 'advanced',
                            tags: ['pipeline', 'tensor']
                        },
                        'HIP异构编程模型': {
                            docPath: 'Computering/并行计算与分布式系统/高性能计算HPC/HIP异构编程模型',
                            level: 'advanced',
                            tags: ['hpc', 'hip']
                        },
                        '优化程序性能方法概览': {
                            docPath: 'Computering/并行计算与分布式系统/高性能计算HPC/优化程序性能方法概览',
                            level: 'intermediate',
                            tags: ['optimization', 'performance']
                        }
                    }
                },
                '数字图像处理': {
                    docPath: 'Computering/数字图像处理',
                    skills: {
                        '数字图像基础': {
                            docPath: 'Computering/数字图像处理/数字图像基础',
                            level: 'intermediate',
                            tags: ['image-processing', 'basics']
                        },
                        '数字图像特征': {
                            docPath: 'Computering/数字图像处理/数字图像特征',
                            level: 'intermediate',
                            tags: ['features', 'analysis']
                        },
                        '离散二维处理': {
                            docPath: 'Computering/数字图像处理/离散二维处理',
                            level: 'advanced',
                            tags: ['2d', 'processing']
                        },
                        '图像改进': {
                            docPath: 'Computering/数字图像处理/图像改进',
                            level: 'intermediate',
                            tags: ['enhancement', 'improvement']
                        },
                        '图像分析': {
                            docPath: 'Computering/数字图像处理/图像分析',
                            level: 'advanced',
                            tags: ['analysis', 'processing']
                        },
                        '图像处理软件': {
                            docPath: 'Computering/数字图像处理/图像处理软件',
                            level: 'beginner',
                            tags: ['software', 'tools']
                        },
                        'YOLOv10速通': {
                            docPath: 'Computering/数字图像处理/速通yoloV10',
                            level: 'advanced',
                            tags: ['yolo', 'object-detection']
                        }
                    }
                },
                '数据结构与算法': {
                    docPath: 'Computering/数据结构与算法',
                    skills: {
                        '数据结构概述': {
                            docPath: 'Computering/数据结构与算法/数据结构',
                            level: 'intermediate',
                            tags: ['data-structures', 'overview']
                        },
                        '算法概述': {
                            docPath: 'Computering/数据结构与算法/算法',
                            level: 'intermediate',
                            tags: ['algorithms', 'overview']
                        },
                        'KMP算法': {
                            docPath: 'Computering/数据结构与算法/数据结构/KMP',
                            level: 'advanced',
                            tags: ['string-matching', 'algorithm']
                        },
                        'Trie树': {
                            docPath: 'Computering/数据结构与算法/数据结构/Trie',
                            level: 'intermediate',
                            tags: ['trie', 'data-structure']
                        },
                        '栈': {
                            docPath: 'Computering/数据结构与算法/数据结构/栈',
                            level: 'beginner',
                            tags: ['stack', 'data-structure']
                        },
                        '链表与邻接表': {
                            docPath: 'Computering/数据结构与算法/数据结构/链表与邻接表',
                            level: 'intermediate',
                            tags: ['linked-list', 'graph']
                        },
                        '队列': {
                            docPath: 'Computering/数据结构与算法/数据结构/队列',
                            level: 'beginner',
                            tags: ['queue', 'data-structure']
                        },
                        '排序算法': {
                            docPath: 'Computering/数据结构与算法/算法/排序',
                            level: 'intermediate',
                            tags: ['sorting', 'algorithms']
                        },
                        '动态规划基础': {
                            docPath: 'Computering/数据结构与算法/算法/简单DP',
                            level: 'intermediate',
                            tags: ['dynamic-programming', 'algorithms']
                        }
                    }
                },
                '机器学习': {
                    docPath: 'Computering/机器学习',
                    skills: {
                        '监督学习': {
                            docPath: 'Computering/机器学习/AAAMLP/SupervisedLearning监督学习',
                            level: 'intermediate',
                            tags: ['supervised-learning', 'ml']
                        },
                        '交叉验证': {
                            docPath: 'Computering/机器学习/AAAMLP/CrossValidation交叉验证',
                            level: 'intermediate',
                            tags: ['cross-validation', 'evaluation']
                        },
                        '评估指标': {
                            docPath: 'Computering/机器学习/AAAMLP/EvaluationMetrics评估指标',
                            level: 'intermediate',
                            tags: ['metrics', 'evaluation']
                        },
                        '组织机器学习项目': {
                            docPath: 'Computering/机器学习/AAAMLP/ArrangingMLProjects组织机器学习',
                            level: 'intermediate',
                            tags: ['project-management', 'mlops']
                        },
                        '处理分类变量': {
                            docPath: 'Computering/机器学习/AAAMLP/ApproachingCategoricalVar处理分类变量',
                            level: 'intermediate',
                            tags: ['categorical-data', 'preprocessing']
                        },
                        '特征工程': {
                            docPath: 'Computering/机器学习/AAAMLP/FeatureEngineering特征工程',
                            level: 'intermediate',
                            tags: ['feature-engineering', 'preprocessing']
                        },
                        '特征选择': {
                            docPath: 'Computering/机器学习/AAAMLP/FeatureSelection特征选择',
                            level: 'intermediate',
                            tags: ['feature-selection', 'optimization']
                        },
                        '超参数优化': {
                            docPath: 'Computering/机器学习/AAAMLP/HyperparameterOptimization超参数优化',
                            level: 'advanced',
                            tags: ['hyperparameter-tuning', 'optimization']
                        },
                        '图像分类和分割': {
                            docPath: 'Computering/机器学习/AAAMLP/ApproachingImageClassification&Segmentation图像分类和分割',
                            level: 'advanced',
                            tags: ['image-classification', 'segmentation']
                        },
                        '文本分类或回归': {
                            docPath: 'Computering/机器学习/AAAMLP/ApproachingTextClassification&Regression文本分类或回归',
                            level: 'advanced',
                            tags: ['nlp', 'text-classification']
                        },
                        '组合和堆叠': {
                            docPath: 'Computering/机器学习/AAAMLP/ApproachingEnsembling&Stacking组合和堆叠',
                            level: 'advanced',
                            tags: ['ensemble', 'stacking']
                        },
                        '可重复代码和模型': {
                            docPath: 'Computering/机器学习/AAAMLP/ApproachingReproducibleCode&ModelServing可重复代码和模型',
                            level: 'intermediate',
                            tags: ['reproducibility', 'mlops']
                        },
                        '阅读提示': {
                            docPath: 'Computering/机器学习/AAAMLP/阅读本系列的提示',
                            level: 'beginner',
                            tags: ['guidance', 'learning']
                        },
                        'Bellman公式': {
                            docPath: 'Computering/机器学习/强化学习/bellman公式',
                            level: 'advanced',
                            tags: ['reinforcement-learning', 'bellman']
                        },
                        '推荐系统概述': {
                            docPath: 'Computering/机器学习/推荐系统/概述',
                            level: 'intermediate',
                            tags: ['recommendation', 'overview']
                        },
                        '协同过滤': {
                            docPath: 'Computering/机器学习/推荐系统/协同过滤',
                            level: 'intermediate',
                            tags: ['collaborative-filtering', 'recommendation']
                        },
                        '深度学习概览': {
                            docPath: 'Computering/机器学习/深度学习/深度学习概览',
                            level: 'intermediate',
                            tags: ['deep-learning', 'overview']
                        },
                        'BP神经网络': {
                            docPath: 'Computering/机器学习/深度学习/BP神经网络',
                            level: 'advanced',
                            tags: ['neural-networks', 'backpropagation']
                        },
                        'LSTM': {
                            docPath: 'Computering/机器学习/深度学习/LSTM',
                            level: 'advanced',
                            tags: ['lstm', 'rnn']
                        }
                    }
                },
                '编程语言': {
                    docPath: 'Computering/编程语言',
                    skills: {
                        '编程语言概述': {
                            docPath: 'Computering/编程语言/编程语言',
                            level: 'beginner',
                            tags: ['programming', 'overview']
                        },
                        'C++概述': {
                            docPath: 'Computering/编程语言/C++/C++概述',
                            level: 'beginner',
                            tags: ['c++', 'overview']
                        },
                        'C++程序组成': {
                            docPath: 'Computering/编程语言/C++/C++程序的基本组成',
                            level: 'beginner',
                            tags: ['c++', 'basics']
                        },
                        '标识符和数据类型': {
                            docPath: 'Computering/编程语言/C++/标识符和数据类型',
                            level: 'beginner',
                            tags: ['c++', 'syntax']
                        },
                        'STL Vector': {
                            docPath: 'Computering/编程语言/C++/STL/vector',
                            level: 'intermediate',
                            tags: ['c++', 'stl', 'containers']
                        },
                        'Rust基础语法': {
                            docPath: 'Computering/编程语言/Rust/Rust基础语法',
                            level: 'intermediate',
                            tags: ['rust', 'syntax']
                        },
                        'OJ项目调研': {
                            docPath: 'Computering/编程语言/项目：实现一个OJ/调研、技术选型',
                            level: 'intermediate',
                            tags: ['project', 'oj']
                        },
                        'ArkTS': {
                            docPath: 'Computering/编程语言/鸿蒙/ArkTS',
                            level: 'intermediate',
                            tags: ['harmonyos', 'typescript']
                        }
                    }
                },
                '编译原理': {
                    docPath: 'Computering/编译原理',
                    skills: {
                        'TinyC': {
                            docPath: 'Computering/编译原理/TinyC',
                            level: 'advanced',
                            tags: ['compilers', 'tinyc']
                        }
                    }
                },
                '虚拟化容器': {
                    docPath: 'Computering/虚拟化容器',
                    skills: {
                        'Kubernetes扫盲': {
                            docPath: 'Computering/虚拟化容器/kubernetes扫盲',
                            level: 'intermediate',
                            tags: ['kubernetes', 'containers']
                        }
                    }
                },
                '计算机网络': {
                    docPath: 'Computering/计算机网络',
                    skills: {
                        '数据通信': {
                            docPath: 'Computering/计算机网络/数据通信',
                            level: 'intermediate',
                            tags: ['networking', 'data-communication']
                        },
                        '广域通信网': {
                            docPath: 'Computering/计算机网络/广域通信网',
                            level: 'intermediate',
                            tags: ['wan', 'networking']
                        },
                        '局域网和城域网': {
                            docPath: 'Computering/计算机网络/局域网和城域网',
                            level: 'intermediate',
                            tags: ['lan', 'man']
                        },
                        '无线通信网': {
                            docPath: 'Computering/计算机网络/无线通信网',
                            level: 'intermediate',
                            tags: ['wireless', 'networking']
                        },
                        '下一代互联网': {
                            docPath: 'Computering/计算机网络/下一代互联网',
                            level: 'advanced',
                            tags: ['ipv6', 'future-internet']
                        },
                        '网络安全': {
                            docPath: 'Computering/计算机网络/网络安全',
                            level: 'intermediate',
                            tags: ['security', 'networking']
                        },
                        '网络操作系统': {
                            docPath: 'Computering/计算机网络/网络操作系统与服务器',
                            level: 'intermediate',
                            tags: ['nos', 'servers']
                        },
                        '组网技术': {
                            docPath: 'Computering/计算机网络/组网技术',
                            level: 'intermediate',
                            tags: ['networking', 'configuration']
                        },
                        '网络管理': {
                            docPath: 'Computering/计算机网络/网络管理',
                            level: 'intermediate',
                            tags: ['network-management', 'administration']
                        },
                        '软件工程': {
                            docPath: 'Computering/计算机网络/软件工程',
                            level: 'intermediate',
                            tags: ['software-engineering', 'development']
                        },
                        '知识产权和标准化': {
                            docPath: 'Computering/计算机网络/知识产权和标准化',
                            level: 'beginner',
                            tags: ['ip', 'standards']
                        },
                        'DNS使用问题': {
                            docPath: 'Computering/计算机网络/漫谈DNS使用问题',
                            level: 'intermediate',
                            tags: ['dns', 'networking']
                        },
                        '代理Proxy': {
                            docPath: 'Computering/计算机网络/浅说代理Proxy',
                            level: 'intermediate',
                            tags: ['proxy', 'networking']
                        },
                        '传统发邮件方式': {
                            docPath: 'Computering/计算机网络/如何用传统的方式发邮件',
                            level: 'intermediate',
                            tags: ['email', 'protocols']
                        }
                    }
                }
            }
        },
        'Control': {
            color: '#10B981',
            docPath: 'Control/控制理论',
            subcategories: {
                'Simulink': {
                    docPath: 'Control/Simulink',
                    skills: {
                        'Simulink入门': {
                            docPath: 'Control/Simulink/Simulink入门',
                            level: 'beginner',
                            tags: ['simulink', 'simulation']
                        }
                    }
                },
                '微机原理': {
                    docPath: 'Control/微机原理',
                    skills: {
                        '计算机组成概览': {
                            docPath: 'Control/微机原理/计算机组成概览',
                            level: 'intermediate',
                            tags: ['computer-architecture', 'microcontrollers']
                        }
                    }
                },
                '机电传动控制': {
                    docPath: 'Control/机电传动控制',
                    skills: {
                        '概述': {
                            docPath: 'Control/机电传动控制/概述',
                            level: 'beginner',
                            tags: ['electromechanical', 'overview']
                        },
                        '动力学基础': {
                            docPath: 'Control/机电传动控制/机电传动系统的动力学基础',
                            level: 'intermediate',
                            tags: ['dynamics', 'modeling']
                        },
                        '直流电机': {
                            docPath: 'Control/机电传动控制/直流电机的工作原理及特性',
                            level: 'intermediate',
                            tags: ['dc-motor', 'electrical']
                        },
                        '交流电机': {
                            docPath: 'Control/机电传动控制/交流电机的工作原理及其特性',
                            level: 'intermediate',
                            tags: ['ac-motor', 'electrical']
                        },
                        '控制电机': {
                            docPath: 'Control/机电传动控制/控制电机',
                            level: 'advanced',
                            tags: ['control-motors', 'automation']
                        }
                    }
                },
                '现代控制理论': {
                    docPath: 'Control/现代控制理论',
                    skills: {
                        '绪论': {
                            docPath: 'Control/现代控制理论/绪论',
                            level: 'beginner',
                            tags: ['modern-control', 'overview']
                        },
                        '状态空间表达式': {
                            docPath: 'Control/现代控制理论/控制系统的状态空间表达式',
                            level: 'intermediate',
                            tags: ['state-space', 'modeling']
                        },
                        '状态空间解': {
                            docPath: 'Control/现代控制理论/控制系统状态空间表达式的解',
                            level: 'advanced',
                            tags: ['state-space', 'solutions']
                        },
                        '能控性和能观性': {
                            docPath: 'Control/现代控制理论/线性控制系统的能控性和能观性',
                            level: 'advanced',
                            tags: ['controllability', 'observability']
                        },
                        '李雅普诺夫方法': {
                            docPath: 'Control/现代控制理论/稳定性与李雅普诺夫方法',
                            level: 'advanced',
                            tags: ['lyapunov', 'stability']
                        },
                        '线性系统综合': {
                            docPath: 'Control/现代控制理论/线性定常系统的综合',
                            level: 'advanced',
                            tags: ['system-synthesis', 'control']
                        },
                        '最优控制': {
                            docPath: 'Control/现代控制理论/最优控制',
                            level: 'advanced',
                            tags: ['optimal-control', 'optimization']
                        }
                    }
                },
                '自动控制原理': {
                    docPath: 'Control/自动控制原理',
                    skills: {
                        'PID控制': {
                            docPath: 'Control/自动控制原理/PID',
                            level: 'intermediate',
                            tags: ['pid', 'control']
                        },
                        '自动控制概念': {
                            docPath: 'Control/自动控制原理/自动控制概念/自动控制的一般概念',
                            level: 'beginner',
                            tags: ['control-concepts', 'basics']
                        },
                        '控制系统数学模型': {
                            docPath: 'Control/自动控制原理/自动控制概念/控制系统的数学模型',
                            level: 'intermediate',
                            tags: ['mathematical-models', 'control']
                        }
                    }
                },
                '高阶控制理论': {
                    docPath: 'Control/高阶控制理论',
                    skills: {
                        '连续系统离散化': {
                            docPath: 'Control/高阶控制理论/连续系统离散化',
                            level: 'advanced',
                            tags: ['discretization', 'control-systems']
                        },
                        '动态系统分析': {
                            docPath: 'Control/高阶控制理论/动态系统分析',
                            level: 'advanced',
                            tags: ['dynamic-systems', 'analysis']
                        },
                        '系统可控性': {
                            docPath: 'Control/高阶控制理论/系统的可控性',
                            level: 'advanced',
                            tags: ['controllability', 'systems']
                        }
                    }
                }
            }
        },
        'Electronic': {
            color: '#F59E0B',
            docPath: 'Electronic/电子科学与技术',
            subcategories: {
                'FOC': {
                    docPath: 'Electronic/FOC',
                    skills: {
                        '标幺值': {
                            docPath: 'Electronic/FOC/标幺值',
                            level: 'intermediate',
                            tags: ['foc', 'electrical']
                        },
                        '克拉克与帕克变换': {
                            docPath: 'Electronic/FOC/克拉克变换与帕克变换',
                            level: 'advanced',
                            tags: ['clarke-park', 'transformations']
                        },
                        '开环调速': {
                            docPath: 'Electronic/FOC/开环调速',
                            level: 'intermediate',
                            tags: ['speed-control', 'foc']
                        }
                    }
                },
                'FPGA': {
                    docPath: 'Electronic/FPGA',
                    skills: {
                        'Verilog简介': {
                            docPath: 'Electronic/FPGA/Verilog/Verilog简介',
                            level: 'beginner',
                            tags: ['verilog', 'fpga']
                        },
                        'Verilog语法基础': {
                            docPath: 'Electronic/FPGA/Verilog/Verilog语法基础',
                            level: 'intermediate',
                            tags: ['verilog', 'syntax']
                        }
                    }
                },
                '信号与系统': {
                    docPath: 'Electronic/信号与系统',
                    skills: {
                        '信号与系统概述': {
                            docPath: 'Electronic/信号与系统/信号与系统',
                            level: 'beginner',
                            tags: ['signals', 'systems']
                        },
                        '线性时不变系统': {
                            docPath: 'Electronic/信号与系统/线性时不变系统',
                            level: 'intermediate',
                            tags: ['lti', 'systems']
                        },
                        '傅里叶级数': {
                            docPath: 'Electronic/信号与系统/周期信号的傅里叶级数表示',
                            level: 'intermediate',
                            tags: ['fourier-series', 'signals']
                        },
                        '连续时间傅里叶变换': {
                            docPath: 'Electronic/信号与系统/连续时间傅里叶变换',
                            level: 'advanced',
                            tags: ['fourier-transform', 'continuous']
                        },
                        '离散时间傅里叶变换': {
                            docPath: 'Electronic/信号与系统/离散时间傅里叶变换',
                            level: 'advanced',
                            tags: ['dtft', 'discrete']
                        },
                        '时域和频域特性': {
                            docPath: 'Electronic/信号与系统/信号与系统的时域和频域特性',
                            level: 'intermediate',
                            tags: ['time-domain', 'frequency-domain']
                        },
                        '采样': {
                            docPath: 'Electronic/信号与系统/采样',
                            level: 'intermediate',
                            tags: ['sampling', 'signals']
                        },
                        '通信系统': {
                            docPath: 'Electronic/信号与系统/通信系统',
                            level: 'intermediate',
                            tags: ['communication-systems']
                        },
                        '拉普拉斯变换': {
                            docPath: 'Electronic/信号与系统/拉普拉斯变换',
                            level: 'advanced',
                            tags: ['laplace-transform', 'signals']
                        },
                        '卡尔曼滤波器': {
                            docPath: 'Electronic/信号与系统/卡尔曼滤波器MATLAB实现',
                            level: 'advanced',
                            tags: ['kalman-filter', 'matlab']
                        }
                    }
                },
                '嵌入式': {
                    docPath: 'Electronic/嵌入式',
                    skills: {
                        '蓝桥杯嵌入式速通': {
                            docPath: 'Electronic/嵌入式/速通蓝桥杯嵌入式',
                            level: 'intermediate',
                            tags: ['embedded', 'competition']
                        },
                        'FreeRTOS初步': {
                            docPath: 'Electronic/嵌入式/FreeRTOS/FreeRTOS初步',
                            level: 'intermediate',
                            tags: ['freertos', 'rtos']
                        },
                        'GPIO': {
                            docPath: 'Electronic/嵌入式/STM32/GPIO',
                            level: 'beginner',
                            tags: ['stm32', 'gpio']
                        },
                        '外部中断': {
                            docPath: 'Electronic/嵌入式/STM32/EXTI外部中断',
                            level: 'intermediate',
                            tags: ['stm32', 'interrupts']
                        }
                        // 可以继续添加更多STM32技能...
                    }
                },
                '滤波器设计': {
                    docPath: 'Electronic/滤波器设计',
                    skills: {
                        '滤波器设计概述': {
                            docPath: 'Electronic/滤波器设计/滤波器设计概述',
                            level: 'beginner',
                            tags: ['filters', 'design']
                        },
                        '频率响应与时间响应': {
                            docPath: 'Electronic/滤波器设计/滤波器的频率响应与时间响应特性',
                            level: 'intermediate',
                            tags: ['frequency-response', 'time-response']
                        }
                    }
                },
                '电源设计': {
                    docPath: 'Electronic/电源设计',
                    skills: {
                        '电源系统介绍': {
                            docPath: 'Electronic/电源设计/电源系统介绍',
                            level: 'beginner',
                            tags: ['power-supply', 'electronics']
                        }
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
                        '微积分概述': {
                            docPath: 'Mathematics/微积分/微积分',
                            level: 'beginner',
                            tags: ['calculus', 'overview']
                        },
                        '不定积分': {
                            docPath: 'Mathematics/微积分/不定积分',
                            level: 'intermediate',
                            tags: ['integral-calculus', 'integration']
                        },
                        '多元函数微积分': {
                            docPath: 'Mathematics/微积分/多元函数微积分学综合',
                            level: 'advanced',
                            tags: ['multivariable', 'calculus']
                        },
                        '多元函数极限与微分': {
                            docPath: 'Mathematics/微积分/多元函数的极限、连续与微分',
                            level: 'advanced',
                            tags: ['multivariable', 'limits']
                        },
                        '定积分': {
                            docPath: 'Mathematics/微积分/定积分',
                            level: 'intermediate',
                            tags: ['definite-integral', 'integration']
                        },
                        '微分中值定理': {
                            docPath: 'Mathematics/微积分/微分中值定理',
                            level: 'advanced',
                            tags: ['mean-value-theorem', 'calculus']
                        },
                        '微分方程': {
                            docPath: 'Mathematics/微积分/微分方程',
                            level: 'advanced',
                            tags: ['differential-equations', 'mathematics']
                        },
                        '级数': {
                            docPath: 'Mathematics/微积分/级数',
                            level: 'advanced',
                            tags: ['series', 'mathematics']
                        },
                        '线面积分': {
                            docPath: 'Mathematics/微积分/线面积分',
                            level: 'advanced',
                            tags: ['line-integral', 'surface-integral']
                        }
                    }
                },
                '线性代数': {
                    docPath: 'Mathematics/线性代数',
                    skills: {
                        '行列式': {
                            docPath: 'Mathematics/线性代数/行列式',
                            level: 'intermediate',
                            tags: ['determinants', 'linear-algebra']
                        },
                        '矩阵运算': {
                            docPath: 'Mathematics/线性代数/矩阵及其运算',
                            level: 'intermediate',
                            tags: ['matrices', 'linear-algebra']
                        },
                        '线性方程组': {
                            docPath: 'Mathematics/线性代数/矩阵的初等变换与线性方程组',
                            level: 'intermediate',
                            tags: ['linear-equations', 'matrices']
                        },
                        '向量组线性相关性': {
                            docPath: 'Mathematics/线性代数/向量组的线性相关性',
                            level: 'advanced',
                            tags: ['linear-dependence', 'vectors']
                        },
                        '相似矩阵与二次型': {
                            docPath: 'Mathematics/线性代数/相似矩阵及二次型',
                            level: 'advanced',
                            tags: ['similar-matrices', 'quadratic-forms']
                        },
                        '线性空间': {
                            docPath: 'Mathematics/线性代数/线性空间与线性变换',
                            level: 'advanced',
                            tags: ['vector-spaces', 'linear-transformations']
                        }
                    }
                },
                '概率论与数理统计': {
                    docPath: 'Mathematics/概率论与数理统计',
                    skills: {
                        '基本概念': {
                            docPath: 'Mathematics/概率论与数理统计/基本概念',
                            level: 'beginner',
                            tags: ['probability', 'basics']
                        },
                        '随机变量及其分布': {
                            docPath: 'Mathematics/概率论与数理统计/随机变量及其分布',
                            level: 'intermediate',
                            tags: ['random-variables', 'distributions']
                        },
                        '多维随机变量': {
                            docPath: 'Mathematics/概率论与数理统计/多维随机变量及其分布',
                            level: 'advanced',
                            tags: ['multivariate', 'distributions']
                        },
                        '数字特征': {
                            docPath: 'Mathematics/概率论与数理统计/随机变量的数字特征',
                            level: 'intermediate',
                            tags: ['expectation', 'variance']
                        },
                        '大数定律': {
                            docPath: 'Mathematics/概率论与数理统计/大数定律及中心极限定理',
                            level: 'advanced',
                            tags: ['law-of-large-numbers', 'central-limit-theorem']
                        },
                        '参数估计': {
                            docPath: 'Mathematics/概率论与数理统计/参数估计',
                            level: 'intermediate',
                            tags: ['parameter-estimation', 'statistics']
                        },
                        '假设检验': {
                            docPath: 'Mathematics/概率论与数理统计/假设检验',
                            level: 'intermediate',
                            tags: ['hypothesis-testing', 'statistics']
                        }
                    }
                }
            }
        },
        'Robotics': {
            color: '#EF4444',
            docPath: 'Robotics/机器人学',
            subcategories: {
                'ROS': {
                    docPath: 'Robotics/ROS',
                    skills: {
                        'ROS基本操作': {
                            docPath: 'Robotics/ROS/ROS基本操作',
                            level: 'beginner',
                            tags: ['ros', 'basics']
                        },
                        '话题通信': {
                            docPath: 'Robotics/ROS/话题通信机制',
                            level: 'intermediate',
                            tags: ['ros', 'communication']
                        },
                        'ROS安装': {
                            docPath: 'Robotics/ROS/ROS安装流程',
                            level: 'beginner',
                            tags: ['ros', 'installation']
                        },
                        'Coppeliasim': {
                            docPath: 'Robotics/ROS/Coppeliasim',
                            level: 'intermediate',
                            tags: ['coppeliasim', 'simulation']
                        }
                    }
                },
                '机器人学导论': {
                    docPath: 'Robotics/机器人学导论',
                    skills: {
                        '空间描述与变换': {
                            docPath: 'Robotics/机器人学导论/空间描述与变换',
                            level: 'intermediate',
                            tags: ['kinematics', 'transformations']
                        },
                        '正运动学': {
                            docPath: 'Robotics/机器人学导论/机器人正运动学',
                            level: 'intermediate',
                            tags: ['forward-kinematics', 'robotics']
                        },
                        '逆运动学': {
                            docPath: 'Robotics/机器人学导论/机器人逆运动学',
                            level: 'advanced',
                            tags: ['inverse-kinematics', 'robotics']
                        }
                    }
                },
                '机器人运动控制': {
                    docPath: 'Robotics/机器人运动控制',
                    skills: {
                        '概述': {
                            docPath: 'Robotics/机器人运动控制/概述',
                            level: 'beginner',
                            tags: ['motion-control', 'overview']
                        },
                        '系统构成': {
                            docPath: 'Robotics/机器人运动控制/机器人系统构成',
                            level: 'intermediate',
                            tags: ['system-architecture', 'robotics']
                        }
                    }
                }
            }
        }, 'Machinery': {
            color: '#DC2626',
            docPath: 'Machinery/机械设计',
            subcategories: {
                'Pyslvs': {
                    docPath: 'Machinery/Pyslvs',
                    skills: {
                        'Pyslvs使用教程': {
                            docPath: 'Machinery/Pyslvs/Pyslvs使用教程',
                            level: 'intermediate',
                            tags: ['pyslvs', 'mechanism']
                        }
                    }
                },
                '机械设计': {
                    docPath: 'Machinery/机械设计',
                    skills: {
                        '平面机构自由度': {
                            docPath: 'Machinery/机械设计/平面机构的自由度和速度分析',
                            level: 'intermediate',
                            tags: ['mechanism', 'degrees-of-freedom']
                        },
                        '平面连杆机构': {
                            docPath: 'Machinery/机械设计/平面连杆机构',
                            level: 'intermediate',
                            tags: ['linkage', 'mechanism']
                        },
                        '凸轮机构': {
                            docPath: 'Machinery/机械设计/凸轮机构',
                            level: 'intermediate',
                            tags: ['cam', 'mechanism']
                        },
                        '齿轮机构': {
                            docPath: 'Machinery/机械设计/齿轮机构',
                            level: 'intermediate',
                            tags: ['gear', 'mechanism']
                        },
                        '轮系': {
                            docPath: 'Machinery/机械设计/轮系',
                            level: 'intermediate',
                            tags: ['gear-train', 'mechanism']
                        },
                        '连接': {
                            docPath: 'Machinery/机械设计/连接',
                            level: 'intermediate',
                            tags: ['connections', 'fasteners']
                        },
                        '齿轮传动': {
                            docPath: 'Machinery/机械设计/齿轮传动',
                            level: 'intermediate',
                            tags: ['gear-transmission', 'mechanical']
                        },
                        '蜗杆传动': {
                            docPath: 'Machinery/机械设计/蜗杆传动',
                            level: 'advanced',
                            tags: ['worm-gear', 'transmission']
                        },
                        '带传动': {
                            docPath: 'Machinery/机械设计/带传动',
                            level: 'intermediate',
                            tags: ['belt-drive', 'transmission']
                        },
                        '轴': {
                            docPath: 'Machinery/机械设计/轴',
                            level: 'intermediate',
                            tags: ['shaft', 'mechanical']
                        },
                        '滚动轴承': {
                            docPath: 'Machinery/机械设计/滚动轴承',
                            level: 'intermediate',
                            tags: ['bearings', 'mechanical']
                        }
                    }
                }
            }
        },
        'Mechanics': {
            color: '#7C3AED',
            docPath: 'Mechanics/力学',
            subcategories: {
                'Adams': {
                    docPath: 'Mechanics/Adams',
                    skills: {
                        'Adams入门教程': {
                            docPath: 'Mechanics/Adams/Adams入门教程',
                            level: 'intermediate',
                            tags: ['adams', 'simulation']
                        }
                    }
                },
                '刚体动力学': {
                    docPath: 'Mechanics/刚体动力学',
                    skills: {
                        'RBDL Dynamics': {
                            docPath: 'Mechanics/刚体动力学/RBDL/Dynamics',
                            level: 'advanced',
                            tags: ['rbdl', 'dynamics']
                        },
                        'RBDL Details': {
                            docPath: 'Mechanics/刚体动力学/RBDL/Details',
                            level: 'advanced',
                            tags: ['rbdl', 'details']
                        }
                    }
                }
            }
        },
        'Paper': {
            color: '#059669',
            docPath: 'Paper',
            subcategories: {
                '论文复现': {
                    docPath: 'Paper/论文复现',
                    skills: {
                        'CodeAsPolicies': {
                            docPath: 'Paper/论文复现/CodeAsPolicies-JackyLiang等',
                            level: 'advanced',
                            tags: ['paper-reproduction', 'robotics']
                        },
                        'ViT': {
                            docPath: 'Paper/论文复现/ViT-Alexey Dosovitskiy等',
                            level: 'advanced',
                            tags: ['vision-transformer', 'computer-vision']
                        },
                        'Voxposer': {
                            docPath: 'Paper/论文复现/Voxposer-李飞飞等',
                            level: 'advanced',
                            tags: ['voxposer', 'robotics']
                        }
                    }
                }
            }
        },
        'PLC': {
            color: '#D97706',
            docPath: 'PLC',
            subcategories: {
                'Siemens PLC': {
                    docPath: 'PLC',
                    skills: {
                        'Siemens PLC': {
                            docPath: 'PLC/Siemens PLC',
                            level: 'intermediate',
                            tags: ['plc', 'industrial-automation']
                        }
                    }
                }
            }
        },
        'Sensor': {
            color: '#0D9488',
            docPath: 'Sensor/仪器科学与技术',
            subcategories: {
                '传感器与机器人感知技术': {
                    docPath: 'Sensor/传感器与机器人感知技术',
                    skills: {
                        '概述': {
                            docPath: 'Sensor/传感器与机器人感知技术/概述',
                            level: 'beginner',
                            tags: ['sensors', 'overview']
                        },
                        '信号采集与处理': {
                            docPath: 'Sensor/传感器与机器人感知技术/传感器信号采集及数据处理技术',
                            level: 'intermediate',
                            tags: ['signal-processing', 'data-acquisition']
                        },
                        '内部传感器': {
                            docPath: 'Sensor/传感器与机器人感知技术/机器人内部传感器',
                            level: 'intermediate',
                            tags: ['internal-sensors', 'robotics']
                        },
                        '外部传感器': {
                            docPath: 'Sensor/传感器与机器人感知技术/机器人外部传感器',
                            level: 'intermediate',
                            tags: ['external-sensors', 'robotics']
                        },
                        '智能传感器': {
                            docPath: 'Sensor/传感器与机器人感知技术/智能传感器及新型传感器',
                            level: 'advanced',
                            tags: ['smart-sensors', 'emerging-technology']
                        },
                        '应用示例': {
                            docPath: 'Sensor/传感器与机器人感知技术/机器人及机械臂上传感器的应用示例',
                            level: 'intermediate',
                            tags: ['sensor-applications', 'robotics']
                        }
                    }
                }
            }
        },
        'Synbio': {
            color: '#65A30D',
            docPath: 'Synbio/生物信息学',
            subcategories: {
                '生物信息学': {
                    docPath: 'Synbio',
                    skills: {
                        '生物信息学': {
                            docPath: 'Synbio/生物信息学',
                            level: 'intermediate',
                            tags: ['bioinformatics', 'biology']
                        },
                        '化信问题解决': {
                            docPath: 'Synbio/记替朋友解决的一个化信问题',
                            level: 'intermediate',
                            tags: ['problem-solving', 'chemistry']
                        }
                    }
                }
            }
        }
    };

    // 创建节点的逻辑
    Object.keys(categories).forEach(category => {
        const categoryInfo = categories[category];

        // 分类节点
        const categoryNode = {
            id: category,
            title: category,
            category: category,
            type: 'category',
            level: 'expert',
            color: categoryInfo.color,
            docPath: categoryInfo.docPath,
            description: `${category}相关知识与技能`,
            progress: 100
        };
        nodes.push(categoryNode);

        const subcategories = categoryInfo.subcategories;
        Object.keys(subcategories).forEach(subcategory => {
            const subcategoryInfo = subcategories[subcategory];

            // 子分类节点
            const subcategoryNode = {
                id: `${category}-${subcategory}`,
                title: subcategory,
                category: category,
                subcategory: subcategory,
                type: 'subcategory',
                level: 'advanced',
                color: categoryInfo.color,
                docPath: subcategoryInfo.docPath,
                progress: Math.floor(Math.random() * 30) + 70
            };
            nodes.push(subcategoryNode);

            // 链接分类和子分类
            links.push({
                source: category,
                target: `${category}-${subcategory}`,
                type: 'contains',
                strength: 1.0
            });

            // 具体技能节点
            const skills = subcategoryInfo.skills;
            Object.keys(skills).forEach(skillName => {
                const skillInfo = skills[skillName];
                const skillId = `${category}-${subcategory}-${skillName}`;

                const skillNode = {
                    id: skillId,
                    title: skillName,
                    category: category,
                    subcategory: subcategory,
                    type: 'skill',
                    level: skillInfo.level || 'intermediate',
                    color: categoryInfo.color,
                    tags: skillInfo.tags || [],
                    progress: Math.floor(Math.random() * 100),
                    status: ['learning', 'mastered', 'planned'][Math.floor(Math.random() * 3)],
                    docPath: skillInfo.docPath,
                    description: `${skillName} - ${category}领域的重要知识点`
                };
                nodes.push(skillNode);

                // 链接子分类和技能
                links.push({
                    source: `${category}-${subcategory}`,
                    target: skillId,
                    type: 'contains',
                    strength: 0.8
                });
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
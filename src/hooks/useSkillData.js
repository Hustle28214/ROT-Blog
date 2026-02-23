
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
    // 移除数字前缀的逻辑已从这里移除，因为现在在定义时就已不包含
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
                                'Shell': { docPath: 'Computering/操作系统/Linux/Shell', level: 'beginner', tags: ['linux', 'shell'] },
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
                        },
                        '操作系统导论': {
                            docPath: 'Computering/操作系统/操作系统导论',
                            skills: {
                                '进程': { docPath: 'Computering/操作系统/操作系统导论/进程', level: 'intermediate', tags: ['os'] },
                                '进程API': { docPath: 'Computering/操作系统/操作系统导论/进程API', level: 'intermediate', tags: ['api'] },
                                '受限直接执行': { docPath: 'Computering/操作系统/操作系统导论/受限直接执行', level: 'intermediate', tags: ['execution'] },
                                '进程调度': { docPath: 'Computering/操作系统/操作系统导论/进程调度', level: 'intermediate', tags: ['scheduling'] },
                                '多级反馈队列': { docPath: 'Computering/操作系统/操作系统导论/多级反馈队列', level: 'intermediate', tags: ['scheduling'] },
                                '比例份额': { docPath: 'Computering/操作系统/操作系统导论/比例份额', level: 'intermediate', tags: ['scheduling'] },
                                '多处理器调度': { docPath: 'Computering/操作系统/操作系统导论/多处理器调度', level: 'intermediate', tags: ['scheduling'] },
                                '地址空间': { docPath: 'Computering/操作系统/操作系统导论/地址空间', level: 'intermediate', tags: ['memory'] },
                                '内存操作API': { docPath: 'Computering/操作系统/操作系统导论/内存操作API', level: 'intermediate', tags: ['api'] },
                                '地址转换': { docPath: 'Computering/操作系统/操作系统导论/地址转换', level: 'intermediate', tags: ['memory'] },
                                '分段': { docPath: 'Computering/操作系统/操作系统导论/分段', level: 'intermediate', tags: ['memory'] },
                                '空闲空间管理': { docPath: 'Computering/操作系统/操作系统导论/空闲空间管理', level: 'intermediate', tags: ['memory'] },
                                '分页': { docPath: 'Computering/操作系统/操作系统导论/分页', level: 'intermediate', tags: ['memory'] },
                                '快速地址转换': { docPath: 'Computering/操作系统/操作系统导论/快速地址转换', level: 'intermediate', tags: ['memory'] },
                                '分页进阶': { docPath: 'Computering/操作系统/操作系统导论/分页进阶', level: 'intermediate', tags: ['memory'] },
                                '交换空间': { docPath: 'Computering/操作系统/操作系统导论/交换空间', level: 'intermediate', tags: ['memory'] },
                                '缓存管理': { docPath: 'Computering/操作系统/操作系统导论/缓存管理', level: 'intermediate', tags: ['memory'] },
                                'VMS虚拟内存系统': { docPath: 'Computering/操作系统/操作系统导论/VMS虚拟内存系统', level: 'intermediate', tags: ['memory'] },
                                '并发': { docPath: 'Computering/操作系统/操作系统导论/并发', level: 'intermediate', tags: ['concurrency'] },
                                '线程API': { docPath: 'Computering/操作系统/操作系统导论/线程API', level: 'intermediate', tags: ['api'] },
                                '锁': { docPath: 'Computering/操作系统/操作系统导论/锁', level: 'intermediate', tags: ['concurrency'] },
                                '基于锁的并发数据结构': { docPath: 'Computering/操作系统/操作系统导论/基于锁的并发数据结构', level: 'intermediate', tags: ['concurrency'] },
                                '条件变量': { docPath: 'Computering/操作系统/操作系统导论/条件变量', level: 'intermediate', tags: ['concurrency'] },
                                '信号量': { docPath: 'Computering/操作系统/操作系统导论/信号量', level: 'intermediate', tags: ['concurrency'] },
                                '常见并发问题': { docPath: 'Computering/操作系统/操作系统导论/常见并发问题', level: 'intermediate', tags: ['concurrency'] },
                                '基于事件的并发': { docPath: 'Computering/操作系统/操作系统导论/基于事件的并发', level: 'intermediate', tags: ['concurrency'] }
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
                        },
                        'React': {
                            docPath: 'Computering/WEB开发/React',
                            skills: {
                                // Assuming no specific files under React in the tree, just the directory
                            }
                        }
                    },
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
                        '8分钟入门Markdown': { docPath: 'Computering/实用工作流/8分钟入门Markdown', level: 'beginner', tags: ['markdown'] },
                        'Git': { docPath: 'Computering/实用工作流/Git', level: 'intermediate', tags: ['git'] }
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
                        '速通yoloV10': { docPath: 'Computering/数字图像处理/速通yoloV10', level: 'advanced', tags: ['yolo'] }
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
                        
                    }
                },
                '算法': {
                    docPath: 'Computering/算法',
                    
                    topics: {
                        'LeetCode刷题': {
                            docPath: 'Computering/算法/LeetCode刷题',
                            skills: {
                                '两数之和1': { docPath: 'Computering/算法/LeetCode刷题/两数之和1', level: 'easy', tags: ['leetcode'] },
                                '两数相加2': { docPath: 'Computering/算法/LeetCode刷题/两数相加2', level: 'medium', tags: ['leetcode'] },
                                '无重复字符的最长子串3': { docPath: 'Computering/算法/LeetCode刷题/无重复字符的最长子串3', level: 'medium', tags: ['leetcode'] },
                                '盛最多水的容器11': { docPath: 'Computering/算法/LeetCode刷题/盛最多水的容器11', level: 'medium', tags: ['leetcode'] },
                                '最长公共前缀14': { docPath: 'Computering/算法/LeetCode刷题/最长公共前缀14', level: 'easy', tags: ['leetcode'] },
                                '三数之和15': { docPath: 'Computering/算法/LeetCode刷题/三数之和15', level: 'medium', tags: ['leetcode'] },
                                '最接近的三数之和16': { docPath: 'Computering/算法/LeetCode刷题/最接近的三数之和16', level: 'medium', tags: ['leetcode'] },
                                '合并两个有序链表21': { docPath: 'Computering/算法/LeetCode刷题/合并两个有序链表21', level: 'easy', tags: ['leetcode'] },
                                '下一个排列31': { docPath: 'Computering/算法/LeetCode刷题/下一个排列31', level: 'medium', tags: ['leetcode'] },
                                '接雨水42': { docPath: 'Computering/算法/LeetCode刷题/接雨水42', level: 'hard', tags: ['leetcode'] }
                            }
                        },
                        '动态规划': {
                            docPath: 'Computering/算法/动态规划',
                            skills: {
                                '区间DP': { docPath: 'Computering/算法/动态规划/区间DP', level: 'advanced', tags: ['dp'] },
                                '树形DP': { docPath: 'Computering/算法/动态规划/树形DP', level: 'advanced', tags: ['dp'] },
                                '背包DP': { docPath: 'Computering/算法/动态规划/背包DP', level: 'advanced', tags: ['dp'] },
                                '记忆化搜索': { docPath: 'Computering/算法/动态规划/记忆化搜索', level: 'intermediate', tags: ['dp'] }
                            }
                        },
                        '字符串': {
                            docPath: 'Computering/算法/字符串',
                            skills: {
                                'KMP': { docPath: 'Computering/算法/字符串/KMP', level: 'advanced', tags: ['string'] }
                            }
                        },
                        '数学': {
                            docPath: 'Computering/算法/数学',
                            skills: {}
                        },
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
                                'SupervisedLearning监督学习': { docPath: 'Computering/机器学习/AAAMLP/SupervisedLearning监督学习', level: 'intermediate', tags: ['ml'] },
                                'CrossValidation交叉验证': { docPath: 'Computering/机器学习/AAAMLP/CrossValidation交叉验证', level: 'intermediate', tags: ['evaluation'] },
                                'EvaluationMetrics评估指标': { docPath: 'Computering/机器学习/AAAMLP/EvaluationMetrics评估指标', level: 'intermediate', tags: ['metrics'] },
                                'ArrangingMLProjects组织机器学习': { docPath: 'Computering/机器学习/AAAMLP/ArrangingMLProjects组织机器学习', level: 'intermediate', tags: ['mlops'] },
                                'ApproachingCategoricalVar处理分类变量': { docPath: 'Computering/机器学习/AAAMLP/ApproachingCategoricalVar处理分类变量', level: 'intermediate', tags: ['preprocessing'] },
                                'FeatureEngineering特征工程': { docPath: 'Computering/机器学习/AAAMLP/FeatureEngineering特征工程', level: 'intermediate', tags: ['feature'] },
                                'FeatureSelection特征选择': { docPath: 'Computering/机器学习/AAAMLP/FeatureSelection特征选择', level: 'intermediate', tags: ['selection'] },
                                'HyperparameterOptimization超参数优化': { docPath: 'Computering/机器学习/AAAMLP/HyperparameterOptimization超参数优化', level: 'advanced', tags: ['tuning'] },
                                'ApproachingImageClassification&Segmentation图像分类和分割': { docPath: 'Computering/机器学习/AAAMLP/ApproachingImageClassification&Segmentation图像分类和分割', level: 'advanced', tags: ['cv'] },
                                'ApproachingTextClassification&Regression文本分类或回归': { docPath: 'Computering/机器学习/AAAMLP/ApproachingTextClassification&Regression文本分类或回归', level: 'advanced', tags: ['nlp'] },
                                'ApproachingEnsembling&Stacking组合和堆叠': { docPath: 'Computering/机器学习/AAAMLP/ApproachingEnsembling&Stacking组合和堆叠', level: 'advanced', tags: ['ensemble'] },
                                'ApproachingReproducibleCode&ModelServing可重复代码和模型': { docPath: 'Computering/机器学习/AAAMLP/ApproachingReproducibleCode&ModelServing可重复代码和模型', level: 'intermediate', tags: ['reproducibility'] },
                                '阅读本系列的提示': { docPath: 'Computering/机器学习/AAAMLP/阅读本系列的提示', level: 'beginner', tags: ['guide'] }
                            }
                        },
                        '推荐系统': {
                            docPath: 'Computering/机器学习/推荐系统',
                            skills: {
                                '概述': { docPath: 'Computering/机器学习/推荐系统/概述', level: 'intermediate', tags: ['recsys'] },
                                '协同过滤': { docPath: 'Computering/机器学习/推荐系统/协同过滤', level: 'intermediate', tags: ['cf'] }
                            }
                        },
                        '智能体系统': {
                            docPath: 'Computering/机器学习/智能体系统',
                            skills: {
                                '智能体简介': { docPath: 'Computering/机器学习/智能体系统/智能体简介', level: 'intermediate', tags: ['agent'] },
                                'LLM基础': { docPath: 'Computering/机器学习/智能体系统/LLM基础', level: 'intermediate', tags: ['llm'] },
                                '智能体经典范式构建': { docPath: 'Computering/机器学习/智能体系统/智能体经典范式构建', level: 'intermediate', tags: ['agent'] },
                                '基于低代码平台的智能体搭建': { docPath: 'Computering/机器学习/智能体系统/基于低代码平台的智能体搭建', level: 'intermediate', tags: ['agent'] },
                                '框架开发实践': { docPath: 'Computering/机器学习/智能体系统/框架开发实践', level: 'intermediate', tags: ['agent'] },
                                '构建一个智能体框架': { docPath: 'Computering/机器学习/智能体系统/构建一个智能体框架', level: 'intermediate', tags: ['agent'] },
                                '记忆与检索': { docPath: 'Computering/机器学习/智能体系统/记忆与检索', level: 'intermediate', tags: ['agent'] },
                                '上下文工程': { docPath: 'Computering/机器学习/智能体系统/上下文工程', level: 'intermediate', tags: ['agent'] },
                                '智能体通信协议': { docPath: 'Computering/机器学习/智能体系统/智能体通信协议', level: 'intermediate', tags: ['agent'] },
                                'AgenticRL': { docPath: 'Computering/机器学习/智能体系统/AgenticRL', level: 'intermediate', tags: ['agent', 'rl'] },
                                '智能体性能评估': { docPath: 'Computering/机器学习/智能体系统/智能体性能评估', level: 'intermediate', tags: ['agent'] },
                            },
                            topics: {
                                '多智能体系统': {
                                    docPath: 'Computering/机器学习/智能体系统/多智能体系统',
                                    skills: {}
                                }
                            }
                        },
                        '模式识别': {
                            docPath: 'Computering/机器学习/模式识别',
                            skills: {}
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
                                'C++程序的基本组成': { docPath: 'Computering/编程语言/C++/C++程序的基本组成', level: 'beginner', tags: ['cpp'] },
                                '标识符和数据类型': { docPath: 'Computering/编程语言/C++/标识符和数据类型', level: 'beginner', tags: ['cpp'] },
                                'C++八股': { docPath: 'Computering/编程语言/C++/C++八股', level: 'intermediate', tags: ['cpp'] }
                            },
                            topics: {
                                'C++11': {
                                    docPath: 'Computering/编程语言/C++/C++11',
                                    skills: {
                                        '并发支持': { docPath: 'Computering/编程语言/C++/C++11/并发支持', level: 'intermediate', tags: ['cpp'] },
                                        '自动类型推导': { docPath: 'Computering/编程语言/C++/C++11/自动类型推导', level: 'intermediate', tags: ['cpp'] }
                                    }
                                },
                                'STL': {
                                    docPath: 'Computering/编程语言/C++/STL',
                                    skills: {
                                        'vector': { docPath: 'Computering/编程语言/C++/STL/vector', level: 'intermediate', tags: ['stl'] }
                                    }
                                }
                            }
                        },
                        'CSharp': {
                            docPath: 'Computering/编程语言/CSharp',
                            skills: {
                                '语法基础': { docPath: 'Computering/编程语言/CSharp/语法基础', level: 'intermediate', tags: ['csharp'] }
                            }
                        },
                        'Rust': {
                            docPath: 'Computering/编程语言/Rust',
                            skills: {
                                'Rust基础语法': { docPath: 'Computering/编程语言/Rust/Rust基础语法', level: 'intermediate', tags: ['rust'] },
                                '自定义类型': { docPath: 'Computering/编程语言/Rust/自定义类型', level: 'intermediate', tags: ['rust'] }
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
                        'kubernetes扫盲': { docPath: 'Computering/虚拟化容器/kubernetes扫盲', level: 'intermediate', tags: ['k8s'] }
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
                        '漫谈DNS使用问题': { docPath: 'Computering/计算机网络/漫谈DNS使用问题', level: 'intermediate', tags: ['dns'] },
                        '浅说代理Proxy': { docPath: 'Computering/计算机网络/浅说代理Proxy', level: 'intermediate', tags: ['proxy'] },
                        '如何用传统的方式发邮件': { docPath: 'Computering/计算机网络/如何用传统的方式发邮件', level: 'intermediate', tags: ['email'] }
                    }
                }
            },
        },
        'Control': {
            color: '#10B981',
            docPath: 'Control/控制理论',
            subcategories: {
                'MPC模型预测控制': {
                    docPath: 'Control/MPC模型预测控制',
                    skills: {
                        '模型预测控制': { docPath: 'Control/MPC模型预测控制/模型预测控制', level: 'advanced', tags: ['mpc'] }
                    }
                },
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
                        'SAC算法': { docPath: 'Control/强化学习/SAC算法', level: 'advanced', tags: ['sac'] },
                        '基于模型的策略优化': { docPath: 'Control/强化学习/基于模型的策略优化', level: 'advanced', tags: ['mbpo'] }
                    },
                    topics: {
                        '多智能体强化学习': {
                            docPath: 'Control/强化学习/多智能体强化学习',
                            skills: {}
                        },
                        '深度强化学习': {
                            docPath: 'Control/强化学习/深度强化学习',
                            skills: {}
                        }
                    }
                },
                '模仿学习': {
                    docPath: 'Control/模仿学习',
                    skills: {
                        '规定长度的马尔可夫决策过程': { docPath: 'Control/模仿学习/规定长度的马尔可夫决策过程', level: 'intermediate', tags: ['il'] },
                        '行为克隆': { docPath: 'Control/模仿学习/行为克隆', level: 'intermediate', tags: ['bc'] },
                        '对抗式模仿学习': { docPath: 'Control/模仿学习/对抗式模仿学习', level: 'advanced', tags: ['gail'] },
                        '环境模仿': { docPath: 'Control/模仿学习/环境模仿', level: 'advanced', tags: ['environment'] },
                        '逆强化学习': { docPath: 'Control/模仿学习/逆强化学习', level: 'advanced', tags: ['irl'] }
                    }
                },
                '自动控制原理': {
                    docPath: 'Control/自动控制原理',
                    topics: {
                        '自动控制概念': {
                            docPath: 'Control/自动控制原理/01-自动控制概念',
                            skills: {
                                '自动控制的一般概念': { docPath: 'Control/自动控制原理/01-自动控制概念/自动控制的一般概念', level: 'beginner', tags: ['basics'] },
                                '控制系统的数学模型': { docPath: 'Control/自动控制原理/01-自动控制概念/控制系统的数学模型', level: 'intermediate', tags: ['modeling'] }
                            }
                        },
                        '数学模型': {
                            docPath: 'Control/自动控制原理/02-数学模型',
                            skills: {
                                '传递函数': { docPath: 'Control/自动控制原理/02-数学模型/传递函数', level: 'intermediate', tags: ['transfer'] },
                                '信号流图、系统传递函数': { docPath: 'Control/自动控制原理/02-数学模型/信号流图、系统传递函数', level: 'intermediate', tags: ['signal-flow'] },
                                '控制系统复域数学模型': { docPath: 'Control/自动控制原理/02-数学模型/控制系统复域数学模型', level: 'intermediate', tags: ['complex-model'] },
                                '结构图及等效变换': { docPath: 'Control/自动控制原理/02-数学模型/结构图及等效变换', level: 'intermediate', tags: ['block-diagram'] }
                            }
                        },
                        '线性系统时域分析与校正': {
                            docPath: 'Control/自动控制原理/03-线性系统时域分析与校正',
                            skills: {
                                '一阶、过阻尼二阶系统动态性能': { docPath: 'Control/自动控制原理/03-线性系统时域分析与校正/一阶、过阻尼二阶系统动态性能', level: 'intermediate', tags: ['time-domain'] },
                                '欠阻尼二阶系统动态性能指标': { docPath: 'Control/自动控制原理/03-线性系统时域分析与校正/欠阻尼二阶系统动态性能指标', level: 'intermediate', tags: ['time-domain'] },
                                '线性系统的动态误差和时域校正': { docPath: 'Control/自动控制原理/03-线性系统时域分析与校正/线性系统的动态误差和时域校正', level: 'advanced', tags: ['error'] },
                                '线性系统的稳态误差（静态）': { docPath: 'Control/自动控制原理/03-线性系统时域分析与校正/线性系统的稳态误差（静态）', level: 'intermediate', tags: ['steady-state'] },
                                '高阶系统动态性能': { docPath: 'Control/自动控制原理/03-线性系统时域分析与校正/高阶系统动态性能', level: 'advanced', tags: ['high-order'] }
                            }
                        },
                        '根轨迹法': {
                            docPath: 'Control/自动控制原理/04-根轨迹法',
                            skills: {
                                '基本概念、绘制法则': { docPath: 'Control/自动控制原理/04-根轨迹法/基本概念、绘制法则', level: 'intermediate', tags: ['root-locus'] },
                                '利用根轨迹分析系统性能': { docPath: 'Control/自动控制原理/04-根轨迹法/利用根轨迹分析系统性能', level: 'advanced', tags: ['analysis'] },
                                '广义根轨迹': { docPath: 'Control/自动控制原理/04-根轨迹法/广义根轨迹', level: 'advanced', tags: ['generalized'] }
                            }
                        },
                        '线性系统频域分析与校正': {
                            docPath: 'Control/自动控制原理/05-线性系统频域分析与校正',
                            skills: {
                                'Bode图': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/Bode图', level: 'advanced', tags: ['bode'] },
                                'Nyquist图': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/Nyquist图', level: 'advanced', tags: ['nyquist'] },
                                '开环对数幅频特性分析系统性能': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/开环对数幅频特性分析系统性能', level: 'advanced', tags: ['open-loop'] },
                                '稳定裕度': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/稳定裕度', level: 'advanced', tags: ['margin'] },
                                '闭环频率特性分析系统性能': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/闭环频率特性分析系统性能', level: 'advanced', tags: ['closed-loop'] },
                                '频域稳定判据': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/频域稳定判据', level: 'advanced', tags: ['stability'] },
                                '相角超前校正': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/相角超前校正', level: 'intermediate', tags: ['lead'] },
                                '相角滞后校正': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/相角滞后校正', level: 'intermediate', tags: ['lag'] },
                                '滞后超前校正、PID校正': { docPath: 'Control/自动控制原理/05-线性系统频域分析与校正/滞后超前校正、PID校正', level: 'advanced', tags: ['lag-lead'] }
                            }
                        },
                        '线性离散系统分析与校正': {
                            docPath: 'Control/自动控制原理/06-线性离散系统分析与校正',
                            skills: {
                                '离散系统、信号采样与保持': { docPath: 'Control/自动控制原理/06-线性离散系统分析与校正/离散系统、信号采样与保持', level: 'intermediate', tags: ['discrete'] },
                                'z变换': { docPath: 'Control/自动控制原理/06-线性离散系统分析与校正/z变换', level: 'advanced', tags: ['z-transform'] },
                                '离散系统数学模型': { docPath: 'Control/自动控制原理/06-线性离散系统分析与校正/离散系统数学模型', level: 'advanced', tags: ['model'] },
                                '稳定性分析': { docPath: 'Control/自动控制原理/06-线性离散系统分析与校正/稳定性分析', level: 'advanced', tags: ['stability'] },
                                '稳态误差、动态性能分析': { docPath: 'Control/自动控制原理/06-线性离散系统分析与校正/稳态误差、动态性能分析', level: 'advanced', tags: ['performance'] },
                                '模拟化校正、数字校正': { docPath: 'Control/自动控制原理/06-线性离散系统分析与校正/模拟化校正、数字校正', level: 'advanced', tags: ['correction'] }
                            }
                        },
                        '非线性控制系统分析': {
                            docPath: 'Control/自动控制原理/07-非线性控制系统分析',
                            skills: {
                                '相平面法': { docPath: 'Control/自动控制原理/07-非线性控制系统分析/相平面法', level: 'advanced', tags: ['phase-plane'] },
                                '描述函数法': { docPath: 'Control/自动控制原理/07-非线性控制系统分析/描述函数法', level: 'advanced', tags: ['describing-function'] },
                                '改善非线性系统性能措施': { docPath: 'Control/自动控制原理/07-非线性控制系统分析/改善非线性系统性能措施', level: 'advanced', tags: ['improvement'] }
                            }
                        }
                    },
                    skills: {
                        'PID': { docPath: 'Control/自动控制原理/PID', level: 'intermediate', tags: ['pid'] }
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
                    },
                    topics: {
                        '汇编语言': {
                            docPath: 'Control/微机原理/汇编语言',
                            skills: {}
                        }
                    }
                },
                '机电传动控制': {
                    docPath: 'Control/机电传动控制',
                    skills: {
                        '概述': { docPath: 'Control/机电传动控制/概述', level: 'beginner', tags: ['overview'] },
                        '机电传动系统的动力学基础': { docPath: 'Control/机电传动控制/机电传动系统的动力学基础', level: 'intermediate', tags: ['dynamics'] },
                        '直流电机的工作原理及特性': { docPath: 'Control/机电传动控制/直流电机的工作原理及特性', level: 'intermediate', tags: ['dc-motor'] },
                        '交流电机的工作原理及其特性': { docPath: 'Control/机电传动控制/交流电机的工作原理及其特性', level: 'intermediate', tags: ['ac-motor'] },
                        '控制电机': { docPath: 'Control/机电传动控制/控制电机', level: 'advanced', tags: ['control-motor'] }
                    }
                },
                '现代控制理论': {
                    docPath: 'Control/现代控制理论',
                    skills: {
                        '绪论': { docPath: 'Control/现代控制理论/绪论', level: 'beginner', tags: ['overview'] },
                        '控制系统的状态空间表达式': { docPath: 'Control/现代控制理论/控制系统的状态空间表达式', level: 'intermediate', tags: ['state-space'] },
                        '控制系统状态空间表达式的解': { docPath: 'Control/现代控制理论/控制系统状态空间表达式的解', level: 'advanced', tags: ['solution'] },
                        '线性控制系统的能控性和能观性': { docPath: 'Control/现代控制理论/线性控制系统的能控性和能观性', level: 'advanced', tags: ['controllability'] },
                        '稳定性与李雅普诺夫方法': { docPath: 'Control/现代控制理论/稳定性与李雅普诺夫方法', level: 'advanced', tags: ['lyapunov'] },
                        '线性定常系统的综合': { docPath: 'Control/现代控制理论/线性定常系统的综合', level: 'advanced', tags: ['synthesis'] },
                        '最优控制': { docPath: 'Control/现代控制理论/最优控制', level: 'advanced', tags: ['optimal'] }
                    }
                },
                '过程控制仪表与装置': {
                    docPath: 'Control/过程控制仪表与装置',
                    skills: {}
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
                'ARM': {
                    docPath: 'Electronic/ARM',
                    skills: {
                        'AArch64异常模型': { docPath: 'Electronic/ARM/AArch64异常模型', level: 'advanced', tags: ['arm'] }
                    },
                    topics: {
                        'AArch64指令集架构': {
                            docPath: 'Electronic/ARM/AArch64指令集架构',
                            skills: {
                                '指令集': { docPath: 'Electronic/ARM/AArch64指令集架构/指令集', level: 'advanced', tags: ['arm'] }
                            }
                        }
                    }
                },
                'ASIC': {
                    docPath: 'Electronic/ASIC',
                    skills: {},
                    topics: {
                        'PA': {
                            docPath: 'Electronic/ASIC/PA',
                            skills: {
                                'PA0': { docPath: 'Electronic/ASIC/PA/PA0', level: 'advanced', tags: ['asic'] }
                            }
                        }
                    }
                },
                '信号完整性分析': {
                    docPath: 'Electronic/信号完整性分析',
                    skills: {
                        '电容物理基础': { docPath: 'Electronic/信号完整性分析/电容物理基础', level: 'intermediate', tags: ['si'] },
                        '传输线物理基础': { docPath: 'Electronic/信号完整性分析/传输线物理基础', level: 'intermediate', tags: ['si'] },
                        '传输线与反射': { docPath: 'Electronic/信号完整性分析/传输线与反射', level: 'advanced', tags: ['si'] },
                        '电感物理基础': { docPath: 'Electronic/信号完整性分析/电感物理基础', level: 'intermediate', tags: ['si'] }
                    }
                },
                '元器件设计': {
                    docPath: 'Electronic/元器件设计',
                    topics: {
                        '滤波器设计': {
                            docPath: 'Electronic/元器件设计/滤波器设计',
                            skills: {
                                '滤波器设计概述': { docPath: 'Electronic/元器件设计/滤波器设计/滤波器设计概述', level: 'beginner', tags: ['filter'] },
                                '滤波器的频率响应与时间响应特性': { docPath: 'Electronic/元器件设计/滤波器设计/滤波器的频率响应与时间响应特性', level: 'intermediate', tags: ['filter'] },
                                'RC滤波器设计': { docPath: 'Electronic/元器件设计/滤波器设计/RC滤波器设计', level: 'intermediate', tags: ['rc-filter'] },
                                '有源滤波器设计': { docPath: 'Electronic/元器件设计/滤波器设计/有源滤波器设计', level: 'intermediate', tags: ['active-filter'] }
                            }
                        },
                        '电机设计': {
                            docPath: 'Electronic/元器件设计/电机设计',
                            topics: {
                                'FOC': {
                                    docPath: 'Electronic/元器件设计/电机设计/FOC',
                                    skills: {
                                        '标幺值': { docPath: 'Electronic/元器件设计/电机设计/FOC/标幺值', level: 'intermediate', tags: ['foc'] },
                                        '克拉克变换与帕克变换': { docPath: 'Electronic/元器件设计/电机设计/FOC/克拉克变换与帕克变换', level: 'advanced', tags: ['transform'] },
                                        '开环调速': { docPath: 'Electronic/元器件设计/电机设计/FOC/开环调速', level: 'intermediate', tags: ['speed'] },
                                        '闭环位控': { docPath: 'Electronic/元器件设计/电机设计/FOC/闭环位控', level: 'intermediate', tags: ['position'] },
                                        '闭环调速': { docPath: 'Electronic/元器件设计/电机设计/FOC/闭环调速', level: 'intermediate', tags: ['speed'] },
                                        '电流闭环': { docPath: 'Electronic/元器件设计/电机设计/FOC/电流闭环', level: 'intermediate', tags: ['current'] },
                                        'SPWM与SVPWM': { docPath: 'Electronic/元器件设计/电机设计/FOC/SPWM与SVPWM', level: 'advanced', tags: ['pwm'] },
                                        'VF模式': { docPath: 'Electronic/元器件设计/电机设计/FOC/VF模式', level: 'advanced', tags: ['motor'] },
                                        'ABZ编码器': { docPath: 'Electronic/元器件设计/电机设计/FOC/ABZ编码器', level: 'intermediate', tags: ['encoder'] },
                                        '编码器测速': { docPath: 'Electronic/元器件设计/电机设计/FOC/编码器测速', level: 'intermediate', tags: ['encoder'] },
                                        '高频注入': { docPath: 'Electronic/元器件设计/电机设计/FOC/高频注入', level: 'advanced', tags: ['sensorless'] }
                                    }
                                },
                                '轴向磁通电机': {
                                    docPath: 'Electronic/元器件设计/电机设计/轴向磁通电机',
                                    skills: {
                                        '轴向磁通电机': { docPath: 'Electronic/元器件设计/电机设计/轴向磁通电机/轴向磁通电机', level: 'advanced', tags: ['motor'] }
                                    }
                                }
                            }
                        },
                        '电源设计': {
                            docPath: 'Electronic/元器件设计/电源设计',
                            skills: {
                                '电源系统介绍': { docPath: 'Electronic/元器件设计/电源设计/电源系统介绍', level: 'beginner', tags: ['power'] }
                            }
                        }
                    }
                },
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
                                '阻塞': { docPath: 'Electronic/嵌入式/FreeRTOS/阻塞', level: 'intermediate', tags: ['rtos'] },
                                'FreeRTOS初步': { docPath: 'Electronic/嵌入式/FreeRTOS/FreeRTOS初步', level: 'intermediate', tags: ['rtos'] }
                            }
                        },
                        'BEKEN': {
                            docPath: 'Electronic/嵌入式/BEKEN',
                            skills: {
                                'Armino实战使用指南': { docPath: 'Electronic/嵌入式/BEKEN/Armino实战使用指南', level: 'intermediate', tags: ['beken'] },
                                'BK7258': { docPath: 'Electronic/嵌入式/BEKEN/BK7258', level: 'intermediate', tags: ['beken'] }
                            }
                        },
                        'CAN通信': {
                            docPath: 'Electronic/嵌入式/CAN通信',
                            skills: {}
                        },
                        'ESP32': {
                            docPath: 'Electronic/嵌入式/ESP32',
                            skills: {}
                        },
                        'RISC-V': {
                            docPath: 'Electronic/嵌入式/RISC-V',
                            skills: {
                                'RISCV简介': { docPath: 'Electronic/嵌入式/RISC-V/RISCV简介', level: 'intermediate', tags: ['riscv'] }
                            }
                        },
                        'RT-Thread': {
                            docPath: 'Electronic/嵌入式/RT-Thread',
                            skills: {
                                'RT-Thread内核': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread内核', level: 'intermediate', tags: ['rtos'] },
                                'RT-Thread线程管理': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread线程管理', level: 'intermediate', tags: ['rtos'] },
                                'RT-Thread时钟管理': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread时钟管理', level: 'intermediate', tags: ['rtos'] },
                                'RT-Thread线程间同步': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread线程间同步', level: 'intermediate', tags: ['rtos'] },
                                'RT-Thread线程间通信': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread线程间通信', level: 'intermediate', tags: ['rtos'] },
                                'RT-Thread内存管理': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread内存管理', level: 'intermediate', tags: ['rtos'] },
                                'RT-Thread中断管理': { docPath: 'Electronic/嵌入式/RT-Thread/RT-Thread中断管理', level: 'intermediate', tags: ['rtos'] }
                            }
                        }
                    },
                    skills: {
                        '速通蓝桥杯嵌入式': { docPath: 'Electronic/嵌入式/速通蓝桥杯嵌入式', level: 'intermediate', tags: ['embedded'] }
                    }
                },
                '信号与系统': {
                    docPath: 'Electronic/信号与系统',
                    skills: {
                        '信号与系统': { docPath: 'Electronic/信号与系统/信号与系统', level: 'beginner', tags: ['signals'] },
                        '线性时不变系统': { docPath: 'Electronic/信号与系统/线性时不变系统', level: 'intermediate', tags: ['lti'] },
                        '周期信号的傅里叶级数表示': { docPath: 'Electronic/信号与系统/周期信号的傅里叶级数表示', level: 'intermediate', tags: ['fourier'] },
                        '连续时间傅里叶变换': { docPath: 'Electronic/信号与系统/连续时间傅里叶变换', level: 'advanced', tags: ['ft'] },
                        '离散时间傅里叶变换': { docPath: 'Electronic/信号与系统/离散时间傅里叶变换', level: 'advanced', tags: ['dtft'] },
                        '信号与系统的时域和频域特性': { docPath: 'Electronic/信号与系统/信号与系统的时域和频域特性', level: 'intermediate', tags: ['domain'] },
                        '采样': { docPath: 'Electronic/信号与系统/采样', level: 'intermediate', tags: ['sampling'] },
                        '通信系统': { docPath: 'Electronic/信号与系统/通信系统', level: 'intermediate', tags: ['communication'] },
                        '拉普拉斯变换': { docPath: 'Electronic/信号与系统/拉普拉斯变换', level: 'advanced', tags: ['laplace'] },
                        '卡尔曼滤波器MATLAB实现': { docPath: 'Electronic/信号与系统/卡尔曼滤波器MATLAB实现', level: 'advanced', tags: ['kalman'] }
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
                        '开环调速': { docPath: 'Electronic/FOC/开环调速', level: 'intermediate', tags: ['speed'] },
                        '闭环位控': { docPath: 'Electronic/FOC/闭环位控', level: 'intermediate', tags: ['position'] },
                        '闭环调速': { docPath: 'Electronic/FOC/闭环调速', level: 'intermediate', tags: ['speed'] },
                        '电流闭环': { docPath: 'Electronic/FOC/电流闭环', level: 'intermediate', tags: ['current'] },
                        'SPWM与SVPWM': { docPath: 'Electronic/FOC/SPWM与SVPWM', level: 'advanced', tags: ['pwm'] },
                        'VF模式': { docPath: 'Electronic/FOC/VF模式', level: 'advanced', tags: ['motor'] },
                        'ABZ编码器': { docPath: 'Electronic/FOC/ABZ编码器', level: 'intermediate', tags: ['encoder'] },
                        '编码器测速': { docPath: 'Electronic/FOC/编码器测速', level: 'intermediate', tags: ['encoder'] },
                        '高频注入': { docPath: 'Electronic/FOC/高频注入', level: 'advanced', tags: ['sensorless'] }
                    }
                },
                '滤波器设计': {
                    docPath: 'Electronic/滤波器设计',
                    skills: {
                        '滤波器设计概述': { docPath: 'Electronic/滤波器设计/滤波器设计概述', level: 'beginner', tags: ['filter'] },
                        '滤波器的频率响应与时间响应特性': { docPath: 'Electronic/滤波器设计/滤波器的频率响应与时间响应特性', level: 'intermediate', tags: ['response'] },
                        'RC滤波器设计': { docPath: 'Electronic/滤波器设计/RC滤波器设计', level: 'intermediate', tags: ['rc'] },
                        '有源滤波器设计': { docPath: 'Electronic/滤波器设计/有源滤波器设计', level: 'intermediate', tags: ['active-filter'] }
                    }
                },
                '电力电子技术': {
                    docPath: 'Electronic/电力电子技术',
                    skills: {
                        'H桥驱动直流电机': { docPath: 'Electronic/电力电子技术/H桥驱动直流电机', level: 'intermediate', tags: ['power-electronics'] }
                    }
                },
                '电源设计': {
                    docPath: 'Electronic/电源设计',
                    skills: {
                        '电源系统介绍': { docPath: 'Electronic/电源设计/电源系统介绍', level: 'beginner', tags: ['power'] }
                    }
                },
                '微波工程': {
                    docPath: 'Electronic/微波工程',
                    skills: {
                        '电磁理论': { docPath: 'Electronic/微波工程/电磁理论', level: 'advanced', tags: ['microwave'] }
                    }
                },
                '微波工程': {
                    docPath: 'Electronic/微波工程',
                    skills: {
                        '电磁理论': { docPath: 'Electronic/微波工程/电磁理论', level: 'advanced', tags: ['microwave'] }
                    }
                },
                '电子技术基础': {
                    docPath: 'Electronic/电子技术基础',
                    topics: {
                        '数字电子技术基础': {
                            docPath: 'Electronic/电子技术基础/数字电子技术基础',
                            skills: {
                                '数字逻辑基础': { docPath: 'Electronic/电子技术基础/数字电子技术基础/数字逻辑基础', level: 'beginner', tags: ['digital'] },
                                '逻辑代数与硬件描述语言': { docPath: 'Electronic/电子技术基础/数字电子技术基础/逻辑代数与硬件描述语言', level: 'intermediate', tags: ['digital'] },
                                '逻辑门电路': { docPath: 'Electronic/电子技术基础/数字电子技术基础/逻辑门电路', level: 'intermediate', tags: ['digital'] },
                                '组合逻辑电路': { docPath: 'Electronic/电子技术基础/数字电子技术基础/组合逻辑电路', level: 'intermediate', tags: ['digital'] },
                                '锁存器和触发器': { docPath: 'Electronic/电子技术基础/数字电子技术基础/锁存器和触发器', level: 'intermediate', tags: ['digital'] },
                                '时序逻辑电路': { docPath: 'Electronic/电子技术基础/数字电子技术基础/时序逻辑电路', level: 'intermediate', tags: ['digital'] },
                                '半导体存储器': { docPath: 'Electronic/电子技术基础/数字电子技术基础/半导体存储器', level: 'intermediate', tags: ['digital'] },
                                'CPLD和FPGA': { docPath: 'Electronic/电子技术基础/数字电子技术基础/CPLD和FPGA', level: 'advanced', tags: ['digital'] },
                                '脉冲波形的变换与产生': { docPath: 'Electronic/电子技术基础/数字电子技术基础/脉冲波形的变换与产生', level: 'intermediate', tags: ['digital'] },
                                '数模与模数转换器': { docPath: 'Electronic/电子技术基础/数字电子技术基础/数模与模数转换器', level: 'intermediate', tags: ['digital'] },
                                '数字系统设计基础': { docPath: 'Electronic/电子技术基础/数字电子技术基础/数字系统设计基础', level: 'intermediate', tags: ['digital'] }
                            }
                        },
                        '模拟电子技术基础': {
                            docPath: 'Electronic/电子技术基础/模拟电子技术基础',
                            skills: {
                                '绪论': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/绪论', level: 'beginner', tags: ['analog'] },
                                '运算放大器': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/运算放大器', level: 'intermediate', tags: ['analog'] },
                                '二极管及其基本放大电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/二极管及其基本放大电路', level: 'intermediate', tags: ['analog'] },
                                '场效应三极管及其放大电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/场效应三极管及其放大电路', level: 'intermediate', tags: ['analog'] },
                                '双极结型三极管及其放大电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/双极结型三极管及其放大电路', level: 'intermediate', tags: ['analog'] },
                                '频率响应': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/频率响应', level: 'advanced', tags: ['analog'] },
                                '模拟集成电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/模拟集成电路', level: 'advanced', tags: ['analog'] },
                                '反馈放大电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/反馈放大电路', level: 'advanced', tags: ['analog'] },
                                '功率放大电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/功率放大电路', level: 'intermediate', tags: ['analog'] },
                                '信号处理与信号产生电路': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/信号处理与信号产生电路', level: 'intermediate', tags: ['analog'] },
                                '直流稳压电源': { docPath: 'Electronic/电子技术基础/模拟电子技术基础/直流稳压电源', level: 'intermediate', tags: ['analog'] }
                            }
                        },
                        '电力电子技术': {
                            docPath: 'Electronic/电子技术基础/电力电子技术',
                            skills: {
                                'H桥驱动直流电机': { docPath: 'Electronic/电子技术基础/电力电子技术/H桥驱动直流电机', level: 'intermediate', tags: ['power'] }
                            }
                        }
                    }
                },
                '电磁场与电磁波': {
                    docPath: 'Electronic/电磁场与电磁波',
                    skills: {
                        '静电场': { docPath: 'Electronic/电磁场与电磁波/静电场', level: 'intermediate', tags: ['em'] }
                    }
                }
            }
        },
        'Materials': {
            color: '#EC4899',
            docPath: 'Materials/半导体器件',
            subcategories: {
                '半导体器件': {
                    docPath: 'Materials/半导体器件',
                    skills: {
                        '固体晶格结构': { docPath: 'Materials/半导体器件/固体晶格结构', level: 'advanced', tags: ['semiconductor'] },
                        '量子力学初步': { docPath: 'Materials/半导体器件/量子力学初步', level: 'advanced', tags: ['quantum'] },
                        '固体量子理论初步': { docPath: 'Materials/半导体器件/固体量子理论初步', level: 'advanced', tags: ['solid-state'] },
                        '平衡半导体': { docPath: 'Materials/半导体器件/平衡半导体', level: 'advanced', tags: ['equilibrium'] },
                        '载流子输运现象': { docPath: 'Materials/半导体器件/载流子输运现象', level: 'advanced', tags: ['transport'] },
                        '半导体中的非平衡过剩载流子': { docPath: 'Materials/半导体器件/半导体中的非平衡过剩载流子', level: 'advanced', tags: ['non-equilibrium'] },
                        'pn结': { docPath: 'Materials/半导体器件/pn结', level: 'advanced', tags: ['pn-junction'] },
                        'pn结二极管': { docPath: 'Materials/半导体器件/pn结二极管', level: 'advanced', tags: ['diode'] },
                        '金属半导体和半导体异质结': { docPath: 'Materials/半导体器件/金属半导体和半导体异质结', level: 'advanced', tags: ['heterojunction'] },
                        '双极晶体管': { docPath: 'Materials/半导体器件/双极晶体管', level: 'advanced', tags: ['bjt'] },
                        'MOSFET基础': { docPath: 'Materials/半导体器件/MOSFET基础', level: 'advanced', tags: ['mosfet'] },
                        'MOSFET概念深入': { docPath: 'Materials/半导体器件/MOSFET概念深入', level: 'advanced', tags: ['mosfet'] },
                        '结型场效应晶体管': { docPath: 'Materials/半导体器件/结型场效应晶体管', level: 'advanced', tags: ['jfet'] },
                        '光器件': { docPath: 'Materials/半导体器件/光器件', level: 'advanced', tags: ['optoelectronics'] },
                        '半导体功率器件': { docPath: 'Materials/半导体器件/半导体功率器件', level: 'advanced', tags: ['power-device'] }
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
                        '一元函数微分学': { docPath: 'Mathematics/微积分/一元函数微分学', level: 'intermediate', tags: ['differential'] },
                        '一元函数积分学': { docPath: 'Mathematics/微积分/一元函数积分学', level: 'intermediate', tags: ['integral'] },
                        '不定积分': { docPath: 'Mathematics/微积分/不定积分', level: 'intermediate', tags: ['integral'] },
                        '定积分': { docPath: 'Mathematics/微积分/定积分', level: 'intermediate', tags: ['definite'] },
                        '二重积分': { docPath: 'Mathematics/微积分/二重积分', level: 'intermediate', tags: ['double-integral'] },
                        '三重积分和线面积分': { docPath: 'Mathematics/微积分/三重积分和线面积分', level: 'advanced', tags: ['triple-integral'] },
                        '多元函数的极限、连续与微分': { docPath: 'Mathematics/微积分/多元函数的极限、连续与微分', level: 'advanced', tags: ['multivariable'] },
                        '多元函数微积分学综合': { docPath: 'Mathematics/微积分/多元函数微积分学综合', level: 'advanced', tags: ['multivariable'] },
                        '微分中值定理': { docPath: 'Mathematics/微积分/微分中值定理', level: 'advanced', tags: ['mvt'] },
                        '常微分方程': { docPath: 'Mathematics/微积分/常微分方程', level: 'advanced', tags: ['ode'] },
                        '微分方程': { docPath: 'Mathematics/微积分/微分方程', level: 'advanced', tags: ['ode'] },
                        '无穷级数': { docPath: 'Mathematics/微积分/无穷级数', level: 'advanced', tags: ['series'] },
                        '级数': { docPath: 'Mathematics/微积分/级数', level: 'advanced', tags: ['series'] },
                        '线面积分': { docPath: 'Mathematics/微积分/线面积分', level: 'advanced', tags: ['integral'] },
                        '积分等式与积分不等式': { docPath: 'Mathematics/微积分/积分等式与积分不等式', level: 'advanced', tags: ['integral'] },
                        '零点问题与微分不等式': { docPath: 'Mathematics/微积分/零点问题与微分不等式', level: 'advanced', tags: ['zero-point'] }
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
                        'R的应用': { docPath: 'Mathematics/概率论与数理统计/R的应用', level: 'intermediate', tags: ['r'] },
                        '各种常用表': { docPath: 'Mathematics/概率论与数理统计/各种常用表', level: 'intermediate', tags: ['reference'] }
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
                },
                '数值分析': {
                    docPath: 'Mathematics/数值分析',
                    skills: {}
                },
                '数论基础': {
                    docPath: 'Mathematics/数论基础',
                    skills: {}
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
                'ROS': {
                    docPath: 'Robotics/ROS',
                    skills: {
                        'ROS基本操作': { docPath: 'Robotics/ROS/ROS基本操作', level: 'beginner', tags: ['ros'] },
                        '话题通信机制': { docPath: 'Robotics/ROS/话题通信机制', level: 'intermediate', tags: ['communication'] },
                        'ROS安装流程': { docPath: 'Robotics/ROS/ROS安装流程', level: 'beginner', tags: ['install'] },
                        'ROS': { docPath: 'Robotics/ROS/ROS', level: 'beginner', tags: ['ros'] }
                    }
                },
                '机器人学导论': {
                    docPath: 'Robotics/机器人学导论',
                    skills: {
                        '空间描述与变换': { docPath: 'Robotics/机器人学导论/空间描述与变换', level: 'intermediate', tags: ['kinematics'] },
                        '机器人正运动学': { docPath: 'Robotics/机器人学导论/机器人正运动学', level: 'intermediate', tags: ['forward'] },
                        '机器人逆运动学': { docPath: 'Robotics/机器人学导论/机器人逆运动学', level: 'advanced', tags: ['inverse'] },
                        '速度与静力': { docPath: 'Robotics/机器人学导论/速度与静力', level: 'intermediate', tags: ['velocity'] }
                    }
                },
                
                '视觉SLAM十四讲': {
                    docPath: 'Robotics/视觉SLAM十四讲',
                    skills: {
                        'Eigen实验': { docPath: 'Robotics/视觉SLAM十四讲/Eigen实验', level: 'intermediate', tags: ['slam'] }
                    }
                },
                '机器人强化学习': {
                    docPath: 'Robotics/机器人强化学习',
                    skills: {
                        'RL项目复现计划': { docPath: 'Robotics/机器人强化学习/RL项目复现计划', level: 'intermediate', tags: ['rl'] },
                        'HumanoidGym': { docPath: 'Robotics/机器人强化学习/HumanoidGym', level: 'intermediate', tags: ['rl'] }
                    }
                }
            }
        },
        'Machinery': {
            color: '#F59E0B',
            docPath: 'Machinery/机械设计',
            skills: {
                '机械设计经典五十问': { docPath: 'Machinery/机械设计经典五十问', level: 'intermediate', tags: ['machinery', 'questions'] }
            },
            subcategories: {
                '机械设计': {
                    docPath: 'Machinery/机械设计/机械设计',
                    skills: {
                        '平面机构的自由度和速度分析': { docPath: 'Machinery/机械设计/机械设计/平面机构的自由度和速度分析', level: 'intermediate', tags: ['mechanism'] },
                        '平面连杆机构': { docPath: 'Machinery/机械设计/机械设计/平面连杆机构', level: 'intermediate', tags: ['linkage'] },
                        '凸轮机构': { docPath: 'Machinery/机械设计/机械设计/凸轮机构', level: 'intermediate', tags: ['cam'] },
                        '齿轮机构': { docPath: 'Machinery/机械设计/机械设计/齿轮机构', level: 'intermediate', tags: ['gear'] },
                        '轮系': { docPath: 'Machinery/机械设计/机械设计/轮系', level: 'intermediate', tags: ['train'] },
                        '连接': { docPath: 'Machinery/机械设计/机械设计/连接', level: 'intermediate', tags: ['fastener'] },
                        '齿轮传动': { docPath: 'Machinery/机械设计/机械设计/齿轮传动', level: 'intermediate', tags: ['transmission'] },
                        '蜗杆传动': { docPath: 'Machinery/机械设计/机械设计/蜗杆传动', level: 'advanced', tags: ['worm'] },
                        '带传动': { docPath: 'Machinery/机械设计/机械设计/带传动', level: 'intermediate', tags: ['belt'] },
                        '轴': { docPath: 'Machinery/机械设计/机械设计/轴', level: 'intermediate', tags: ['shaft'] },
                        '滚动轴承': { docPath: 'Machinery/机械设计/机械设计/滚动轴承', level: 'intermediate', tags: ['bearing'] }
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
                },
                '材料力学': {
                    docPath: 'Mechanics/材料力学',
                    skills: {}
                },
                '理论力学': {
                    docPath: 'Mechanics/理论力学',
                    skills: {}
                },
                '飞行器结构力学': {
                    docPath: 'Mechanics/飞行器结构力学',
                    skills: {}
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
                        'CodeAsPolicies-JackyLiang等': { docPath: 'Paper/论文复现/CodeAsPolicies-JackyLiang等', level: 'advanced', tags: ['paper'] },
                        'ViT-Alexey Dosovitskiy等': { docPath: 'Paper/论文复现/ViT-Alexey Dosovitskiy等', level: 'advanced', tags: ['vision'] },
                        'Voxposer-李飞飞等': { docPath: 'Paper/论文复现/Voxposer-李飞飞等', level: 'advanced', tags: ['robotics'] }
                    }
                },
                '论文调研': {
                    docPath: 'Paper/论文调研',
                    skills: {}
                }
            }
        },
        
        'Sensor': {
            color: '#84CC16',
            docPath: 'Sensor/仪器科学与技术',
            skills: {
                '视触觉传感器': { docPath: 'Sensor/视触觉传感器', level: 'intermediate', tags: ['sensor', 'tactile'] }
            },
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
            skills: {
                '生物信息学': { docPath: 'Synbio/生物信息学', level: 'intermediate', tags: ['bio'] },
                '记替朋友解决的一个化信问题': { docPath: 'Synbio/记替朋友解决的一个化信问题', level: 'intermediate', tags: ['chemistry'] }
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
                    type: 'topics', // 注意类型是 'topics'
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
        'Computering-机器学习-AAAMLP-SupervisedLearning监督学习',
        'prerequisite'
    );
    // 控制理论与机器人
    addRelation(nodes, links,
        'Mathematics-微积分-微分方程',
        'Control-现代控制理论-控制系统的状态空间表达式的解',
        'related'
    );
    // 电子与嵌入式
    addRelation(nodes, links,
        'Electronic-信号与系统-周期信号的傅里叶级数表示',
        'Electronic-嵌入式-速通蓝桥杯嵌入式',
        'applies_to'
    );
    // 计算机与机器人
    addRelation(nodes, links,
        'Computering-编程语言-C++-C++概述',
        'Robotics-ROS-ROS基本操作',
        'prerequisite'
    );
    // 数学与信号处理
    addRelation(nodes, links,
        'Mathematics-概率论与数理统计-基本概念',
        'Electronic-信号与系统-信号与系统',
        'related'
    );
    addRelation(nodes, links,
        'Machinery-机械设计-机械设计-平面机构的自由度和速度分析',
        'Robotics-机器人学导论-机器人正运动学',
        'prerequisite'
    );
    // 力学与机械
    addRelation(nodes, links,
        'Mechanics-刚体动力学-RBDL-Dynamics',
        'Machinery-机械设计-机械设计-齿轮传动',
        'applies_to'
    );
    // 传感器与机器人
    addRelation(nodes, links,
        'Sensor-传感器与机器人感知技术-机器人外部传感器',
        'Robotics-机器人运动控制-机器人系统构成',
        'related'
    );
    // 控制与PLC
    addRelation(nodes, links,
        'Control-自动控制原理-PID',
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

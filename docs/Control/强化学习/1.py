import gymnasium as gym
import numpy as np
import random
from collections import deque
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
import matplotlib.pyplot as plt
from typing import List, Tuple

class QNetwork(nn.Module):
    """Q网络：输入状态，输出各动作的Q值"""
    
    def __init__(self, state_size: int, action_size: int, hidden_size: int = 64):
        super(QNetwork, self).__init__()
        self.fc1 = nn.Linear(state_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, action_size)
        
    def forward(self, state: torch.Tensor) -> torch.Tensor:
        x = F.relu(self.fc1(state))
        x = F.relu(self.fc2(x))
        return self.fc3(x)

class ReplayBuffer:
    """经验回放缓冲区"""
    
    def __init__(self, buffer_size: int, batch_size: int):
        self.memory = deque(maxlen=buffer_size)
        self.batch_size = batch_size
        
    def add(self, state: np.ndarray, action: int, reward: float, 
            next_state: np.ndarray, done: bool):
        """添加经验到缓冲区"""
        self.memory.append((state, action, reward, next_state, done))
        
    def sample(self) -> Tuple:
        """随机采样一批经验"""
        experiences = random.sample(self.memory, k=self.batch_size)
        
        states = torch.from_numpy(np.vstack([e[0] for e in experiences])).float()
        actions = torch.from_numpy(np.vstack([e[1] for e in experiences])).long()
        rewards = torch.from_numpy(np.vstack([e[2] for e in experiences])).float()
        next_states = torch.from_numpy(np.vstack([e[3] for e in experiences])).float()
        dones = torch.from_numpy(np.vstack([e[4] for e in experiences]).astype(np.uint8)).float()
        
        return states, actions, rewards, next_states, dones
        
    def __len__(self) -> int:
        return len(self.memory)

class DQNAgent:
    """DQN智能体"""
    
    def __init__(self, state_size: int, action_size: int):
        self.state_size = state_size
        self.action_size = action_size
        
        # 超参数
        self.buffer_size = 10000
        self.batch_size = 32
        self.lr = 0.001
        self.gamma = 0.99
        self.tau = 0.01  # 软更新参数
        self.update_every = 4  # 更新频率
        
        # Q网络
        self.qnetwork_local = QNetwork(state_size, action_size)
        self.qnetwork_target = QNetwork(state_size, action_size)
        self.optimizer = optim.Adam(self.qnetwork_local.parameters(), lr=self.lr)
        
        # 经验回放
        self.memory = ReplayBuffer(self.buffer_size, self.batch_size)
        
        # 时间步计数器
        self.t_step = 0
        
    def step(self, state: np.ndarray, action: int, reward: float, 
             next_state: np.ndarray, done: bool):
        """存储经验并学习"""
        # 存储经验
        self.memory.add(state, action, reward, next_state, done)
        
        # 每隔一定步数学习
        self.t_step = (self.t_step + 1) % self.update_every
        if self.t_step == 0 and len(self.memory) > self.batch_size:
            experiences = self.memory.sample()
            self.learn(experiences)
            
    def act(self, state: np.ndarray, eps: float = 0.0) -> int:
        """根据当前策略选择动作"""
        state = torch.from_numpy(state).float().unsqueeze(0)
        self.qnetwork_local.eval()
        with torch.no_grad():
            action_values = self.qnetwork_local(state)
        self.qnetwork_local.train()
        
        # Epsilon-greedy策略
        if random.random() > eps:
            return np.argmax(action_values.cpu().data.numpy())
        else:
            return random.choice(np.arange(self.action_size))
            
    def learn(self, experiences: Tuple):
        """使用一批经验更新网络参数"""
        states, actions, rewards, next_states, dones = experiences
        
        # 计算当前Q值
        q_current = self.qnetwork_local(states).gather(1, actions)
        
        # 计算目标Q值
        q_targets_next = self.qnetwork_target(next_states).detach().max(1)[0].unsqueeze(1)
        q_targets = rewards + (self.gamma * q_targets_next * (1 - dones))
        
        # 计算损失
        loss = F.mse_loss(q_current, q_targets)
        
        # 最小化损失
        self.optimizer.zero_grad()
        loss.backward()
        self.optimizer.step()
        
        # 软更新目标网络
        self.soft_update()
        
    def soft_update(self):
        """软更新目标网络参数"""
        for target_param, local_param in zip(self.qnetwork_target.parameters(), 
                                           self.qnetwork_local.parameters()):
            target_param.data.copy_(self.tau * local_param.data + 
                                  (1.0 - self.tau) * target_param.data)

def train_dqn(env_name: str = "CartPole-v1", n_episodes: int = 1000, 
              max_t: int = 1000, eps_start: float = 1.0, 
              eps_end: float = 0.01, eps_decay: float = 0.995):
    """训练DQN智能体"""
    
    # 创建环境和智能体 - 使用Gymnasium
    env = gym.make(env_name)
    state_size = env.observation_space.shape[0]
    action_size = env.action_space.n
    agent = DQNAgent(state_size, action_size)
    
    scores = []  # 每回合得分
    scores_window = deque(maxlen=100)  # 最近100回合得分
    eps = eps_start  # 探索率
    
    for i_episode in range(1, n_episodes + 1):
        # Gymnasium的reset返回(state, info)
        state, _ = env.reset()
        score = 0
        
        for t in range(max_t):
            # 选择并执行动作
            action = agent.act(state, eps)
            # Gymnasium的step返回(state, reward, terminated, truncated, info)
            next_state, reward, terminated, truncated, _ = env.step(action)
            done = terminated or truncated
            
            # 学习
            agent.step(state, action, reward, next_state, done)
            
            state = next_state
            score += reward
            
            if done:
                break
                
        scores_window.append(score)
        scores.append(score)
        eps = max(eps_end, eps_decay * eps)  # 衰减探索率
        
        # 打印训练进度
        if i_episode % 100 == 0:
            print(f'\rEpisode {i_episode}\tAverage Score: {np.mean(scores_window):.2f}')
            
        # 检查是否解决环境
        if np.mean(scores_window) >= 195.0:
            print(f'\nEnvironment solved in {i_episode} episodes!')
            torch.save(agent.qnetwork_local.state_dict(), 'checkpoint.pth')
            break
            
    env.close()
    return scores

def plot_scores(scores: List[float]):
    """绘制训练得分曲线"""
    plt.figure(figsize=(12, 6))
    plt.plot(scores, alpha=0.6, label='Episode Score')
    
    # 计算移动平均
    window_size = 100
    moving_avg = []
    for i in range(len(scores)):
        if i < window_size:
            moving_avg.append(np.mean(scores[:i+1]))
        else:
            moving_avg.append(np.mean(scores[i-window_size+1:i+1]))
    
    plt.plot(moving_avg, linewidth=2, label=f'{window_size}-Episode Moving Average')
    plt.xlabel('Episode')
    plt.ylabel('Score')
    plt.title('DQN Training Performance on CartPole-v1')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig('dqn_training.png', dpi=300, bbox_inches='tight')
    plt.show()

def test_agent(env_name: str = "CartPole-v1", model_path: str = 'checkpoint.pth'):
    """测试训练好的智能体"""
    # 使用Gymnasium
    env = gym.make(env_name, render_mode='human')  # 添加render_mode以显示可视化
    state_size = env.observation_space.shape[0]
    action_size = env.action_space.n
    
    # 加载训练好的模型
    agent = DQNAgent(state_size, action_size)
    agent.qnetwork_local.load_state_dict(torch.load(model_path))
    
    state, _ = env.reset()
    score = 0
    
    for t in range(1000):
        action = agent.act(state)  # 测试时不探索
        next_state, reward, terminated, truncated, _ = env.step(action)
        state = next_state
        score += reward
        
        if terminated or truncated:
            break
            
    print(f"Test Score: {score}")
    env.close()

if __name__ == "__main__":
    # 设置随机种子
    torch.manual_seed(0)
    np.random.seed(0)
    random.seed(0)
    
    print("开始训练DQN智能体...")
    scores = train_dqn(n_episodes=1000)
    
    print("绘制训练曲线...")
    plot_scores(scores)
    
    print("测试训练好的智能体...")
    test_agent()
参考资料：来自于老哥数学建模课程。

## BP神经网络的背景

1986年，Rumelhart等提出了误差反向传播神经网络，简称BP网络（Back Propagation），该网络是一种单向传播的多层前向网络。误差反向传播的学习算法简称BP算法，其基本思想是梯度下降法，BP神经网络是到目前为止使用最多、最成熟、采用最速下降的学习方式，在训练过程中通过误差的反向传播不断调整网络的权值和阈值，使得网络的误差平方和最小。BP神经网络可以全局逼近任意非线性的映射，具有良好的泛化性能。除此只挖掘，BP神经网络还具有强大的容错能力、鲁棒性好，具有自学习、自组织和自适应性等优点。因此，该神经网络自提出之后就得到了众多研究人员关注，并已经应用于语言综合、语言识别、自适应控制等领域。


## 输入层、隐含层、输出层

**输入层**：指的就是我们输入数据的种类数量，输入几类，输入层神经元就有几层

**隐含层**：夹在输入层和输出层之间的神经元，数量可以自行设置，不过一般通过经验公式来确定：

$h=\sqrt{m+n+a}$，

其中，m，n分别为输入、输出层节点个数，a为1-10之间的调节常数。

**输出层**：指的就是我们相应得到的指标，一般就一个

## 权值

**权值（Weight）**：输入层与隐含层之间

权值是神经元之间连接的强度，标示量一个神经元的输出与其输入直接的关联程度，在神经网络的每个连接中，都会有一个对应的权值。当一个神经元与另一个神经元连接时，输入信号会乘以对应的权值，然后传递给下一个神经元。权值可以看作是输入信号的重要性或权重，它决定了输入信号对神经元激活状态的影响程度。权值是神经网络训练的主要目标，通过反向传播算法等优化方法，调整权值使得神经网络能够更好地拟合训练数据，准确预测。


## 阈值

阈值（Biases）：隐含层和输出层之间

阈值是神经元的激活门限值，用于控制神经元是否被激活。在神经元接收到加权输入后，会将输入值与对应的权值相加，然后与阈值进行比较。如果加权输入超过了阈值，神经元将被激活，产生输出。否则将保持非激活状态。阈值可以看作是神经元的敏感度，调整阈值可以改变神经元的激活情况。在神经网络的训练过程中，也会优化阈值，以使神经元的激活情况更符合预期输出。

需要注意的是，权值和阈值都是可以学习更新的，神经网络会自动调整，以优化神经网络的性能、准确性。

## 激活函数

常用的激活函数有两个：

1. tanh（双曲正切）激活函数：

tanh函数的定义是：

$f(x)=\frac{e^x-e^{-x}}{e^x+e^{-x}}$
			
这个函数的输出范围在-1到1之间，即在输入较大或较小时，都能产生较大的输出值，因此相对于Sigmoid函数，它的输出更接近于零中心化，有时能帮助神经网络更快地收敛。

2. Sigmoid激活函数：

Sigmoid函数的定义是：

$f(x)=\frac{1}{1+e^{-x}}$

这个函数的输出范围是0-1之间，当输入值较大/较小时，输出值接近于0/1，容易导致梯度消失问题，即在反向传播过程中梯度接近于0，使得网络难以更新权重。

这两种激活函数主要用于在神经元之间传递信号并引入非线性特性，它们的主要作用在于增加网络的表达能力，使得神经网络可以学习非线性函数。

Tanh函数的求导过程：

$\frac{d\tanh(x)}{dx} = 1 - \tanh^{2}(x)$

Sigmoid函数的求导过程：

$\frac{d\sigma(x)}{dx} = \sigma(x) \cdot (1 - \sigma(x))$


较小规模选Sigmoid，更复杂的选tanh，因为他在输入较大或较小时有更大的导数，可以有效避免梯度消失问题。

## 评价指标


BP神经网络优化前后的预测误差评价指标有4种，分别为：

（1）平均绝对误差mae：

$mae=\frac{1}{n}\sum^n_{i=1}\lvert{y_i-h(x_i)}\rvert$

$y$代表真实值，$h(x_i)$代表预测值。

（2）均方误差mse：

$mse=\frac{\sum^n_{i=1}(X_i-x_i)^2}{N}$

其中，$X_i$与$x_i$分别为真实值和预测值，$N$为样本个数。

（3）均方误差根rmse：

$rmse=\sqrt{\frac{\sum^n_{i=1}(X_i-x_i)^2}{N}}$

（4）平均绝对百分比误差mape：

$mape=\frac{100\%}{n}\frac{1}{n}\sum^n_{i=1}\lvert\frac{{y_i-h(x_i)}}{y_i}\rvert$

其中，$y_i$代表真实值，$h(x_i)$代表预测值，mape值越小，代表模型拟合的越好越准确，mape=0即完美，mape>100%则表示模型劣质、不合适。

## 如何建立一个BP神经网络

步骤：

1. 定义输入和输出：明确你输入的特征/数据是什么，输出是你希望神经网络预测/分类的目标。
2. 设计网络结构：确定输入层的节点数量（与输入特征数相同）、输出层的节点数量（与输出维度相同），以及中间的隐藏层的数量和节点数量。层数的增加只可能是隐含层的增加。
3. 初始化权值和阈值：这两个值一般会被初始化为随机值
4. 前向传播（Forward Propagation）：数据从输入层传到输出层，每个神经元中，输入值乘以权重加上阈值，通过激活函数计算神经元的输出。直到累计产生最终预测结果。
5. 计算损失（Loss）：损失函数用于衡量神经网络的预测输出与实际输出之间的误差。常见的损失函数包括包括均方误差和交叉熵损失等。目标是通过训练来最小化损失，使得神经网络的输出尽可能接近真实值。
6. 反向传播（Back Propagation）：反向传播是训练神经网络的核心步骤，通过比较预测输出和实际输出，计算损失函数对权值和阈值的梯度，然后，使用优化算法（如梯度下降法）来根据这些梯度逐渐调整权值和阈值，使损失函数减小。
7. 重复训练
8. 验证测试
9. 模型应用

## BP神经网络实际代码

 ```python
 import numpy as np
import math
import random
import string
import matplotlib as mpl
import matplotlib.pyplot as plt
 
#random.seed(0)  #当我们设置相同的seed，每次生成的随机数相同。如果不设置seed，则每次会生成不同的随机数
                #参考https://blog.csdn.net/jiangjiang_jian/article/details/79031788
 
#生成区间[a,b]内的随机数
def random_number(a,b):
    return (b-a)*random.random()+a
 
#生成一个矩阵，大小为m*n,并且设置默认零矩阵
def makematrix(m, n, fill=0.0):
    a = []
    for i in range(m):
        a.append([fill]*n)
    return a
 
#函数sigmoid(),这里采用tanh，因为看起来要比标准的sigmoid函数好看
def sigmoid(x):
    return math.tanh(x)
 
#函数sigmoid的派生函数
def derived_sigmoid(x):
    return 1.0 - x**2
 
#构造三层BP网络架构
class BPNN:
    def __init__(self, num_in, num_hidden, num_out):
        #输入层，隐藏层，输出层的节点数
        self.num_in = num_in + 1  #增加一个偏置结点
        self.num_hidden = num_hidden + 1   #增加一个偏置结点
        self.num_out = num_out
        
        #激活神经网络的所有节点（向量）
        self.active_in = [1.0]*self.num_in
        self.active_hidden = [1.0]*self.num_hidden
        self.active_out = [1.0]*self.num_out
        
        #创建权重矩阵
        self.wight_in = makematrix(self.num_in, self.num_hidden)
        self.wight_out = makematrix(self.num_hidden, self.num_out)
        
        #对权值矩阵赋初值
        for i in range(self.num_in):
            for j in range(self.num_hidden):
                self.wight_in[i][j] = random_number(-0.2, 0.2)
        for i in range(self.num_hidden):
            for j in range(self.num_out):
                self.wight_out[i][j] = random_number(-0.2, 0.2)
    
        #最后建立动量因子（矩阵）
        self.ci = makematrix(self.num_in, self.num_hidden)
        self.co = makematrix(self.num_hidden, self.num_out)        
        
    #信号正向传播
    def update(self, inputs):
        if len(inputs) != self.num_in-1:
            raise ValueError('与输入层节点数不符')
            
        #数据输入输入层
        for i in range(self.num_in - 1):
            #self.active_in[i] = sigmoid(inputs[i])  #或者先在输入层进行数据处理
            self.active_in[i] = inputs[i]  #active_in[]是输入数据的矩阵
            
        #数据在隐藏层的处理
        for i in range(self.num_hidden - 1):
            sum = 0.0
            for j in range(self.num_in):
                sum = sum + self.active_in[i] * self.wight_in[j][i]
            self.active_hidden[i] = sigmoid(sum)   #active_hidden[]是处理完输入数据之后存储，作为输出层的输入数据
            
        #数据在输出层的处理
        for i in range(self.num_out):
            sum = 0.0
            for j in range(self.num_hidden):
                sum = sum + self.active_hidden[j]*self.wight_out[j][i]
            self.active_out[i] = sigmoid(sum)   #与上同理
            
        return self.active_out[:]
    
    #误差反向传播
    def errorbackpropagate(self, targets, lr, m):   #lr是学习率， m是动量因子
        if len(targets) != self.num_out:
            raise ValueError('与输出层节点数不符！')
            
        #首先计算输出层的误差
        out_deltas = [0.0]*self.num_out
        for i in range(self.num_out):
            error = targets[i] - self.active_out[i]
            out_deltas[i] = derived_sigmoid(self.active_out[i])*error
        
        #然后计算隐藏层误差
        hidden_deltas = [0.0]*self.num_hidden
        for i in range(self.num_hidden):
            error = 0.0
            for j in range(self.num_out):
                error = error + out_deltas[j]* self.wight_out[i][j]
            hidden_deltas[i] = derived_sigmoid(self.active_hidden[i])*error
        
        #首先更新输出层权值
        for i in range(self.num_hidden):
            for j in range(self.num_out):
                change = out_deltas[j]*self.active_hidden[i]
                self.wight_out[i][j] = self.wight_out[i][j] + lr*change + m*self.co[i][j]
                self.co[i][j] = change
                
        #然后更新输入层权值
        for i in range(self.num_in):
            for i in range(self.num_hidden):
                change = hidden_deltas[j]*self.active_in[i]
                self.wight_in[i][j] = self.wight_in[i][j] + lr*change + m* self.ci[i][j]
                self.ci[i][j] = change
                
        #计算总误差
        error = 0.0
        for i in range(len(targets)):
            error = error + 0.5*(targets[i] - self.active_out[i])**2
        return error
 
    #测试
    def test(self, patterns):
        for i in patterns:
            print(i[0], '->', self.update(i[0]))
    #权重
    def weights(self):
        print("输入层权重")
        for i in range(self.num_in):
            print(self.wight_in[i])
        print("输出层权重")
        for i in range(self.num_hidden):
            print(self.wight_out[i])
            
    def train(self, pattern, itera=100000, lr = 0.1, m=0.1):
        for i in range(itera):
            error = 0.0
            for j in pattern:
                inputs = j[0]
                targets = j[1]
                self.update(inputs)
                error = error + self.errorbackpropagate(targets, lr, m)
            if i % 100 == 0:
                print('误差 %-.5f' % error)
    
#实例
def demo():
    patt = [
            [[1,2,5],[0]],
            [[1,3,4],[1]],
            [[1,6,2],[1]],
            [[1,5,1],[0]],
            [[1,8,4],[1]]
            ]
    #创建神经网络，3个输入节点，3个隐藏层节点，1个输出层节点
    n = BPNN(3, 3, 1)
    #训练神经网络
    n.train(patt)
    #测试神经网络
    n.test(patt)
    #查阅权重值
    n.weights()
 
     
if __name__ == '__main__':
    demo()
 ```

运行结果如图所示：
![1](https://github.com/user-attachments/assets/0abe348e-7824-4265-8c18-35c411cffb97)

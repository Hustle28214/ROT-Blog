import numpy as np
import matplotlib.pyplot as plt

# 定义函数 f(x)
def f(x):
    return np.sin(x)  # 选择一个简单的正弦函数

# 生成 x 数据
x = np.linspace(0, 2 * np.pi, 400)
y = f(x)

# 端点
a, b = 0, 2 * np.pi
fa, fb = f(a), f(b)

# 找到导数为零的点
from scipy.optimize import minimize_scalar

def neg_f_prime(x):
    return -np.cos(x)  # 负导数

result = minimize_scalar(neg_f_prime, bounds=(a, b), method='bounded')
x0 = result.x
y0 = f(x0)

# 绘制函数图像
plt.figure(figsize=(8, 6))
plt.plot(x, y, label='$f(x) = \sin(x)$', color='blue')

# 标记端点 a 和 b
plt.plot(a, fa, 'ro', label='$f(a) = f(b)$')
plt.plot(b, fb, 'ro')

# 标记导数为零的点 x0
plt.plot(x0, y0, 'go')  # 极值点
plt.text(x0, y0 + 0.5, '$x_0$', fontsize=12, ha='center')

# 绘制切线（导数为零）
plt.axhline(y0, color='gray', linestyle='--')

# 设置图形属性
plt.title('Lagrange mean value theorem')
plt.xlabel('$x$')
plt.ylabel('$f(x)$')
plt.legend()
plt.grid(True)
plt.show()
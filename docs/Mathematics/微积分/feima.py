import numpy as np
import matplotlib.pyplot as plt

# 定义函数 f(x) 和 g(x)
def f(x):
    return np.sin(x)

def g(x):
    return x

# 生成 x 数据
x = np.linspace(0, 2 * np.pi, 400)
y_f = f(x)
y_g = g(x)

# 端点
a, b = 0, 2 * np.pi
fa, fb = f(a), f(b)
ga, gb = g(a), g(b)

# 找到导数比值符合柯西中值定理的点
from scipy.optimize import minimize_scalar

def mean_value_condition(x):
    return (np.cos(x) / 1) - (fb - fa) / (gb - ga)

result = minimize_scalar(mean_value_condition, bounds=(a, b), method='bounded')
x0 = result.x
y0_f = f(x0)
y0_g = g(x0)

# 绘制函数图像
plt.figure(figsize=(10, 6))

# 绘制 f(x) 和 g(x)
plt.plot(x, y_f, label='$f(x) = \sin(x)$', color='blue')
plt.plot(x, y_g, label='$g(x) = x$', color='red')

# 标记端点 a 和 b
plt.plot(a, fa, 'bo', label='$f(a)$, $g(a)$')
plt.plot(b, fb, 'bo')
plt.plot(a, ga, 'ro')
plt.plot(b, gb, 'ro')

# 标记点 x0
plt.plot(x0, y0_f, 'go')  # 对应 f(x)
plt.plot(x0, y0_g, 'go')  # 对应 g(x)
plt.text(x0, y0_f + 0.5, '$x_0$', fontsize=12, ha='center')

# 绘制导数比值的条件
plt.axhline(y=f(x0) / g(x0), color='gray', linestyle='--')

# 设置图形属性
plt.title('Cauchy mean value theorem')
plt.xlabel('$x$')
plt.ylabel('$f(x)$ 和 $g(x)$')
plt.legend()
plt.grid(True)
plt.show()
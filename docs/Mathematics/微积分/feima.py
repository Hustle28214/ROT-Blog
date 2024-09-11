import numpy as np
import matplotlib.pyplot as plt

# 定义函数 f(x)
def f(x):
    return - (x - 2)**2 + 4

# 生成 x 数据
x = np.linspace(0, 4, 400)
y = f(x)

# 绘制函数图像
plt.figure(figsize=(8, 6))
plt.plot(x, y, label='$f(x) = -(x - 2)^2 + 4$', color='blue')

# 标记极值点
x0 = 2
y0 = f(x0)
plt.plot(x0, y0, 'ro')  # 极值点
plt.text(x0, y0 + 0.5, '$x_0$', fontsize=12, ha='center')

# 绘制切线（导数为零）
plt.axhline(y0, color='gray', linestyle='--')

# 设置图形属性
plt.title('Fermat\'s Theorem')
plt.xlabel('$x$')
plt.ylabel('$f(x)$')
plt.legend()
plt.grid(True)
plt.show()
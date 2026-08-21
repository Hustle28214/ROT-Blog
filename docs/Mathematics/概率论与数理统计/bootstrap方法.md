import WordCount from '../../../src/components/WordCount/WordCount.jsx';

<WordCount>

# Bootstrap 方法

## 1. 为什么需要 Bootstrap

设样本为
$$
X_1,\ldots,X_n \overset{\mathrm{iid}}{\sim} F,
$$
我们希望估计统计量
$$
\hat\theta=s(X_1,\ldots,X_n)
$$
的标准误、偏差或置信区间。若 $\hat\theta$ 是中位数、分位数或复杂模型输出，
其抽样分布往往难以解析推导。Bootstrap 的核心做法是：用样本本身近似未知总体，
再通过重复重采样近似“重复抽样”。

### 1.1 经验分布

样本对应的经验分布函数为

$$
\widehat F_n(x)=\frac{1}{n}\sum_{i=1}^n I(X_i\le x).
\tag{1.1}
$$

$\widehat F_n$ 在每个观测值上放置质量 $1/n$。从 $\widehat F_n$ 抽取一个观测，
等价于从原样本中等概率、有放回地抽取一个元素。

:::note 直观解释

真实实验是“从 $F$ 抽样并计算统计量”；非参数 Bootstrap 把其中未知的 $F$
替换为可观测的 $\widehat F_n$。因此，它不是凭空制造信息，而是在
“经验分布足够接近总体分布”的前提下传播抽样不确定性。

:::

## 2. 非参数 Bootstrap 算法

给定重复次数 $B$，标准算法如下。

```text
输入：样本 x[1:n]，统计函数 s，重复次数 B
计算 theta_hat = s(x)
对 b = 1, ..., B：
    从 x 中有放回抽取 n 个值，得到 x_star
    theta_star[b] = s(x_star)
输出：theta_hat 与 theta_star[1:B]
```

通常探索时可取 $B=2000$，报告尾部分位数时建议至少取 $B=5000$。
应检查增大 $B$ 后结论是否稳定。

### 2.1 R 中的通用实现

下面仅使用 R 自带函数，对均值、中位数或其他单样本统计量都适用。

```r
bootstrap <- function(x, statistic, B = 5000, seed = NULL) {
  if (!is.null(seed)) set.seed(seed)
  n <- length(x)
  replicate(B, {
    x_star <- sample(x, size = n, replace = TRUE)
    statistic(x_star)
  })
}

x <- c(12.1, 11.8, 12.5, 13.0, 11.6, 12.4, 12.8, 11.9)
theta_hat <- median(x)
theta_star <- bootstrap(x, median, B = 5000, seed = 20260820)
```

对于成对数据，必须重采样“行”，不能分别重采样两列：

```r
dat <- data.frame(
  x = c(1, 2, 3, 4, 5, 6),
  y = c(1.2, 1.9, 3.4, 3.7, 5.1, 6.3)
)

set.seed(20260820)
B <- 5000
r_star <- replicate(B, {
  id <- sample(seq_len(nrow(dat)), replace = TRUE)
  cor(dat$x[id], dat$y[id])
})
```

## 3. 标准误与偏差

Bootstrap 标准误是 Bootstrap 统计量的样本标准差：

$$
\widehat{\operatorname{se}}_{\mathrm{boot}}(\hat\theta)
=
\sqrt{\frac{1}{B-1}\sum_{b=1}^B
(\hat\theta_b^*-\overline{\theta^*})^2}.
\tag{3.1}
$$

Bootstrap 偏差估计为

$$
\widehat{\operatorname{bias}}_{\mathrm{boot}}
=\overline{\theta^*}-\hat\theta.
\tag{3.2}
$$

```r
boot_se <- sd(theta_star)
boot_bias <- mean(theta_star) - theta_hat
c(estimate = theta_hat, standard_error = boot_se, bias = boot_bias)
```

可构造偏差修正的点估计

$$
\hat\theta_{\mathrm{bc}}
=\hat\theta-\widehat{\operatorname{bias}}_{\mathrm{boot}},
$$

但偏差修正可能增加方差。实际报告中通常保留原点估计，同时报告估计偏差。

### 3.1 Monte Carlo 误差

$B$ 有限会引入模拟误差。可以用两个不同种子重复计算，或比较
$B=2000,5000,10000$ 的结果。若区间端点明显漂移，应增加 $B$；
这只能减少模拟误差，不能修复样本代表性不足。

## 4. Bootstrap 置信区间

记 $\hat q_\alpha^*$ 为 $\{\hat\theta_b^*\}$ 的经验 $\alpha$ 分位数，
置信水平为 $1-\alpha$。

### 4.1 Percentile 区间

Percentile 区间直接读取 Bootstrap 分布的分位数：

$$
\left[
\hat q_{\alpha/2}^*,
\hat q_{1-\alpha/2}^*
\right].
\tag{4.1}
$$

```r
alpha <- 0.05
ci_percentile <- quantile(
  theta_star,
  probs = c(alpha / 2, 1 - alpha / 2),
  names = FALSE
)
```

它直观、保持参数变换单调不变性，但可能受偏差和偏斜影响。

### 4.2 Basic 区间

Basic 区间以 $\hat\theta$ 为中心反射 Bootstrap 分位数：

$$
\left[
2\hat\theta-\hat q_{1-\alpha/2}^*,
2\hat\theta-\hat q_{\alpha/2}^*
\right].
\tag{4.2}
$$

```r
q_boot <- quantile(
  theta_star,
  probs = c(1 - alpha / 2, alpha / 2),
  names = FALSE
)
ci_basic <- 2 * theta_hat - q_boot
```

Basic 区间近似校正位置偏差，但在强偏斜问题中仍可能覆盖不足。

### 4.3 BCa 区间

BCa（bias-corrected and accelerated）同时校正偏差与分布偏斜。
偏差校正常数为

$$
z_0=\Phi^{-1}\left(
\frac{\#\{\hat\theta_b^*<\hat\theta\}}{B}
\right).
\tag{4.3}
$$

加速常数 $a$ 由删除一个观测的 Jackknife 统计量估计：

$$
a=
\frac{\sum_{i=1}^n(\bar\theta_{(\cdot)}-\hat\theta_{(i)})^3}
{6\left[\sum_{i=1}^n
(\bar\theta_{(\cdot)}-\hat\theta_{(i)})^2\right]^{3/2}}.
\tag{4.4}
$$

将正态分位数 $z_\gamma$ 调整为

$$
\gamma_{\mathrm{BCa}}
=
\Phi\left[
z_0+\frac{z_0+z_\gamma}{1-a(z_0+z_\gamma)}
\right],
\tag{4.5}
$$

再读取 Bootstrap 分布在两个调整概率处的分位数。BCa 通常比 percentile
区间准确，但当统计量不平滑、Jackknife 值退化或样本很小时也不可靠。

以下函数展示无额外依赖的实现：

```r
bca_interval <- function(x, statistic, theta_star, conf = 0.95) {
  n <- length(x)
  theta_hat <- statistic(x)
  prop_less <- mean(theta_star < theta_hat)
  eps <- 1 / (2 * length(theta_star))
  prop_less <- min(max(prop_less, eps), 1 - eps)
  z0 <- qnorm(prop_less)

  jack <- vapply(seq_len(n), function(i) {
    statistic(x[-i])
  }, numeric(1))
  u <- mean(jack) - jack
  denom <- 6 * sum(u^2)^(3 / 2)
  accel <- if (denom == 0) 0 else sum(u^3) / denom

  alpha <- 1 - conf
  z <- qnorm(c(alpha / 2, 1 - alpha / 2))
  probs <- pnorm(z0 + (z0 + z) / (1 - accel * (z0 + z)))
  quantile(theta_star, probs = probs, names = FALSE)
}

ci_bca <- bca_interval(x, median, theta_star)
```

:::warning

任何区间都应同时报告点估计、样本量、$B$、重采样单位与随机种子。
只报告一个“看起来精确”的区间会隐藏设计假设。

:::

## 5. 参数 Bootstrap

若有可信的参数模型 $F_\theta$，可先估计 $\hat\theta$，再从
$F_{\hat\theta}$ 模拟样本。此时重采样来源是拟合模型，而非经验分布。

例如估计正态总体中位数（它等于均值）：

```r
x <- c(4.2, 5.0, 5.4, 4.8, 6.1, 5.2, 4.9, 5.7)
n <- length(x)
mu_hat <- mean(x)
sigma_hat <- sd(x)

set.seed(20260820)
B <- 5000
mu_star <- replicate(B, {
  x_star <- rnorm(n, mean = mu_hat, sd = sigma_hat)
  mean(x_star)
})

sd(mu_star)
quantile(mu_star, c(0.025, 0.975))
```

参数 Bootstrap 在模型正确时通常更有效率；模型错设时，它会稳定地重复错误模型。
因此应先检查分布假设与残差诊断。

## 6. Bootstrap 假设检验

检验必须在零假设成立的机制下生成样本，不能直接用原始样本重采样后计算
$P(\hat\theta^*\ge\hat\theta)$。

以单样本均值检验

$$
H_0:\mu=\mu_0
$$

为例，先中心化数据 $x_i^0=x_i-\bar x+\mu_0$，再从中心化样本重采样。

```r
x <- c(9.1, 10.4, 11.2, 9.8, 10.7, 11.0, 10.2, 9.9)
mu0 <- 10
t_obs <- mean(x) - mu0
x_null <- x - mean(x) + mu0

set.seed(20260820)
B <- 9999
t_null <- replicate(B, {
  mean(sample(x_null, replace = TRUE)) - mu0
})

p_value <- (1 + sum(abs(t_null) >= abs(t_obs))) / (B + 1)
p_value
```

加一修正避免有限模拟下得到 $p=0$。两组比较时应根据设计选择：
独立样本可在零假设下合并标签并置换，配对样本应重采样“配对差值”。
严格说，置换检验与 Bootstrap 不同，但零假设下的交换性常使置换检验更直接。

## 7. 适用条件与失效情形

非参数 Bootstrap 通常要求：

1. 样本能代表目标总体；
2. 重采样单位之间近似独立；
3. 样本量足以让 $\widehat F_n$ 逼近 $F$；
4. 统计量对经验分布的微小变化较稳定。

常见失效或需要改造的情形包括：

- **极小样本**：经验分布支持点太少，尾部信息无法恢复；
- **极端值或重尾分布**：均值与高阶矩的 Bootstrap 分布可能很不稳定；
- **边界参数**：如方差接近零、概率接近 $0$ 或 $1$，常规区间覆盖率差；
- **不平滑统计量**：样本最大值、变量选择后的估计等可能不满足常规近似；
- **相关数据**：时间序列、空间数据不能逐点独立重采样，应考虑块 Bootstrap；
- **分层或整群抽样**：应按原抽样设计在层内或以整群为单位重采样；
- **删失与缺失**：必须在重采样中保留删失机制，并说明缺失处理假设；
- **分布外推**：Bootstrap 不能产生样本范围之外的尾部结构。

:::tip 实践检查清单

先明确“独立的信息单位”是什么，再写重采样代码。绘制
`hist(theta_star)` 或 `plot(density(theta_star))` 检查偏斜、多峰和离群值；
比较多种区间并做模拟稳定性检查。若方法间差异很大，应解释原因，而不是挑选
最有利的结果。

:::

## 8. 完整可复现实例

下面对变异系数 $\operatorname{CV}=s/\bar x$ 估计标准误和三种区间：

```r
x <- c(18.2, 20.1, 17.9, 22.4, 19.7, 21.3, 18.8, 23.0, 20.5, 19.2)
cv <- function(z) sd(z) / mean(z)

B <- 10000
theta_hat <- cv(x)
theta_star <- bootstrap(x, cv, B = B, seed = 20260820)
alpha <- 0.05

result <- list(
  estimate = theta_hat,
  standard_error = sd(theta_star),
  bias = mean(theta_star) - theta_hat,
  percentile = unname(quantile(theta_star, c(0.025, 0.975))),
  basic = 2 * theta_hat -
    unname(quantile(theta_star, c(0.975, 0.025))),
  BCa = bca_interval(x, cv, theta_star, conf = 0.95)
)
result
```

复现实验时还应记录：

```r
sessionInfo()
```

## References

1. Efron, B., & Tibshirani, R. J. (1993). *An Introduction to the Bootstrap*. Chapman & Hall/CRC.
2. Davison, A. C., & Hinkley, D. V. (1997). *Bootstrap Methods and Their Application*. Cambridge University Press.
3. Canty, A., & Ripley, B. D. (2025). *boot: Bootstrap R (S-Plus) Functions*. R package documentation.

</WordCount>

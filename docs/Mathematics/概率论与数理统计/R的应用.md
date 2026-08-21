import WordCount from '../../../src/components/WordCount/WordCount.jsx';

<WordCount>

# R 在概率论与数理统计中的应用

## 1. 基础约定与数据准备

R 的向量运算默认逐元素进行，索引从 1 开始。缺失值用 `NA` 表示，
多数统计函数需要显式设置 `na.rm = TRUE`。
```r
x <- c(8.2, 7.9, 8.5, NA, 9.1, 8.7)
length(x)
mean(x, na.rm = TRUE)
x[!is.na(x)]
```
数据框适合保存“每行一个观测、每列一个变量”的整洁数据：
```r
dat <- data.frame(
  group = factor(c("control", "control", "control",
                   "treatment", "treatment", "treatment")),
  score = c(72, 75, 71, 81, 79, 84)
)
str(dat)
summary(dat)
```
:::note 公式接口
R 中许多模型采用 `响应变量 ~ 解释变量` 公式。例如
`score ~ group` 表示用组别解释得分；`y ~ x1 + x2` 表示包含两个主效应。
:::
## 2. 概率分布函数：d、p、q、r

R 为常见分布使用统一前缀：

1. `d*`：概率质量函数或概率密度函数；
2. `p*`：累积分布函数 $P(X\le x)$；
3. `q*`：分位数函数，即累积分布函数的反函数；
4. `r*`：生成伪随机数。

后缀表示分布，例如正态分布 `norm`、二项分布 `binom`、泊松分布 `pois`、
$t$ 分布 `t`、卡方分布 `chisq` 和 $F$ 分布 `f`。

### 2.1 正态分布

若 $X\sim N(\mu,\sigma^2)$，计算密度、左尾概率、分位数与随机样本：
```r
dnorm(0, mean = 0, sd = 1)
pnorm(1.96)
qnorm(0.975)
rnorm(5, mean = 10, sd = 2)
```
右尾概率应优先使用 `lower.tail = FALSE`，避免手工计算 `1 - p` 的精度损失：
```r
pnorm(3, lower.tail = FALSE)
qnorm(0.01, lower.tail = FALSE)
```
### 2.2 离散分布

若 $X\sim\operatorname{Bin}(n,p)$，则
$$
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}.
$$
```r
dbinom(3, size = 10, prob = 0.2)       # P(X = 3)
pbinom(3, size = 10, prob = 0.2)       # P(X <= 3)
pbinom(2, size = 10, prob = 0.2,
       lower.tail = FALSE)             # P(X >= 3)
qbinom(0.95, size = 10, prob = 0.2)
rbinom(100, size = 10, prob = 0.2)
```
:::warning 离散分布的端点
`pbinom(k, ...)` 是 $P(X\le k)$。因此 $P(X\ge k)$ 应写成
`pbinom(k - 1, ..., lower.tail = FALSE)`，不能直接计算
`1 - pbinom(k, ...)`。
:::
## 3. 描述统计与探索

集中趋势和离散程度可直接计算：
```r
x <- c(12, 15, 14, 10, 18, 16, 15, 13)
mean(x)
median(x)
var(x)
sd(x)
quantile(x, probs = c(0, 0.25, 0.5, 0.75, 1))
IQR(x)
range(x)
```
样本方差采用分母 $n-1$：
$$
s^2=\frac{1}{n-1}\sum_{i=1}^n(x_i-\bar x)^2.
\tag{3.1}
$$
分类变量可用频数表与比例表：
```r
g <- factor(c("A", "B", "A", "A", "C", "B"))
table(g)
prop.table(table(g))
```
分组汇总无需额外依赖：
```r
aggregate(score ~ group, data = dat, FUN = mean)
aggregate(score ~ group, data = dat, FUN = sd)
```
图形探索应先于正式推断：
```r
par(mfrow = c(1, 2))
hist(x, breaks = "FD", main = "Histogram", xlab = "x")
boxplot(x, horizontal = TRUE, main = "Boxplot")
par(mfrow = c(1, 1))
```
## 4. 采样、模拟与随机种子

`sample()` 默认不放回抽样；Bootstrap 等场景必须设置 `replace = TRUE`。
```r
population <- 1:100
sample(population, size = 10)
sample(population, size = 10, replace = TRUE)
sample(c("yes", "no"), size = 20, replace = TRUE,
       prob = c(0.3, 0.7))
```
`set.seed()` 固定伪随机数生成器状态，使模拟可复现：
```r
set.seed(20260820)
z1 <- rnorm(5)
set.seed(20260820)
z2 <- rnorm(5)
identical(z1, z2)
```
不要在循环内部重复设置同一个种子，否则每轮会产生相同样本。

### 4.1 用模拟验证概率

估计两个骰子点数和至少为 10 的概率：
```r
set.seed(20260820)
B <- 100000
d1 <- sample(1:6, B, replace = TRUE)
d2 <- sample(1:6, B, replace = TRUE)
p_hat <- mean(d1 + d2 >= 10)
mc_se <- sqrt(p_hat * (1 - p_hat) / B)
c(estimate = p_hat, Monte_Carlo_SE = mc_se)
```
Monte Carlo 标准误约按 $1/\sqrt{B}$ 下降。要将误差减半，模拟次数约需增至四倍。

## 5. 置信区间

### 5.1 单个正态总体均值

总体方差未知且观测独立、近似正态时，
$$
\bar X\pm t_{1-\alpha/2,n-1}\frac{S}{\sqrt n}.
\tag{5.1}
$$
```r
x <- c(5.2, 4.8, 5.6, 5.1, 4.9, 5.4, 5.0, 5.3)
n <- length(x)
alpha <- 0.05
margin <- qt(1 - alpha / 2, df = n - 1) * sd(x) / sqrt(n)
c(lower = mean(x) - margin, upper = mean(x) + margin)
t.test(x, conf.level = 0.95)$conf.int
```
### 5.2 单个比例

`prop.test()` 给出基于得分近似的区间，`binom.test()` 给出精确二项区间：
```r
prop.test(x = 42, n = 100, conf.level = 0.95,
          correct = FALSE)$conf.int
binom.test(x = 42, n = 100, conf.level = 0.95)$conf.int
```
小样本或比例接近 0、1 时优先考虑精确区间，同时说明它通常较保守。

## 6. 常用假设检验

### 6.1 t 检验

单样本检验 $H_0:\mu=10$：
```r
t.test(x, mu = 10, alternative = "two.sided")
```
独立两样本默认使用 Welch t 检验，不假设方差相等：
```r
a <- c(18, 21, 20, 19, 23, 22)
b <- c(15, 17, 14, 18, 16, 15)
t.test(a, b, alternative = "two.sided")
```
只有在设计和诊断支持方差齐性时，才设置 `var.equal = TRUE`。
配对设计必须保留配对关系：
```r
before <- c(120, 132, 128, 140, 135, 125)
after  <- c(116, 128, 125, 133, 130, 121)
t.test(after, before, paired = TRUE)
```
### 6.2 比例检验

比较两个独立比例：
```r
success <- c(45, 60)
total <- c(100, 120)
prop.test(success, total, correct = FALSE)
```
期望频数很小时，构造 $2\times2$ 列联表并使用 Fisher 精确检验：
```r
tab <- matrix(c(1, 8, 6, 5), nrow = 2, byrow = TRUE)
fisher.test(tab)
```
### 6.3 方差检验

正态总体单方差检验基于
$$
\frac{(n-1)S^2}{\sigma_0^2}\sim\chi^2_{n-1}.
\tag{6.1}
$$
```r
sigma0_sq <- 4
stat <- (length(x) - 1) * var(x) / sigma0_sq
p_value <- 2 * min(
  pchisq(stat, df = length(x) - 1),
  pchisq(stat, df = length(x) - 1, lower.tail = FALSE)
)
min(1, p_value)
```
两个正态总体方差比可用：
```r
var.test(a, b, ratio = 1)
```
:::warning
方差检验对非正态性非常敏感。先检查分布；若目标只是比较均值，
Welch t 检验通常不需要先做方差齐性检验。
:::
## 7. 单因素方差分析

单因素 ANOVA 检验
$$
H_0:\mu_1=\mu_2=\cdots=\mu_k.
$$
```r
anova_dat <- data.frame(
  group = factor(rep(c("A", "B", "C"), each = 5)),
  value = c(12, 13, 11, 14, 12,
            15, 16, 14, 17, 15,
            19, 18, 20, 17, 19)
)
fit_aov <- aov(value ~ group, data = anova_dat)
summary(fit_aov)
TukeyHSD(fit_aov)
```
总体 $F$ 检验显著只表示至少一组均值不同。`TukeyHSD()` 用于控制
两两比较的家族错误率，不能用多次未校正 t 检验代替。

检查残差正态性和方差稳定性：
```r
par(mfrow = c(1, 2))
plot(fitted(fit_aov), residuals(fit_aov),
     xlab = "Fitted", ylab = "Residuals")
abline(h = 0, lty = 2)
qqnorm(residuals(fit_aov))
qqline(residuals(fit_aov))
par(mfrow = c(1, 1))
```
## 8. 线性回归

简单线性模型为
$$
Y_i=\beta_0+\beta_1x_i+\varepsilon_i,
\qquad
\varepsilon_i\overset{\mathrm{iid}}{\sim}N(0,\sigma^2).
\tag{8.1}
$$
```r
reg_dat <- data.frame(
  hours = c(1, 2, 3, 4, 5, 6, 7, 8),
  score = c(52, 55, 61, 64, 68, 73, 77, 81)
)
fit <- lm(score ~ hours, data = reg_dat)
summary(fit)
confint(fit, level = 0.95)
```
对新解释变量值计算均值响应区间与个体预测区间：
```r
new_dat <- data.frame(hours = c(4.5, 9))
predict(fit, newdata = new_dat,
        interval = "confidence", level = 0.95)
predict(fit, newdata = new_dat,
        interval = "prediction", level = 0.95)
```
个体预测区间更宽，因为它还包含新个体自身的随机误差。
不要对远离已观测 `hours` 范围的值作无依据外推。

## 9. 回归诊断

线性回归主要检查线性、独立、同方差、残差近似正态，以及高影响观测。
```r
par(mfrow = c(2, 2))
plot(fit)
par(mfrow = c(1, 1))
```
四幅默认诊断图分别帮助识别：

1. 残差与拟合值图中的非线性和异方差；
2. 正态 Q-Q 图中的尾部偏离；
3. Scale-Location 图中的方差变化；
4. 杠杆值与 Cook 距离标出的高影响观测。

还可提取数值进行复核：
```r
rstandard(fit)
hatvalues(fit)
cooks.distance(fit)
which(cooks.distance(fit) > 4 / nrow(reg_dat))
```
阈值 `4 / n` 只是筛查规则。高影响点不等于错误数据；应核查记录、研究设计，
并比较保留与删除该点的结论，而非自动删除。
:::tip 模型解释
显著性不代表效应足够大，也不证明因果关系。报告系数、置信区间、单位、
样本来源和研究设计；观察性数据中的回归关系仍可能由混杂因素造成。
:::

## 10. 可复现工作流

一个无需新依赖的最小工作流如下：

1. 将原始数据视为只读，分析代码保存在脚本中；
2. 用相对路径读取数据，避免依赖个人主目录；
3. 在随机操作前只设置一次种子；
4. 记录数据清理规则、排除标准和变量单位；
5. 保存关键结果与图形，并记录 R 会话信息。

```r
# 1. 固定随机状态
set.seed(20260820)

# 2. 读取并验证数据
# dat <- read.csv("data/experiment.csv", stringsAsFactors = FALSE)
stopifnot(is.data.frame(reg_dat))
stopifnot(all(c("hours", "score") %in% names(reg_dat)))
stopifnot(!anyNA(reg_dat[c("hours", "score")]))

# 3. 拟合与提取结果
fit <- lm(score ~ hours, data = reg_dat)
coef_table <- summary(fit)$coefficients
intervals <- confint(fit)

# 4. 保存纯文本结果；执行前确保 results 目录已存在
# write.csv(coef_table, "results/coefficients.csv")
# writeLines(capture.output(sessionInfo()), "results/session-info.txt")

# 5. 输出环境信息
sessionInfo()
```

分析结束后，可用 `options()` 检查关键全局设置。不要依赖交互式工作区中残留的对象，
也不要把 `.Random.seed` 或 `.RData` 当作分析记录；从全新 R 会话运行完整脚本，
才是最直接的复现检查。

## 11. 结果报告清单

统计报告至少应包含：

- 研究问题、目标总体和抽样单位；
- 样本量、缺失值与排除规则；
- 点估计、区间估计和效应单位；
- 检验统计量、自由度与 $p$ 值；
- 模型假设及诊断结果；
- 软件版本、随机种子和可执行代码。

:::note 关于 p 值

$p$ 值是在 $H_0$ 及模型假设成立时，获得当前或更极端统计量的概率。
它不是“$H_0$ 为真的概率”，也不能单独衡量实际重要性。

:::

## References

1. R Core Team. (2026). *R: A Language and Environment for Statistical Computing*. R Foundation for Statistical Computing.
2. Dalgaard, P. (2008). *Introductory Statistics with R* (2nd ed.). Springer.
3. Faraway, J. J. (2014). *Linear Models with R* (2nd ed.). Chapman & Hall/CRC.

</WordCount>

import React, { useState, useEffect, useRef } from 'react';
import styles from './CovarianceMatrixVisualizer.module.css';

/**
 * 2D 协方差矩阵交互式可视化组件
 * @param {number} props.initialVarX - 初始 X 轴方差 (可选)
 * @param {number} props.initialVarY - 初始 Y 轴方差 (可选)
 * @param {number} props.initialCovXY - 初始 协方差 (可选)
 * @param {number} props.pointsCount - 随机散点的数量 (默认 600)
 */
export default function CovarianceMatrixVisualizer({
  initialVarX = 1.5,
  initialVarY = 1.0,
  initialCovXY = 0.5,
  pointsCount = 600
}) {
  const [varX, setVarX] = useState(initialVarX);
  const [varY, setVarY] = useState(initialVarY);
  const [covXY, setCovXY] = useState(initialCovXY);

  const canvasRef = useRef(null);

  // 数学边界保护：|covXY| 必须小于 sqrt(varX * varY)，保证协方差矩阵是正定的（数据不坍缩且合法）
  const maxCov = Math.sqrt(varX * varY) - 0.01;
  const safeCov = Math.min(Math.max(covXY, -maxCov), maxCov);

  // Box-Muller 变换：快速在浏览器端生成标准高斯分布随机数 (均值0, 方差1)
  const generateGaussianPair = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const radius = Math.sqrt(-2.0 * Math.log(u));
    const angle = 2.0 * Math.PI * v;
    return { z1: radius * Math.cos(angle), z2: radius * Math.sin(angle) };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const center = { x: width / 2, y: height / 2 };
    
    // 缩放因子：1 个标准差在画布上映射为 80 像素
    const scale = 80; 

    // 1. 每帧画布刷新
    ctx.clearRect(0, 0, width, height);

    // 2. 绘制网格背景与坐标轴
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = scale; i < width; i += scale) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(width, i); ctx.stroke();
    }
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, center.y); ctx.lineTo(width, center.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(center.x, 0); ctx.lineTo(center.x, height); ctx.stroke();

    // 3. 核心数学变换：Cholesky 分解矩阵 L 使得 Sigma = L * L^T
    const l11 = Math.sqrt(varX);
    const l21 = safeCov / l11;
    const l22 = Math.sqrt(Math.max(0, varY - l21 * l21));

    // 渲染散点
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'; // 现代感科技蓝，叠加显示密度
    for (let i = 0; i < pointsCount; i++) {
      const { z1, z2 } = generateGaussianPair();
      // 空间线性拉伸与旋转
      const x = l11 * z1;
      const y = l21 * z1 + l22 * z2;

      // 转换为画布物理坐标 (注意 Canvas 的 Y 轴向下，所以用减法)
      const cx = center.x + x * scale;
      const cy = center.y - y * scale;

      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 2 * Math.PI); ctx.fill();
    }

    // 4. 特征值与特征向量求解 (对角化分析)
    const trace = varX + varY;
    const det = varX * varY - safeCov * safeCov;
    const discriminant = Math.sqrt(Math.max(0, trace * trace - 4 * det));
    const lambda1 = (trace + discriminant) / 2; // 主特征值（主轴长度正相关）
    const lambda2 = (trace - discriminant) / 2; // 次特征值（次轴长度正相关）

    // 求解旋转角
    let theta = 0;
    if (safeCov !== 0) {
      theta = 0.5 * Math.atan2(2 * safeCov, varX - varY);
    }

    // 转换成椭圆物理半径 (取 2 倍标准差，包裹约 95% 数据边界)
    const radiusX = Math.sqrt(Math.max(0, lambda1)) * scale * 2;
    const radiusY = Math.sqrt(Math.max(0, lambda2)) * scale * 2;

    // 5. 绘制红色置信椭圆
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radiusX, radiusY, -theta, 0, 2 * Math.PI);
    ctx.stroke();

    // 6. 绘制几何主轴 (PCA 主成分方向)
    ctx.lineWidth = 3;
    // 第一主轴 (绿色)
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(center.x - radiusX * Math.cos(theta), center.y + radiusX * Math.sin(theta));
    ctx.lineTo(center.x + radiusX * Math.cos(theta), center.y - radiusX * Math.sin(theta));
    ctx.stroke();

    // 第二主轴 (橙色)
    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(center.x - radiusY * Math.sin(theta), center.y - radiusY * Math.cos(theta));
    ctx.lineTo(center.x + radiusY * Math.sin(theta), center.y + radiusY * Math.cos(theta));
    ctx.stroke();

  }, [varX, varY, safeCov, pointsCount]);

  return (
    <div className={styles.wrap}>
      <div className={styles.panel}>
        <div className={styles.titleBox}>
          <h3 className={styles.title}>2D 协方差矩阵可视化</h3>
          <p className={styles.hint}>拖动滑块观察多维数据分布的拉伸与旋转</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlBox}>
            <div className={styles.controlHead}>
              <span className={styles.label}>X 轴方差 · Var X</span>
              <span className={styles.value}>{varX.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={varX}
              onChange={(e) => setVarX(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlBox}>
            <div className={styles.controlHead}>
              <span className={styles.label}>Y 轴方差 · Var Y</span>
              <span className={styles.value}>{varY.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.1"
              value={varY}
              onChange={(e) => setVarY(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>

          <div className={styles.controlBox}>
            <div className={styles.controlHead}>
              <span className={styles.label}>协方差 · Cov XY</span>
              <span className={styles.value}>{safeCov.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-maxCov}
              max={maxCov}
              step="0.05"
              value={safeCov}
              onChange={(e) => setCovXY(parseFloat(e.target.value))}
              className={styles.slider}
            />
          </div>
        </div>

        <div className={styles.legendBox}>
          <div className={styles.legendTitle}>Legend</div>
          <div className={styles.legendTags}>
            <span className={`${styles.tag} ${styles.tagRed}`}>
              <span className={styles.tagDot} />
              95% 椭圆
            </span>
            <span className={`${styles.tag} ${styles.tagGreen}`}>
              <span className={styles.tagDot} />
              主轴
            </span>
            <span className={`${styles.tag} ${styles.tagAmber}`}>
              <span className={styles.tagDot} />
              次轴
            </span>
          </div>
        </div>

        <div className={styles.matrixBox}>
          <div className={styles.matrixBadge}>Σ Covariance Matrix</div>
          <div className={styles.matrixRow}>
            <span className={styles.matrixEq}>=</span>
            <div className={styles.matrixGrid}>
              <div className={styles.diag}>{varX.toFixed(2)}</div>
              <div className={styles.offDiag}>{safeCov.toFixed(2)}</div>
              <div className={styles.offDiag}>{safeCov.toFixed(2)}</div>
              <div className={styles.diag}>{varY.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.canvasCol}>
        <div className={styles.canvasCaption}>高斯样本 · 置信椭圆 · PCA 主轴</div>
        <div className={styles.canvasBox}>
          <canvas
            ref={canvasRef}
            width={450}
            height={450}
            className={styles.canvas}
          />
        </div>
      </div>
    </div>
  );
}

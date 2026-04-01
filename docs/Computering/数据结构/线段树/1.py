import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import warnings
warnings.filterwarnings('ignore')

# ========================
# 1. 读取 Excel 文件
# ========================
file_path = "TRCAS-交叉验证-临床样本.xlsx"
df_raw = pd.read_excel(file_path, sheet_name=0, header=None)
print("原始数据形状：", df_raw.shape)

# ========================
# 2. 定义数据块关键词
# ========================
tissues = ["肺癌组织", "卵巢癌组织", "肺癌血液"]
all_samples = []   # 存放每个数据块整理后的样本（每个样本一行）

for tissue in tissues:
    # 查找包含关键词的行
    mask = df_raw.apply(lambda row: row.astype(str).str.contains(tissue).any(), axis=1)
    if not mask.any():
        print(f"警告：未找到数据块 '{tissue}'，跳过。")
        continue
    start_row = mask.idxmax()
    title_row = start_row + 1
    if title_row >= df_raw.shape[0]:
        print(f"警告：'{tissue}' 标题行越界，跳过。")
        continue

    # 找到标题行中第一个包含 'mir' 的列，作为数据起始列
    start_col = None
    for col in range(df_raw.shape[1]):
        cell = str(df_raw.iloc[title_row, col])
        if "mir" in cell:
            start_col = col
            break
    if start_col is None:
        print(f"警告：'{tissue}' 未找到 miRNA 标题列，跳过。")
        continue

    # 确定数据结束行（遇到空行或下一个关键词）
    end_row = df_raw.shape[0]
    for r in range(title_row + 1, df_raw.shape[0]):
        if pd.isna(df_raw.iloc[r, start_col]) and pd.isna(df_raw.iloc[r, start_col + 1]):
            end_row = r
            break
        cell_val = str(df_raw.iloc[r, start_col])
        if any(k in cell_val for k in tissues):
            end_row = r
            break

    # 提取数据区域
    block_df = df_raw.iloc[title_row:end_row, start_col:].copy()
    # 将第一行作为列名
    block_df.columns = block_df.iloc[0]
    block_df = block_df.drop(index=title_row).reset_index(drop=True)
    block_df = block_df.dropna(how='all')
    if block_df.empty:
        print(f"警告：'{tissue}' 数据块无有效数据，跳过。")
        continue

    # 获取所有 miRNA 列的索引（列名包含 'mir'）
    col_names = block_df.columns.tolist()
    mir_indices = [i for i, name in enumerate(col_names) if 'mir' in str(name)]

    # 遍历每一行，拆分为 cancer 和 normal 样本
    block_samples = []
    for idx, row in block_df.iterrows():
        cancer_sample = {'tissue': tissue, 'label': 1}
        normal_sample = {'tissue': tissue, 'label': 0}
        for mir_idx in mir_indices:
            # 确保有足够的列（cancer 和 normal 列）
            if mir_idx + 2 >= len(col_names):
                continue
            cancer_idx = mir_idx + 1
            normal_idx = mir_idx + 2
            mir_name = col_names[mir_idx]
            val_c = row.iloc[cancer_idx]
            val_n = row.iloc[normal_idx]
            if pd.notna(val_c):
                cancer_sample[mir_name] = val_c
            if pd.notna(val_n):
                normal_sample[mir_name] = val_n
        # 添加样本（仅当至少有一个 miRNA 表达值）
        if len(cancer_sample) > 2:  # 除了 tissue 和 label 还有至少一个 miRNA
            block_samples.append(cancer_sample)
        if len(normal_sample) > 2:
            block_samples.append(normal_sample)

    if not block_samples:
        print(f"警告：'{tissue}' 未提取到有效样本，跳过。")
        continue

    df_block = pd.DataFrame(block_samples)
    all_samples.append(df_block)

# 合并所有数据块
if not all_samples:
    raise ValueError("未提取到任何有效数据，请检查 Excel 格式。")
df_all = pd.concat(all_samples, ignore_index=True)

print("\n整理后的数据预览：")
print(df_all.head())
print("数据形状：", df_all.shape)
print("类别分布：\n", df_all['label'].value_counts())

# ========================
# 3. 提取特征 X 和标签 y
# ========================
# 特征列：所有 miRNA 列（以 'mir' 开头）
feature_cols = [col for col in df_all.columns if col.startswith('mir-')]
X = df_all[feature_cols].values
y = df_all['label'].values

# 处理缺失值（不同组织可能缺失某些 miRNA）
imputer = SimpleImputer(strategy='mean')
X = imputer.fit_transform(X)

print("\n特征矩阵形状：", X.shape)
print("标签向量形状：", y.shape)

# ========================
# 4. 分层 k 折交叉验证
# ========================
k = 5
skf = StratifiedKFold(n_splits=k, shuffle=True, random_state=42)

# 构建包含标准化和分类器的 pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('clf', RandomForestClassifier(n_estimators=100, random_state=42))
])

accuracies = []
aucs = []

for fold, (train_idx, val_idx) in enumerate(skf.split(X, y)):
    X_train, X_val = X[train_idx], X[val_idx]
    y_train, y_val = y[train_idx], y[val_idx]
    
    pipeline.fit(X_train, y_train)
    
    y_pred = pipeline.predict(X_val)
    y_proba = pipeline.predict_proba(X_val)[:, 1]
    
    acc = accuracy_score(y_val, y_pred)
    auc = roc_auc_score(y_val, y_proba)
    
    accuracies.append(acc)
    aucs.append(auc)
    
    print(f"Fold {fold+1}: 准确率 = {acc:.4f}, AUC = {auc:.4f}")

print("\n====== 平均结果 ======")
print(f"平均准确率: {np.mean(accuracies):.4f} (±{np.std(accuracies):.4f})")
print(f"平均 AUC:    {np.mean(aucs):.4f} (±{np.std(aucs):.4f})")
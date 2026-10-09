import React, {useState, useMemo} from 'react';
import {usePluginData} from '@docusaurus/useGlobalData';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

/**
 * Pin2Pin 替代料查询
 *
 * 数据来源：hardware-and-silicon 目录下各 mdx 的 frontmatter.pin2pin
 * 通过 docusaurus.config.js 的 contentLoaded 钩子聚合，构造双向索引。
 */
export default function Pin2PinSearch() {
  // setGlobalData 暴露的数据：{ pin2pinMap: { direct, bidirectional, docsIndex, generatedAt } }
  const pluginData = usePluginData('pin2pin-data-plugin');
  const data = pluginData && pluginData.pin2pinMap;

  const [query, setQuery] = useState('');

  if (!data) {
    return <div className={styles.empty}>正在加载替代料数据…</div>;
  }

  const {bidirectional = {}, direct = {}, docsIndex = {}} = data;
  const allModels = useMemo(
    () =>
      Object.keys(bidirectional).sort((a, b) =>
        a.localeCompare(b, 'zh-Hans-CN'),
      ),
    [bidirectional],
  );

  const totalRelations = useMemo(() => {
    let count = 0;
    Object.values(direct).forEach((arr) => {
      count += arr.length;
    });
    return count;
  }, [direct]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allModels;
    return allModels.filter((k) => {
      if (k.toLowerCase().includes(q)) return true;
      const arr = bidirectional[k] || [];
      return arr.some((v) => v.toLowerCase().includes(q));
    });
  }, [query, allModels, bidirectional]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.statRow}>
          <span className={styles.stat}>
            <span className={styles.statNum}>{allModels.length}</span>
            <span className={styles.statLabel}>已建档型号</span>
          </span>
          <span className={styles.stat}>
            <span className={styles.statNum}>{totalRelations}</span>
            <span className={styles.statLabel}>替代关系</span>
          </span>
        </div>
        <input
          type="search"
          className={styles.searchBox}
          placeholder="输入型号（如 STM32F103 / CH32V203 / GD32）"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className={styles.hint}>
          数据来源于各器件页 frontmatter 的 <code>pin2pin</code> 字段，双向匹配。
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          {query ? `没有匹配 "${query}" 的型号` : '暂无替代料数据'}
        </div>
      ) : (
        <ul className={styles.resultList}>
          {filtered.map((model) => (
            <li key={model} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.modelName}>{model}</span>
                {docsIndex[model]?.permalink ? (
                  <Link
                    to={docsIndex[model].permalink}
                    className={styles.docLink}
                  >
                    查看文档 ↗
                  </Link>
                ) : (
                  <span className={styles.docLinkMissing}>暂无文档</span>
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.bodyLabel}>可互相替代：</span>
                <div className={styles.peerList}>
                  {(bidirectional[model] || []).map((peer) => (
                    <span key={peer} className={styles.peerTag}>
                      {peer}
                      {docsIndex[peer]?.permalink && (
                        <Link
                          to={docsIndex[peer].permalink}
                          className={styles.peerLink}
                          title={`查看 ${peer} 文档`}
                        >
                          ↗
                        </Link>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * pin2pin-data-plugin
 *
 * 独立 docusaurus 插件：扫描 hardware-and-silicon/ 下所有 mdx 的
 * frontmatter.pin2pin 字段，构建双向替代料索引，通过
 * actions.createData('pin2pin-map.json', ...) 暴露给客户端，
 * 组件可通过 usePluginData('pin2pin-data-plugin') 拿到。
 */
const path = require('path');
const fs = require('fs');

const HARDWARE_ROOT = 'hardware-and-silicon';
const ROUTE_BASE = '/hardware-and-silicon';

// ---------- 简易 frontmatter 解析 ----------
function parseFrontmatter(content) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const yaml = m[1];
  const fm = {};

  const unquote = (s) =>
    s.replace(/^['"]|['"]$/g, '').trim();

  const titleMatch = yaml.match(/^title:\s*(.+?)\s*(?:\r?\n|$)/m);
  if (titleMatch) fm.title = unquote(titleMatch[1]);

  const slugMatch = yaml.match(/^slug:\s*(.+?)\s*(?:\r?\n|$)/m);
  if (slugMatch) fm.slug = unquote(slugMatch[1]);

  // pin2pin 数组
  const pinSection = yaml.match(
    /^pin2pin:\s*\r?\n((?:[ \t]+-[ \t]*[^\r\n]*\r?\n?)+)/m,
  );
  if (pinSection) {
    const items = [];
    pinSection[1].split(/\r?\n/).forEach((line) => {
      const lm = line.match(/^[ \t]+-[ \t]*(.+?)\s*$/);
      if (lm) items.push(unquote(lm[1]));
    });
    if (items.length) fm.pin2pin = items;
  }

  return fm;
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(p));
    } else if (entry.isFile() && /\.(mdx?|MDX?)$/.test(entry.name)) {
      out.push(p);
    }
  }
  return out;
}

// 复刻 docusaurus 默认 numberPrefixParser：只去文件名开头的 "数字-"
function slugifyFileName(name) {
  return name.replace(/^\d+[-_]/, '');
}

function computePermalink(relPath, fm) {
  if (fm && fm.slug) {
    return ROUTE_BASE + '/' + fm.slug.replace(/^\//, '');
  }
  let p = relPath
    .replace(/\.(mdx?|MDX?)$/, '')
    .replace(/^hardware-and-silicon\//, '');
  const parts = p.split('/');
  const last = parts.pop();
  parts.push(slugifyFileName(last));
  return ROUTE_BASE + '/' + parts.join('/');
}

// ---------- plugin 主体 ----------
module.exports = function pin2pinDataPlugin(context /*, options */) {
  return {
    name: 'pin2pin-data-plugin',

    getPathsToWatch() {
      return [path.join(context.siteDir, HARDWARE_ROOT)];
    },

    async contentLoaded({actions}) {
      const dir = path.join(context.siteDir, HARDWARE_ROOT);
      const files = walk(dir);

      const direct = {};
      const docsIndex = {};

      for (const file of files) {
        const rel = path
          .relative(context.siteDir, file)
          .replace(/\\/g, '/');
        const content = fs.readFileSync(file, 'utf-8');
        const fm = parseFrontmatter(content);
        if (!fm) continue;

        const fallbackName = path
          .basename(file)
          .replace(/\.(mdx?|MDX?)$/, '')
          .replace(/^\d+[-_]/, '');
        const title = fm.title || fallbackName;

        docsIndex[title] = {
          id: rel.replace(/\.(mdx?|MDX?)$/, ''),
          permalink: computePermalink(rel, fm),
        };

        if (Array.isArray(fm.pin2pin) && fm.pin2pin.length > 0) {
          direct[title] = Array.from(new Set(fm.pin2pin));
        }
      }

      // 双向化
      const bidirectional = JSON.parse(JSON.stringify(direct));
      Object.entries(direct).forEach(([key, arr]) => {
        arr.forEach((peer) => {
          if (!bidirectional[peer]) bidirectional[peer] = [];
          if (!bidirectional[peer].includes(key)) {
            bidirectional[peer].push(key);
          }
        });
      });

      // 通过 setGlobalData 暴露给客户端 usePluginData
      actions.setGlobalData({
        pin2pinMap: {
          direct,
          bidirectional,
          docsIndex,
          generatedAt: new Date().toISOString(),
        },
      });
    },
  };
};

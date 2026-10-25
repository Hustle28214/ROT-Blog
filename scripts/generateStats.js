const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../docs');

/**
 * 站点全部 docs 实例的内容目录（与 docusaurus.config.js 中的三个实例一致）：
 * 默认实例 docs + leetcode-answer + hardware-and-silicon
 */
const ALL_DOCS_DIRS = [
  DOCS_DIR,
  path.join(__dirname, '../leetcode-answer'),
  path.join(__dirname, '../hardware-and-silicon'),
];

const OUTPUT_DIR = path.join(__dirname, '../static/api/docs');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'stats.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function countWords(text) {
  // Strip HTML tags
  text = text.replace(/<[^>]*>/g, '');
  // Strip common Markdown syntax
  // Remove admonitions markers
  text = text.replace(/:::[a-z]*\n/g, '').replace(/:::/g, '');
  // Remove code blocks content might be desired or not? 
  // WordCount.jsx counts everything in innerText, which includes code blocks.
  // So we keep code blocks text, but we might want to strip the ``` markers.
  text = text.replace(/```[a-z]*\n/g, '').replace(/```/g, '');
  
  // 统计中文字符
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  
  // 统计英文单词
  const englishWords = text.replace(/[\u4e00-\u9fa5]/g, ' ')
                           .split(/\s+/)
                           .filter(word => /[a-zA-Z]/.test(word)).length;
  
  // 统计数字（每个数字都视为一个单位）
  const numbers = (text.match(/\d/g) || []).length;
  
  // 统计标点符号
  const punctuations = (text.match(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~。，、；：？！…—·ˉ¨''""々～‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g) || []).length;
  
  return chineseChars + englishWords + numbers + punctuations;
}

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.md') || file.endsWith('.mdx')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

async function generateStats(log = true) {
  try {
    let totalWordCount = 0;
    let fileCount = 0;
    let countedFiles = 0;
    const byInstance = {};

    for (const dir of ALL_DOCS_DIRS) {
      if (!fs.existsSync(dir)) continue;
      const files = getAllFiles(dir);
      const name = path.basename(dir);
      let instanceWords = 0;
      let instanceCounted = 0;

      if (log) console.log(`Scanning ${name}: ${files.length} files...`);

      for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');

        // Check if file uses WordCount
        const regex = /<WordCount>([\s\S]*?)<\/WordCount>/g;
        let match;
        let fileHasWordCount = false;

        while ((match = regex.exec(content)) !== null) {
          fileHasWordCount = true;
          const innerContent = match[1];
          const count = countWords(innerContent);
          instanceWords += count;
        }

        if (fileHasWordCount) {
          instanceCounted += 1;
        }
      }

      fileCount += files.length;
      countedFiles += instanceCounted;
      totalWordCount += instanceWords;
      byInstance[name] = { files: files.length, words: instanceWords };
    }

    const totalReadingTime = Math.ceil(totalWordCount / 500);

    const stats = {
      totalWordCount,
      totalReadingTime,
      /** 文章总数 = 所有 docs 实例下 .md / .mdx 之和 */
      fileCount,
      /** 其中已插入 <WordCount> 的篇数 */
      countedFiles,
      byInstance,
      generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
    if (log) {
      console.log(`Generated stats for ${fileCount} files across ${ALL_DOCS_DIRS.length} instances.`);
      console.log(`Total Word Count: ${totalWordCount}`);
      console.log(`Stats saved to ${OUTPUT_FILE}`);
    }
  } catch (error) {
    console.error('Error generating stats:', error);
  }
}

// 如果是直接运行该脚本
if (require.main === module) {
  generateStats();
}

module.exports = {
  generateStats,
  DOCS_DIR,
  ALL_DOCS_DIRS
};

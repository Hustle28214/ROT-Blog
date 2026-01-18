const path = require('path');
const chokidar = require('chokidar');
const { generateStats, DOCS_DIR } = require('../../../scripts/generateStats');

module.exports = function (context, options) {
  return {
    name: 'plugin-content-docs-stats',

    // 插件初始化时执行
    async loadContent() {
      // 初始生成一次
      await generateStats();
      
      // 仅在开发模式下启动监听
      if (process.env.NODE_ENV === 'development') {
        const watcher = chokidar.watch(DOCS_DIR, {
          ignored: /(^|[\/\\])\../, // 忽略点文件
          persistent: true,
          ignoreInitial: true
        });

        watcher.on('all', async (event, path) => {
          if (path.endsWith('.md') || path.endsWith('.mdx')) {
            console.log(`[Stats Plugin] File ${event}: ${path}`);
            await generateStats(false); // 传入 false 以减少日志噪音
          }
        });
      }
    },
    
    // 如果需要注入 webpack 配置等可以在这里做，但我们只需要生成 JSON 文件
  };
};

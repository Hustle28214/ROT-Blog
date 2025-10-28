# Coze Chat 配置说明

## 环境变量配置

为了保护敏感信息（如 API token），本项目使用环境变量来管理 Coze Chat 的配置。

### 设置步骤

1. **复制配置文件**
   ```bash
   cp static/js/coze-config.example.js static/js/coze-config.js
   ```

2. **编辑配置文件**
   ```bash
   # 使用你喜欢的编辑器打开文件
   nano static/js/coze-config.js
   # 或者
   code static/js/coze-config.js
   ```

3. **填入你的配置信息**
   ```javascript
   window.COZE_CONFIG = {
     // 将 your_actual_token_here 替换为你的实际 token
     token: 'pat_your_actual_token_here',
     
     // 将 your_actual_bot_id_here 替换为你的实际 bot ID
     botId: 'your_actual_bot_id_here'
   };
   ```

⚠️ **重要提醒**：
- 绝对不要将真实的 token 提交到 Git 仓库
- `static/js/coze-config.js` 文件已被 `.gitignore` 保护，不会被提交
- 如果聊天组件无法加载，请检查浏览器控制台的错误信息
- 配置文件会在页面加载时自动加载

### 获取 Coze Token 和 Bot ID

1. **获取 Token**：
   - 登录 [Coze 平台](https://www.coze.cn/)
   - 进入开发者设置
   - 创建或查看你的 API Token

2. **获取 Bot ID**：
   - 在 Coze 平台创建或选择你的机器人
   - 在机器人设置中找到 Bot ID

### 安全注意事项

- ✅ `.env.local` 文件已被添加到 `.gitignore`，不会被提交到 Git
- ✅ 使用 `REACT_APP_` 前缀使环境变量在客户端可用
- ❌ 不要将真实的 token 直接写在代码中
- ❌ 不要将 `.env.local` 文件提交到版本控制系统

### 部署配置

在部署到生产环境时，需要在部署平台（如 Vercel、Netlify 等）的环境变量设置中添加：

- `REACT_APP_COZE_TOKEN`
- `REACT_APP_COZE_BOT_ID`

### 故障排除

如果聊天组件无法正常工作，请检查：

1. `.env.local` 文件是否存在且配置正确
2. 环境变量名称是否正确（包含 `REACT_APP_` 前缀）
3. Token 是否有效且具有必要的权限
4. Bot ID 是否正确

查看浏览器控制台是否有相关错误信息。
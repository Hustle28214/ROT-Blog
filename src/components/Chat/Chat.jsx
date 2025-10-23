// src/components/Chat.js
import { useEffect } from 'react';

const Chat = () => {
  useEffect(() => {
    // 获取环境变量 - 在构建时会被替换
    const cozeToken = typeof process !== 'undefined' && process.env 
      ? process.env.REACT_APP_COZE_TOKEN 
      : undefined;
    const cozeBotId = typeof process !== 'undefined' && process.env 
      ? process.env.REACT_APP_COZE_BOT_ID 
      : undefined;

    // 验证环境变量
    if (!cozeToken || !cozeBotId || 
        cozeToken === 'your_token_here' || 
        cozeBotId === 'your_bot_id_here' ||
        cozeToken === 'your_actual_token_here' || 
        cozeBotId === 'your_actual_bot_id_here') {
      console.error('❌ Coze Chat: Missing environment variables');
      console.error('📝 Please copy .env.example to .env.local and fill in your values');
      return;
    }

    // 加载SDK
    const sdkScript = document.createElement('script');
    sdkScript.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';
    
    sdkScript.onload = () => {
      // SDK加载完成后初始化
      new window.CozeWebSDK.WebChatClient({
        config: {
          bot_id: cozeBotId,
        },
        componentProps: {
          title: 'Coze',
        },
        auth: {
          type: 'token',
          token: cozeToken,
          onRefreshToken: function () {
            return cozeToken;
          }
        }
      });
    };
    
    document.body.appendChild(sdkScript);
  }, []);

  return null;
};

export default Chat;
// src/components/Chat.js
// import React, { useEffect } from 'react';

// const Chat = () => {
//   useEffect(() => {
//     // 加载SDK
//     const sdkScript = document.createElement('script');
//     sdkScript.src = 'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js';
    
//     sdkScript.onload = () => {
//       // SDK加载完成后初始化
//       const initScript = document.createElement('script');
//       initScript.innerHTML = `
//         new CozeWebSDK.WebChatClient({
//           config: {
//             bot_id: '7564256371802685492',
//           },
//           componentProps: {
//             title: 'Coze',
//           },
//           auth: {
//             type: 'token',
//             token: 'xxx',
//             onRefreshToken: function () {
//               return 'xxx'
//             }
//           }
//         });
//       `;
//       document.body.appendChild(initScript);
//     };
    
//     document.body.appendChild(sdkScript);
//   }, []);

//   return null;
// };

// export default Chat;
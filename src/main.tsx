import React, { useEffect, useRef, useState } from 'react';
import AuChat, { Card, Event, MessageStatus } from './index';
import ReactDOM from 'react-dom/client';
import useChatStreamHandler from './hooks/useChatStreamHandler';
import useAgentList, { AgentInfo } from './hooks/useAgentList';

const delay = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const App = () => {
  const chatRef = useRef<HTMLDivElement>(null);
  const [auChatInstance, setAuChatInstance] = useState<AuChat | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo | null>(null);
  const { agents, loading } = useAgentList();

  // 设置默认智能体
  useEffect(() => {
    if (!selectedAgent && agents.length > 0) {
      setSelectedAgent(agents[0]);
    }
  }, [agents, selectedAgent]);


  useEffect(() => {
    if (!chatRef.current) return;

    const chat = new AuChat({
      container: chatRef.current,
      product: {
        logo: <img src='https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/QBYeBCymJCQGCgUDcKADp/yuantulogo3.png' />,
        darkLogo: <img src='https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/Ek69FC46jbmc4rBmNKiLa/899A7B21_C634_4135_B7E9_D16C1C3BE4D5.png' />,
        name: 'XXX',
      },
      avatar: {
        assistant: <img src='https://gw.alipayobjects.com/zos/finxbff/compress-tinypng/igrVm7tHegnACtg4gFPaY/weitu__1_.png' />,
        user: '洋流',
      },
      recommend: {
        list: [
          { content: '2024年的中国经济走向，核心关注什么？' },
          { content: '白酒上市公司需要关注哪几个方面的因素' },
          { content: '近十年两会召开期间上证指数平均走势如何' },
          { content: '怎么解读2023年中国政府的财政预算报告？' },
          { content: '2024年中国经济走向何方，核心关注什么？' },
          { content: '从投资时钟的角度来看，当前我国的经济处于什么位置' },
          { content: '央行降准后市场风格和行业表现上会有何特征？' },
          { content: '如何看待海通证券荀玉根发布的策略专题报告：策略研究框架' },
          { content: '分短期和中长期来看,医药反腐政策对行业会产生何种影响' },
        ],
      },
      sessionHandler: {
        async initSessionList() {
          try {
            const response = await fetch('http://127.0.0.1:8888/session/list');
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // 后端返回的格式已经是 { id: string, title: string }，直接返回即可
            return data;
          } catch (error) {
            console.error('Failed to fetch session list:', error);
            return [];
          }
        },
        async addSession({ title }: { title: string }) {
          await delay(1000);
          const newSessionId = Math.random().toString(36).substring(2, 10);
          console.log(`New session added with ID: ${newSessionId}`);
          // 根据 Session 类的构造函数，需要传入 store 参数
          // 这里暂时不创建 Session 实例，只打印日志
          console.log(`New session title: ${title}`);
          // 参考 useSessionStore.tsx 中的 addSession 方法
          // 实际应用中需要创建 Session 实例并返回
        },
        async deleteSession(sessionId: string) {
          try {
            const response = await fetch('http://127.0.0.1:8888/session/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ session_id: sessionId }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`Session ${sessionId} deleted successfully.`);
          } catch (error) {
            console.error(`Failed to delete session ${sessionId}:`, error);
          }
        },
        async updateSession(sessionId: string, title: string) {
          try {
            const response = await fetch('http://127.0.0.1:8888/session/update', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ session_id: sessionId, query: title }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log(`Session ${sessionId} updated to title: ${title}`);
          } catch (error) {
            console.error(`Failed to update session ${sessionId}:`, error);
          }
        }
      },
      messageHandler: {
        async initMessageList(sessionId: string) {
          try {
            const response = await fetch(`http://127.0.0.1:8888/session/${sessionId}/history`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // 后端返回的数据格式已经符合前端 AuChat 期望的消息数组格式，直接返回即可
            return data;
          } catch (error) {
            console.error(`Failed to fetch messages for session ${sessionId}:`, error);
            return [];
          }
        },
      },
    });

    setAuChatInstance(chat);

    return () => {
      // if (chat && typeof chat.destroy === 'function') {
      //   chat.destroy();
      // }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      {/* 主体区域 */}
      <div style={{ flex: 1, height: '100%' }}>
        <div ref={chatRef} style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React, { useEffect, useRef } from 'react';
import AuChat, { Card, Event, MessageStatus } from './index';
import ReactDOM from 'react-dom/client';

const delay = async (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms);
});

const App = () => {
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const auChat = new AuChat({
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
          return [
            {
              id: '1', title: '市净率是什么', attachment: [
                {
                  id: '1',
                  type: 'image',
                  name: '测试图片',
                  source: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2F0fGVufDB8fDB8fHww',
                }
              ]
            },
            { id: '2', title: '2024年的中国经济走向，核心关注什么' },
            { id: '3', title: '分短期和中长期来看,医药反腐政策对行业会产生何种影响' },
          ];
        },
        async addSession() {
          await delay(1000);
          return { id: 4, title: '新建问题' };
        },
        async deleteSession(id: string) {
          return true;
        },
        async updateSession(id: string, title: string) {
          return true;
        }
      },

      messageHandler: {
        async initMessageList(sessionId: string) {
          await delay(1000);
          return [
            { id: 1, role: 'user', content: '市净率是什么' },
            {
              id: 2, 
              role: 'assistant', 
              content: [
                {
                  card: Card.Markdown,
                  props: {
                    children: '市盈率是xxxxx',
                    speed: 100,
                  },
                },
              ]
            },
          ]

        },
      },
    });


    auChat.on(Event.PROMPT_SEND, (prompt, sessionId) => {
      console.log('prompt', prompt);
      const answerMessage = auChat.pushAssistantMessage({
        id: Math.random().toString(36).substring(2, 15),
        status: MessageStatus.RUNNING,
        title: prompt.content,
        content: [
          {
            card: Card.Markdown,
            props: {
              children: `我是回答，你可以使用markdown格式`,
              speed: 200,
            },
          },
        ]
      });

      // chat.mergePrompt({
      //   attachment: [
      //     {
      //       id: '1',
      //       type: 'image',
      //       name: '测试图片',
      //       url: 'https://images.unsplash.com/photo-1500259571355-332da5cb07aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2F0fGVufDB8fDB8fHww',
      //     }
      //   ]
      // })

      setTimeout(() => {
        answerMessage.update({
          status: MessageStatus.SUCCESS,
        });
      }, 500);
    });
  }, []);


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div ref={chatRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
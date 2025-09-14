// src/hooks/useChatStreamHandler.ts
import { useEffect } from 'react';
import AuChat from '../AuChat';
import { Card, Event, MessageStatus, Role, Message } from '../index'; // 导入 Role 和 Message
import { streamChatResponse } from '../services/chatService';
import useSessionStore, { selectActiveSession } from '../store/useSessionStore'; // 导入 useSessionStore 和 selectActiveSession

interface UseChatStreamHandlerProps {
  auChatInstance: AuChat | null;
  serviceId: string;
  currentSessionId: string | null;
  onSessionIdChange: (sessionId: string) => void;
}

const useChatStreamHandler = ({ auChatInstance, serviceId, currentSessionId, onSessionIdChange }: UseChatStreamHandlerProps) => {
  useEffect(() => {
    // 确保 auChatInstance 已经存在
    if (!auChatInstance) {
      return;
    }

    const handlePromptSend = async (prompt: any) => { // 移除 sessionId 参数，从 props 获取
      console.log('User prompt received in hook:', prompt);
      console.log('Current Session ID in hook:', currentSessionId); // 使用 props 中的 currentSessionId
      console.log('当前发送的 service_id:', serviceId);

      let activeSessionId = currentSessionId;

      // 如果没有当前会话ID，则创建一个新会话
      if (!activeSessionId && auChatInstance) { // 修改条件，通过 useSessionStore 访问 addSession
        try {
          const newSession = await useSessionStore.getState().addSession({ title: prompt.content });
          activeSessionId = newSession.id;
          onSessionIdChange(activeSessionId); // 通知外部更新 session_id
          console.log('New session created:', activeSessionId);
        } catch (error) {
          console.error('Failed to create new session:', error);
          // 错误处理，例如显示错误消息
          return;
        }
      }

      if (!activeSessionId) {
        console.error('No active session ID available.');
        return;
      }

      // 1. 创建AI助手的消息占位符
      const assistantMessageId = Math.random().toString(36).substring(2, 15);
      const sessionStore = useSessionStore.getState(); // 获取 sessionStore
      const activeSession = selectActiveSession(sessionStore); // 获取当前活跃的 session 实例

      if (!activeSession) {
        console.error('No active session found for pushing assistant message.');
        return;
      }

      const answerMessage = auChatInstance.pushAssistantMessage(new Message({
        id: assistantMessageId,
        role: Role.ASSISTANT,
        status: MessageStatus.RUNNING,
        session: activeSession,
        store: sessionStore,
        content: [
          {
            card: 'Markdown',
            props: {
              children: '',
              speed: 20,
            },
          },
        ],
      }));

      let accumulatedText = '';

      // 2. 调用 chatService 中的 streamChatResponse 函数
      streamChatResponse({
        promptContent: prompt.content,
        sessionId: activeSessionId, // 使用 activeSessionId
        serviceId, // 关键：传递当前选中的 serviceId
        onToken: (chunk) => {
          accumulatedText += chunk;
          answerMessage.update({
            status: MessageStatus.RUNNING,
            content: [
              {
                card: 'Markdown',
                props: {
                  children: accumulatedText,
                  speed: 20,
                },
              },
            ],
          });
        },
        onComplete: (finalText) => {
          console.log('Stream completed in hook. Final text:', finalText);
          answerMessage.update({
            status: MessageStatus.SUCCESS,
            content: [
              {
                card: 'Markdown',
                props: {
                  children: finalText,
                  speed: 0,
                },
              },
            ],
          });
        },
        onError: (error) => {
          console.error('Chat stream error in hook:', error);
          // 尝试从错误信息中提取更具体的后端错误信息
          let errorMessage = error.message;
          if (error.message.includes('Exception:')) {
            errorMessage = error.message.split('Exception:')[1].trim();
          }
          answerMessage.update({
            status: MessageStatus.FAILURE, // 修改为 FAILURE
            content: [
              {
                card: 'Markdown',
                props: {
                  children: `抱歉，请求失败或发生错误：${errorMessage}`,
                  speed: 0,
                },
              },
            ],
          });
        },
      });
    };

    auChatInstance.on(Event.PROMPT_SEND, handlePromptSend);

    return () => {
      if (auChatInstance && typeof auChatInstance.off === 'function') {
        auChatInstance.off(Event.PROMPT_SEND, handlePromptSend);
      }
    };
  }, [auChatInstance, serviceId, currentSessionId, onSessionIdChange]); // 依赖 serviceId, currentSessionId, onSessionIdChange，切换时会生效
};

export default useChatStreamHandler;
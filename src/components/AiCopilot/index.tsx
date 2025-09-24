import React, { RefObject, useEffect, useRef, useState } from 'react';
import { Spin, Drawer, Button } from 'antd';
import { CloseOutlined, LeftCircleOutlined } from '@ant-design/icons';
import { isEmpty, last } from 'lodash';
import classNames from 'classnames';
import RelationQuestion from '@/components/RelationQuestion';
import useSessionStore, {
  Prompt,
  selectActiveSession,
  selectInputRunning,
} from '@/store/useSessionStore';
import useMiscStore from '@/store/useMiscStore';
import useConfigStore from '@/store/useConfigStore';
import useChatStore from '@/store/useChatStore';
import Bubble from '@/components/AiBubble';
import WelcomeWithRecommend from '@/components/WelcomeWithRecommend';
import OmniInput from '@/components/OmniInput';
import styles from './index.module.less';
import { CSSProperties } from 'styled-components';
import useScrollVisibility from '@/hooks/useScrollVisibility';

// const MemorizedBubble = React.memo(Bubble, (prevProps, nextProps) => {
//   return prevProps.message.id === nextProps.message.id && prevProps.message.status === 'success';
// });

const MemorizedOmniInput = React.memo(OmniInput, (prevProps, nextProps) => {
  return prevProps.running === nextProps.running;
});

interface Props {
  isDocCopilotMode?: boolean,
  style?: CSSProperties,
}

const AiCopilot: React.FC<Props> = ({ isDocCopilotMode = false, style }) => {
  const { messageListLoading, sendPrompt } = useSessionStore((state) => state);
  const activeSession = useSessionStore(selectActiveSession);
  const inputRunning = useSessionStore(selectInputRunning);
  // @ts-nocheck
  const chatRef: RefObject<any> = useRef(null);
  const attachRef: RefObject<any> = useRef(null);

  const { safeTip, copilot, activeRoute, isCompact, setCopilot, container } = useConfigStore();
  const { setMisc, scrollToBottom, artifactLoading, artifact, setArtifact, artifactStyle } = useMiscStore();
  const chat = useChatStore(state => state.chat);

  // 表示是否允许自动滚动到底部
  const [isAllowAutoScrollToBottom, setAllowAutoScrollToBottom] = useState<boolean>(true);

  const messageList = activeSession?.messageList || [];
  
  const lastMessage = last(messageList);
  const isShowRecommend = isEmpty(messageList) && !messageListLoading; // 消息为空且未在加载消息中

  const isScrolling = useScrollVisibility(chatRef);

  useEffect(() => {
    if (chatRef.current) {
      setMisc({
        contentRef: chatRef,
      });
    };
  }, [chatRef.current]);

  useEffect(() => {
    if(attachRef.current) {
      setMisc({
        attachRef: attachRef,
      })
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      // 答案都更新时判断是否自动滚动到最最底部
      if (isAllowAutoScrollToBottom) {
        scrollToBottom();
      };
    };
  }, [lastMessage]);

  // 滚动事件
  const handleWheel = () => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      // 如果用户手动向上滚动了，则不自动滚动到底部，除非用户再手动向下滚动到底部
      const isAllowAutoScrollToBottom = scrollHeight - (scrollTop + clientHeight) < 10;
      setAllowAutoScrollToBottom(isAllowAutoScrollToBottom);
    };
  };

  // 中止对话
  const handleClickAbort = () => {
    lastMessage?.abort();
  };

  // 发送消息
  const handleSendPrompt = async (prompt: Prompt) => {
    await sendPrompt({ prompt });
    // 注意：发送消息是个异步事件，过程中依赖 store 的 prompt 数据，所以不能直接清空输入框，应该在发送完成之后
    chat.clearInput();

    // 设置延迟时间
    if(chatRef.current) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    };
  };

  const handleShow = (boolean: boolean) => {
    if(activeRoute === 'investment' && !window.location.host.includes('touyan')) {
      chat.setConfig({
        hiddenHeader: boolean
      })
    }
    setCopilot({
      isOpen: boolean,
    })
  };

  return (
    <div className={classNames([styles.copilot, {
      [styles.bodyPdf]: isDocCopilotMode,
      [styles.hidden]: !copilot?.isFolding || !copilot?.isOpen,
    }])} style={style}>
      <div id="chatContent" className={styles.content}
      >
        {
          copilot?.isFolding && !copilot?.isOpen &&
            <LeftCircleOutlined 
            className={styles.leftIcon} 
            onClick={() => handleShow(true)} 
          />
        }
        {isShowRecommend && !isDocCopilotMode && (
          <div className={styles.recommendContainer}>
            <WelcomeWithRecommend
              onClick={handleSendPrompt}
            />
          </div>
        )}
        {isDocCopilotMode && <div className={styles.header}>
          <div className={styles.title}>{copilot?.title || '答疑'}</div>
          {
            copilot?.isOpen && <Button type='link' onClick={() => handleShow(false)}>隐藏</Button>
          }
        </div>}
        {!isShowRecommend && (
          <>
          <Spin spinning={messageListLoading} style={{ marginTop: 20 }}></Spin>
          <div
            ref={chatRef}
            className={classNames([styles.chatContainer, {
              [styles.hiddenScrollBar]: !isScrolling
            }])}
            onWheel={handleWheel}
          >
            
              {messageList.map((message) => (
                <Bubble
                  key={message.id}
                  message={message}
                />
              ))}
            
            {!isEmpty(lastMessage?.relateQuestion) && (
              <RelationQuestion
                questions={lastMessage?.relateQuestion || []}
                onClickItem={handleSendPrompt}
              />
            )}
          </div>
          </>
        )}
        <div className={styles.footContainer}>
          <MemorizedOmniInput
            running={inputRunning}
            onAbort={handleClickAbort}
            onSubmit={handleSendPrompt}
          />
          <div className={styles.safeTip}>{ safeTip }</div>
        </div>
      </div>
      {
        isCompact
        ? (
          <Drawer bodyStyle={{ padding: 0 }} getContainer={() => container!} placement="bottom" height="70%" onClose={() => setArtifact(undefined)} open={!!artifact}>
            <div ref={attachRef}>
              { artifact as React.ReactNode}
            </div>
          </Drawer>
        )
        : (
          <div className={styles.artifactContainer} style={{ display: !!artifact ? 'flex' : 'none', ...artifactStyle }}>
            <div className={classNames(styles.artifact, 'bg-slate-50 dark:bg-slate-800')}>
              <div className={classNames(styles.artifactHeader, 'bg-slate-300 dark:bg-slate-700')}>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setArtifact(undefined)}></Button>
              </div>
              <Spin spinning={artifactLoading}>
                <div ref={attachRef}>
                  { artifact as React.ReactNode }
                </div>
              </Spin>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default AiCopilot;

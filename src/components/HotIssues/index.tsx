import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import useSessionStore from '@/store/useSessionStore';
import useChatStore from '@/store/useChatStore';
import styles from './index.module.less';
import ZChat from '@/index';
interface IQuestion {
  question: string,
  entity: string,
}

interface Props {
  style?: React.CSSProperties,
  color?: string[],
  data: IQuestion[],
  showRefresh?: boolean;
  onClick?: (chat: ZChat) => void;
}

const HotIssues: React.FC<Props> = ({ data, color, style, showRefresh = true, onClick }) => {

  const { chat } = useChatStore(state => state);
  const [startIndex, setStartIndex] = useState(0);

  const { sendPrompt } = useSessionStore();

  const getCurrentItems = () => {
    const endIndex = (startIndex + 5) % data.length;
    if (startIndex < endIndex) {
      return data.slice(startIndex, endIndex);
    } else {
      return [...data.slice(startIndex), ...data.slice(0, endIndex)];
    };
  };

  const handleRotate = () => {
    setStartIndex((startIndex + 5) % data.length);
  };

  const handleSendPrompt = (item: IQuestion) => {
    if(onClick) {
      onClick(chat);
    } else {
      sendPrompt({ prompt: { content: item.question } });
    };
  }

  const renderText = (question: string, entity: string, index: number) => {
    return <>
      <span style={{ marginRight: 6, color: color?.length ? color[index]: '' }}>{index + 1}. </span>
      <span>{question.split(entity)[0]}</span>
      <span className={styles.entity}>{entity}</span>
      <span>{question.split(entity)[1]}</span>
    </>;
  };
  
  return (
    <div style={style} className={styles.hotIssues}>
      <div className={styles.header}>
        <div className={styles.title}>热门问题</div>
        {
          showRefresh && <Button 
            style={{ padding: 0 }} 
            onClick={handleRotate} 
            type='text'
          >
            <SyncOutlined />
          </Button>
        }
      </div>
      {
        getCurrentItems().map((item, index) => (
          <Popover content={item.question} key={index}>
            <div
              onClick={() => handleSendPrompt(item)}
              className={styles.question} 
              >
              {renderText(item.question, item.entity, index)}
            </div>
          </Popover>
        ))
      }
    </div>
  )
}

export default HotIssues;
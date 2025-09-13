import React from 'react';
import classNames from 'classnames';
import { Alert, Image, Skeleton } from 'antd';
import { motion } from "framer-motion";
import { isString } from 'lodash';
import Message, { MessageStatus, Role } from '@/store/message';
import useConfigStore from "@/store/useConfigStore";
import useChatStore from '@/store/useChatStore';
import Card from '@/card/index';
import styles from './index.module.less';
// import { FileImageOutlined, FilePdfOutlined } from '@ant-design/icons';

interface Props {
  message: Message;
  children?: React.ReactNode;
  style?: any;
}

function getCardsWithMessage(message: Message) {
  let cards = message.content;
  cards = Array.isArray(cards) ? cards : [cards];

  cards = cards.filter(card => card).map((card, index) => {
    // 文本使用 markdown 渲染
    if (isString(card)) {
      return <Card.Markdown type={'text'} key={index}>{ card }</Card.Markdown>;
    }

    // 对象使用传递的组件渲染
    if ('card' in card) {
      const CardComponent = card.card;
      return CardComponent
        ? (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={{
              hidden: { filter: "blur(10px)", opacity: 0 },
              visible: { filter: "blur(0px)", opacity: 1 },
            }}
          >
            <CardComponent key={index} message={message} {...card.props} />
          </motion.div>
        )
        : `${card.card} 组件不存在`;
    }
    // element 直接渲染
    return card;
  });

  return cards as React.ReactNode;
};

function getAttachmentCardByMessage(message: Message) {
  const attchament = message.attachment;
  if(attchament) {
    const singleImage = attchament.length === 1 && attchament[0].type === 'image';
    const muiltImage = attchament.every(item => item.type === 'image');

    // 单张图片
    if(singleImage) {
      return (
        <Image
          alt={attchament[0].name}
          style={{ maxHeight: '200px', maxWidth: '300px', minHeight: '80px', borderRadius: '12px' }}
          placeholder={
            <div style={{ width: '100px', height: '80px' }}>
              <Skeleton.Image active={true} />
            </div>
          } 
          src={attchament[0].source}
        />
      )
    }

    // 组图
    if(muiltImage) {
      return (
        attchament.map(item => {
          return (
            <Image
              key={item.id}
              alt={item.name}
              style={{ height: '96px',width: '96px', borderRadius: '12px', objectFit: 'cover' }}
              placeholder={
                <div style={{ width: '96px', height: '80px' }}>
                  <Skeleton.Image active={true} />
                </div>
              } 
              src={item.source}
            />
          )
        })
      )
    }

    // 文件
    // return attchament.map(item => {
    //   const icon = item.type === 'pdf' ? <FilePdfOutlined style={{fontSize: '24px'}} /> :<FileImageOutlined style={{fontSize: '24px'}}/>;
      
    //   return <AttachmentFileCard
    //     key={item.id}
    //     isAttach={true}
    //     icon={icon}
    //     file={item}
    //     source={item.source}
    //   />
    // })
  }
  return <div></div>;
}

const Bubble: React.FC<Props> = ({
  message,
  style,
}) => {
  const { messageActions, message: messageConfig } = useConfigStore(state => state);
  const chat = useChatStore(state => state.chat);

  const isUser = message.role === Role.USER;
  const isSuccess = message.status === MessageStatus.SUCCESS;
  const isPending = message.status === MessageStatus.PENDING;
  const isRunning = message.status === MessageStatus.RUNNING;
  const error = message.error;
  
  if (isUser) {
    const userCards = getCardsWithMessage(message);
    const attachment = getAttachmentCardByMessage(message);

    // User侧消息
    return (
      <div className={styles.userSection} style={style}>
        <div style={messageConfig?.userBubbleStyle} className={classNames(styles.userBubble, messageConfig?.userBubbleClassName)}>
          {userCards}
        </div>
        <div className={styles.attachBubble}>
          { attachment }
         </div>
      </div>
    );
  }

  // AI侧消息
  const cards = getCardsWithMessage(message); 

  return (
    <div className={styles.section} style={style}>
      <div style={messageConfig?.assistantBubbleStyle} className={classNames(styles.aiBubble, messageConfig?.assistantBubbleClassName)}>
        <div className={styles.content}>
          { cards }
          { error?.message && ( <Alert message={`出错啦：${error.message}`} type="error" />) }
          {
            (isPending || isRunning) && <div className={styles.loading}></div>
          }
        </div>
        {
          isSuccess && (
            <div className={styles.actions}>
              {
                messageActions?.map(([Actions, options = {}], index) => {
                  return (
                    <span
                      key={index}
                      style={options.position === 'end' ? {display: 'flex', flexGrow: 1, justifyContent: 'end' } : {}}>
                      <Actions
                        message={message}
                        chat={chat}
                        {...options}
                      />
                    </span>
                  );
                })
              }
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Bubble;

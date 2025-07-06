import { useBoolean } from 'ahooks';
import React, { useRef, useState } from 'react';
import {
  AlipayOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  ChromeOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Form, Popover, Skeleton, Steps, Tag, Button } from 'antd';
import classNames from 'classnames';
import { isArray, isEmpty, uniqWith } from 'lodash';
import type Message from '@/store/message';
import { Process4E as Process4EType, Process4EStatus, ExecutingTask, ExecutingStage } from '@/typings/answer';
import TaskProcessExecuting, { EditButtonProps } from './TaskProcessExecuting';
import useConfigStore from '@/store/useConfigStore';
import useChatStore from '@/store/useChatStore';
import ZChat from '@/AuChat';
import styles from './index.module.less';

type Props = {
  data: Process4EType['data'];
  message: Message;
  open?: boolean;
  editable?: boolean;
  onlyShowExecuting?: boolean; // 分享时使用，此时不可编辑，且仅展示执行阶段
  chat?: ZChat;
  avatarHide?: boolean;
  renderDag?: (props: { data: Process4EType['data'] }) => React.ReactNode;
};

// 处理step中status的映射问题
const stepStatus = {  
  [Process4EStatus.PENDING]: 'wait',
  [Process4EStatus.RUNNING]: 'process',
  [Process4EStatus.SUCCESS]: 'finish',
  [Process4EStatus.FAILURE]: 'error',
};

function getResourceList(data: Process4EType['data']) {
  let resourceList: ExecutingTask['task_source'] = [];
  
  if (data) {
    const tasks = (data.find(item => item.stage_code === 'executing') as unknown as ExecutingStage).tasks || [];
    resourceList = tasks.reduce((list, task) => {
      if (task.task_source) { // 有的任务可能没有 task_source
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        list = list.concat(task.task_source);
      }
      return list;
    }, []);
  }

  return uniqWith(
    resourceList,
    (prev, next) => prev.title === next.title,
  );;
}

const Process4E: React.FC<Props> = ({ message, data, open = false, editable = true, onlyShowExecuting, avatarHide = false, renderDag  }) => {
  const { avatar, activeRoute } = useConfigStore(state => state);
  const [isOpen, { toggle: toggleOpen }] = useBoolean( activeRoute === 'investment' ? false : open);
  const resourceList = getResourceList(data);

  const taskProcessExecutingRef = useRef<{
    EditButton: React.FC<EditButtonProps>;
  }>(null);

  // 是否自定义解读
  const [customize, setCustomize] = useState(false);
  const [form] = Form.useForm();
  const chat = useChatStore(state => state.chat);

  // 自定义解读按钮
  const EditButton = taskProcessExecutingRef.current?.EditButton;
  const skeletonProps = {
    paragraph: {
      rows: 1,    // 骨架行数
    },
    active: true, // 展示动画
  };

  const renderDescription = (item: (typeof data)[number]) => {

    // 策划阶段
    if (item.stage_code === 'engineering') {
      const isWait =
        item.status === Process4EStatus.PENDING ||
        item.status === Process4EStatus.RUNNING;
      return (
        <div className={styles.engineeringContent}>
          {isWait && (
            <div style={{ marginBottom: 8 }}>{`${
              item.status
                ? isEmpty(item.guiding_framework) && item.framework_enable
                  ? '未匹配到该领域的专家解读框架，将基于默认思路生成解读'
                  : '将基于默认思路生成解读'
                : '正在匹配专家解读框架'
            }`}</div>
          )}
          <Skeleton loading={isWait} {...skeletonProps}>
            {isArray(item.guiding_framework) ? (
              isEmpty(item.guiding_framework) ? (
                <div>未匹配到该领域的专家解读框架，将基于默认思路生成解读</div>
              ) : (
                <div>
                  已匹配到
                  {item.guiding_framework!.map((framework) => (
                    <span
                      className={styles.engineeringFramework}
                      key={framework.name}
                    >
                      {framework.name}
                      <Popover
                        content={
                          <div className={styles.introduction}>
                            {framework.introduction}
                          </div>
                        }
                      >
                        <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                      </Popover>
                    </span>
                  ))}
                  将基于该专家解读框架知识、指导等信息，生成解读
                </div>
              )
            ) : (
              '将基于默认思路生成解读'
            )}
          </Skeleton>
        </div>
      );
    }

    // 执行（分析拆解+执行）阶段
    if (item.stage_code === 'executing') {
      return (
        <TaskProcessExecuting
          skeletonProps={skeletonProps}
          customize={customize}
          ref={taskProcessExecutingRef}
          data={data}
          resourceList={resourceList}
          item={item}
          message={message}
          form={form}
          renderDag={renderDag}
        />
      );
    }

    // 执行（分析拆解+执行）阶段
    if (item.stage_code === 'relate_action') {
      const { location, name, order, service_id } = item?.data || {};
      return (
        <div
          style={{ textAlign: location || 'right' }}
          className='my-4'
        >
          <Button
            type="primary"
            onClick={() => {
              chat.sendPrompt({
                content: order,
                skill: { type: '', data: service_id },
              });
            }}
          >
            {name}
          </Button>
        </div>
      );
    }
    
    // 表达阶段
    if (item.stage_code === 'expressing') {
      return (
        <Skeleton loading={item.status === Process4EStatus.PENDING} {...skeletonProps}>
          {message.connectTime > 2500 && (
            <Tag
              icon={<ExclamationCircleOutlined />}
              color="warning"
              style={{ marginTop: '0.5rem' }}
            >
              您的网络连接缓慢，可能影响本次问答速度
            </Tag>
          )}
        </Skeleton>
      );
    }
  };

  return (
    <div className={styles.taskProcess}>
      <div className={styles.head} onClick={toggleOpen}>
        {isOpen ? <CaretDownOutlined /> : <CaretRightOutlined />}
        {avatarHide ? null : <span className={styles.avatar}>{avatar.assistant}</span>}
        {data[1].status === Process4EStatus.SUCCESS && (
          <>
            <span>基于 { resourceList.length } 篇资料整理</span>
            <span className={styles.iconList}>
              <WeiboCircleOutlined />
              <AlipayOutlined />
              <ChromeOutlined />
            </span>
          </>
        )}
      </div>

      <div
        className={classNames([
          styles.taskContainer,
          { [styles.hidden]: !isOpen },
        ])}
      >
        {
          onlyShowExecuting
          ? renderDescription(data?.find(item => item.stage_code === 'executing') as any)
          : (
            <Steps
              direction="vertical"
              size="small"
              items={data?.map((item) => ({
                title:
                  item.stage_code === 'executing' && editable
                    ? EditButton && (
                      <div className={styles.title}>
                        <span>{item.stage_name}</span>
                        <EditButton
                          item={item}
                          form={form}
                          setCustomize={setCustomize}
                          customize={customize}
                          message={message}
                        />
                      </div>
                      )
                    : item.stage_name,
                status: (stepStatus as any)[item.status],
                description: renderDescription(item),
                icon: item.status === Process4EStatus.RUNNING && (
                  <div className={styles.syncOutlinedContener}>
                    <SyncOutlined spin className={styles.syncOutlined} />
                  </div>
                ),
              }))}
            />
          )
        } 
      </div>
    </div>
  );
};

export default Process4E;

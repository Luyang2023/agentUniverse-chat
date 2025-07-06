import React, { forwardRef, useImperativeHandle, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import { Button, Divider, Form, FormInstance, Input, Skeleton, Tree } from 'antd';
import { isEmpty, merge } from 'lodash';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import LinkButtonGroup from '@/components/LinkButtonGroup';
import TypedThrottle from '@/components/TypedThrottle';
import Message, { MessageStatus } from '@/store/message';
import useSessionStore, { selectActiveSession, selectInputRunning } from '@/store/useSessionStore';
import {
  EngineeringStage,
  ExecutingStage,
  ExecutingTask,
  Process4E,
  Process4EStatus,
} from '@/typings/answer';
import useTypedThrottle from '@/hooks/useTypedThrottle';
import styles from './index.module.less';
import { PC_FLAG } from '@/constants';
import useChatStore from '@/store/useChatStore';
import useMiscStore from '@/store/useMiscStore';


// 改造树形结构数据满足antd中tree组件数据源要求,根据场景判断是否用假流式
export function transformToAntdTreeData(data: ExecutingTask[], deepKey = '', normal: boolean = false): { key: string; title: string | React.ReactElement; children: any[]; task_source: any }[] {
  return data?.map((node, index) => {
    const key = deepKey ? `${deepKey}-${index + 1}` : `${index + 1}`;
    return {
      key,
      title: normal ? `${index + 1} . ${node.task}`: <TypedThrottle speed={800}>{`${index + 1} . ${node.task}`}</TypedThrottle>,
      children: node.sub_task ? transformToAntdTreeData(node.sub_task, key, normal) : [],
      task_source: node.task_source,
    }
  });
}

export type EditButtonProps = {
  setCustomize: (c: boolean) => void;
  customize: boolean;
  form: FormInstance<any>;
  item: ExecutingStage;
  message: Message;
}
// 自定义按钮
const EditButton: React.FC<EditButtonProps> = (props) => {
  const {item, customize, setCustomize, form} = props;
  const inputDisabled = useSessionStore(selectInputRunning);
  const activeSession = useSessionStore(selectActiveSession);
  const { contentRef, scrollToBottom } = useMiscStore();
  const isStopped = props.message.status === MessageStatus.STOPPED;
  const chat = useChatStore(state => state.chat);
  // 重新解读；
  const reinterpret = async (item: ExecutingStage) => {
    const currentContent = item.tasks[0].task;
    // 原始数据
    const rawData = item.tasks;
    // 修改后的数据
    const values: { names: { name: string }[] } = await form.validateFields();

    const rawDataMap = new Map<string, any>();
    rawData?.forEach((data) => {
      rawDataMap.set(data.task, data);
    });
    const newTasks = values.names.map((it) => {
      const rawData = rawDataMap.get(it.name);
      if (rawData) {
        return {
          question: rawData.task,
          preset_answer: rawData.task_result,
          preset_source: rawData.task_source,
        };
      } else {
        return {
          question: it.name,
        };
      }
    });

    // 设置延迟时间
    if(contentRef?.current) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
    
    // 发起重新请求
    useSessionStore.getState().sendPrompt({prompt: merge({}, chat.getPrompt(), {
      content: currentContent,
      framework: newTasks,
        isRetry: true,
      }),
      sessionId: activeSession!.id,
    });

    setCustomize(false);
  };

  return (
     <div className={styles.customFrameWorkContainer}>
      {customize ? (
        <div className={styles.customFrameWorkButton}>
          <Button type="link" onClick={() => reinterpret(item)}>
            确定
          </Button>
          <Divider type="vertical" />
          <Button type="link" onClick={() => setCustomize(false)}>
            取消
          </Button>
        </div>
      ) : (
        <Button
          disabled={inputDisabled || isStopped}
          className={styles.customFrameWorkButton}
          type="link"
          onClick={() => setCustomize(true)}
        >
          自定义解读框架
        </Button>
      )}
    </div>
  );
};

const titleMapGenerate = {
  [Process4EStatus.PENDING]: () => '',
  [Process4EStatus.RUNNING]: () => '正在根据以上问题查询知识库和公开资料',
  [Process4EStatus.SUCCESS]: (lenAll: number, len: number) =>
    `已查询知识库和以下公开资料（共计 ${lenAll} 篇），其中公开资料${len}篇`,
  [Process4EStatus.FAILURE]: () => '',
};

const TaskProcessExecuting: React.FC<{
  data: Process4E['data'];
  resourceList: ExecutingTask['task_source'];
  skeletonProps: {
    paragraph: {
      rows: number;
    };
    active: boolean;
  };
  item: ExecutingStage
  message: Message;
  customize: boolean;
  hideResources?: boolean;
  form: FormInstance<any>;
  ref: any;
  renderDag?: (props: { data: Process4E['data'] }) => React.ReactNode;
}> = forwardRef(({ item, data, resourceList, message, customize, hideResources, form, skeletonProps, renderDag }, ref) => {
  const tasks = useMemo(() => transformToAntdTreeData(item.tasks, '', hideResources), [item.tasks]);
  const realTasks = useTypedThrottle(tasks, { speed: 300, disabled: message.status !== MessageStatus.RUNNING }); 
  const taskSourceHasUrl = resourceList.filter((item) => !!item.url);

  // children为空时不显示展开按钮，避免样式问题
  const isShowExpandButton = tasks?.some((task: any) => task.children.length > 0);

  useImperativeHandle(ref, () => ({
    EditButton,
  }));

  // 初始化form
  const initFormData = () => {
    // 对话完成
    if (
      data.find((card) => card.stage_code === 'expressing')?.status === 'success'
    ) {
      const engineeringList = data?.find(
        (card) => card.stage_code === 'engineering',
      ) as EngineeringStage;
      const engineering = engineeringList?.framework?.map((item) => {
        return {
          name: item,
          key: nanoid(),
        };
      });
      form.setFieldsValue({
        names: engineering,
      });
    }
  };

  useEffect(() => {
    initFormData();
  },[data]);

  return (
    <Skeleton loading={item.status === Process4EStatus.PENDING} {...skeletonProps}>
      {customize ? (
        <Form
          className={styles.form}
          layout={!PC_FLAG ? 'inline' : 'horizontal'}
          form={form}
        >
          <Form.List name="names">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => {
                  return (
                    <Form.Item key={field.key} noStyle>
                      <div style={{ display: 'flex' }}>
                        <Form.Item
                          style={{
                            width: '100%',
                            marginBottom: 0,
                            marginRight: '4px',
                          }}
                          label={field.name + 1}
                          {...field}
                          name={[field.name, 'name']}
                        >
                          <Input placeholder="请输入解读问题" />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </div>
                    </Form.Item>
                  );
                })}
                {fields.length < 10 && (
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                    >
                      新增解读
                    </Button>
                  </Form.Item>
                )}
              </>
            )}
          </Form.List>
        </Form>
      ) : (
        <div className={styles.executing}>
          <Tree
            className={classNames([styles.tree, {[styles.expandButton]: !isShowExpandButton }])}
            treeData={realTasks}
          />
          {renderDag && renderDag({ data })}
          {
            !hideResources && <div className={styles.resource}>
              <div className={styles.source}>
                <div className={styles.title}>
                  {!isEmpty(resourceList) &&
                    titleMapGenerate[item.status](
                      resourceList.length,
                      taskSourceHasUrl.length,
                    )}
                </div>
                <LinkButtonGroup list={resourceList} />
              </div>
            </div>
          }
        </div>
      )}
    </Skeleton>
  );
});

export default TaskProcessExecuting;

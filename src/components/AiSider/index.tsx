import React, { useMemo } from 'react';
import { Alert, Button, Divider, message, Popover, Spin, Collapse } from 'antd';
import { MessageOutlined, ClockCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import Session from '@/store/session';
import useSessionStore from '@/store/useSessionStore';
import useMiscStore from '@/store/useMiscStore';
import useConfigStore, { selectProductLogo } from '@/store/useConfigStore';
import useChatStore from '@/store/useChatStore';
import IconSider from '@/icon/IconSider';
import SessionButton from '@/components/SessionButton';
import MenuButton from '@/components/MenuButton';
import AiAddButton from '@/components/AiAddButton';
import styles from './index.module.less';
import Event from '@/constants/event';
import { MessageStatus } from '@/store/message';

const AiSider = ({ className }: { className: string }) => {
  const { setMisc } = useMiscStore(state => state);
  const { menuRoutes, SideBottomSlot, activeRoute, welcomeSlot, setCopilot, setActiveRoute, sessionDefaultActiveKey } = useConfigStore(state => state);
  const { chat } = useChatStore(state => state);

  const {
    error,
    sessionList,
    activeSessionId,
    sessionListLoading,
    initSessionList,
    activateSession,
  } = useSessionStore((state) => state);

  const productLogo = useConfigStore(selectProductLogo);

  const realMenuRoutes = useMemo(() => {
    if(menuRoutes?.length) {
      return [
        {
          label: '对话',
          value: 'session',
          icon: <MessageOutlined />,
          content: welcomeSlot
        },
        ...menuRoutes,
      ];
    } else {
      return [];
    };
  }, [ menuRoutes, welcomeSlot ]);

  // 点击会话tab
  const handleSessionClick = async (session: Session) => {
    chat.setConfig({
      isDocCopilotMode: false,
      hiddenHeader: false,
      activeRoute: 'session',
    });
    setCopilot({
      isFolding: false,
      isOpen: false,
    })
    activateSession(session.id);
  };

  // 确认删除当前会话
  const handleSessionDelete = async (session: Session) => {
    try {
      await session.destroy();
      message.success('删除成功');
    }
    catch (error) {
      message.error('删除失败');
    }

    // 删除完后更新list，拉取新的最近10条
    // initSessionList();
  };

  // 修改会话名称
  const handleSessionChange = async (session: Session, title: string) => {
    session
      .updateTitle(title)
      .then(() => message.success('修改成功'))
      .catch(() => message.error('修改失败'));
  };

  return (
    <div className={classNames(styles.sider, className)}>
      <div className={styles.head}>
        <div className={styles.logo}>
          { productLogo }
        </div>
        <Button icon={<IconSider />} style={{ opacity: '0.7' }} type="text" onClick={() => setMisc({ siderVisible: false })} />
      </div>
      <Spin spinning={sessionListLoading} wrapperClassName={styles.spinContainer}>
        <AiAddButton className={styles.addButton} />
      </Spin>
      
      {error && (
        <Alert
          style={{ margin: '0 12px' }}
          message="列表加载失败"
          type="error"
          showIcon
          action={
            <Popover content={error.message}>
              <Button size="small" danger>
                详情
              </Button>
            </Popover>
          }
        />
      )}

      {
        realMenuRoutes?.map(item => 
          <MenuButton
            active={activeRoute === item.value} 
            key={item.value}
            {...item}
            onClick={() => {
              activateSession('');
              setActiveRoute(item.value);
              chat.setConfig({
                isDocCopilotMode: false,
              })
            }}
          />
        )
      }

      <Divider className={styles.explain} />

      <Collapse
        bordered={false}
        expandIconPosition='end'
        defaultActiveKey={sessionDefaultActiveKey}
        items={[
          {
            id: '1',
            key: 'recently',
            label: <div className={styles.historySession}>
              <ClockCircleOutlined />
              <span>最近对话</span>
            </div>,
            children: sessionList.map((session) => {
              const messageStatus = session.messageList?.[session.messageList.length - 1]?.status || '';
              const deleteDisabled = messageStatus === MessageStatus.RUNNING || messageStatus === MessageStatus.PENDING
              return (
                <SessionButton
                  key={session.id}
                  active={activeSessionId === session.id}
                  deleteDisabled={deleteDisabled}
                  showOperate
                  onClick={() => handleSessionClick(session)}
                  onDelete={() => handleSessionDelete(session)}
                  onChange={(title: string) => handleSessionChange(session, title)}
                >
                  {session.title}
                </SessionButton>
              )
            })
          }
        ]} />
      <div className={styles.bottom}>
        {SideBottomSlot ? SideBottomSlot : ''}
      </div>
    </div>
  );
};

export default AiSider;

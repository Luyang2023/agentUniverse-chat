import React from 'react';
import { Avatar, Button, Dropdown } from 'antd';;
import { MoonOutlined, SunOutlined, FormOutlined, LogoutOutlined } from '@ant-design/icons';
import useMiscStore from '@/store/useMiscStore';
import useConfigStore from '@/store/useConfigStore';
import IconSider from '@/icon/IconSider';
import { ALI_APP_FLAG } from '@/constants';
import Event from '@/constants/event';
import useChatStore from '@/store/useChatStore';
import AiAddButton from '@/components/AiAddButton';
import styles from './index.module.less';

const AiHead = () => {
  const { siderVisible, setMisc } = useMiscStore(state => state);
  const { avatar, switchTheme, disabledSession, headerSlots } = useConfigStore(state => state);
  const chat = useChatStore(state => state.chat);

  const handleClickFeedback = () => {
    chat.emit(Event.FEEDBACK_CLICK);
  };

  const handleLogout = () => {
    chat.emit(Event.LOGOUT_CLICK);
  };

  const dropdownItems = [
    {
      key: '1',
      label: <div onClick={() => switchTheme('dark')}>
        <span>暗色主题</span>
        <MoonOutlined className={styles.themeDark} />
      </div>,
    },
    {
      key: '2',
      label: <div onClick={() => switchTheme('light')}>
        <span>亮色主题</span>
        <SunOutlined className={styles.themeLight} />
      </div>,
    },
    {
      key: '3',
      label: <div onClick={handleClickFeedback}>
        <span>意见反馈</span>
        <FormOutlined className={styles.feedback} />
      </div>
    }
  ];

  if (!ALI_APP_FLAG) {
    // APP 环境没有退出
    dropdownItems.push(
      {
        key: '4',
        label: <div onClick={handleLogout}>
          <span>退出登录</span>
          <LogoutOutlined className={styles.logout} />
        </div>,
      },
    );
  };

  return (
    <div className={styles.head}>
      <div className={styles.left}>
        { (!siderVisible && !disabledSession) && (
          <>
            <Button icon={<IconSider />} style={{ opacity: '0.7' }} type="text" onClick={() => setMisc({ siderVisible: true })} />
            <AiAddButton size='small' />
          </>
        ) }
      </div>
      <div className={styles.right}>
        <div className={styles.slots}>
          { headerSlots?.map((slot: React.ElementType) => 
            React.createElement(slot, { chat })
          ) }
        </div>
        <Dropdown menu={{ items: dropdownItems }}>
          <Avatar style={{ backgroundColor: '#1677ff', cursor: 'pointer' }} size={32}>
            { avatar.user }
          </Avatar>
        </Dropdown>
      </div>
    </div>
  );
};

export default AiHead;

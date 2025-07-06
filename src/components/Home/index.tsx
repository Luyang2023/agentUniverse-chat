import React, { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import classNames from 'classnames';
import useSessionStore from '@/store/useSessionStore';
import useChatStore from '@/store/useChatStore';
import useConfigStore, { selectAntdTheme } from '@/store/useConfigStore';
import useMiscStore from '@/store/useMiscStore';
import AiContent from '@/components/AiContent';
import AiSider from '@/components/AiSider';
import Event from '@/constants/event';
import styles from './index.module.less'; 

const Home = () => {
  const chat = useChatStore(state => state.chat);
  const { initSessionList } = useSessionStore(state => state);
  const { theme, isCompact, setConfig, container, disabledSession, hiddenSider } = useConfigStore(state => state);
  const antdTheme = useConfigStore(selectAntdTheme);
  const { siderVisible, isPinSidebar, setMisc } = useMiscStore(state => state);

  useEffect(() => {
    initSessionList();
  }, []);

  useEffect(() => {
    if (!container) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const isCompact = entry.contentRect.width < 768;
        setConfig({
          isCompact,
        });

        chat.emit(Event.COMPACT_CHANGE, isCompact);
      }
    });

    resizeObserver.observe(container);

    // 清理函数
    return () => {
      resizeObserver.disconnect();
    };
  }, [container]);


  useEffect(() => {

    if (isCompact) {
      container?.classList.add('compact');
    } else {
      container?.classList.remove('compact');
    };

    if(!isPinSidebar) {
      setMisc({
        siderVisible: !isCompact,
      });
    }
    
  }, [isCompact]);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    };
  }, [ theme ]);

  const isHiddenSider = hiddenSider || disabledSession;

  return (
    <div
      className={
        classNames({
          [styles.container]: true,
        })
      }
    >
      <ConfigProvider theme={antdTheme}>
          <div className={styles.body}>
            {
             !isHiddenSider && (
              <AiSider className={classNames({
                [styles.siderContainer]: true,
                [styles.fixed]: isCompact,
                [styles.hidden]: !siderVisible,
              })} />
            )
          }
            <AiContent />
          </div>
      </ConfigProvider>
    </div>
  );
};

export default Home;

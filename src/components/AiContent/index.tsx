import React, { useMemo } from 'react';
import useSessionStore from '@/store/useSessionStore';
import useMiscStore from '@/store/useMiscStore';
import useConfigStore from '@/store/useConfigStore';
import useChatStore from '@/store/useChatStore';
import { Button } from 'antd';
import { LeftCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AiHead from '@/components/AiHead';
import Event from '@/constants/event';
import styles from './index.module.less';
import AiCopilot from '../AiCopilot';

const AiContent = () => {
  const { activateSession, activeSessionId } = useSessionStore((state) => state);
  // @ts-nocheck
  const { hiddenHeader, menuRoutes, welcomeSlot, activeRoute, copilot, docLimitAlert, isDocCopilotMode, setActiveRoute } = useConfigStore();
  const { setArtifact, isClearActiveSession, setClearActiveSession } = useMiscStore();
  const chat = useChatStore(state => state.chat);

  const currentMenuContent = useMemo(() => {
    return menuRoutes?.find(item => item.value === activeRoute)?.content || welcomeSlot;
  }, [activeRoute]);

  const handleBack = () => {
    chat.emit(Event.PDF_BACK);
    setActiveRoute(chat.getConfig().activeRoute);
    setArtifact(undefined);
    if(isClearActiveSession) {
      activateSession('');
    } else {
      activateSession(activeSessionId as string);
      setClearActiveSession(true);
    }
    chat.setConfig({
      isDocCopilotMode: false,
      hiddenHeader: false,
    });
  };

  const renderSlot = () => {
    if(activeRoute === 'report') {
      if(isDocCopilotMode) {
        return (
          <div className={styles.docCopilotMode}>
            {
              activeRoute === 'report' && 
              <div style={{ width: copilot?.isOpen ? '60%' : '100%' }}>
                <div className={styles.back}>
                  <Button onClick={handleBack} type='text'>
                    <LeftCircleOutlined />
                    <span>返回</span>
                  </Button>
                  {
                    docLimitAlert && <div>
                      <ExclamationCircleOutlined style={{ color: "#1677ff", marginRight: 8 }} />
                      <span>{docLimitAlert.message}</span>
                    </div>
                  }
                </div> 
              </div> 
            }          
            <AiCopilot isDocCopilotMode={true} />
          </div>
        )
      } else {
        return <div className={styles.reportMenuContent}>{currentMenuContent}</div>;
      }
    } else {
      return <div style={{ display: 'flex', width: '100%', height: copilot?.isOpen ? '100%' : 'calc(100% - 56px)' }}>
        {currentMenuContent}
        <AiCopilot isDocCopilotMode={true} />
      </div> ;
    }
  };

  return (
    <div className={styles.container}>
      {
        !hiddenHeader && <AiHead />
      }
      {
        activeRoute !== 'session' ? renderSlot() : <AiCopilot />
      }
    </div>
  );
};

export default AiContent;

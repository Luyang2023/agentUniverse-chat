import { Button, Tooltip } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { ActionComponent } from '@/store/useConfigStore';
import useSessionStore, { selectActiveSession } from '@/store/useSessionStore';
import { useMemo } from 'react';

const Share: ActionComponent = ({message, onClick}) => {
  const activeSession = useSessionStore(selectActiveSession);
  const messageList = activeSession?.messageList;


  const latestQuestion = useMemo(() => {
    if(messageList?.length) {
      const index = messageList.findLastIndex(msg => msg.id === message?.id);
      if(index < 0) {
        return {};
      } else {
        return messageList[index - 1];
      }
    } else {
      return {}
    }
  }, [messageList]);
  
  return (
    <Tooltip title="分享">
      <Button size='small' icon={<ShareAltOutlined />} type='text' onClick={() => onClick?.(message!, latestQuestion)} />
    </Tooltip>
  );
};

export default Share;

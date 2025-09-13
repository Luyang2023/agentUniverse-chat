import { Button } from 'antd';
import { ActionComponent } from '@/store/useConfigStore';
import useConfigStore from '@/store/useConfigStore';
import useChatStore from '@/store/useChatStore';
import useMiscStore from '@/store/useMiscStore';
import { StarOutlined } from '@ant-design/icons';
import { Message } from '@/index';

const AIRead: ActionComponent = ({message, onClick}) => {
  const attachment = message?.session.attachment;
  const { isDocCopilotMode, setCopilot } = useConfigStore.getState();
  const chat = useChatStore.getState().chat;
  const { setClearActiveSession } = useMiscStore.getState();

  const handleClick = (message: Message | undefined) => {
    chat.setConfig({
      activeRoute: 'report',
    })
    setCopilot({
      isFolding: true,
      isOpen: true,
    })
    setClearActiveSession(false);
    onClick?.(message!);
  }
  
  if(!attachment?.filter(item => item.type === 'pdf').length || isDocCopilotMode) {
    return null;
  } else {
    return (
      <Button style={{ borderRadius: 11, marginRight: 4 }} size='small' type='primary' icon={<StarOutlined />} onClick={ () => handleClick(message)}>进入AI阅读</Button>
    );
  };
};

export default AIRead;
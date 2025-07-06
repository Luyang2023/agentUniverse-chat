import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import useSessionStore from '@/store/useSessionStore';
import useChatStore from '@/store/useChatStore';
import Event from '@/constants/event';

const AiAddButton = ({ size = 'middle', className }: { size?: 'small' | 'middle', className?: string }) => {
  const {setActiveSessionId, activeSessionId } = useSessionStore((state) => state);
  // 添加新会话
  const handleAddSession = async () => {
    setActiveSessionId(undefined);
    const { chat } = useChatStore.getState();
    chat.emit(Event.SESSION_ADD);
  };

  let buttonStyle = {};
  if (size === 'small') {
    buttonStyle = {
      borderRadius: 16,
    };
  }

  return (
    <Button
      className={className}
      style={buttonStyle}
      onClick={handleAddSession}
      type="primary"
      disabled={!activeSessionId}
      ghost
      icon={<PlusOutlined />}
      iconPosition="start"
    >
      新对话
    </Button>
  );
};

export default AiAddButton;
import { Button, Tooltip, Modal, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import useConfigStore from '@/store/useConfigStore';
import { copyToClipboard } from '@/utils/util';
import ZChat from '@/AuChat';

const SessionShare = ({ chat }: { chat: ZChat }) => {
  const activeSession = chat.getActiveSession();
  const lng = useConfigStore(state => state.lng);

  if(!activeSession) {
    return null;
  }

  const shareUrl = window.location.origin + window.location.pathname + `?sessionId=${activeSession?.id}` + `&lng=${lng}`;

  const handleCopy = () => {
    copyToClipboard(shareUrl);
    message.success('复制成功');
  };

  return (
    <Tooltip title="分享">
      <Button
        shape="circle"
        type="text"
        disabled={!activeSession}
        icon={<ShareAltOutlined />}
        onClick={() => {
          Modal.success({
            closable: true,
            onOk: handleCopy,
            okText: '复制链接',
            title: '分享会话',
            content: (
              <div className="mt-6 text-slate-400 bg-slate-50 p-3 rounded-lg">
                { shareUrl }
              </div>
            ),
          });
        }}
      />
    </Tooltip>
  );
};

export default SessionShare;
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { AudioOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import { ALI_APP_FLAG } from '@/constants';

interface VoiceButtonProps {
  inputDisabled: boolean;
  onChange: () => void;
}

declare global {
  interface Window {
    AlipayJSBridge?: {
      call: (method: string, callback: (result: any) => void) => void;
    };
  }
}

const VoiceButton: React.FC<VoiceButtonProps> = ({onChange, inputDisabled}) => {
  const [isSpeechAvailable, setIsSpeechAvailable] = useState(false);

  const handleVoiceButtonClick = () => {
    onChange();
  };

  // 判断语音服务是否可用
  useEffect(() => {
    setIsSpeechAvailable(false);
    if (window.AlipayJSBridge) {
      window.AlipayJSBridge?.call('isSpeechAvailable', (result: any) => {
        if (result.success) {
          // 可用
          setIsSpeechAvailable(true);
        }
      });
    }
  }, []);

  return (
    ALI_APP_FLAG && isSpeechAvailable && (
      <Button
        disabled={inputDisabled}
        className={styles.voiceButton}
        type="link"
        onClick={handleVoiceButtonClick}
        icon={ <AudioOutlined className={styles.voiceIcon} />}
      >
      </Button>
    )
  );
};

export default VoiceButton;

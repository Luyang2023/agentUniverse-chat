// 简易输入框，用于处理简单的输入，不支持富文本，用于富文本不兼容的地方
import React, { useEffect, useRef, useState } from 'react';
import useChatStore from '@/store/useChatStore';
import TextareaAutosize from 'react-textarea-autosize';
interface EasyInputProps {
  placeholder: string;
  disabled: boolean;
  onChange: (value: { content: string;}) => void;
  onEnter?: () => void;
}

const EasyInput: React.FC<EasyInputProps> = ({ placeholder, disabled, onChange, onEnter }) => {
  const chat = useChatStore(state => state.chat);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isComposing, setIsComposing] = useState(false);
 
  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    chat.richInput = {
      tf: {
        setValue: (value: any) => {
          if (typeof value === 'string') {
            inputRef.current!.value = value;
            onChange({content: value});
          }
        },
        reset: () => {
          inputRef.current!.value = '';
        },
      },
    };
  }, [inputRef.current]);

  const handleChange = (event: any) => {
    onChange({ content: event.target.value });
  };

  return (
    <TextareaAutosize
      ref={inputRef}
        style={{ 
          width: '100%',
          outline: 'none', 
          resize: 'none',
          padding: 0, 
          margin: 0,
          backgroundColor: 'transparent',
          border: 'none',
        }}
        minRows={1}
        maxRows={6}
        placeholder={placeholder}
        onChange={handleChange}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(event) => {
          
          if(disabled) return;
          
          if (event.key === 'Enter' && !event.shiftKey && !isComposing) {
            event.preventDefault();
            event.stopPropagation();
            onEnter?.();
          }
      }}
    />
  );
};


export default EasyInput;
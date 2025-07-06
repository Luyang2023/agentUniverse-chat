import React, { useState, useRef, useEffect } from 'react';
import { Button, Dropdown } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

interface ButtonItem {
  label: string;
  value: string;
  Icon: React.FC;
  onChange: (value: string) => void;
}

interface AdaptiveButtonListProps {
  items: ButtonItem[];
}

const AdaptiveButtonList: React.FC<AdaptiveButtonListProps> = ({ items }) => {
  const [hiddenButtons, setHiddenButtons] = useState<ButtonItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
      
  useEffect(() => {
    const updateButtonVisibility = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      let availableWidth = containerWidth;
      const newHiddenButtons: ButtonItem[] = [];

      // 估算每个按钮的宽度为150px，包括文本、图标和边距
      const estimatedButtonWidth = 150;
      
      for (let i = 0; i < items.length; i++) {
        if (availableWidth < estimatedButtonWidth) {
          newHiddenButtons.push(items[i]);
        } else {
          availableWidth -= estimatedButtonWidth;
        }
      }

      setHiddenButtons(newHiddenButtons);
    };

    const resizeObserver = new ResizeObserver(updateButtonVisibility);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [items]);

  const visibleButtons = items.filter(item => !hiddenButtons.includes(item));

  return (
    <div ref={containerRef} style={{ display: 'flex', flexWrap: 'nowrap', overflow: 'hidden' }}>
      {visibleButtons.map((item) => (
        <Button
          key={item.value}
          icon={<item.Icon />}
          onClick={() => item.onChange(item.value)}
          style={{ marginRight: 8 }}
        >
          {item.label}
        </Button>
      ))}
      {hiddenButtons.length > 0 && (
        <Dropdown
          menu={{
            items: hiddenButtons.map((item) => ({
              key: item.value,
              label: (
                <Button
                  icon={<item.Icon />}
                  onClick={() => item.onChange(item.value)}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  {item.label}
                </Button>
              ),
            })),
          }}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />}>更多</Button>
        </Dropdown>
      )}
    </div>
  );
};

export default React.memo(AdaptiveButtonList, (prevProps, nextProps) => {
  return prevProps.items.length === nextProps.items.length;
});

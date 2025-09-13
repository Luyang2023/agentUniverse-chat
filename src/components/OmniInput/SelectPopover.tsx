import React, { useEffect, useRef, useState } from 'react';
import { List } from 'antd';
import classnames from 'classnames';
import useClickAway from 'ahooks/lib/useClickAway';
import styles from './SelectPopover.module.less';

interface Option {
  label: string;
  type: string; // 技能标识
  icon?: React.FC;
  description?: string;
}

interface SelectPopoverProps {
  options: Option[];
  onSelect: (type: string) => void;
  visible: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClickAway?: () => void;
}

const SelectPopover = ({ options, onSelect, visible, className, style, onClickAway }: SelectPopoverProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    onClickAway?.();
  }, listRef);

  useEffect(() => {
    if (visible && listRef.current) {
      listRef.current.focus();
    }
  }, [visible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % options.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case 'Enter':
        e.preventDefault();
        onSelect(options[activeIndex].type);
        break;
    }
  };

  if (!visible) return null;

  return (
    <div 
      ref={listRef}
      className={classnames(styles.popover, className)}
      style={style}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <List bordered={false}>
        {options.map((option, index) => (
          <List.Item
            key={option.type}
            className={`${styles.item} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => onSelect(option.type)}
          >
            <div className={styles.itemContent}>
              {option.icon && <span className={styles.icon}>{React.createElement(option.icon)}</span>}
              <span className={styles.label}>{option.label}</span>
              {option.description && <span className={styles.desc}>{option.description}</span>}
            </div>
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default SelectPopover;

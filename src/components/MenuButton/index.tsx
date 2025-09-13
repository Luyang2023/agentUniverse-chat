import React from 'react';
import classNames from 'classnames';
import { MessageOutlined, ReadOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface Props {
  active: boolean;
  value: string;
  label: string;
  icon: React.ReactNode,
  onClick: (value: string) => void;
}

const MenuButton: React.FC<Props> = (props) => {
  const { active, value, label, icon, onClick } = props;
  return (
    <div 
      className={
        classNames([
          styles.menuButton, 
          {
            [styles.active]: active,
          }
        ])
      }
      onClick={() => onClick(value)}
    >
      <div className={styles.icon}>
        {icon}
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default MenuButton;
import { useState, useEffect } from 'react';
import { Select } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import ZChat from '@/AuChat';
import { Skill } from './index';

const createSelectSkill = ({
  type,
  label,
  description,
  Icon = BookOutlined,
  placeholder,
  disableClose,
  options,
  defaultValue,
  onChange,
}: Skill & { options: { label: string; value: string }[], defaultValue: string, onChange?: (value: string) => void  }) => {
  const Header = ({ chat }: { chat: ZChat }) => {
    const { data: skillData } = chat.getPrompt()?.skill || {};

    const handleChange = (value: string) => {
      chat.setSkill({
        type,
        data: value,
      });
      onChange?.(value);
    };

  return (
    <Select
      value={skillData || defaultValue}
      onChange={handleChange}
      style={{ width: 200 }}
      options={options}
      />
    );  
  };

  return {
    type,
    label,
    description,
    Icon,
    placeholder,
    disableClose,
    Header,
  };
};

export default createSelectSkill;
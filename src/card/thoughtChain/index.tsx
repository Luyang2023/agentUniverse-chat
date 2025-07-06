import React, { useEffect, useState } from 'react';
import { Collapse, theme } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import Markdown from '@/card/Markdown';
import type Message from '@/store/message';
import StatusLabel from './StatusLabel';
import ZChat from '@/AuChat';

type Props = {
  data: any;
  message: Message;
  chat?: ZChat;
  autoClose?: boolean;  // 是否 success 后自动关闭
};

const ThoughtChain: React.FC<Props> = ({ message, data, autoClose = false }) => {
  const { token } = theme.useToken();
  const [successMap, setSuccessMap] = useState<Record<string, boolean>>({});
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  useEffect(() => {
    const deltaItemNames = data.filter((item: any) => {
      return !successMap[item.name];
    }).map((item: any) => item.name);

    if (deltaItemNames.length) {
      setSuccessMap({
        ...successMap,
        ...deltaItemNames.reduce((res: Record<string, boolean>, itemName: string) => {
          res[itemName] = true;
          return res;
        }, {})
      });
    }
    let newActiveKeys = [...activeKeys, ...deltaItemNames]
    if (autoClose) {
      newActiveKeys = newActiveKeys.filter((item) => data.find((i: any) => i.name === item)?.status !== 'success');
    }
    setActiveKeys(newActiveKeys);
  }, [data]);

  const panelStyle: React.CSSProperties = {
    borderRadius: token.borderRadiusLG,
    background: token.colorFillAlter,
    border: 'none',
  };

  const items = data.map((item: any) => {
    const tdata = {
      label: <StatusLabel status={item.status} label={item.name} />,
      key: item.name,
      children: <Markdown speed={item.status !== 'success' ? 250 : 0}>{item.data?.answer}</Markdown>, // success后不使用假流式
      style: panelStyle,
    };

    return tdata;
  });

  return (
    <Collapse
      items={items}
      className='flex bg-slate-50 dark:bg-slate-800'
      style={{ // 支小助打包 tailwind，会有缺失，先手动注入吧
        borderRadius: token.borderRadiusLG,
        flexDirection: 'column',
        padding: token.paddingSM,
        gap: token.marginSM,
      }}
      ghost
      activeKey={activeKeys}
      size='small'
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      onChange={(key) => {
        setActiveKeys(key as string[]);
      }}
    />
  );
};

export default ThoughtChain;

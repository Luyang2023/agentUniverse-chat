import { Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { ActionComponent } from '@/store/useConfigStore';

const Copy: ActionComponent = ({message, onClick}) => {
  return (
    <Tooltip title="复制">
      <Button size='small' icon={<CopyOutlined />} type='text' onClick={() => onClick?.(message!)} />
    </Tooltip>
  );
};

export default Copy;

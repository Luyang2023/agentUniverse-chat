import { Button } from 'antd';
import { ActionComponent } from '@/store/useConfigStore';

const MoreDetail: ActionComponent = ({message, onClick}) => {
  return (
    <Button size='small' type='link' onClick={() => onClick?.(message!)}>查看解读详情</Button>
  );
};

export default MoreDetail;

import { Button, Tooltip } from 'antd';
import Icon from '@ant-design/icons';
import useConfigStore from '@/store/useConfigStore';
import { ZhIcon, EnIcon } from './Icon';

const LanguageSwitch = () => {
  const { lng, setLng } = useConfigStore();

  return (
    <Tooltip title="中英文">
      <Button
        shape="circle"
        type="text"
        icon={<Icon className="slate-icon" style={{ width: 20, height: 20 }} component={lng === 'zh' ? ZhIcon : EnIcon} />}
        onClick={() => {
          const newLng = lng === 'zh' ? 'en' : 'zh';
          setLng(newLng);
        }}
      />
    </Tooltip>
  );
};

export default LanguageSwitch;
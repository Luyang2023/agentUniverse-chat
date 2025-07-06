import { CheckCircleOutlined, LoadingOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

// 处理step中status的映射问题
enum Status {
  PENDING = 'pending',
  RUNNING = 'running',
  SUCCESS = 'success',
  FAILURE = 'failure',
};

const statusMap = {
  [Status.SUCCESS]: {
    color: '#52c41a',
    icon: <CheckCircleOutlined />,
  },
  [Status.RUNNING]: {
    color: '#1677ff',
    icon: <LoadingOutlined />,
  },
  [Status.FAILURE]: {
    color: '#ff4d4f',
    icon: <CloseCircleOutlined />,
  },
  [Status.PENDING]: {
    color: '#faad14',
    icon: <ClockCircleOutlined />,
  }
};

const StatusLabel = ({ status, label }: { status: Status, label: string }) => {
  return (
    <div style={{ color: statusMap[status].color }}>
      <span style={{ marginRight: 4 }}>{ statusMap[status].icon }</span>
      { label }
    </div>
  );
};

export default StatusLabel;

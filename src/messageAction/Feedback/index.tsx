import React, { useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { DislikeOutlined, LikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons';
import useConfigStore, { ActionComponent } from '@/store/useConfigStore';
import { useState } from 'react';
import FeedbackModal from './FeedbackModal';

enum FROM_CODE {
  Like = 'f877cadfd46176157',
  Dislike = 'faa359769a4eb83b1',
  SystemFeedback = 'fa718ff58f55f3507',
}

const Feedback: ActionComponent = ({message, onClick, getConfig, onSubmit, onInit}) => {
  const [currentFeedback, setCurrentFeedback] = useState<string>('');
  const [open, setOpen] = useState(false);
  const setConfig = useConfigStore(state => state.setConfig);

  useEffect(() => {
    // TODO 有点问题，为啥要在这里面初始化表单配置？这个组件不应该关注点击后的表单内容，因为有可能都不需要弹出表单，业务侧处理表单就好。
    onInit?.().then((res: any[]) => {
      setConfig({
        feedbackFormList: res,
      })
    })
  }, [getConfig, onInit]);

  const handleClick = (feedback: string) => {
    if (onInit) {
      // TODO 这里是临时逻辑，如果没有onInit，说明不需要表单，直接点击事件
      setOpen(true);
    }
    setCurrentFeedback(feedback);
    if (onClick) {
      onClick(message!, feedback);
    }
  };

  return (
    <>
      <Tooltip title="喜欢">
        <Button
          size='small'
          icon={currentFeedback === FROM_CODE.Like ? <LikeFilled /> : <LikeOutlined />}
          type='text'
          onClick={() => {
            handleClick(FROM_CODE.Like);
          }}
        />
      </Tooltip>
      <Tooltip title="不喜欢">
        <Button
          size='small'
          icon={currentFeedback === FROM_CODE.Dislike ? <DislikeFilled /> : <DislikeOutlined />}
          type='text'
          onClick={() => {
            handleClick(FROM_CODE.Dislike);
          }}
        />
      </Tooltip>
      <FeedbackModal 
        open={open}
        message={message}
        type={currentFeedback}
        onCancel={() => setOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default Feedback;

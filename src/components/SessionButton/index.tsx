import { Input, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import styles from './index.module.less';

interface Props {
  children: React.ReactElement | string;
  active: boolean;
  showOperate?: boolean;
  deleteDisabled?: boolean,
  onClick: () => void;
  onDelete?: () => void;
  onChange?: (content: string) => void;
}

const SessionButton: React.FC<Props> = ({
  children,
  active,
  showOperate,
  deleteDisabled,
  onClick,
  onDelete,
  onChange,
}) => {
  const [value, setValue] = useState<string>('');
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    setValue(children as string);
  }, [children]);

  const onBlur = () => {
    setIsEdit(false);
    onChange?.(value);
  };

  const handleCheckOutlinedMouseDown = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    // 点击input后缀阻止触发blur，手动调用onchange
    event.preventDefault();
    setIsEdit(false);
    onChange?.(value);
  };
  // 点击input后缀阻止触发blur,更新成最初状态
  const handleCloseOutlinedMouseDown = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setIsEdit(false);
    setValue(children as string);
  };

  return (
    <div
      className={classNames({
        [styles.sessionButton]: true,
        [styles.active]: active,
      })}
    >
      {/* <MessageOutlined className={styles.iconMessage} /> */}
      {isEdit ? (
        <Input
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          suffix={
            <div>
              <CheckOutlined
                className={styles.checkOutlined}
                onMouseDown={handleCheckOutlinedMouseDown}
              />
              <CloseOutlined
                className={styles.closeOutlined}
                onMouseDown={handleCloseOutlinedMouseDown}
              />
            </div>
          }
        />
      ) : (
        <>
          <div className={styles.question} onClick={onClick}>
            {value}
          </div>
          {showOperate && (
            <div className={styles.operate}>
              <EditOutlined
                className={styles.edit}
                onClick={() => setIsEdit(true)}
              />
              <Popconfirm
                title="删除对话"
                description="删除后无法恢复，是否继续删除"
                disabled={deleteDisabled}
                okText="确认"
                cancelText="取消"
                onConfirm={onDelete}
              >
                <DeleteOutlined 
                  className={classNames([{
                  [styles.disabled]: deleteDisabled
                  }])} 
                />
              </Popconfirm>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SessionButton;

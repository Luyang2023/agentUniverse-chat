import { Checkbox, Form, Input, Modal } from 'antd';
import React from 'react';
import useConfigStore from '@/store/useConfigStore';
import useSessionStore, { selectActiveSession } from '@/store/useSessionStore';
import Message from '@/store/message';

interface IFeedbackModal {
  type?: string;
  open: boolean;
  message?: Message;
  onCancel: () => void;
  onSubmit: (params: {
      formData: Record<string, string[] | string>,
      messageList: Message[] | undefined,
      message?: Message,
      feedbackForm: any,
    }
  ) => void;
}

const fieldType = {
  String: 'STRING', // 单行输入框
  BigString: 'BIG_STRING', // 输入框
  List: 'ENUM_LIST', // 勾选框
};

const FeedbackModal: React.FC<IFeedbackModal> = ({
  open,
  type,
  message,
  onCancel,
  onSubmit,
}) => {
  const activeSession = useSessionStore(selectActiveSession);
  const messageList = activeSession?.messageList;
  const [form] = Form.useForm();
  // 表单数据
  const feedbackFormList = useConfigStore((state) => state.feedbackFormList);
  const feedbackForm = feedbackFormList?.find((form) => form.formCode === type);
  const handleCancel = () => {
    onCancel();
    form.resetFields();
  };

  const handleSubmit = async () => {
    const formData = await form.validateFields();
    onSubmit({feedbackForm, formData, message, messageList});
    handleCancel();
  };

  return (
    feedbackFormList && <Modal
      title={feedbackForm?.formName}
      okText={'提交'}
      onCancel={handleCancel}
      onOk={handleSubmit}
      open={open}
    >
      <Form form={form}>
        {feedbackForm?.formFields
          .filter((form: any) => !form.extraInfo.hidden) // 过滤掉问题和trace表单
          .map((form: any) => {
            // 根据表单类型判断渲染组件
            if (form.fieldType === fieldType.List) {
              return (
                <div key={form.id} style={{ marginBottom: '12px' }}>
                  {form.description}
                  {form.extraInfo.dataSource?.options.map((item: any) => {
                    return (
                      <Form.Item
                        key={item.label}
                        style={{ margin: 0 }}
                        name={item.label}
                      >
                        <Checkbox.Group>
                          <Checkbox value={form.fieldName}>
                            {item.label}
                          </Checkbox>
                        </Checkbox.Group>
                      </Form.Item>
                    );
                  })}
                </div>
              );
            }
            if (form.fieldType === fieldType.BigString)
              return (
                <div key={form.id}>
                  <div style={{ marginBottom: '12px' }}>{form.description}</div>
                  <Form.Item name={form.fieldName}>
                    <Input.TextArea rows={4} placeholder="请输入" />
                  </Form.Item>
                </div>
              );
            if (form.fieldType === fieldType.String)
              return (
                <div key={form.id}>
                  <div style={{ marginBottom: '12px' }}>{form.description}</div>
                  <Form.Item name={form.fieldName}>
                    <Input placeholder="请输入" />
                  </Form.Item>
                </div>
              );
            return <div key={form.id}></div>;
          })}
      </Form>
    </Modal>
  );
};

export default FeedbackModal;

import { useEffect, useState } from 'react';
import { Tooltip, message as AntdMessage } from 'antd';
import { isString } from 'lodash';
import OpenAI from 'openai';
import { type ActionComponent } from '@/store/useConfigStore';
import { MessageStatus } from '@/store/message';
import useConfigStore from '@/store/useConfigStore';
import ColorButton from './ColorButton';

const genPromptContent = (content: string) => `
      你现在扮演一名跟客服对话的咨询用户，你的任务是根据客服的回答，返回你的回答。

      请按照以下步骤返回消息：
      1. 仔细阅读和分析客服回答的内容。
      2. 给出3个你会发起的回答或要求。
      3. 每个回答尽量简短，最多不超过20字。
      4. 根据客服语言，返回对应语言，比如客服是中文，则返回中文，客服是英文，则返回英文。
      5. 将回答以数组格式返回，仅返回可序列化的数组，不要有任何其他内容。

      以下是客服的回答：
      ${content}
    `;


const Suggestion: ActionComponent = ({message, prompt, openAiOption, model}) => {
  const { lng } = useConfigStore();
  const [loading, setLoading] = useState(false);
  const content = isString(message?.content) 
      ? message.content
      : message?.contentString || ''; 
  
  const isShowSuggestion = content && !message?.isHistory;

  const handleClick = () => {
    const openai = new OpenAI({
      ...openAiOption,
      dangerouslyAllowBrowser: true,
    });
    setLoading(true);
    openai.chat.completions.create({
      model: model || "qwen-plus",  //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
      messages: [
          { role: "user", content: prompt || genPromptContent(content) }
      ],
    })
    .then((res) => {
      try {
        const result = JSON.parse(res.choices[0].message.content || '[]');
        message?.update({
          relateQuestion: result,
        });
      }
      catch (error) {
        AntdMessage.error('猜你喜欢失败');
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (message?.status === MessageStatus.SUCCESS && isShowSuggestion) {
      handleClick();
    }
  }, [message?.status]);
  
  if (!isShowSuggestion) {
    return null;
  }
  const title = lng === 'en' ? 'Guess ask' : '猜你想问';
  return (
    <Tooltip title={title}>
      <ColorButton loading={loading} size='small' onClick={handleClick}>
        {title}
      </ColorButton>
    </Tooltip>
  );
};

export default Suggestion;

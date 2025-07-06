import { useEffect, useState } from 'react';
import { Tooltip, message as AntdMessage, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { isString } from 'lodash';
import OpenAI from 'openai';
import { type ActionComponent } from '@/store/useConfigStore';
import useConfigStore from '@/store/useConfigStore';
import { MessageStatus } from '@/store/message';
import ColorButton from '@/messageAction/Suggestion/ColorButton';


const Highlight: ActionComponent = ({message, role = '通用知识专家', openAiOption, model}) => {
  const { lng } = useConfigStore();
  const [loading, setLoading] = useState(false);
  const [highlightContent, setHighlightContent] = useState('');
  const originContent = message?.contentString || '';
  const autoHighlight = originContent.length > 0 && !message?.isHistory;
  const [checked, setChecked] = useState(autoHighlight);

  const setHighlight = () => {
    if (highlightContent) {
      message?.updateContent(highlightContent);
      return;
    }
    const openai = new OpenAI({
      // 预发环境先测试，后续删掉
      ...openAiOption,
      dangerouslyAllowBrowser: true,
    });
    setLoading(true);
    const promptContent = (content: string) => `
      你现在扮演一名${role}，我将提供一段 markdown 格式的知识内容，你需要根据内容高亮其中的重点内容。
      以下是知识内容：
      <content>
      ${content}
      </content>

      请按照以下步骤高亮重点并返回修改后的内容：
      1. 仔细阅读和分析提供的文案内容。
      2. 找出重点内容，包括能抓住读者注意力的关键点、主题和亮点。
      3. 重点内容不必太多，控制在全文的30%以下。链接和加粗的文本不属于重点内容。
      4. 重点内容应该是分散的。
      5. 单条重点内容不应该太长，最好控制在20个字以内。
      6. 将重点内容包裹起来，例如重点内容为“xxx”，则修改为 :highlight[xxx]{.warning}。
      7. 如果有重点内容，就只返回修改后的 markdown 内容，不要包含解释以及任何其他内容。
      8. 如果没有重点内容，不要解释原因，应该直接返回原始内容。
      9. 返回的 markdown 不需要用标签包裹。

      举例1：
      原始内容：
      请问您在伦敦期间是否有特别想参加的活动或不太感兴趣的活动类型？另外，您在交通方面有偏好的方式或希望避免的交通工具吗？

      你应该返回如下信息：
      请问您在伦敦期间是否有特别想参加的:highlight[活动]{.warning}或不太感兴趣的活动类型？另外，您在交通方面有:highlight[偏好的方式]{.warning}或希望避免的交通工具吗？

      举例2：
      原始内容：
      请问您

      由于无法找到重点信息，你应该返回直接返回原文：
      请问您
    `;
  
    openai.chat.completions.create({
      model: model || "qwen-plus",  //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
      messages: [
          { role: "user", content: promptContent(originContent) },
      ],
    })
    .then((res) => {
      try {
        const result = res.choices[0].message.content;
        if (isString(result)) {
          setHighlightContent(result);
          message?.updateContent(result);
        }
      }
      catch (error) {
        AntdMessage.error('幻影高亮失败');
      }
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    if (isString(!originContent)) {
      return;
    }
    if (message?.status === MessageStatus.SUCCESS && originContent) {
      if (checked) {
        setHighlight();
      }
      else {
        message?.updateContent(originContent);
      }
    }
  }, [message?.status, originContent, checked]);


  const title = lng === 'en' ? 'Highlight' : '幻影高亮';
  
  return (
    <Tooltip title={title}>
      <ColorButton loading={loading} size="small" icon={null}>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          checked={checked}
          onChange={(checked) => setChecked(checked)}
          size="small"
        />
        {title}
      </ColorButton>
    </Tooltip>
  );
};

export default Highlight;

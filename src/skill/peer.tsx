import { Button, Tooltip } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { MergeOutlined } from '@ant-design/icons';
import ZChat from '@/AuChat';
import { Prompt } from '@/store/useSessionStore';
import { Skill } from './index';

const StyledButton = styled(Button)`
  height: 30px;
  line-height: 30px;
  border-radius: 15px;
`;

type Props = {
  chat: ZChat;
  prompt: Prompt;
  onClick: () => void;
};

type Data = {
  framework_type?: 'USER_FRAMEWORK' | 'SUB_FRAMEWORK';  // 自定义框架 | 专家框架
  user_framework_code?: string; // 具体的框架id，专家框架无框架id就是自动匹配
  name: string; // 具体的框架名
};


const Header: React.FC<Props> = ({ chat, prompt, onClick }) => {
  const data: Data = prompt?.skill?.data;

  if (data?.framework_type && data?.user_framework_code) {
    return (
      <StyledButton
        type="primary"
        size="small"
        onClick={onClick}
        icon={
          <Tooltip title="退出框架">
            <LogoutOutlined
              style={{ transform: 'rotate(180deg)' }}
              onClick={(e) => {
                // 阻止时间冒泡行为，防止右侧框架详情弹窗唤起
                e.stopPropagation();
                chat.setSkill({
                  type: 'PEER',
                  data: {
                    framework_type: 'SUB_FRAMEWORK',
                    user_framework_code: null,
                    name: null,
                  },
                });
              }}
            />
          </Tooltip>
        }
      >
        已选
        <strong>
          &nbsp;
          { data.name }
          &nbsp;
        </strong>
      </StyledButton>
    )
  }
  return <StyledButton onClick={onClick}>自动选择框架</StyledButton>;
};

const peer: Skill = {
  type: 'PEER',  
  label: '深度解读',
  description: '多 Agent + 专家框架进行深度解读',
  Icon: MergeOutlined,
  placeholder: '请选择专家框架',
  Header,
  onAttach(chat) {
    chat.setSkill({
      type: 'PEER',
      data: {
        framework_type: 'SUB_FRAMEWORK',
        user_framework_code: undefined,
        name: undefined,
      },
    });
  },
};

export default peer;

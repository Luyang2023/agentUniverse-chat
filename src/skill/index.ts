import ZChat from '@/AuChat';
import peer from './peer';
import rag from './rag';
import url from './url';
import createSelectSkill from './createSelectSkill';

export type Skill = {
  type: string; // 技能标识
  label: string; // 技能名
  disableClose?: boolean; // 是否可关闭
  description: string; // 技能说明
  Icon: React.FC<any>; // 技能图标
  placeholder?: string; // 选择技能时的 input 占位提示
  Header?: React.FC<any>; // 技能顶部渲染内容（标题右侧）,默认会传入 chat 实例作为 props
  Content?: React.FC<any>; // 技能主体渲染内容（标题下面）,默认会传入 chat 实例作为 props
  onAttach?: (chat: ZChat) => void; // 技能被选择时的事件
  onDestroy?: (chat: ZChat) => void; // 技能被关闭时的事件
};

export default {
  peer,
  rag,
  url,
  createSelectSkill,
};

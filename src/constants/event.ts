enum Event {
  // 会话模式切换
  ROUTE_CHANGE = 'route.change',
  // pdf返回
  PDF_BACK = 'pdf.back',
  // 会话
  SESSION_ADD = 'session.add',
  SESSION_DELETE= 'session.delete',
  SESSION_CHANGE = 'session.change',

  // 消息
  MESSAGE_ABORT = 'message.abort',
  PROMPT_SEND = 'prompt.send',

  // 技能
  SKILL_CHANGE = 'skill.change',
  SKILL_DESTROY = 'skill.destroy',
  
  // 全局配置
  THEME_CHANGE = 'theme.change',
  COMPACT_CHANGE = 'compact.change',

  // 反馈
  FEEDBACK_CLICK = 'feedback.click',
  LOGOUT_CLICK = 'logout.click',

  // 语音输入
  VOICE_INPUT = 'voice.input',

  //杂项
  LANGUAGE_CHANGE = 'language.change',
  ARTIFACT_OPEN = 'artifact.open',
  ARTIFACT_CLOSE = 'artifact.close',
}

export default Event;
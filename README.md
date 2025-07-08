# agentUniverse-chat

agentUniverse-chat 是面向业务的 Chat UI SDK，提供了一套完整的聊天机器人解决方案，包括会话管理、消息管理、技能管理、Copilot模式、事件订阅、移动端适配、主题切换等功能。
能够帮助业务侧快速的实现商业级别的大模型对话服务。

--------------------

## 快速使用

```tsx | pure
import AuChat from 'agentUniverse-chat';

const chat = new AuChat({
  container: document.getElementById('chat'), // 挂载的 DOM 元素
  disableSession: true, // 是否禁用会话管理
});

chat.open();
```

## Config 配置项

## Method 方法

### 会话&消息管理

#### 配置消息
```ts
interface Config {
  // 管理左侧会话的增删改查
  sessionHandler?: {
    initSessionList(): Promise<Session[]>;
    addSession({title}: {title: string}): Promise<void>;
    deleteSession(sessionId: string): Promise<void>;
    updateSession(sessionId: string, title: string): Promise<void>;
  }

  // 管理消息列表的初始化
  messageHandler?: {
    initMessageList(sessionId: string): Promise<{ messageList: any[], attachment: Session['attachment'] }>;
  }
```
session 实例的数据结构见：
message 实例的数据结构见：

### 监听消息

```ts
import { Event } from 'agentUniverse-chat';

chat.on(Event.MESSAGE_SEND, (role, message) => {
  console.log(role, message);
});
```

### 发送消息

## 模块
### Card 卡片
```tsx | pure
import { Card } from 'agentUniverse-chat';

chat.
<Card.Markdown type={'text'}>{ message.content }</Card.Markdown>
```

### Skill 技能

### MessageAction 消息动作

### Event 事件

## 插槽

### HeadSlot 头部插槽

### AsideSlot 侧边插槽

### WelcomeSlot 欢迎页插槽
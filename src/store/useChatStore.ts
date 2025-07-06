import ZChat from '@/AuChat';
import { create } from 'zustand';

export type ThemeType = 'dark' | 'light';

export interface ChatState {
  chat: ZChat;
}

export type ConfigStore = ChatState;

const useChatStore = create<ConfigStore>()(() => ({
  chat: undefined!,
}));


export default useChatStore;

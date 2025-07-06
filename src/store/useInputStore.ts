import { create } from 'zustand';
import { mergeWith } from 'lodash';
import { Prompt } from './useSessionStore';
import { mergeWithArray } from '@/utils/util';

export interface PromptState {
  prompt?: Prompt;
  disableSend: boolean;
}

export interface PromptAction {
  setPrompt: (config: Partial<PromptState>) => void;
  mergePrompt: (prompt: Partial<Prompt>) => void;
}

export type ConfigStore = PromptState & PromptAction;

const usePromptStore = create<ConfigStore>()((set, get) => ({
  prompt: undefined,
  disableSend: false,

  setPrompt: (input) => {
    set(input);
  },
  
  mergePrompt: (prompt) => {
    set(state => ({
      prompt: mergeWith(state.prompt, prompt, mergeWithArray),
    }));
  },
}));

export default usePromptStore;

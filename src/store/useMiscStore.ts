import React from 'react';
import { create } from 'zustand';
import useChatStore from './useChatStore';
import Event from '@/constants/event';

export interface MiscState {
  siderVisible: boolean;
  artifact?: React.ReactNode;
  artifactLoading?: boolean;
  artifactStyle: React.CSSProperties;
  contentRef?: React.RefObject<HTMLDivElement>;
  isPinSidebar: boolean;
  attachRef: React.RefObject<HTMLDivElement> | null;
}
export interface MiscAction {
  setMisc: (config: Partial<MiscState>) => void;
  setArtifact: (artifact: React.ReactNode | undefined, props?: any) => void;
  isClearActiveSession: boolean;
  scrollToBottom: () => void;
  setClearActiveSession: (boolean: boolean) => void;
}

export type ConfigStore = MiscState & MiscAction;

const useMiscStore = create<ConfigStore>()((set, get) => ({
  siderVisible: true,
  contentRef: undefined,
  isPinSidebar: false,
  artifact: undefined,
  artifactLoading: false,
  artifactStyle: {},
  attachRef: null,
  isClearActiveSession: true,

  setMisc: (misc) => {
    set(misc);
  },

  setArtifact: (artifact, props) => {
    set({ artifact, artifactStyle: props });
    useChatStore.getState().chat.emit(artifact ? Event.ARTIFACT_OPEN : Event.ARTIFACT_CLOSE);
  },

  scrollToBottom: () => {
    const { contentRef } = get();
    if (contentRef) {
      requestAnimationFrame(() => { 
        contentRef.current?.scrollTo(0, contentRef.current?.scrollHeight);
      });
    }
  },

  setClearActiveSession(boolean) {
    set({
      isClearActiveSession: boolean,
    })
  }
 
}));

export default useMiscStore;

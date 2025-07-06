import { create } from 'zustand';
import type { MessageModel } from '../models/messageModels';

interface MessageState {
  messages: MessageModel[];
  setMessages: (msgs: MessageModel[]) => void;
  addMessage: (msg: MessageModel) => void;
  clearMessages: () => void;
  logout: () => void;

}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
    logout: () => set({ messages: [] }),

  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationFrequency = 'daily' | 'weekly';

export interface NotificationState {
  frequency: NotificationFrequency;
  setFrequency: (frequency: NotificationFrequency) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist<NotificationState>(
    (set) => ({
      frequency: 'daily',
      setFrequency: (frequency: NotificationFrequency) => set({ frequency }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Theme = 'system' | 'light' | 'dark';

export interface ThemeState {
  theme: Theme;
  getTheme: () => Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist<ThemeState>(
    (set, get) => ({
      theme: 'system',
      getTheme: () => get().theme,
      setTheme: (theme: Theme) => set({ theme }),
    }),
    {
      name: 'theme-storage', 
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
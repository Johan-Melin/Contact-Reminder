import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto';

export interface Contact {
  id: string;
  name: string;
}

export interface ContactState {
    contacts: Contact[];
    addContact: (name: string) => void;
    updateContact: (id: string, name: string) => void;
    removeContact: (id: string) => void;
  }

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (name: string) => set({ contacts: [...get().contacts, { id: Crypto.randomUUID(), name } ] }),
      updateContact: (id: string, name: string) => set({ contacts: get().contacts.map(c => c.id === id ? { ...c, name } : c) }),
      removeContact: (id: string) => set({ contacts: get().contacts.filter(c => c.id !== id) }),
    }),
    {
      name: 'contact-storage', 
      storage: createJSONStorage(() => AsyncStorage), 
    },
  ),
)
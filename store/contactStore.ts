import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto';

export interface Contact {
  id: string;
  name: string;
  shouldContact: boolean;
  lastContact?: Date;
}

export interface ContactState {
    contacts: Contact[];
    addContact: (name: string, shouldContact: boolean, lastContact?: Date) => void;
    updateContact: (id: string, name: string, shouldContact: boolean, lastContact?: Date) => void;
    removeContact: (id: string) => void;
  }

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (name: string, shouldContact: boolean, lastContact?: Date) => set({ contacts: [...get().contacts, { id: Crypto.randomUUID(), name, shouldContact, lastContact } ] }),
      updateContact: (id: string, name: string, shouldContact: boolean, lastContact?: Date) => set({ contacts: get().contacts.map(c => c.id === id ? { ...c, name, shouldContact, lastContact } : c) }),
      removeContact: (id: string) => set({ contacts: get().contacts.filter(c => c.id !== id) }),
    }),
    {
      name: 'contact-storage', 
      storage: createJSONStorage(() => AsyncStorage), 
    },
  ),
)
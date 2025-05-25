import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Crypto from 'expo-crypto';

export type ContactType = {name: string, color: string};

export const contactTypes: ContactType[] = [
  { name: 'Untagged', color: 'gray' },
  { name: 'Family', color: 'green' },
  { name: 'Friend', color: 'blue' },
  { name: 'Colleague', color: 'indigo' },
];

export interface Contact {
  id: string;
  name: string;
  shouldContact: boolean;
  contactType: ContactType;
  lastContact?: Date;
}

export interface ContactState {
    contacts: Contact[];
    addContact: (name: string, shouldContact: boolean, contactType: ContactType, lastContact?: Date) => void;
    updateContact: (id: string, name: string, shouldContact: boolean, contactType: ContactType, lastContact?: Date) => void;
    removeContact: (id: string) => void;
  }

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (name: string, shouldContact: boolean, contactType: ContactType = contactTypes[0], lastContact?: Date) => set({ contacts: [...get().contacts, { id: Crypto.randomUUID(), name, shouldContact, contactType, lastContact } ] }),
      updateContact: (id: string, name: string, shouldContact: boolean, contactType: ContactType, lastContact?: Date) => set({ contacts: get().contacts.map(c => c.id === id ? { ...c, name, shouldContact, contactType, lastContact } : c) }),
      removeContact: (id: string) => set({ contacts: get().contacts.filter(c => c.id !== id) }),
    }),
    {
      name: 'contact-storage', 
      storage: createJSONStorage(() => AsyncStorage), 
    },
  ),
)
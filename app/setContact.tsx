import { useState } from 'react';
import { View, TextInput, Text, Platform, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useContactStore } from '~/store/contactStore';
import { useRouter } from 'expo-router';
import { Button } from '~/components/Button';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function Modal() {
  const {contacts, addContact, updateContact, removeContact} = useContactStore(state => ({
    contacts: state.contacts,
    addContact: state.addContact,
    updateContact: state.updateContact,
    removeContact: state.removeContact,
  }));
  const [warning, setWarning] = useState('');
  const router = useRouter();

  const { id, name: initialName } = useLocalSearchParams<{ id?: string; name?: string }>();
  const [name, setName] = useState(initialName || '');
  const isEditing = !!id;

  const handleAdd = () => {
    if (name.trim() === '') {
      setWarning('Name cannot be empty');
      return;
    }

    const nameLower = name.trim().toLowerCase();

    // If editing, ignore the current contact's own name in the duplicate check
    const isDuplicate = contacts.some(contact =>
      contact.name.toLowerCase() === nameLower && (!isEditing || contact.id !== id)
    );
  
    if (isDuplicate) {
      setWarning('This name already exists.');
      return;
    }
    
    if (isEditing) {
      updateContact(id, name);
    } else {
      addContact(name);
    }
    setName('');
    setWarning('');
    router.back(); // Close modal
  };

  const handleDelete = () => {
    if (!id) return;
    removeContact(id);
    router.back(); // Close modal
  };

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Edit Contact' : 'Add Contact' }} />
      <View className="flex-1 p-6 bg-white">
        <Text className='text-lg font-semibold mb-2'>Name</Text>
        <TextInput
          className="border border-gray-300 px-4 py-2 mb-2 w-full text-lg rounded"
          placeholder={'Enter name'}
          value={name}
          onChangeText={text => { setName(text); setWarning(''); }}
          autoFocus
        />
        {warning ? (
          <Text className="text-red-500 mb-2">{warning}</Text>
        ) : null}
        <Button title="Save" onPress={handleAdd} className="w-full"/>
        {isEditing && (
          <Pressable onPress={handleDelete} className="w-full items-center p-4">
            <Text className="text-red-500 text-lg">Delete</Text>
          </Pressable>
        )}
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </>
  );
}
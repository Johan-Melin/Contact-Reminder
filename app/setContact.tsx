import { useState } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { StatusBar } from 'expo-status-bar';
import { useContactStore } from '~/store/contactStore';
import { useRouter } from 'expo-router';
import { Button } from '~/components/Button';
import { Stack } from 'expo-router';

export default function Modal() {
  const [name, setName] = useState('');
  const addContact = useContactStore(state => state.addContact);
  const router = useRouter();

  const handleAdd = () => {
    if (name.trim() === '') return;
    addContact(name);
    setName('');
    router.back(); // Close modal
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Add Contact' }} />
      <View className="flex-1 p-6">
        <Text className='text-lg font-semibold mb-2'>Name</Text>
        <TextInput
          className="border border-gray-300 h-12 p-2 mb-4 w-full text-lg rounded text-foreground"
          placeholderClassName='text-gray-400'
          placeholder="Enter name"
          value={name}
          onChangeText={setName}
          autoFocus
          textAlignVertical="center"
        />
        <Button title="Save" onPress={handleAdd} className="w-full"/>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </>
  );
}
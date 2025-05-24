import { useState } from 'react';
import { View, TextInput, Platform, Pressable, SafeAreaView, Switch, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useContactStore } from '~/store/contactStore';
import { useRouter } from 'expo-router';
import { Button as StyledButton } from '~/components/Button';
import { Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { DatePicker } from '~/components/nativewindui/DatePicker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Text } from '~/components/nativewindui/Text';

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
  const isEditing = !!id;
  const editingContact = isEditing ? contacts.find(c => c.id === id) : undefined;
  const [name, setName] = useState(initialName || (editingContact?.name ?? ''));
  const [shouldContact, setShouldContact] = useState(editingContact?.shouldContact ?? false);
  const [date, setDate] = useState<Date | null>(
    editingContact?.lastContact ? new Date(editingContact.lastContact) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(!!date);

  const handleSave = () => {
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
      updateContact(id, name, shouldContact, date ?? undefined);
    } else {
      addContact(name, shouldContact, date ?? undefined);
    }
    setName('');
    setShouldContact(false);
    setWarning('');
    router.back(); // Close modal
  };

  const handleDelete = () => {
    if (!id) return;
    removeContact(id);
    router.back(); // Close modal
  };

  const { showActionSheetWithOptions } = useActionSheet();

  const handleDeleteButtonPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Delete this contact', 'Cancel'],
        cancelButtonIndex: 1,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          handleDelete();
        }
      }
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Edit Contact' : 'Add Contact' }} />
      <SafeAreaView>
        <View className="p-6">
          <Text variant="heading" className="mb-2">Name</Text>
          <TextInput
            className="border border-gray-300 px-4 py-2 mb-2 w-full text-lg rounded text-foreground"
            placeholder={'Enter name'}
            value={name}
            onChangeText={text => { setName(text); setWarning(''); }}
            autoFocus
          />
          {warning ? (
            <Text variant="body" className="text-red-500 mb-2">{warning}</Text>
          ) : null}
          <View className="flex-row items-center mb-4">
            <Switch
              value={shouldContact}
              onValueChange={setShouldContact}
            />
            <Text variant="heading" className="ml-2">Should Contact Soon</Text>
          </View>
          <View className="mb-4">
            <Text variant="heading" className="mb-2">Last Contact</Text>
            {showDatePicker ? (
              <View className="flex-row">
                <DatePicker
                  value={date || new Date()}
                  mode="date"
                  onChange={(ev) => setDate(new Date(ev.nativeEvent.timestamp))}
                />
                <Pressable onPress={() => { setShowDatePicker(false); }} className="justify-center">
                  <Text variant="heading" className="text-blue-500 ml-2">Clear Date</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => {
                setShowDatePicker(true);
                setDate(new Date());
              }}>
                <Text variant="heading" className="text-blue-500">Set Last Contact Date</Text>
              </Pressable>
            )}
          </View>
          <StyledButton title="Save" onPress={handleSave} className="w-full"/>
          {isEditing && (
            <Pressable onPress={handleDeleteButtonPress} className="w-full items-center p-4">
              <Text variant="heading" className="text-red-500">Delete</Text>
            </Pressable>
          )}
          <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        </View>
      </SafeAreaView>
    </>
  );
}
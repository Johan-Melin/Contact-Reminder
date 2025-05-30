import { useState, useRef, useEffect } from 'react';
import { View, TextInput, Platform, Pressable, SafeAreaView, Switch, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useContactStore, ContactType, contactTypes } from '~/store/contactStore';
import { TagBar } from '~/components/TagBar';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';

import { Button as StyledButton } from '~/components/Button';
import { DatePicker } from '~/components/nativewindui/DatePicker';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';

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
  const [contactType, setContactType] = useState<ContactType>(editingContact?.contactType ?? contactTypes[0]);
  const [shouldContact, setShouldContact] = useState(editingContact?.shouldContact ?? false);
  const [date, setDate] = useState<Date | null>(
    editingContact?.lastContact ? new Date(editingContact.lastContact) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(!!date);
  const nameInputRef = useRef<TextInput>(null);

  // Focus the input when the component mounts if not in edit mode
  useEffect(() => {
    if (!isEditing) {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEditing]);

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
      updateContact(id, name, shouldContact, contactType, date ?? undefined);
    } else {
      addContact(name, shouldContact, contactType, date ?? undefined);
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
            ref={nameInputRef}
            className={"border border-border bg-card px-4 py-2 mb-2 w-full text-lg rounded text-foreground"}
            placeholderTextColor="gray"
            placeholder={'Enter name'}
            value={name}
            autoFocus={!isEditing}
            onChangeText={text => { setName(text); setWarning(''); }}
            returnKeyType="done"
            onSubmitEditing={handleSave}
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
                <Pressable onPress={() => { 
                  setDate(null); 
                  setShowDatePicker(false); 
                }} className="justify-center">
                  <Ionicons name="close-circle" size={20} color="#9ca3af" />
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => {
                setShowDatePicker(true);
                setDate(new Date());
              }}>
                <View className="flex-row items-center ml-4">
                  <Text variant="body" className="bg-gray-200 dark:bg-zinc-900 px-4 py-2 rounded">xx/mm/yyyy</Text>
                </View>
              </Pressable>
            )}
          </View>
          <View className="mb-4">
            <Text variant="heading" className="mb-2">Contact Type</Text>
            <TagBar 
              tags={contactTypes}
              selectedTag={contactType.name}
              onSelectTag={setContactType}
            />
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
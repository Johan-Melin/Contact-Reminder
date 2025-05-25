import { View, SectionList, Pressable, SafeAreaView, Image } from 'react-native';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { ContactCard } from '~/components/ContactCard';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useContactStore, contactTypes, type ContactType } from '~/store/contactStore';
import { Text } from '~/components/nativewindui/Text';
import { groupContactsByRecency } from '~/lib/contactUtils';
import { TagBar } from '~/components/TagBar';
import { useState } from 'react';

export default function Contacts() {
  const { contacts } = useContactStore();
  const searchValue = useHeaderSearchBar();
  
  // Get unique contact types that exist in the contacts
  const existingContactTypes = Array.from(
    new Set(contacts.map(c => c.contactType?.name).filter(Boolean))
  );
  
  // Only show tags for existing contact types + 'All' and 'Untagged' if they have contacts
  const allTag = { name: 'All', color: 'transparent' };
  const untaggedTag = { name: 'Untagged', color: 'gray' };
  
  const hasUntagged = contacts.some(c => !c.contactType || c.contactType.name === 'Untagged');  
  
  const availableTags = [
    allTag,
    ...(hasUntagged ? [untaggedTag] : []),
    ...contactTypes.filter(tag => 
      tag.name !== 'Untagged' && existingContactTypes.includes(tag.name)
    )
  ];
  
  const [selectedTag, setSelectedTag] = useState<typeof allTag | ContactType>(allTag);

  // Filter contacts based on search and selected tag
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = searchValue
      ? contact.name.toLowerCase().includes(searchValue.toLowerCase())
      : true;
      
    if (selectedTag.name === 'All') {
      return matchesSearch;
    }
    
    const matchesTag = selectedTag.name === 'Untagged' 
      ? !contact.contactType || contact.contactType.name === 'Untagged'
      : contact.contactType?.name === selectedTag.name;
      
    return matchesSearch && matchesTag;
  });

  // Get grouped and sorted contacts
  const sections = groupContactsByRecency(filteredContacts);
  const hasSearchResults = filteredContacts.length > 0;
  const hasContacts = contacts.length > 0;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
        <TagBar 
          tags={availableTags}
          selectedTag={selectedTag.name}
          onSelectTag={(tag) => setSelectedTag(tag as ContactType)}
        />
        <View className="h-4" />
        {searchValue && !hasSearchResults ? (
          <Text variant="title3">No results for "{searchValue}"</Text>
        ) : null}
        {hasContacts ? (
          <SectionList 
            sections={sections}
            renderItem={({ item }) => (
              <Link href={`/setContact?id=${item.id}&name=${item.name}`} asChild>
                <ContactCard contact={item} />
              </Link>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Text variant="title3">
                {title}:
              </Text>
            )}
            keyExtractor={(item) => item.id}
            SectionSeparatorComponent={() => <View className="h-4" />}
            ItemSeparatorComponent={() => <View className="h-4" />}
          />
        ) : (
          <View className="items-center">
            <Image
              source={require('~/assets/undraw_conversation.webp')}
              className="w-full h-80"
              resizeMode="contain"
            />
            <Text variant="body" className="text-center">
              {selectedTag.name === 'Untagged' 
                ? 'No untagged contacts yet!'
                : `No ${selectedTag.name.toLowerCase()} contacts yet!`}
            </Text>
            <Text variant="body" className="text-center">
              Add friends, family, or colleagues to stay connected!
            </Text>
          </View>
        )}
        <Link href="/setContact" asChild
          className="absolute bottom-8 right-8"
        >
          <Pressable className="bg-primary rounded-full w-16 h-16 items-center justify-center shadow-sm">
            <Ionicons name="add" size={36} color="white" />
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

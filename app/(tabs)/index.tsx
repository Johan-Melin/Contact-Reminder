import { View, SectionList, Pressable, SafeAreaView, Image } from 'react-native';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { ContactCard } from '~/components/ContactCard';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useContactStore, contactTypes, type ContactType } from '~/store/contactStore';
import { Text } from '~/components/nativewindui/Text';
import { groupContactsByRecency } from '~/lib/contactUtils';
import { TagBar } from '~/components/TagBar';
import { useState, useEffect } from 'react';
import { useColorScheme } from '~/lib/useColorScheme';

export default function Contacts() {
  const { contacts } = useContactStore();
  const searchValue = useHeaderSearchBar();
  const { colors } = useColorScheme();
  
  // State for expanded/collapsed sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
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

  const hasSearchResults = filteredContacts.length > 0;
  const hasContacts = contacts.length > 0;
  
  // Get grouped and sorted contacts
  const sections = groupContactsByRecency(filteredContacts);
  
  // Initialize all sections as expanded by default
  useEffect(() => {
    if (sections.length > 0 && Object.keys(expandedSections).length === 0) {
      const initialExpandedState = sections.reduce((acc, section) => ({
        ...acc,
        [section.title]: true
      }), {});
      setExpandedSections(initialExpandedState);
    }
  }, [sections]);
  
  // Filter sections to only show items for expanded sections
  const visibleSections = sections.map(section => ({
    ...section,
    data: expandedSections[section.title] === false ? [] : section.data
  }));
  
  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View className="p-4">
          <TagBar 
            tags={availableTags}
            selectedTag={selectedTag.name}
            onSelectTag={(tag) => setSelectedTag(tag as ContactType)}
          />
        </View>
        <View className="flex-1">
          {searchValue && !hasSearchResults ? (
            <View className="px-4">
              <Text variant="title3">No results for "{searchValue}"</Text>
            </View>
          ) : null}
          {hasContacts ? (
            <SectionList 
              className="px-4"
              stickySectionHeadersEnabled={false}
              sections={visibleSections}
              renderItem={({ item }) => (
              <Link href={`/setContact?id=${item.id}&name=${item.name}`} asChild>
                <ContactCard contact={item} />
              </Link>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <Pressable 
                onPress={() => toggleSection(title)}
                className="flex-row items-center py-2"
              >
                <Text variant="title3" className="flex-1">
                  {title}:
                </Text>
                <Ionicons 
                  name={expandedSections[title] === false ? 'chevron-down' : 'chevron-up'} 
                  size={20} 
                  color={colors.foreground} 
                />
              </Pressable>
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
      </View>
    </SafeAreaView>
  );
}

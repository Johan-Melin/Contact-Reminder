import { View, SectionList, Pressable, SafeAreaView, Image } from 'react-native';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { ContactCard } from '~/components/ContactCard';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useContactStore } from '~/store/contactStore';
import { Text } from '~/components/nativewindui/Text';
import { groupContactsByRecency } from '~/lib/contactUtils';

export default function Contacts() {
  const { contacts } = useContactStore();
  const searchValue = useHeaderSearchBar({ hideWhenScrolling: contacts.length === 0 });

  // Filter contacts based on search
  const filteredContacts = searchValue
    ? contacts.filter((c) => c.name.toLowerCase().includes(searchValue.toLowerCase()))
    : contacts;

  // Get grouped and sorted contacts
  const sections = groupContactsByRecency(filteredContacts);
  const hasSearchResults = filteredContacts.length > 0;
  const hasContacts = contacts.length > 0;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
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
          <View>
            <Image
              source={require('~/assets/undraw_conversation.webp')}
              className="w-full h-80"
              resizeMode="contain"
            />
            <Text variant="body" className="text-center">No contacts yet? Add friends, family, or colleagues to stay connected!</Text>
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
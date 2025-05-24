import { View, SectionList, Pressable, SafeAreaView, Image } from 'react-native';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { ContactCard } from '~/components/ContactCard';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useContactStore } from '~/store/contactStore';
import { Text } from '~/components/nativewindui/Text';

export default function TabOne() {
  const { contacts } = useContactStore();
  const searchValue = useHeaderSearchBar({ hideWhenScrolling: contacts.length === 0 });

  const data = searchValue
    ? contacts.filter((c) => c.name.toLowerCase().includes(searchValue.toLowerCase()))
    : contacts;

    const hasContacts = data.length > 0;

    const sortedContacts = [...data].sort((a, b) => {
      if (a.lastContact && b.lastContact) {
        return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
      }
      if (a.lastContact) return -1;
      if (b.lastContact) return 1;
      return 0;
    });
  
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
  
    const weekContacts = sortedContacts.filter(c =>
      c.lastContact && (now.getTime() - new Date(c.lastContact).getTime()) < oneWeek
    );
    const monthContacts = sortedContacts.filter(c =>
      c.lastContact &&
      (now.getTime() - new Date(c.lastContact).getTime()) >= oneWeek &&
      (now.getTime() - new Date(c.lastContact).getTime()) < oneMonth
    );
    const olderContacts = sortedContacts.filter(c =>
      c.lastContact && (now.getTime() - new Date(c.lastContact).getTime()) >= oneMonth
    );
    const neverContacts = sortedContacts.filter(c => !c.lastContact);
  
    const rawSections = [
      { title: "Contacted last 7 days", data: weekContacts },
      { title: "Contacted last 30 days", data: monthContacts },
      { title: "Older than 30 days", data: olderContacts },
      { title: "No Last Contact Date", data: neverContacts },
    ];
    
    const sections = rawSections.filter(section => section.data.length > 0);  

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-4">
        {hasContacts ? (
        <SectionList 
          sections={sections}
          renderItem={({ item }) => (
            <Link href={`/setContact?id=${item.id}&name=${item.name}`} asChild>
              <ContactCard contact={item} />
            </Link>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text className="text-xl font-bold">
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
            <Text className="text-lg font-semibold mt-4 text-center">No contacts yet? Add friends, family, or colleagues to stay connected!</Text>
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
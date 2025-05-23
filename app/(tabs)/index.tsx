import { View, FlatList, Pressable } from 'react-native';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { ContactCard } from '~/components/ContactCard';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useContactStore } from '~/store/contactStore';

export default function TabOne() {
  const { contacts } = useContactStore();
  const searchValue = useHeaderSearchBar({ hideWhenScrolling: contacts.length === 0 });

  const data = searchValue
    ? contacts.filter((c) => c.name.toLowerCase().includes(searchValue.toLowerCase()))
    : contacts;

  return (
    <View className="flex-1 p-4">
      <FlatList 
        data={data} 
        renderItem={({ item }) => <ContactCard contact={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-4" />}
      />
      <Link href="/setContact" asChild
        className="absolute bottom-8 right-8"
      >
        <Pressable className="bg-primary rounded-full w-16 h-16 items-center justify-center shadow-sm">
          <Ionicons name="add" size={36} color="white" />
        </Pressable>
      </Link>
    </View>
  );
}
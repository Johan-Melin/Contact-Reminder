import { View, FlatList } from 'react-native';
import { useHeaderSearchBar } from '~/lib/useHeaderSearchBar';
import { ContactCard } from '~/components/ContactCard';

export interface Contact {
  id: string;
  name: string;
}

export default function TabOne() {
  const contacts: Contact[] = [{ id: "1", name: 'Adam' }, { id: "2", name: 'Eve' }];
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
    </View>
  );
}
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Pressable } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

type Tag = {
  name: string;
  color: string;
};

type TagBarProps = {
  tags: Tag[];
  selectedTag: string;
  onSelectTag: (tag: Tag) => void;
};

export function TagBar({ tags, selectedTag, onSelectTag }: TagBarProps) {
  const { colors } = useColorScheme();

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ 
        paddingHorizontal: 4,
        gap: 8, 
      }}
    >
      {tags.map(tag => {
        const isSelected = selectedTag === tag.name;
        return (
          <Pressable 
            key={tag.name} 
            onPress={() => onSelectTag(tag)}
          >
            <View className="rounded-full px-4 py-2 bg-card">
              <Text 
                variant="heading"
                style={{
                  color: isSelected ? colors.primary : colors.foreground,
                }}
              >
                {tag.name}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
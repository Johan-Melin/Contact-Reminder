import React, { JSX } from 'react';
import { ScrollView, View, Pressable } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';

function Card({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  return (
    <View className="rounded-xl border border-border bg-card p-2 px-4 shadow-sm shadow-black/10 dark:shadow-none">
      {items.map((child, idx) => (
        <React.Fragment key={idx}>
          {child}
          {idx < items.length - 1 && (
            <View className="border-b border-border my-1" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

export default function SettingsScreen(): JSX.Element {
  const { colorScheme, setColorScheme, colors } = useColorScheme();

  const options = [
    { key: 'light', icon: 'sunny-outline', label: 'Light' },
    { key: 'dark', icon: 'moon-outline', label: 'Dark' },
  ];

  return (
    <ScrollView className="flex-1 p-4">
      <Text variant="heading">Theme</Text>
      <Card>
        {options.map(option => (
          <Pressable
            key={option.key}
            onPress={() => setColorScheme(option.key as 'dark' | 'light' | 'dark')}
            className="flex-row items-center py-2"
          >
            <Ionicons
              name={option.icon as any}
              size={24}
              style={{ marginRight: 12 }}
              color={colorScheme === option.key ? '#6366F1' : colors.grey}
            />
            <Text className="flex-1" variant="body">{option.label}</Text>
            <Ionicons
              name={colorScheme === option.key ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={colorScheme === option.key ? '#6366F1' : colors.grey}
            />
          </Pressable>
        ))}
      </Card>
    </ScrollView>
  );
}


import React, { JSX } from 'react';
import { ScrollView, View, Pressable, SafeAreaView } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '~/lib/useColorScheme';
import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useThemeStore, Theme } from '~/store/themeStore';
import { cardContainer } from '~/styles/common';
import * as Application from 'expo-application';

function Card({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  return (
    <SafeAreaView>
      <View className={cardContainer}>
        {items.map((child, idx) => (
          <React.Fragment key={idx}>
            {child}
            {idx < items.length - 1 && (
              <View className="border-b border-border my-1" />
            )}
          </React.Fragment>
        ))}
    </View>
    </SafeAreaView>
  );
}

export default function SettingsScreen(): JSX.Element {
  const appVersion = Application.nativeApplicationVersion; 
  const { colorScheme, setColorScheme } = useColorScheme();
  const { colorScheme: nativeWindColorScheme, setColorScheme: setNativeWindColorScheme } = useNativewindColorScheme();
  const { theme, setTheme } = useThemeStore();
  const handlePress = (key: Theme) => {
    setTheme(key);
    setNativeWindColorScheme(key);
    if(key === 'light' || key === 'dark'){
      setColorScheme(key);
    }
  };
  type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

  const options: { key: Theme; icon: IoniconName; label: string }[] = [
    { key: 'system', icon: 'contrast', label: 'System' },
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
            onPress={() => handlePress(option.key)}
            className="flex-row items-center py-2"
          >
            <Ionicons
              name={option.icon as IoniconName}
              size={24}
              style={{ marginRight: 12 }}
              color={theme === option.key ? '#6366F1' : 'gray'}
            />
            <Text className="flex-1" variant="body">{option.label}</Text>
            <Ionicons
              name={theme === option.key ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={theme  === option.key ? '#6366F1' : 'gray'}
            />
          </Pressable>
        ))}
      </Card>
      <View className="flex-1 items-center justify-center mt-4">
        <Text variant="body" className="text-center text-muted-foreground text-sm">Version: {appVersion}</Text>
      </View>
    </ScrollView>
  );
}


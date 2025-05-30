import React, { JSX, useEffect } from 'react';
import { ScrollView, View, Pressable, SafeAreaView, Alert } from 'react-native';
import { Text } from '~/components/nativewindui/Text';
import { Toggle } from '~/components/nativewindui/Toggle';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useThemeStore, Theme } from '~/store/themeStore';
import { useNotificationStore, type NotificationFrequency } from '~/store/notificationStore';
import { cardContainer } from '~/styles/common';
import { testNotification } from '~/lib/localNotification';

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
  const { setColorScheme } = useColorScheme();
  const { theme, setTheme } = useThemeStore();
  
  const handlePress = (key: Theme) => {
    setTheme(key);
    setColorScheme(key);
  };

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const { frequency, setFrequency } = useNotificationStore();

  const handleTestNotification = async (enabled: boolean) => {
    const success = await testNotification(enabled);
    if (success) {
      setNotificationsEnabled(enabled);
    } else {
      // If there was an error, revert the toggle
      setNotificationsEnabled(!enabled);
    }
  };

  const handleFrequencyChange = (newFrequency: NotificationFrequency) => {
    setFrequency(newFrequency);
    // If notifications are enabled, update the schedule with new frequency
    if (notificationsEnabled) {
      testNotification(true);
    }
  };

  // Initialize the toggle state
  React.useEffect(() => {
    // Check if notifications are already scheduled
    // For now, we'll default to false
    setNotificationsEnabled(false);
  }, []);

  type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

  const options: { key: Theme; icon: IoniconName; label: string }[] = [
    { key: 'system', icon: 'contrast', label: 'System' },
    { key: 'light', icon: 'sunny-outline', label: 'Light' },
    { key: 'dark', icon: 'moon-outline', label: 'Dark' },
  ];

  return (
    <ScrollView className="flex-1 p-4">
      <Text variant="heading" className="mb-2">Theme</Text>
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

      <Text variant="heading" className="mt-8 mb-2">Notifications</Text>
      <Card>
        <View className="flex-row items-center justify-between py-4">
          <View className="flex-row items-center">
            <Ionicons
              name="notifications-outline"
              size={24}
              style={{ marginRight: 12 }}
              color={notificationsEnabled ? '#6366F1' : 'gray'}
            />
            <Text variant="body">Enable Notifications</Text>
          </View>
          <Toggle
            value={notificationsEnabled}
            onValueChange={(value) => handleTestNotification(value)}
          />
        </View>
        
        {/* Notification Frequency Options */}
        <View>
          <Pressable
            disabled={!notificationsEnabled}
            onPress={() => handleFrequencyChange('daily')}
            className={`flex-row items-center py-3 px-4 ${!notificationsEnabled ? 'opacity-50' : ''}`}
          >
            <Ionicons
              name={frequency === 'daily' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={!notificationsEnabled ? 'gray' : frequency === 'daily' ? '#6366F1' : 'gray'}
              style={{ marginRight: 12 }}
            />
            <Text variant="body" className={!notificationsEnabled ? 'text-gray-400' : ''}>
              Daily Reminders
            </Text>
          </Pressable>
          <Pressable
            disabled={!notificationsEnabled}
            onPress={() => handleFrequencyChange('weekly')}
            className={`flex-row items-center py-3 px-4 ${!notificationsEnabled ? 'opacity-50' : ''}`}
          >
            <Ionicons
              name={frequency === 'weekly' ? 'radio-button-on' : 'radio-button-off'}
              size={22}
              color={!notificationsEnabled ? 'gray' : frequency === 'weekly' ? '#6366F1' : 'gray'}
              style={{ marginRight: 12 }}
            />
            <Text variant="body" className={!notificationsEnabled ? 'text-gray-400' : ''}>
              Weekly Reminders
            </Text>
          </Pressable>
        </View>
      </Card>
    </ScrollView>
  );
}


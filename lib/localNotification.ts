import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    // @ts-ignore - these are valid properties but not in the type definition
    shouldShowBanner: true,
    // @ts-ignore
    shouldShowList: true,
  }),
});

// Set the notification channel for Android
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

export async function scheduleContactReminder() {
  try {
    // Request permissions (required for iOS)
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '👋 Contact Reminder',
        body: `Check in with your contacts`,
        sound: true,
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 60, 
        repeats: true 
    },
    });

    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

export async function testNotification() {
  return await scheduleContactReminder();
}

// For testing notifications when the app is in the background
// This would typically be called when the app starts
export function registerForPushNotifications() {
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('Notification response received:', response);
  });

  const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  // Return cleanup function
  return () => {
    responseSubscription.remove();
    receivedSubscription.remove();
  };
}

// Clear all scheduled notifications
export async function cancelAllScheduledNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}
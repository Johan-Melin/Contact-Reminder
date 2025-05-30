import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useNotificationStore } from '~/store/notificationStore';

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

// Track scheduled notification IDs
let scheduledNotificationIds: string[] = [];

export async function scheduleContactReminder() {
  try {
    // Request permissions (required for iOS)
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Get the selected frequency
    const { frequency } = useNotificationStore.getState();
    
    // Calculate trigger time
    const triggerSeconds = frequency === 'daily' 
      ? 24 * 60 * 60 // 24 hours in seconds
      : 7 * 24 * 60 * 60; // 1 week in seconds

    // Cancel any existing notifications
    await cancelAllScheduledNotifications();

    // Schedule new notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '👋 Contact Reminder',
        body: frequency === 'daily' 
          ? 'Daily check-in: Time to reach out to your contacts!' 
          : 'Weekly check-in: Time to catch up with your contacts!',
        sound: true,
      },
      trigger: { 
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: triggerSeconds,
        repeats: true 
      },
    });

    // Store the notification ID
    scheduledNotificationIds.push(notificationId);
    return true;
  } catch (error) {
    console.error('Error scheduling notification:', error);
    return false;
  }
}

export async function cancelAllScheduledNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    scheduledNotificationIds = [];
    return true;
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    return false;
  }
}

export async function testNotification(enable: boolean) {
  if (enable) {
    return await scheduleContactReminder();
  } else {
    return await cancelAllScheduledNotifications();
  }
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

// Get all scheduled notifications
export async function getAllScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getDailyTips } from '../firebase/services';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<boolean> {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }
  return true;
}

export async function scheduleDailyTipNotification() {
  await cancelAllNotifications(); // Cancel previous notifications to avoid duplicates

  const tips = await getDailyTips();
  if (tips.length === 0) {
    console.log("No tips available to schedule notification.");
    return;
  }

  const tip = tips[Math.floor(Math.random() * tips.length)];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✨ Consejo del Día",
      body: tip,
    },
    trigger: {
      seconds: 5, // Disparador temporal para pruebas
    },
  });
  console.log('Notificación diaria programada para las 9:00 AM.');
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('All scheduled notifications cancelled.');
}

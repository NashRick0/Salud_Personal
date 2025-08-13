import React, { useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    scheduleDailyTipNotification,
    registerForPushNotificationsAsync
} from './src/services/notificationService';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const notificationsEnabled = await AsyncStorage.getItem('notificationsEnabled');
        if (JSON.parse(notificationsEnabled || 'false')) {
          const permissionGranted = await registerForPushNotificationsAsync();
          if (permissionGranted) {
            await scheduleDailyTipNotification();
            console.log('Daily notifications re-scheduled on app start.');
          }
        }
      } catch (error) {
        console.error('Failed to initialize app settings:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <DataProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </DataProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

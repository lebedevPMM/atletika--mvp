import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { QueryProvider } from '@/shared/providers/QueryProvider';

// SplashScreen — only on native
if (Platform.OS !== 'web') {
  const SplashScreen = require('expo-splash-screen');
  SplashScreen.preventAutoHideAsync();
}

// Start MSW in dev (native only — web production has no mock server)
if (__DEV__ && Platform.OS !== 'web') {
  require('@/mocks/setup').server.listen({ onUnhandledRequest: 'bypass' });
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const SplashScreen = require('expo-splash-screen');
      SplashScreen.hideAsync();
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <QueryProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(client)" />
            <Stack.Screen name="(trainer)" />
          </Stack>
        </QueryProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

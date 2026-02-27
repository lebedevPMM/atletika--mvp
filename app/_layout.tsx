import { useEffect, useState } from 'react';
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

// Start MSW in dev on native
if (__DEV__ && Platform.OS !== 'web') {
  require('@/mocks/setup').server.listen({ onUnhandledRequest: 'bypass' });
}

export default function RootLayout() {
  const [mswReady, setMswReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const SplashScreen = require('expo-splash-screen');
      SplashScreen.hideAsync();
    }
    // Start MSW worker on web (for demo with mock data)
    if (Platform.OS === 'web') {
      const { createMockServer } = require('@/mocks/setup');
      const worker = createMockServer();
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => setMswReady(true));
    }
  }, []);

  if (!mswReady) return null;

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

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { QueryProvider } from '@/shared/providers/QueryProvider';

SplashScreen.preventAutoHideAsync();

// Start MSW in dev
if (__DEV__) {
  require('@/mocks/setup').server.listen({ onUnhandledRequest: 'bypass' });
}

export default function RootLayout() {
  useEffect(() => {
    // TODO: Load fonts here, then hide splash
    SplashScreen.hideAsync();
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

import type { AnalyticsEvent } from './events';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

export const analytics = {
  track: (event: AnalyticsEvent) => {
    // MVP1: console-only. Production: Amplitude / Mixpanel
    if (__DEV__) {
      console.log('[Analytics]', event.name, event.params);
    }
  },
  screenView: (screen: string, params?: Record<string, string>) => {
    analytics.track({ name: 'screen_view', params: { screen, ...params } });
  },
};

export function useScreenView(screen: string) {
  useFocusEffect(
    useCallback(() => {
      analytics.screenView(screen);
    }, [screen]),
  );
}

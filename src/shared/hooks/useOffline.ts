import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useUIStore } from '@/shared/stores/uiStore';

export function useOffline(): boolean {
  const [isOffline, setIsOffline] = useState(false);
  const setGlobalOffline = useUIStore((s) => s.setOffline);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected;
      setIsOffline(offline);
      setGlobalOffline(offline);
    });
    return unsubscribe;
  }, [setGlobalOffline]);

  return isOffline;
}

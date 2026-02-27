import { Platform } from 'react-native';
import { handlers } from './handlers';

// Native: setupServer (interceptor-based)
// Web: setupWorker (ServiceWorker-based)
export function createMockServer() {
  if (Platform.OS === 'web') {
    const { setupWorker } = require('msw/browser');
    return setupWorker(...handlers);
  }
  const { setupServer } = require('msw/native');
  return setupServer(...handlers);
}

// For backwards compat with native dev usage
export const server = Platform.OS !== 'web'
  ? (() => { const { setupServer } = require('msw/native'); return setupServer(...handlers); })()
  : (undefined as any);

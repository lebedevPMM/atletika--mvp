jest.mock('@/shared/lib/storage', () => require('@/__mocks__/storage'));
jest.mock('@/shared/lib/secureStorage', () => require('@/__mocks__/secureStorage'));

import { useAuthStore } from '../store';
import { resetMockStorage } from '@/__mocks__/storage';
import { resetMockSecureStorage } from '@/__mocks__/secureStorage';
import type { AuthUser } from '../types';

const mockUser: AuthUser = {
  id: 'u1',
  phone: '+79001112233',
  role: 'client',
  firstName: 'Test',
  lastName: 'User',
};

beforeEach(() => {
  // Reset Zustand store to initial state
  useAuthStore.setState({
    accessToken: null,
    user: null,
    isAuthenticated: false,
    firstLogin: false,
    docsUpdated: false,
  });
  resetMockStorage();
  resetMockSecureStorage();
});

describe('useAuthStore', () => {
  it('has correct initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.firstLogin).toBe(false);
    expect(state.docsUpdated).toBe(false);
  });

  it('setAuth sets token, user, and isAuthenticated', async () => {
    await useAuthStore.getState().setAuth('access-tok', 'refresh-tok', mockUser);
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('access-tok');
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('logout clears everything', async () => {
    await useAuthStore.getState().setAuth('access-tok', 'refresh-tok', mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    await useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.firstLogin).toBe(false);
    expect(state.docsUpdated).toBe(false);
  });

  it('setFirstLogin updates firstLogin flag', () => {
    useAuthStore.getState().setFirstLogin(true);
    expect(useAuthStore.getState().firstLogin).toBe(true);

    useAuthStore.getState().setFirstLogin(false);
    expect(useAuthStore.getState().firstLogin).toBe(false);
  });

  it('setDocsUpdated updates docsUpdated flag', () => {
    useAuthStore.getState().setDocsUpdated(true);
    expect(useAuthStore.getState().docsUpdated).toBe(true);

    useAuthStore.getState().setDocsUpdated(false);
    expect(useAuthStore.getState().docsUpdated).toBe(false);
  });
});

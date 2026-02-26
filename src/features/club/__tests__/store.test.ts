jest.mock('@/shared/lib/storage', () => require('@/__mocks__/storage'));
jest.mock('@/shared/lib/secureStorage', () => require('@/__mocks__/secureStorage'));

import { useClubStore } from '../store';
import { resetMockStorage } from '@/__mocks__/storage';
import type { ClubConfig } from '../types';

const mockConfig: ClubConfig = {
  spaEnabled: true,
  eventsEnabled: false,
  chatEnabled: true,
  freezeEnabled: false,
  cancelPolicyMinutes: 120,
  maxBookingsPerDay: 3,
};

beforeEach(() => {
  useClubStore.setState({
    clubId: null,
    branchId: null,
    clubName: null,
    config: null,
  });
  resetMockStorage();
});

describe('useClubStore', () => {
  it('has correct initial state', () => {
    const state = useClubStore.getState();
    expect(state.clubId).toBeNull();
    expect(state.branchId).toBeNull();
    expect(state.clubName).toBeNull();
    expect(state.config).toBeNull();
  });

  it('setClub sets clubId, branchId, and clubName', () => {
    useClubStore.getState().setClub('club-1', 'branch-1', 'Atletika+');
    const state = useClubStore.getState();
    expect(state.clubId).toBe('club-1');
    expect(state.branchId).toBe('branch-1');
    expect(state.clubName).toBe('Atletika+');
  });

  it('setConfig sets config', () => {
    useClubStore.getState().setConfig(mockConfig);
    expect(useClubStore.getState().config).toEqual(mockConfig);
  });

  it('reset clears everything', () => {
    useClubStore.getState().setClub('club-1', 'branch-1', 'Atletika+');
    useClubStore.getState().setConfig(mockConfig);

    useClubStore.getState().reset();
    const state = useClubStore.getState();
    expect(state.clubId).toBeNull();
    expect(state.branchId).toBeNull();
    expect(state.clubName).toBeNull();
    expect(state.config).toBeNull();
  });
});

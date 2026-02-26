import { api } from '@/shared/api/client';
import type { Club, ClubConfig } from './types';

export const clubApi = {
  getMyClubs: () => api.get<Club[]>('me/clubs'),
  selectClub: (clubId: string, branchId: string) =>
    api.post<void>('me/club-context', { clubId, branchId }),
  getConfig: () => api.get<ClubConfig>('club/config'),
};

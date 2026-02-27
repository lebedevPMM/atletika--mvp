import { api } from '@/shared/api/client';
import type { Membership, FreezeRules, FreezeRecord, FreezeRequest } from './types';

export const membershipApi = {
  getMembership: () => api.get<Membership>('me/membership'),
  getFreezeRules: () => api.get<FreezeRules>('me/membership/freeze-rules'),
  getFreezeHistory: () => api.get<FreezeRecord[]>('me/membership/freeze-history'),
  requestFreeze: (data: FreezeRequest) => api.post<void>('me/membership/freeze', data),
  cancelFreeze: (freezeId: string) => api.delete<void>(`me/membership/freeze/${freezeId}`),
};

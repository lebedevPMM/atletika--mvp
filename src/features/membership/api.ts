import { api } from '@/shared/api/client';
import type { Membership } from './types';

export const membershipApi = {
  getMembership: () => api.get<Membership>('me/membership'),
};

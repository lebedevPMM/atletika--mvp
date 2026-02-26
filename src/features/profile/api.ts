import { api } from '@/shared/api/client';
import type { UserProfile } from './types';

export const profileApi = {
  getProfile: () => api.get<UserProfile>('me/profile'),
  updateProfile: (data: Partial<UserProfile>) => api.patch<UserProfile>('me/profile', data),
};

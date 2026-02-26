import type { UserProfile } from '@/features/profile/types';

export const MOCK_PROFILE: UserProfile = {
  id: 'user-001',
  firstName: 'Иван',
  lastName: 'Петров',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  birthDate: '1990-05-15',
  avatarUrl: null,
  memberSince: '2024-01-15T00:00:00Z',
};

import type { AuthUser } from '@/features/auth/types';

export const MOCK_CLIENT: AuthUser = {
  id: 'usr-001',
  phone: '+79991234567',
  role: 'client',
  firstName: 'Alexey',
  lastName: 'Ivanov',
  avatarUrl: undefined,
};

export const MOCK_TRAINER: AuthUser = {
  id: 'usr-100',
  phone: '+79997654321',
  role: 'trainer',
  firstName: 'Igor',
  lastName: 'Smirnov',
  avatarUrl: undefined,
};

export const MOCK_CLUBS = [
  { id: 'club-001', name: 'Atletika+ Central', branchId: 'branch-001' },
];

export const VALID_OTP = '1234';

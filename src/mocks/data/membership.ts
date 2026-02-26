import type { Membership } from '@/features/membership/types';

export const MOCK_MEMBERSHIP: Membership = {
  id: 'mem-001',
  planName: 'Премиум',
  status: 'active',
  startDate: new Date(Date.now() - 60 * 86400000).toISOString(),
  endDate: new Date(Date.now() + 25 * 86400000).toISOString(),
  daysLeft: 25,
  visitsLeft: null, // unlimited
  visitsTotal: null,
  ptSessionsLeft: 3,
  ptSessionsTotal: 8,
  freezeAvailable: true,
  freezeDaysLeft: 14,
  debtFlag: false,
  accessZones: ['Тренажёрный зал', 'Бассейн', 'Групповые', 'СПА'],
};

import { http, HttpResponse, delay } from 'msw';
import type { ClubConfig } from '@/features/club/types';

const MOCK_CLUB_LIST = [
  {
    id: 'club-001',
    name: 'Атлетика+ Центральный',
    address: 'ул. Центральная, 10',
    logoUrl: undefined,
    branches: [
      { id: 'branch-001', name: 'Основной зал', address: 'ул. Центральная, 10' },
    ],
  },
];

const MOCK_CONFIG: ClubConfig = {
  spaEnabled: true,
  eventsEnabled: true,
  chatEnabled: true,
  freezeEnabled: true,
  cancelPolicyMinutes: 120,
  maxBookingsPerDay: 3,
};

export const clubHandlers = [
  http.get('*/me/clubs', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_CLUB_LIST);
  }),

  http.post('*/me/club-context', async () => {
    await delay(200);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get('*/club/config', async () => {
    await delay(400);
    return HttpResponse.json(MOCK_CONFIG);
  }),
];

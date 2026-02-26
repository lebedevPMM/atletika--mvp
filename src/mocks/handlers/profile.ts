import { http, HttpResponse, delay } from 'msw';
import { MOCK_PROFILE } from '../data/profile';
import type { UserProfile } from '@/features/profile/types';

let currentProfile = { ...MOCK_PROFILE };

export const profileHandlers = [
  http.get('*/me/profile', async () => {
    await delay(400);
    return HttpResponse.json(currentProfile);
  }),

  http.patch('*/me/profile', async ({ request }) => {
    await delay(300);
    const updates = (await request.json()) as Partial<UserProfile>;
    currentProfile = { ...currentProfile, ...updates };
    return HttpResponse.json(currentProfile);
  }),
];

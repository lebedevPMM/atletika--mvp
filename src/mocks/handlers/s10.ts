import { http, HttpResponse } from 'msw';
import {
  MOCK_TRAINER_PROFILE,
  MOCK_CLIENT_PLAN,
  MOCK_DAY_SUMMARY,
  MOCK_CLIENT_PROGRESS,
  MOCK_TRAINER_NOTIFICATIONS,
  MOCK_REVIEWS,
  MOCK_ACHIEVEMENTS,
  MOCK_WORKOUT_PLAN,
} from '../data/s10';

export const s10Handlers = [
  // Trainer profile
  http.get('*/trainer/me', () => HttpResponse.json(MOCK_TRAINER_PROFILE)),
  http.post('*/trainer/me', () => HttpResponse.json(MOCK_TRAINER_PROFILE)),

  // Client plan
  http.get('*/trainer/clients/:clientId/plan', () => HttpResponse.json(MOCK_CLIENT_PLAN)),

  // Day summary
  http.get('*/trainer/day-summary', () => HttpResponse.json(MOCK_DAY_SUMMARY)),

  // End shift
  http.post('*/trainer/shift/end', () => HttpResponse.json({ success: true })),

  // Client progress
  http.get('*/trainer/clients/:clientId/progress', () => HttpResponse.json(MOCK_CLIENT_PROGRESS)),

  // Trainer notifications
  http.get('*/trainer/notifications', () => HttpResponse.json(MOCK_TRAINER_NOTIFICATIONS)),
  http.post('*/trainer/notifications/read-all', () => HttpResponse.json({ success: true })),

  // Reviews
  http.get('*/reviews', () => HttpResponse.json(MOCK_REVIEWS)),
  http.post('*/reviews', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      id: 'new-review',
      authorName: 'Вы',
      ...body,
      date: new Date().toISOString(),
    });
  }),

  // Achievements
  http.get('*/me/achievements', () => HttpResponse.json(MOCK_ACHIEVEMENTS)),

  // Workout
  http.get('*/bookings/:bookingId/workout-plan', () => HttpResponse.json(MOCK_WORKOUT_PLAN)),
  http.post('*/bookings/:bookingId/workout-log', () => HttpResponse.json({ success: true })),
];

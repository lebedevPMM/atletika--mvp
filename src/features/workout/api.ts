import { api } from '@/shared/api/client';
import type { WorkoutPlan, WorkoutLog } from './types';

export const workoutApi = {
  getPlan: (bookingId: string) =>
    api.get<WorkoutPlan>('bookings/' + bookingId + '/workout-plan'),

  saveLog: (data: WorkoutLog) =>
    api.post<void>('bookings/' + data.bookingId + '/workout-log', data),
};

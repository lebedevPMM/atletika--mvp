import { api } from '@/shared/api/client';
import type { TrainerDayOverview, TrainerSession, TrainerClient } from './types';

export const trainerApi = {
  getDayOverview: (date?: string) =>
    api.get<TrainerDayOverview>('trainer/day-overview', date ? { date } : undefined),

  getSchedule: (from: string, to: string) =>
    api.get<TrainerSession[]>('trainer/schedule', { from, to }),

  getSession: (sessionId: string) =>
    api.get<TrainerSession>('trainer/sessions/' + sessionId),

  getClients: () =>
    api.get<TrainerClient[]>('trainer/clients'),

  getClient: (clientId: string) =>
    api.get<TrainerClient>('trainer/clients/' + clientId),

  markAttendance: (sessionId: string) =>
    api.post<TrainerSession>('trainer/sessions/' + sessionId + '/attend'),

  cancelSession: (sessionId: string) =>
    api.post<TrainerSession>('trainer/sessions/' + sessionId + '/cancel'),
};

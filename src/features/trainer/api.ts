import { api } from '@/shared/api/client';
import type { TrainerDayOverview, TrainerSession, TrainerClient, TrainerProfile, TrainerClientPlan, TrainerDaySummary, TrainerClientProgress, TrainerNotification } from './types';

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

  getProfile: () =>
    api.get<TrainerProfile>('trainer/me'),

  updateProfile: (data: Partial<TrainerProfile>) =>
    api.post<TrainerProfile>('trainer/me', data),

  getClientPlan: (clientId: string) =>
    api.get<TrainerClientPlan>('trainer/clients/' + clientId + '/plan'),

  getDaySummary: (date?: string) =>
    api.get<TrainerDaySummary>('trainer/day-summary', date ? { date } : undefined),

  endShift: (data: { date: string; notes?: string }) =>
    api.post<void>('trainer/shift/end', data),

  getClientProgress: (clientId: string) =>
    api.get<TrainerClientProgress>('trainer/clients/' + clientId + '/progress'),

  getNotifications: () =>
    api.get<TrainerNotification[]>('trainer/notifications'),

  readAllNotifications: () =>
    api.post<void>('trainer/notifications/read-all'),
};

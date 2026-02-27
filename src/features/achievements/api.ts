import { api } from '@/shared/api/client';
import type { AchievementsSummary } from './types';

export const achievementsApi = {
  getAchievements: () =>
    api.get<AchievementsSummary>('me/achievements'),
};

import { api } from '@/shared/api/client';
import type { BonusBalance, BonusTransaction } from './types';

export const loyaltyApi = {
  getBalance: () => api.get<BonusBalance>('loyalty/balance'),
  getHistory: () => api.get<BonusTransaction[]>('loyalty/history'),
};

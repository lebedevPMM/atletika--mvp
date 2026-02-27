import { useQuery } from '@tanstack/react-query';
import { loyaltyApi } from './api';

export function useBonusBalance() {
  return useQuery({
    queryKey: ['loyalty', 'balance'],
    queryFn: () => loyaltyApi.getBalance(),
  });
}

export function useBonusHistory() {
  return useQuery({
    queryKey: ['loyalty', 'history'],
    queryFn: () => loyaltyApi.getHistory(),
  });
}

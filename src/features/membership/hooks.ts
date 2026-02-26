import { useQuery } from '@tanstack/react-query';
import { membershipApi } from './api';

export function useMembership() {
  return useQuery({
    queryKey: ['membership'],
    queryFn: () => membershipApi.getMembership(),
  });
}

import { useQuery } from '@tanstack/react-query';
import { qrApi } from './api';
import { useMembership } from '@/features/membership/hooks';

export function useQRPass() {
  const { data: membership } = useMembership();
  const isActive = membership?.status === 'active';

  return useQuery({
    queryKey: ['qr-pass'],
    queryFn: () => qrApi.getPass(),
    refetchInterval: 30_000, // auto-refresh every 30s for security
    enabled: isActive,
  });
}

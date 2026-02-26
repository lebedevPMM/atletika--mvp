import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

export interface DashboardData {
  nextBooking: {
    id: string;
    title: string;
    date: string;
    time: string;
    trainer: string;
    room: string;
  } | null;
  membership: {
    name: string;
    validUntil: string;
    remainingVisits: number;
    totalVisits: number;
  } | null;
  billing: {
    openInvoices: number;
    totalDue: number;
    currency: string;
  } | null;
  bonus: {
    balance: number;
    level: string;
    nextLevel: string;
    pointsToNext: number;
  } | null;
  promos: Array<{
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
  }>;
}

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('home/dashboard'),
    staleTime: 60_000,
  });
}

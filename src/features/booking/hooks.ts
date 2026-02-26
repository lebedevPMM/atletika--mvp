import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from './api';
import type { BookingRequest } from './types';
import { analytics } from '@/features/analytics/tracker';

export function useSchedule(params: { date?: string; serviceType?: string; trainerId?: string }) {
  return useQuery({
    queryKey: ['schedule', params],
    queryFn: () => bookingApi.getSchedule(params),
    staleTime: 30_000,
  });
}

export function useSlot(slotId: string) {
  return useQuery({
    queryKey: ['slot', slotId],
    queryFn: () => bookingApi.getSlot(slotId),
    enabled: !!slotId,
  });
}

export function useMyBookings(status?: string) {
  return useQuery({
    queryKey: ['bookings', { status }],
    queryFn: () => bookingApi.getMyBookings(status ? { status } : undefined),
  });
}

export function useBooking(bookingId: string) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getBooking(bookingId),
    enabled: !!bookingId,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingRequest) => bookingApi.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      analytics.track({
        name: 'booking_create_result',
        params: { success: true },
      });
    },
    onError: (error: Error) => {
      analytics.track({
        name: 'booking_create_result',
        params: { success: false, reason: error.message },
      });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      bookingApi.cancelBooking(bookingId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

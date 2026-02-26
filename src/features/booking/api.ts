import { api } from '@/shared/api/client';
import type { ScheduleSlot, Booking, BookingRequest } from './types';

export const bookingApi = {
  getSchedule: (params: { date?: string; serviceType?: string; trainerId?: string }) =>
    api.get<ScheduleSlot[]>('schedule', params),

  getSlot: (slotId: string) =>
    api.get<ScheduleSlot>(`schedule/${slotId}`),

  getMyBookings: (params?: { status?: string }) =>
    api.get<Booking[]>('bookings', params),

  getBooking: (bookingId: string) =>
    api.get<Booking>(`bookings/${bookingId}`),

  createBooking: (data: BookingRequest) =>
    api.post<Booking>('bookings', data),

  cancelBooking: (bookingId: string, reason?: string) =>
    api.post<void>(`bookings/${bookingId}/cancel`, { reason }),
};

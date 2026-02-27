import { api } from '@/shared/api/client';
import { bookingApi } from '../api';

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

describe('bookingApi', () => {
  beforeEach(() => jest.clearAllMocks());

  // --- GET endpoints ---

  describe('getSchedule', () => {
    it('calls schedule with all params', async () => {
      const params = { date: '2026-03-01', serviceType: 'group', trainerId: 'tr-1' };
      await bookingApi.getSchedule(params);
      expect(mockGet).toHaveBeenCalledWith('schedule', params);
    });

    it('calls schedule with partial params', async () => {
      const params = { date: '2026-03-01' };
      await bookingApi.getSchedule(params);
      expect(mockGet).toHaveBeenCalledWith('schedule', params);
    });

    it('calls schedule with empty params', async () => {
      await bookingApi.getSchedule({});
      expect(mockGet).toHaveBeenCalledWith('schedule', {});
    });
  });

  describe('getSlot', () => {
    it('calls schedule/:slotId', async () => {
      await bookingApi.getSlot('slot-99');
      expect(mockGet).toHaveBeenCalledWith('schedule/slot-99');
    });
  });

  describe('getMyBookings', () => {
    it('calls bookings without params', async () => {
      await bookingApi.getMyBookings();
      expect(mockGet).toHaveBeenCalledWith('bookings', undefined);
    });

    it('calls bookings with status filter', async () => {
      await bookingApi.getMyBookings({ status: 'confirmed' });
      expect(mockGet).toHaveBeenCalledWith('bookings', { status: 'confirmed' });
    });
  });

  describe('getBooking', () => {
    it('calls bookings/:id', async () => {
      await bookingApi.getBooking('book-42');
      expect(mockGet).toHaveBeenCalledWith('bookings/book-42');
    });
  });

  // --- POST endpoints ---

  describe('createBooking', () => {
    it('calls POST bookings with booking request data', async () => {
      const data = { slotId: 'slot-1', serviceType: 'group' };
      await bookingApi.createBooking(data as any);
      expect(mockPost).toHaveBeenCalledWith('bookings', data);
    });
  });

  describe('cancelBooking', () => {
    it('calls POST bookings/:id/cancel with reason', async () => {
      await bookingApi.cancelBooking('book-42', 'Changed plans');
      expect(mockPost).toHaveBeenCalledWith('bookings/book-42/cancel', { reason: 'Changed plans' });
    });

    it('calls POST bookings/:id/cancel without reason', async () => {
      await bookingApi.cancelBooking('book-42');
      expect(mockPost).toHaveBeenCalledWith('bookings/book-42/cancel', { reason: undefined });
    });
  });

  describe('rescheduleBooking', () => {
    it('calls POST bookings/:id/reschedule with new slot id', async () => {
      await bookingApi.rescheduleBooking('book-42', 'slot-new');
      expect(mockPost).toHaveBeenCalledWith('bookings/book-42/reschedule', { newSlotId: 'slot-new' });
    });
  });
});

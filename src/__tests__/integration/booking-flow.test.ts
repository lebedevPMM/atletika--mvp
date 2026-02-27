/**
 * Integration test: Booking Flow
 *
 * Verifies the complete booking sequence:
 *   getSchedule -> getSlot -> createBooking -> getBooking (confirmation)
 *
 * Also tests:
 *   - Waitlist booking flow
 *   - Cancel booking flow
 *   - Reschedule booking flow
 *   - Error handling (slot full, network failure)
 */

jest.mock('@/shared/api/client', () => ({
  api: {
    get: jest.fn().mockResolvedValue({}),
    post: jest.fn().mockResolvedValue({}),
  },
}));

import { api } from '@/shared/api/client';
import { bookingApi } from '@/features/booking/api';
import type { ScheduleSlot, Booking, BookingRequest } from '@/features/booking/types';

const mockGet = api.get as jest.Mock;
const mockPost = api.post as jest.Mock;

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const scheduleSlots: ScheduleSlot[] = [
  {
    id: 'slot-1',
    serviceType: 'group',
    title: 'Yoga Morning',
    date: '2026-03-10',
    startTime: '09:00',
    endTime: '10:00',
    trainerId: 'tr-1',
    trainerName: 'Anna Ivanova',
    room: 'Hall A',
    capacity: 20,
    booked: 12,
    price: 500,
    currency: 'RUB',
    isFull: false,
    isWaitlistAvailable: false,
    level: 'all',
  },
  {
    id: 'slot-2',
    serviceType: 'pt',
    title: 'Personal Training',
    date: '2026-03-10',
    startTime: '11:00',
    endTime: '12:00',
    trainerId: 'tr-2',
    trainerName: 'Dmitry Sidorov',
    room: 'Room B',
    capacity: 1,
    booked: 1,
    price: 3000,
    currency: 'RUB',
    isFull: true,
    isWaitlistAvailable: true,
  },
];

const slotDetail: ScheduleSlot = {
  ...scheduleSlots[0],
  description: 'Morning yoga class for all levels',
};

const confirmedBooking: Booking = {
  id: 'book-1',
  slotId: 'slot-1',
  serviceType: 'group',
  title: 'Yoga Morning',
  date: '2026-03-10',
  startTime: '09:00',
  endTime: '10:00',
  trainerId: 'tr-1',
  trainerName: 'Anna Ivanova',
  room: 'Hall A',
  status: 'confirmed',
  price: 500,
  currency: 'RUB',
  createdAt: '2026-03-08T14:30:00Z',
  cancelDeadline: '2026-03-10T07:00:00Z',
};

const waitlistBooking: Booking = {
  id: 'book-2',
  slotId: 'slot-2',
  serviceType: 'pt',
  title: 'Personal Training',
  date: '2026-03-10',
  startTime: '11:00',
  endTime: '12:00',
  trainerId: 'tr-2',
  trainerName: 'Dmitry Sidorov',
  room: 'Room B',
  status: 'waitlist',
  price: 3000,
  currency: 'RUB',
  createdAt: '2026-03-08T14:35:00Z',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Booking Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes the full browse -> detail -> book -> confirmation flow', async () => {
    // Step 1: Browse schedule for a date
    mockGet.mockResolvedValueOnce(scheduleSlots);

    const schedule = await bookingApi.getSchedule({ date: '2026-03-10' });

    expect(mockGet).toHaveBeenCalledWith('schedule', { date: '2026-03-10' });
    expect(schedule).toHaveLength(2);
    expect(schedule[0].id).toBe('slot-1');

    // Step 2: Get slot detail
    mockGet.mockResolvedValueOnce(slotDetail);

    const slot = await bookingApi.getSlot('slot-1');

    expect(mockGet).toHaveBeenCalledWith('schedule/slot-1');
    expect(slot.description).toBe('Morning yoga class for all levels');
    expect(slot.isFull).toBe(false);

    // Step 3: Create booking
    const bookingRequest: BookingRequest = {
      slotId: 'slot-1',
      serviceType: 'group',
    };
    mockPost.mockResolvedValueOnce(confirmedBooking);

    const booking = await bookingApi.createBooking(bookingRequest);

    expect(mockPost).toHaveBeenCalledWith('bookings', bookingRequest);
    expect(booking.status).toBe('confirmed');
    expect(booking.slotId).toBe('slot-1');

    // Step 4: Get booking confirmation (detail page)
    mockGet.mockResolvedValueOnce(confirmedBooking);

    const confirmation = await bookingApi.getBooking('book-1');

    expect(mockGet).toHaveBeenCalledWith('bookings/book-1');
    expect(confirmation.id).toBe('book-1');
    expect(confirmation.status).toBe('confirmed');

    // Verify total call counts
    expect(mockGet).toHaveBeenCalledTimes(3);  // schedule, slot, getBooking
    expect(mockPost).toHaveBeenCalledTimes(1); // createBooking
  });

  it('completes waitlist booking flow when slot is full', async () => {
    // Step 1: Browse schedule
    mockGet.mockResolvedValueOnce(scheduleSlots);
    const schedule = await bookingApi.getSchedule({ date: '2026-03-10' });

    // Identify that slot-2 is full but has waitlist
    const fullSlot = schedule.find((s: ScheduleSlot) => s.id === 'slot-2');
    expect(fullSlot).toBeDefined();
    expect(fullSlot!.isFull).toBe(true);
    expect(fullSlot!.isWaitlistAvailable).toBe(true);

    // Step 2: Get slot detail
    mockGet.mockResolvedValueOnce({ ...scheduleSlots[1], description: 'One-on-one PT session' });
    const slotInfo = await bookingApi.getSlot('slot-2');
    expect(slotInfo.isFull).toBe(true);

    // Step 3: Create waitlist booking
    const waitlistRequest: BookingRequest = {
      slotId: 'slot-2',
      serviceType: 'pt',
      waitlist: true,
    };
    mockPost.mockResolvedValueOnce(waitlistBooking);

    const booking = await bookingApi.createBooking(waitlistRequest);

    expect(mockPost).toHaveBeenCalledWith('bookings', waitlistRequest);
    expect(booking.status).toBe('waitlist');

    // Step 4: Confirm waitlist status
    mockGet.mockResolvedValueOnce(waitlistBooking);
    const result = await bookingApi.getBooking('book-2');
    expect(result.status).toBe('waitlist');
  });

  it('handles booking cancellation flow', async () => {
    // User views their bookings
    mockGet.mockResolvedValueOnce([confirmedBooking]);
    const myBookings = await bookingApi.getMyBookings({ status: 'confirmed' });

    expect(mockGet).toHaveBeenCalledWith('bookings', { status: 'confirmed' });
    expect(myBookings).toHaveLength(1);

    // User cancels booking
    mockPost.mockResolvedValueOnce(undefined);
    await bookingApi.cancelBooking('book-1', 'Schedule conflict');

    expect(mockPost).toHaveBeenCalledWith('bookings/book-1/cancel', {
      reason: 'Schedule conflict',
    });

    // Verify updated status
    const cancelledBooking: Booking = { ...confirmedBooking, status: 'cancelled' };
    mockGet.mockResolvedValueOnce(cancelledBooking);

    const updated = await bookingApi.getBooking('book-1');
    expect(updated.status).toBe('cancelled');
  });

  it('handles booking reschedule flow', async () => {
    // Step 1: Browse available new slots
    const newSlots: ScheduleSlot[] = [
      {
        ...scheduleSlots[0],
        id: 'slot-new',
        date: '2026-03-12',
        startTime: '10:00',
        endTime: '11:00',
      },
    ];
    mockGet.mockResolvedValueOnce(newSlots);
    const slots = await bookingApi.getSchedule({ date: '2026-03-12' });
    expect(slots).toHaveLength(1);

    // Step 2: Reschedule existing booking to new slot
    const rescheduledBooking: Booking = {
      ...confirmedBooking,
      slotId: 'slot-new',
      date: '2026-03-12',
      startTime: '10:00',
      endTime: '11:00',
    };
    mockPost.mockResolvedValueOnce(rescheduledBooking);

    const result = await bookingApi.rescheduleBooking('book-1', 'slot-new');

    expect(mockPost).toHaveBeenCalledWith('bookings/book-1/reschedule', {
      newSlotId: 'slot-new',
    });
    expect(result.slotId).toBe('slot-new');
    expect(result.date).toBe('2026-03-12');
  });

  it('handles schedule filtered by service type and trainer', async () => {
    mockGet.mockResolvedValueOnce([scheduleSlots[1]]);

    const ptSlots = await bookingApi.getSchedule({
      date: '2026-03-10',
      serviceType: 'pt',
      trainerId: 'tr-2',
    });

    expect(mockGet).toHaveBeenCalledWith('schedule', {
      date: '2026-03-10',
      serviceType: 'pt',
      trainerId: 'tr-2',
    });
    expect(ptSlots).toHaveLength(1);
    expect(ptSlots[0].serviceType).toBe('pt');
  });

  it('handles booking creation failure (server error)', async () => {
    // Browse and select slot succeed
    mockGet.mockResolvedValueOnce(scheduleSlots);
    await bookingApi.getSchedule({ date: '2026-03-10' });

    mockGet.mockResolvedValueOnce(slotDetail);
    await bookingApi.getSlot('slot-1');

    // Booking fails (e.g., slot became full between browse and book)
    mockPost.mockRejectedValueOnce(new Error('Slot is no longer available'));

    await expect(
      bookingApi.createBooking({ slotId: 'slot-1', serviceType: 'group' }),
    ).rejects.toThrow('Slot is no longer available');

    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  it('retrieves all user bookings without filter', async () => {
    const allBookings = [confirmedBooking, waitlistBooking];
    mockGet.mockResolvedValueOnce(allBookings);

    const result = await bookingApi.getMyBookings();

    expect(mockGet).toHaveBeenCalledWith('bookings', undefined);
    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('confirmed');
    expect(result[1].status).toBe('waitlist');
  });
});

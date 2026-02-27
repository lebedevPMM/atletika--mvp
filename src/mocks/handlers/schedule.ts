import { http, HttpResponse, delay } from 'msw';
import { generateSlots, MOCK_BOOKINGS, MOCK_TRAINERS } from '../data/schedule';
import type { Booking } from '@/features/booking/types';

let bookings = [...MOCK_BOOKINGS];
let nextBookingId = 100;

export const scheduleHandlers = [
  // Get schedule
  http.get('*/schedule', async ({ request }) => {
    await delay(400);
    const url = new URL(request.url);
    const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
    const serviceType = url.searchParams.get('serviceType');

    let slots = generateSlots(date);
    if (serviceType) {
      slots = slots.filter(s => s.serviceType === serviceType);
    }
    return HttpResponse.json(slots);
  }),

  // Get single slot
  http.get('*/schedule/:slotId', async ({ params }) => {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    const slots = generateSlots(today);
    const slot = slots.find(s => s.id === params.slotId);
    if (!slot) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Слот не найден' }, { status: 404 });
    }
    return HttpResponse.json(slot);
  }),

  // Get my bookings
  http.get('*/bookings', async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    let result = bookings;
    if (status) {
      result = bookings.filter(b => b.status === status);
    }
    return HttpResponse.json(result);
  }),

  // Get single booking
  http.get('*/bookings/:bookingId', async ({ params }) => {
    await delay(200);
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Запись не найдена' }, { status: 404 });
    }
    return HttpResponse.json(booking);
  }),

  // Create booking
  http.post('*/bookings', async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { slotId: string; serviceType: string; waitlist?: boolean };
    const today = new Date().toISOString().split('T')[0];
    const slots = generateSlots(today);
    const slot = slots.find(s => s.id === body.slotId);

    const newBooking: Booking = {
      id: `bk-${++nextBookingId}`,
      slotId: body.slotId,
      serviceType: slot?.serviceType || 'group',
      title: slot?.title || 'Тренировка',
      date: slot?.date || today,
      startTime: slot?.startTime || '10:00',
      endTime: slot?.endTime || '11:00',
      trainerId: slot?.trainerId || 'tr-001',
      trainerName: slot?.trainerName || 'Тренер',
      room: slot?.room || 'Зал A',
      status: body.waitlist ? 'waitlist' : 'confirmed',
      price: slot?.price || 0,
      currency: 'RUB',
      createdAt: new Date().toISOString(),
      cancelDeadline: new Date(Date.now() + 7200000).toISOString(),
    };

    bookings.push(newBooking);
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  // Reschedule booking
  http.post('*/bookings/:bookingId/reschedule', async ({ params, request }) => {
    await delay(500);
    const body = (await request.json()) as { newSlotId: string };
    const idx = bookings.findIndex(b => b.id === params.bookingId);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });

    const today = new Date().toISOString().split('T')[0];
    const slots = generateSlots(today);
    const newSlot = slots.find(s => s.id === body.newSlotId);

    // Cancel old booking
    bookings[idx] = { ...bookings[idx], status: 'cancelled' };

    // Create new booking with new slot details
    const newBooking: Booking = {
      id: `bk-${++nextBookingId}`,
      slotId: body.newSlotId,
      serviceType: newSlot?.serviceType || bookings[idx].serviceType,
      title: newSlot?.title || bookings[idx].title,
      date: newSlot?.date || today,
      startTime: newSlot?.startTime || '10:00',
      endTime: newSlot?.endTime || '11:00',
      trainerId: newSlot?.trainerId || bookings[idx].trainerId,
      trainerName: newSlot?.trainerName || bookings[idx].trainerName,
      room: newSlot?.room || bookings[idx].room,
      status: 'confirmed',
      price: newSlot?.price || 0,
      currency: 'RUB',
      createdAt: new Date().toISOString(),
      cancelDeadline: new Date(Date.now() + 7200000).toISOString(),
    };
    bookings.push(newBooking);
    return HttpResponse.json(newBooking);
  }),

  // Cancel booking
  http.post('*/bookings/:bookingId/cancel', async ({ params }) => {
    await delay(400);
    const idx = bookings.findIndex(b => b.id === params.bookingId);
    if (idx === -1) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Запись не найдена' }, { status: 404 });
    }
    bookings[idx] = { ...bookings[idx], status: 'cancelled' };
    return new HttpResponse(null, { status: 204 });
  }),

  // Get trainers
  http.get('*/trainers', async () => {
    await delay(300);
    return HttpResponse.json(MOCK_TRAINERS);
  }),
];

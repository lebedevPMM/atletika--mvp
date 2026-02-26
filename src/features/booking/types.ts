export type ServiceType = 'group' | 'pt' | 'spa';

export interface ScheduleSlot {
  id: string;
  serviceType: ServiceType;
  title: string;
  date: string; // ISO date
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  trainerId: string;
  trainerName: string;
  room: string;
  capacity: number;
  booked: number;
  price: number;
  currency: string;
  isFull: boolean;
  isWaitlistAvailable: boolean;
  description?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all';
}

export interface Booking {
  id: string;
  slotId: string;
  serviceType: ServiceType;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  trainerId: string;
  trainerName: string;
  room: string;
  status: 'confirmed' | 'waitlist' | 'cancelled' | 'completed';
  price: number;
  currency: string;
  createdAt: string;
  cancelDeadline?: string;
}

export interface BookingRequest {
  slotId: string;
  serviceType: ServiceType;
  waitlist?: boolean;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  avatarUrl?: string;
  rating: number;
}

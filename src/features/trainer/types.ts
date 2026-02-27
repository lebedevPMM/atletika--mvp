export interface TrainerDayOverview {
  date: string;
  sessionsCount: number;
  clientsCount: number;
  hoursCount: number;
  upcomingSessions: TrainerSession[];
}

export interface TrainerSession {
  id: string;
  time: string; // "10:00"
  endTime: string; // "11:00"
  type: 'pt' | 'group' | 'spa';
  title: string;
  clientName?: string; // for PT
  clientPhone?: string; // for PT
  location: string;
  attendeeCount?: number; // for groups
  maxAttendees?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  attendees?: TrainerSessionAttendee[];
}

export interface TrainerSessionAttendee {
  id: string;
  firstName: string;
  lastName: string;
  attended: boolean;
}

export interface TrainerClient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  membershipStatus: 'active' | 'expired' | 'frozen';
  lastVisit: string;
  sessionsCompleted: number;
  currentPlan: string | null;
}

export interface TrainerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  avatarUrl: string | null;
  bio: string;
  specializations: string[];
  certifications: string[];
}

export interface TrainerClientPlan {
  id: string;
  clientId: string;
  clientName: string;
  period: string; // "01.03 - 31.03"
  frequency: string; // "3 раза/неделю"
  days: TrainerPlanDay[];
}

export interface TrainerPlanDay {
  day: string; // "Пн", "Ср", "Пт"
  title: string;
  exercises: string[];
}

export interface TrainerDaySummary {
  date: string;
  sessionsCount: number;
  clientsCount: number;
  cancellations: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  sessions: TrainerSummarySession[];
}

export interface TrainerSummarySession {
  id: string;
  time: string;
  title: string;
  type: 'pt' | 'group' | 'spa';
  attendeeCount?: number;
  completed: boolean;
  cancelled: boolean;
}

export interface TrainerClientProgress {
  clientId: string;
  clientName: string;
  visitsPerWeek: number;
  visitsTrend: number; // percentage
  metrics: TrainerProgressMetric[];
  notes: TrainerProgressNote[];
}

export interface TrainerProgressMetric {
  label: string;
  startValue: string;
  currentValue: string;
  change: string;
  improved: boolean;
}

export interface TrainerProgressNote {
  id: string;
  date: string;
  text: string;
}

export interface TrainerNotification {
  id: string;
  type: 'cancellation' | 'new_booking' | 'schedule_change' | 'report' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

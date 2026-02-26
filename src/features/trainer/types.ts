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

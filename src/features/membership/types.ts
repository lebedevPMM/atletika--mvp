export type MembershipStatus = 'active' | 'expired' | 'frozen' | 'none';

export interface Membership {
  id: string;
  planName: string;
  status: MembershipStatus;
  startDate: string;
  endDate: string;
  daysLeft: number;
  visitsLeft: number | null; // null = unlimited
  visitsTotal: number | null;
  ptSessionsLeft: number;
  ptSessionsTotal: number;
  freezeAvailable: boolean;
  freezeDaysLeft: number;
  debtFlag: boolean;
  accessZones: string[]; // e.g. ['Тренажёрный зал', 'Бассейн', 'СПА']
}

// === S9 additions: Freeze ===

export interface FreezeRules {
  maxDays: number;
  maxTimesPerYear: number;
  minPeriodDays: number;
  freezesUsed: number;
  freezeDaysUsed: number;
}

export interface FreezeRequest {
  startDate: string;
  endDate: string;
  reason?: string;
}

export interface FreezeRecord {
  id: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

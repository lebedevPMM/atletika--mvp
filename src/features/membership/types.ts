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

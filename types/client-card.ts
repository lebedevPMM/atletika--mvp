// === Branded ID Types ===
type Brand<T, B extends string> = T & { readonly __brand: B };

export type ClientId = Brand<string, 'ClientId'>;
export type ClubId = Brand<string, 'ClubId'>;
export type CardId = Brand<string, 'CardId'>;
export type TrainerId = Brand<string, 'TrainerId'>;
export type PlanId = Brand<string, 'PlanId'>;
export type ISODateString = string;

// === Aggregate Root ===
export type CardStatus = 'active' | 'archived' | 'suspended';

export interface ClientCard {
  id: CardId;
  clientId: ClientId;
  clubId: ClubId;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  status: CardStatus;
  personalInfo: PersonalInfo;
  membership: MembershipInfo;
  healthProfile: HealthProfile | null;
  visitSummary: VisitSummary;
  progressSummary: ProgressSummary | null;
}

// === PersonalInfo ===
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  phone: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: 'male' | 'female' | null;
  avatarUrl: string | null;
  tags: ClientTag[];
  emergencyContact: EmergencyContact | null;
}

export type ClientTag = string;

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string | null;
}

// === MembershipInfo ===
export type MembershipStatus = 'active' | 'expired' | 'frozen' | 'pending' | 'cancelled';

export interface MembershipInfo {
  status: MembershipStatus;
  planName: string;
  validFrom: ISODateString;
  validTo: ISODateString | null;
  autoRenew: boolean;
  freezeInfo: FreezeInfo | null;
  limits: ServiceLimits;
}

export interface FreezeInfo {
  frozenAt: ISODateString;
  unfreezeAt: ISODateString;
  reason: string;
}

export interface ServiceLimits {
  ptRemaining: number | null;
  ptTotal: number | null;
  groupRemaining: number | null;
  groupTotal: number | null;
  spaRemaining: number | null;
  spaTotal: number | null;
}

// === HealthProfile ===
export interface HealthProfile {
  updatedAt: ISODateString;
  contraindications: string[];
  injuries: string[];
  limitsText: string;
  medsText: string;
  allergiesText: string;
  visibility: HealthVisibility;
  consentHealthData: boolean;
  healthSources: HealthSource[];
}

export interface HealthVisibility {
  showTrainer: boolean;
  showMethodist: boolean;
}

export type HealthSourceProvider = 'apple_health' | 'google_fit' | 'dexbee' | 'myzone';
export type HealthSourceStatus = 'connected' | 'disconnected' | 'error' | 'syncing' | 'permission_denied';

export interface HealthSource {
  provider: HealthSourceProvider;
  status: HealthSourceStatus;
  lastSyncAt: ISODateString | null;
  scopes: string[];
  errorCode: string | null;
}

// === Lazy Sub-Resources ===
export interface PurchasedService {
  id: string;
  title: string;
  type: 'pt' | 'group' | 'spa' | 'package';
  countLeft: number;
  countTotal: number;
  status: 'active' | 'exhausted' | 'expired';
  validTo: ISODateString | null;
}

export interface UpcomingBooking {
  id: string;
  title: string;
  date: ISODateString;
  time: string;
  type: 'group_class' | 'pt' | 'mini_group' | 'spa';
  trainerName: string | null;
  location: string | null;
  status: 'confirmed' | 'pending' | 'waitlisted';
}

export interface BodyMeasurement {
  id: string;
  date: ISODateString;
  weight: number;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  measuredBy: TrainerId | 'self';
}

export interface TrainingPlan {
  id: PlanId;
  title: string;
  goal: string;
  trainerId: TrainerId;
  trainerName: string;
  startAt: ISODateString;
  endAt: ISODateString;
  totalWeeks: number;
  currentWeek: number;
  progressPercent: number;
  checkpoints: Checkpoint[];
}

export interface Checkpoint {
  id: string;
  date: ISODateString;
  type: 'measurement' | 'photo' | 'test';
  status: 'pending' | 'completed' | 'missed';
}

export interface VisitRecord {
  id: string;
  date: ISODateString;
  type: 'group_class' | 'pt' | 'mini_group' | 'spa' | 'open_gym';
  title: string;
  trainerName: string | null;
  duration: number | null;
  status: 'completed' | 'no_show' | 'canceled';
}

export type NoteAuthorRole = 'trainer' | 'methodist';

export interface ClientNote {
  id: string;
  cardId: CardId;
  authorId: string;
  authorRole: NoteAuthorRole;
  authorName: string;
  text: string;
  createdAt: ISODateString;
}

// === Summaries ===
export interface VisitSummary {
  totalVisits: number;
  visitsLast30Days: number;
  lastVisitDate: ISODateString | null;
  noShowCount: number;
  streak: number;
  avgVisitsPerWeek: number;
}

export interface ProgressSummary {
  weightStart: number | null;
  weightCurrent: number | null;
  weightDelta: number | null;
  waistStart: number | null;
  waistCurrent: number | null;
  waistDelta: number | null;
  lastMeasurementDate: ISODateString | null;
  trend: 'improving' | 'stable' | 'declining';
}

// === Role-Based Access ===
export type AppRole = 'client' | 'trainer' | 'methodist';

export const CARD_PERMISSIONS: Record<AppRole, Record<string, string>> = {
  client: {
    personalInfo: 'own',
    membership: 'read',
    healthProfile: 'read_write',
    purchasedServices: 'read',
    upcomingBookings: 'read',
    measurements: 'read',
    trainingPlan: 'read',
    notes: 'none',
    visits: 'read',
  },
  trainer: {
    personalInfo: 'read',
    membership: 'read',
    healthProfile: 'read',
    purchasedServices: 'read',
    upcomingBookings: 'read',
    measurements: 'write',
    trainingPlan: 'write',
    notes: 'own_write',
    visits: 'read',
  },
  methodist: {
    personalInfo: 'read',
    membership: 'read',
    healthProfile: 'write',
    purchasedServices: 'read',
    upcomingBookings: 'read',
    measurements: 'read',
    trainingPlan: 'approve',
    notes: 'own_write',
    visits: 'read',
  },
};

import type {
  ClientCard, CardId, ClientId, ClubId, TrainerId, PlanId,
  PersonalInfo, MembershipInfo, HealthProfile, VisitSummary, ProgressSummary,
  PurchasedService, UpcomingBooking, BodyMeasurement, TrainingPlan, VisitRecord, ClientNote
} from '../types/client-card';

let counter = 0;
const nextId = (prefix: string) => `${prefix}-${++counter}` as any;

export function createClientCard(overrides?: Partial<ClientCard>): ClientCard {
  return {
    id: nextId('card'),
    clientId: nextId('client') as ClientId,
    clubId: 'club-1' as ClubId,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: new Date().toISOString(),
    status: 'active',
    personalInfo: createPersonalInfo(),
    membership: createMembership(),
    healthProfile: createHealthProfile(),
    visitSummary: createVisitSummary(),
    progressSummary: createProgressSummary(),
    ...overrides,
  };
}

export function createPersonalInfo(overrides?: Partial<PersonalInfo>): PersonalInfo {
  return {
    firstName: 'Елена',
    lastName: 'Смирнова',
    phone: '+7 900 123-45-67',
    email: 'elena@mail.ru',
    dateOfBirth: '1997-05-14',
    gender: 'female',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    tags: ['Новичок', 'ПТ'],
    emergencyContact: null,
    ...overrides,
  };
}

export function createMembership(overrides?: Partial<MembershipInfo>): MembershipInfo {
  return {
    status: 'active',
    planName: 'Безлимит: Год',
    validFrom: '2024-01-15',
    validTo: '2025-01-15',
    autoRenew: true,
    freezeInfo: null,
    limits: {
      ptRemaining: 8,
      ptTotal: 12,
      groupRemaining: null,
      groupTotal: null,
      spaRemaining: 3,
      spaTotal: 5,
    },
    ...overrides,
  };
}

export function createHealthProfile(overrides?: Partial<HealthProfile>): HealthProfile {
  return {
    updatedAt: '2024-06-10T14:00:00Z',
    contraindications: ['Сколиоз'],
    injuries: ['Травма колена (2022)'],
    limitsText: 'Избегать осевых нагрузок на позвоночник',
    medsText: '',
    allergiesText: 'Сезонная аллергия',
    visibility: { showTrainer: true, showMethodist: true },
    consentHealthData: true,
    healthSources: [],
    ...overrides,
  };
}

export function createVisitSummary(overrides?: Partial<VisitSummary>): VisitSummary {
  return {
    totalVisits: 47,
    visitsLast30Days: 12,
    lastVisitDate: '2024-09-10',
    noShowCount: 1,
    streak: 5,
    avgVisitsPerWeek: 3.2,
    ...overrides,
  };
}

export function createProgressSummary(overrides?: Partial<ProgressSummary>): ProgressSummary {
  return {
    weightStart: 68.0,
    weightCurrent: 65.5,
    weightDelta: -2.5,
    waistStart: 72,
    waistCurrent: 68,
    waistDelta: -4,
    lastMeasurementDate: '2024-09-12',
    trend: 'improving',
    ...overrides,
  };
}

export function createPurchasedService(overrides?: Partial<PurchasedService>): PurchasedService {
  return {
    id: nextId('svc'),
    title: 'ПТ с Анной',
    type: 'pt',
    countLeft: 5,
    countTotal: 10,
    status: 'active',
    validTo: '2025-01-15',
    ...overrides,
  };
}

export function createUpcomingBooking(overrides?: Partial<UpcomingBooking>): UpcomingBooking {
  return {
    id: nextId('book'),
    title: 'Йога',
    date: '2024-09-15',
    time: '10:00',
    type: 'group_class',
    trainerName: 'Мария К.',
    location: 'Зал 2',
    status: 'confirmed',
    ...overrides,
  };
}

export function createBodyMeasurement(overrides?: Partial<BodyMeasurement>): BodyMeasurement {
  return {
    id: nextId('meas'),
    date: '2024-09-12',
    weight: 65.5,
    chest: 92,
    waist: 68,
    hips: 94,
    measuredBy: 'self',
    ...overrides,
  };
}

export function createTrainingPlan(overrides?: Partial<TrainingPlan>): TrainingPlan {
  return {
    id: nextId('plan') as PlanId,
    title: 'Жиросжигание + тонус',
    goal: 'Снижение веса на 5 кг, укрепление мышечного корсета',
    trainerId: 'trainer-1' as TrainerId,
    trainerName: 'Анна Петрова',
    startAt: '2024-08-01',
    endAt: '2024-11-01',
    totalWeeks: 12,
    currentWeek: 7,
    progressPercent: 58,
    checkpoints: [
      { id: 'cp-1', date: '2024-08-15', type: 'measurement', status: 'completed' },
      { id: 'cp-2', date: '2024-09-15', type: 'measurement', status: 'pending' },
      { id: 'cp-3', date: '2024-10-15', type: 'measurement', status: 'pending' },
    ],
    ...overrides,
  };
}

export function createVisitRecord(overrides?: Partial<VisitRecord>): VisitRecord {
  return {
    id: nextId('visit'),
    date: '2024-09-10',
    type: 'group_class',
    title: 'Функциональный тренинг',
    trainerName: 'Мария К.',
    duration: 55,
    status: 'completed',
    ...overrides,
  };
}

export function createClientNote(overrides?: Partial<ClientNote>): ClientNote {
  return {
    id: nextId('note'),
    cardId: 'card-1' as CardId,
    authorId: 'trainer-1',
    authorRole: 'trainer',
    authorName: 'Анна Петрова',
    text: 'Хороший прогресс по технике приседаний.',
    createdAt: '2024-09-10T15:30:00Z',
    ...overrides,
  };
}

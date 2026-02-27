import type { BonusBalance, BonusTransaction } from '@/features/loyalty/types';
import type { FreezeRules, FreezeRecord } from '@/features/membership/types';
import type { VisitStats, Contraindication, FamilyMember, DocumentItem, FavoriteItem } from '@/features/health/types';

const now = Date.now();

export const MOCK_BONUS_BALANCE: BonusBalance = {
  total: 1250,
  pending: 200,
};

export const MOCK_BONUS_HISTORY: BonusTransaction[] = [
  {
    id: 'bt-001',
    type: 'accrual',
    amount: 100,
    description: 'Посещение групповой тренировки',
    createdAt: new Date(now - 86_400_000).toISOString(),
  },
  {
    id: 'bt-002',
    type: 'accrual',
    amount: 200,
    description: 'Покупка пакета ПТ (10 занятий)',
    createdAt: new Date(now - 172_800_000).toISOString(),
  },
  {
    id: 'bt-003',
    type: 'redemption',
    amount: -300,
    description: 'Скидка на продление абонемента',
    createdAt: new Date(now - 432_000_000).toISOString(),
  },
  {
    id: 'bt-004',
    type: 'referral',
    amount: 500,
    description: 'Приглашение друга (Алексей К.)',
    createdAt: new Date(now - 604_800_000).toISOString(),
  },
  {
    id: 'bt-005',
    type: 'expiry',
    amount: -150,
    description: 'Сгорание бонусов за неактивность',
    createdAt: new Date(now - 1_296_000_000).toISOString(),
  },
];

export const MOCK_FREEZE_RULES: FreezeRules = {
  maxDays: 30,
  maxTimesPerYear: 2,
  minPeriodDays: 7,
  freezesUsed: 0,
  freezeDaysUsed: 0,
};

export const MOCK_FREEZE_HISTORY: FreezeRecord[] = [
  {
    id: 'fr-001',
    startDate: '2025-12-01',
    endDate: '2025-12-14',
    days: 14,
    status: 'completed',
    createdAt: '2025-11-28T10:00:00.000Z',
  },
];

export const MOCK_VISIT_STATS: VisitStats = {
  totalVisits: 87,
  thisMonth: 12,
  lastMonth: 15,
  avgPerWeek: 3.2,
  streak: 4,
  byType: [
    { type: 'Силовая', count: 42 },
    { type: 'Групповая', count: 25 },
    { type: 'Бассейн', count: 12 },
    { type: 'СПА', count: 8 },
  ],
  monthly: [
    { month: '2025-09', count: 10 },
    { month: '2025-10', count: 14 },
    { month: '2025-11', count: 11 },
    { month: '2025-12', count: 8 },
    { month: '2026-01', count: 15 },
    { month: '2026-02', count: 12 },
  ],
};

export const MOCK_CONTRAINDICATIONS: Contraindication[] = [
  {
    id: 'ci-001',
    title: 'Грыжа L5-S1',
    description: 'Избегать осевой нагрузки, приседаний со штангой, становой тяги',
    severity: 'high',
    addedAt: '2025-06-15T10:00:00.000Z',
  },
  {
    id: 'ci-002',
    title: 'Артрит правого колена',
    description: 'Ограничить прыжковые упражнения, бег. Рекомендуется велотренажёр',
    severity: 'medium',
    addedAt: '2025-09-01T10:00:00.000Z',
  },
  {
    id: 'ci-003',
    title: 'Аллергия на хлор',
    description: 'Исключить посещение бассейна. Душ — только гипоаллергенные средства',
    severity: 'low',
    addedAt: '2025-03-20T10:00:00.000Z',
  },
];

export const MOCK_FAMILY: FamilyMember[] = [
  {
    id: 'fam-001',
    name: 'Ольга Лебедева',
    relationship: 'spouse',
    membershipStatus: 'active',
  },
  {
    id: 'fam-002',
    name: 'Артём Лебедев',
    relationship: 'child',
    membershipStatus: 'active',
  },
];

export const MOCK_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    title: 'Договор на оказание услуг',
    type: 'contract',
    url: 'https://atletika.ru/docs/contract-001.pdf',
    createdAt: '2025-01-10T10:00:00.000Z',
  },
  {
    id: 'doc-002',
    title: 'Справка о посещениях (февраль 2026)',
    type: 'certificate',
    url: 'https://atletika.ru/docs/visits-feb-2026.pdf',
    createdAt: '2026-02-25T10:00:00.000Z',
  },
  {
    id: 'doc-003',
    title: 'Правила клуба',
    type: 'policy',
    url: 'https://atletika.ru/docs/club-rules.pdf',
    createdAt: '2025-01-01T10:00:00.000Z',
  },
  {
    id: 'doc-004',
    title: 'Медицинская справка',
    type: 'medical',
    url: 'https://atletika.ru/docs/medical-cert.pdf',
    createdAt: '2025-06-15T10:00:00.000Z',
  },
  {
    id: 'doc-005',
    title: 'Квитанция за март 2026',
    type: 'receipt',
    url: 'https://atletika.ru/docs/receipt-mar-2026.pdf',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
];

export const MOCK_FAVORITES: FavoriteItem[] = [
  {
    id: 'fav-001',
    type: 'trainer',
    title: 'Игорь Смирнов',
    subtitle: 'Силовые тренировки',
    rating: 4.8,
  },
  {
    id: 'fav-002',
    type: 'trainer',
    title: 'Анна Петрова',
    subtitle: 'Йога и пилатес',
    rating: 4.9,
  },
  {
    id: 'fav-003',
    type: 'class',
    title: 'Утренняя йога',
    subtitle: 'Пн, Ср, Пт 07:00',
  },
  {
    id: 'fav-004',
    type: 'class',
    title: 'HIIT Express',
    subtitle: 'Вт, Чт 18:30',
    rating: 4.7,
  },
];

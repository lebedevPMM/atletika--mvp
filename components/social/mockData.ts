import { UserProfile, FitnessPassport, BuddyConnection, OpenWorkout, BuddySuggestion, Challenge } from './types';

export const MOCK_USERS: UserProfile[] = [
    {
        id: 'u1',
        nickname: 'AlexSt.',
        firstName: 'Александр',
        lastName: 'Степанов',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        isVerified: true,
        verificationStatus: 'verified',
        role: 'member',
        status: 'green',
        statusMessage: 'Looking for tennis partner 🎾',
        business: {
            companyName: 'FinTech Solutions',
            industry: 'Finance',
            role: 'CEO & Founder',
            revenueRange: '500M - 1B ₽',
            expertise: ['Fintech', 'Investments', 'M&A'],
            description: 'Building the future of digital banking in CIS.'
        },
        sports: {
            mainSports: ['Tennis', 'CrossFit'],
            level: 'amateur',
            achievements: ['Moscow Open Amateur 2023'],
        },
        privacy: { isGhostMode: false, showRevenue: true },
        isGeofenced: true,
        currentActivity: 'Tennis Court',
        stats: { level: 12, reputation: 150 }
    },
    {
        id: 'u2',
        nickname: 'ElenaV',
        firstName: 'Елена',
        lastName: 'Волкова',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
        isVerified: true,
        verificationStatus: 'verified',
        role: 'ambassador',
        status: 'yellow',
        statusMessage: 'In the zone 🎧',
        business: {
            companyName: 'Green Estate',
            industry: 'Real Estate',
            role: 'Managing Partner',
            revenueRange: '1B+ ₽',
            expertise: ['Commercial RE', 'Development', 'Sales'],
            description: 'Premium real estate development in Moscow.'
        },
        sports: {
            mainSports: ['Triathlon', 'Yoga'],
            level: 'pro',
            achievements: ['Ironman 70.3 Turkey', 'Marathon de Paris'],
            connectedApps: ['garmin', 'strava']
        },
        musicTrack: { artist: 'Rammstein', title: 'Sonne' },
        privacy: { isGhostMode: false, showRevenue: true },
        isGeofenced: true,
        currentActivity: 'Treadmill',
        stats: { level: 25, reputation: 450 }
    },
    {
        id: 'u3',
        nickname: 'MikeTech',
        firstName: 'Михаил',
        lastName: 'Романов',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        isVerified: true,
        verificationStatus: 'verified',
        role: 'member',
        status: 'red',
        statusMessage: 'Training hard, no talk.',
        business: {
            companyName: 'LogiSoft',
            industry: 'Logistics',
            role: 'CTO',
            revenueRange: '100M - 300M ₽',
            expertise: ['IT', 'Logistics', 'AI'],
        },
        sports: {
            mainSports: ['Powerlifting'],
            level: 'amateur',
            achievements: [],
        },
        privacy: { isGhostMode: false, showRevenue: false },
        isGeofenced: true,
        currentActivity: 'Free Weights',
        stats: { level: 8, reputation: 40 }
    },
    {
        id: 'u4',
        nickname: 'DmitryK',
        firstName: 'Дмитрий',
        lastName: 'Ковалев',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry',
        isVerified: true,
        verificationStatus: 'verified',
        role: 'alumni',
        status: 'yellow',
        business: {
            companyName: 'Retail Group',
            industry: 'Retail',
            role: 'Owner',
            revenueRange: '300M - 500M ₽',
            expertise: ['Retail', 'Franchising'],
        },
        sports: {
            mainSports: ['Golf', 'Swimming'],
            level: 'beginner',
            achievements: [],
        },
        privacy: { isGhostMode: false, showRevenue: true },
        isGeofenced: false, // Not at Gym
        stats: { level: 5, reputation: 100 }
    },
    {
        id: 'u5',
        nickname: 'SarahConnor',
        firstName: 'Сара',
        lastName: 'Коннор',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        isVerified: true,
        verificationStatus: 'verified',
        role: 'member',
        status: 'green',
        business: {
            companyName: 'Cyberdyne',
            industry: 'Technology',
            role: 'Security Consultant',
            revenueRange: 'Unknown',
            expertise: ['Security', 'AI Survival'],
        },
        sports: {
            mainSports: ['CrossFit', 'Running'],
            level: 'pro',
            achievements: ['Terminator Survivor'],
        },
        privacy: { isGhostMode: true, showRevenue: false },
        isGeofenced: true, // At gym but in ghost mode
        stats: { level: 99, reputation: 900 }
    }
];

export const CURRENT_USER_MOCK: UserProfile = {
    id: 'me',
    nickname: 'MaxPower',
    firstName: 'Максим',
    lastName: 'Иванов',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    isVerified: true,
    verificationStatus: 'guest', // Default to GUEST for testing the flow
    role: 'guest',
    status: 'green',
    statusMessage: 'Ready for business & gains',
    business: {
        companyName: 'StartUp Inc.',
        industry: 'Technology',
        role: 'CEO',
        revenueRange: '0 - 100M ₽',
        expertise: ['Bootstrapping', 'Product'],
    },
    sports: {
        mainSports: ['Running', 'Cycling'],
        level: 'amateur',
        achievements: [],
        connectedApps: ['strava']
    },
    privacy: { isGhostMode: false, showRevenue: true },
    isGeofenced: true,
    stats: { level: 15, reputation: 120 }
};

export const MOCK_REQUESTS: import('./types').BusinessRequest[] = [
    {
        id: 'r1',
        authorId: 'u2', // ElenaV
        type: 'offer',
        category: 'Real Estate',
        title: 'Exclusive Off-Market Penthouse in Khamovniki',
        description: 'Available for club members first. 250m², terrace, river view. Direct from developer.',
        urgency: 'high',
        status: 'approved',
        views: 124,
        responses: 5,
        createdAt: new Date('2024-03-10'),
        expiresAt: new Date('2024-04-10')
    },
    {
        id: 'r2',
        authorId: 'u1', // AlexSt
        type: 'need',
        category: 'Finance',
        title: 'Looking for CFO with IPO experience',
        description: 'Fintech startup (Series B) needs a seasoned CFO to lead us to IPO in 18 months.',
        urgency: 'high',
        status: 'approved',
        views: 340,
        responses: 12,
        createdAt: new Date('2024-03-12'),
        expiresAt: new Date('2024-03-25')
    },
    {
        id: 'r3',
        authorId: 'u3', // MikeTech
        type: 'ask',
        category: 'Logistics',
        title: 'Reliable customs broker for China-Russia',
        description: 'Need recommendations for a broker handling electronics components. Fast track preferred.',
        urgency: 'normal',
        status: 'approved',
        views: 45,
        responses: 2,
        createdAt: new Date('2024-03-14'),
        expiresAt: new Date('2024-03-20')
    },
    {
        id: 'r4',
        authorId: 'u5', // Sarah
        type: 'lifestyle',
        category: 'Other',
        title: 'Best private school for 7yo in Odintsovo?',
        description: 'Moving to the area next month. Looking for feedbacks on local international schools.',
        urgency: 'normal',
        status: 'approved',
        views: 89,
        responses: 8,
        createdAt: new Date('2024-03-15'),
        expiresAt: new Date('2024-04-15')
    }
];

export const MOCK_EVENTS: import('./types').CommunityEvent[] = [
    {
        id: 'e1',
        title: 'Morning Business Run',
        type: 'sport',
        date: new Date('2025-03-25T07:00:00'),
        location: 'Luzhniki Embankment',
        organizerId: 'u1',
        description: 'Casual 5km run followed by coffee. Discussing fintech trends.',
        imageUrl: 'https://images.unsplash.com/photo-1552674605-469455954e60?auto=format&fit=crop&q=80&w=800',
        capacity: 15,
        attendees: ['u1', 'u2', 'u5'],
        isOfficial: false
    },
    {
        id: 'e2',
        title: 'Padel Tournament: Spring Cup',
        type: 'sport',
        date: new Date('2025-03-30T10:00:00'),
        location: 'Lawn Tennis Club',
        organizerId: 'admin',
        description: 'Official club tournament. Doubles. Level: Amateur+. Prize pool.',
        imageUrl: 'https://images.unsplash.com/photo-1626244422533-5c026ec1770b?auto=format&fit=crop&q=80&w=800',
        price: '5000 ₽',
        capacity: 32,
        attendees: ['u1', 'u3', 'u4', 'u2'],
        isOfficial: true
    },
    {
        id: 'e3',
        title: 'Crypto & Coffee Breakfast',
        type: 'business',
        date: new Date('2025-03-28T09:00:00'),
        location: 'Club Lounge',
        organizerId: 'u5',
        description: 'Roundtable on the impact of new regulations. Guest speaker from Central Bank.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=800',
        capacity: 10,
        attendees: ['u2', 'u5', 'u1'],
        isOfficial: false
    },
    {
        id: 'e4',
        title: 'Friday Night Networking',
        type: 'social',
        date: new Date('2025-03-29T19:00:00'),
        location: 'Rooftop Bar',
        organizerId: 'admin',
        description: 'Casual drinks and networking for all members. +1 allowed.',
        imageUrl: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=800',
        price: 'Deposit 2000 ₽',
        attendees: ['u1', 'u2', 'u3', 'u4', 'u5'],
        isOfficial: true
    }
];

// === F3: Fitness Passports ===

export const MOCK_FITNESS_PASSPORTS: Record<string, FitnessPassport> = {
    'u1': {
        trainingStyles: ['crossfit', 'strength'],
        goals: ['gain_muscle', 'competitive'],
        experienceYears: 5,
        preferredSchedule: [
            { day: 'Пн', time: '07:00' },
            { day: 'Ср', time: '07:00' },
            { day: 'Пт', time: '07:00' },
        ],
        lookingFor: 'buddy',
        bio: 'Утренний кроссфитер. Ищу напарника на WOD и силовые.',
    },
    'u2': {
        trainingStyles: ['cardio', 'yoga', 'swimming'],
        goals: ['endurance', 'health'],
        experienceYears: 8,
        preferredSchedule: [
            { day: 'Вт', time: '18:00' },
            { day: 'Чт', time: '18:00' },
            { day: 'Сб', time: '10:00' },
        ],
        lookingFor: 'group',
        bio: 'Триатлонистка. Бег, плавание, йога — в любом порядке.',
    },
    'u3': {
        trainingStyles: ['strength'],
        goals: ['gain_muscle', 'competitive'],
        experienceYears: 3,
        preferredSchedule: [
            { day: 'Пн', time: '19:00' },
            { day: 'Ср', time: '19:00' },
            { day: 'Пт', time: '19:00' },
            { day: 'Сб', time: '11:00' },
        ],
        lookingFor: 'buddy',
        bio: 'Пауэрлифтинг. Нужен страхующий на жим и присед.',
    },
    'u4': {
        trainingStyles: ['swimming', 'flexibility'],
        goals: ['health', 'social'],
        experienceYears: 1,
        preferredSchedule: [
            { day: 'Вт', time: '08:00' },
            { day: 'Сб', time: '09:00' },
        ],
        lookingFor: 'mentor',
        bio: 'Начинающий. Хочу освоить плавание и улучшить гибкость.',
    },
    'u5': {
        trainingStyles: ['crossfit', 'cardio', 'martial_arts'],
        goals: ['endurance', 'competitive'],
        experienceYears: 12,
        preferredSchedule: [
            { day: 'Пн', time: '06:00' },
            { day: 'Вт', time: '06:00' },
            { day: 'Ср', time: '06:00' },
            { day: 'Чт', time: '06:00' },
            { day: 'Пт', time: '06:00' },
        ],
        lookingFor: 'none',
        bio: 'Тренируюсь одна. Не подходите.',
    },
    'me': {
        trainingStyles: ['cardio', 'strength', 'crossfit'],
        goals: ['gain_muscle', 'endurance'],
        experienceYears: 2,
        preferredSchedule: [
            { day: 'Вт', time: '18:00' },
            { day: 'Чт', time: '18:00' },
            { day: 'Сб', time: '10:00' },
        ],
        lookingFor: 'buddy',
        bio: 'Бег + силовые. Ищу напарника для регулярных тренировок.',
    },
};

// === F3: Buddy Connections ===

export const MOCK_BUDDY_CONNECTIONS: BuddyConnection[] = [
    {
        id: 'bc1',
        userId: 'me',
        buddyId: 'u1',
        status: 'accepted',
        createdAt: '2026-02-15T10:00:00Z',
        sharedWorkouts: 12,
        bondLevel: 65,
    },
    {
        id: 'bc2',
        userId: 'me',
        buddyId: 'u2',
        status: 'accepted',
        createdAt: '2026-01-20T14:00:00Z',
        sharedWorkouts: 8,
        bondLevel: 45,
    },
    {
        id: 'bc3',
        userId: 'me',
        buddyId: 'u3',
        status: 'pending',
        createdAt: '2026-03-14T09:00:00Z',
        sharedWorkouts: 0,
        bondLevel: 0,
    },
    {
        id: 'bc4',
        userId: 'u4',
        buddyId: 'me',
        status: 'pending',
        createdAt: '2026-03-15T16:00:00Z',
        sharedWorkouts: 0,
        bondLevel: 0,
    },
    {
        id: 'bc5',
        userId: 'u1',
        buddyId: 'u3',
        status: 'accepted',
        createdAt: '2026-01-10T08:00:00Z',
        sharedWorkouts: 20,
        bondLevel: 80,
    },
    {
        id: 'bc6',
        userId: 'u2',
        buddyId: 'u5',
        status: 'accepted',
        createdAt: '2025-12-01T06:00:00Z',
        sharedWorkouts: 35,
        bondLevel: 92,
    },
];

// === F3: Open Workouts ===

export const MOCK_OPEN_WORKOUTS: OpenWorkout[] = [
    {
        id: 'ow1',
        creatorId: 'u1',
        title: 'Вечерняя силовая',
        description: 'Базовые упражнения: присед, жим, тяга. Берём рабочие веса, страхуем друг друга.',
        date: '2026-03-17',
        time: '19:00',
        maxParticipants: 4,
        participants: ['u1', 'u3'],
        trainingStyle: 'strength',
        level: 'intermediate',
        isRecurring: true,
    },
    {
        id: 'ow2',
        creatorId: 'u2',
        title: 'Утреннее кардио в парке',
        description: 'Бег 5 км по набережной + растяжка. Темп разговорный, подходит всем.',
        date: '2026-03-18',
        time: '07:00',
        maxParticipants: 8,
        participants: ['u2'],
        trainingStyle: 'cardio',
        level: 'any',
        isRecurring: true,
    },
    {
        id: 'ow3',
        creatorId: 'u3',
        title: 'Группа растяжки',
        description: 'Час на мобильность и растяжку. Фоам-роллер, стретчинг, дыхание. Идеально после тяжёлой недели.',
        date: '2026-03-19',
        time: '18:00',
        maxParticipants: 6,
        participants: ['u3', 'u4', 'u2'],
        trainingStyle: 'flexibility',
        level: 'any',
        isRecurring: false,
    },
    {
        id: 'ow4',
        creatorId: 'me',
        title: 'Кроссфит WOD субботний',
        description: 'AMRAP 20 минут. Бёрпи, подтягивания, выпады. Командный формат.',
        date: '2026-03-22',
        time: '10:00',
        maxParticipants: 6,
        participants: ['me', 'u1'],
        trainingStyle: 'crossfit',
        level: 'intermediate',
        isRecurring: true,
    },
];

// === F3: Buddy Suggestions (daily) ===

export const MOCK_BUDDY_SUGGESTIONS: BuddySuggestion[] = [
    {
        userId: 'u3',
        compatibilityScore: 82,
        matchReasons: ['Силовые тренировки', 'Пн, Ср, Пт вечером', 'Ищет напарника'],
    },
    {
        userId: 'u1',
        compatibilityScore: 75,
        matchReasons: ['Кроссфит', 'Утренние тренировки', '2 общих buddy'],
    },
    {
        userId: 'u4',
        compatibilityScore: 48,
        matchReasons: ['Сб утром', 'Плавание', 'Ищет ментора'],
    },
];

// === F3: Weekly Circle Stats (for YourCircleWidget) ===

export const MOCK_WEEKLY_CIRCLE: Array<{ userId: string; workoutsThisWeek: number }> = [
    { userId: 'u1', workoutsThisWeek: 4 },
    { userId: 'u2', workoutsThisWeek: 3 },
    { userId: 'u3', workoutsThisWeek: 3 },
    { userId: 'me', workoutsThisWeek: 1 },
];

// === F3.3: Challenge Teams Mock Data ===

const now = new Date();
const day4Start = new Date(now);
day4Start.setDate(now.getDate() - 3);
const day4End = new Date(day4Start);
day4End.setDate(day4Start.getDate() + 7);

const day2Start = new Date(now);
day2Start.setDate(now.getDate() - 1);
const day2End = new Date(day2Start);
day2End.setDate(day2Start.getDate() + 7);

const upcomingStart = new Date(now);
upcomingStart.setDate(now.getDate() + 3);
const upcomingEnd = new Date(upcomingStart);
upcomingEnd.setDate(upcomingStart.getDate() + 7);

export const MOCK_CHALLENGES: Challenge[] = [
    {
        id: 'ch1',
        title: 'Неделя движения',
        description: 'Кто наберёт больше шагов за неделю? Командный зачёт — каждый шаг на счету!',
        category: 'steps',
        target: 70000,
        unit: 'шагов',
        startDate: day4Start.toISOString(),
        endDate: day4End.toISOString(),
        status: 'active',
        teams: [
            {
                id: 'ct1',
                name: 'Шагоходы',
                members: ['me', 'u1', 'u2'],
                score: 42500,
                avatar: '\u{1F6B6}',
            },
            {
                id: 'ct2',
                name: 'Марафонцы',
                members: ['u3', 'u4', 'u5'],
                score: 38200,
                avatar: '\u{1F3C3}',
            },
        ],
        creatorId: 'u1',
        prizeDescription: 'Проигравшая команда ставит смузи',
    },
    {
        id: 'ch2',
        title: 'Марафон тренировок',
        description: 'Больше тренировок — больше очков. Групповые, персональные, самостоятельные — всё считается!',
        category: 'workouts',
        target: 20,
        unit: 'тренировок',
        startDate: day2Start.toISOString(),
        endDate: day2End.toISOString(),
        status: 'active',
        teams: [
            {
                id: 'ct3',
                name: 'Iron Squad',
                members: ['u1', 'u3'],
                score: 6,
                avatar: '\u{1F4AA}',
            },
            {
                id: 'ct4',
                name: 'Cardio Kings',
                members: ['u2', 'u5'],
                score: 5,
                avatar: '\u{1F451}',
            },
            {
                id: 'ct5',
                name: 'Flex Team',
                members: ['me', 'u4'],
                score: 4,
                avatar: '\u{26A1}',
            },
        ],
        creatorId: 'me',
        prizeDescription: 'Победители получают гостевой пасс на друга',
    },
    {
        id: 'ch3',
        title: 'Кардио-битва',
        description: 'Неделя кардио! Бег, велосипед, эллипс, плавание — засчитываются минуты активности.',
        category: 'minutes',
        target: 500,
        unit: 'минут',
        startDate: upcomingStart.toISOString(),
        endDate: upcomingEnd.toISOString(),
        status: 'upcoming',
        teams: [],
        creatorId: 'u2',
        prizeDescription: 'Бесплатный протеиновый коктейль для каждого в команде-победителе',
    },
];

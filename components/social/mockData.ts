import { UserProfile } from './types';

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

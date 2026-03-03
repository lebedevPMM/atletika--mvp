export type SocialStatus = 'green' | 'yellow' | 'red';

export type UserRole = 'guest' | 'member' | 'ambassador' | 'alumni' | 'admin';

export type BusinessIndustry =
    | 'Technology'
    | 'Real Estate'
    | 'Finance'
    | 'Logistics'
    | 'Retail'
    | 'Healthcare'
    | 'Consulting'
    | 'Energy'
    | 'Other';

export type SportLevel = 'beginner' | 'amateur' | 'pro';

export interface BusinessProfile {
    companyName: string;
    industry: BusinessIndustry;
    role: string;
    revenueRange: string; // e.g. "100M - 500M ₽"
    expertise: string[]; // e.g. ["IPO", "Marketing", "Sales"]
    description?: string;
}

export interface SportProfile {
    mainSports: string[]; // e.g. ["Triathlon", "Tennis"]
    level: SportLevel;
    achievements: string[]; // e.g. ["Ironman Finisher 2024"]
    connectedApps?: ('strava' | 'garmin')[];
}

export interface UserProfile {
    id: string;
    nickname: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;

    // Status & Roles
    isVerified: boolean; // Legacy check (keep for compatibility or remove later)
    verificationStatus: 'guest' | 'pending' | 'verified' | 'rejected';
    role: UserRole;
    status: SocialStatus;
    statusMessage?: string;

    // DNA
    business: BusinessProfile;
    sports: SportProfile;

    // Real-time Context
    currentActivity?: string;
    musicTrack?: {
        artist: string;
        title: string;
        coverUrl?: string;
    };

    // Location & Privacy
    isGeofenced: boolean;
    lastSeen?: Date;
    privacy: {
        isGhostMode: boolean;
        showRevenue: boolean;
    };

    // Gamification
    stats: {
        level: number;
        reputation: number; // "Karma"
    };
}

export type RequestType = 'need' | 'offer' | 'ask' | 'lifestyle';
export type RequestStatus = 'draft' | 'pending' | 'approved' | 'closed';

export interface BusinessRequest {
    id: string;
    authorId: string;
    type: RequestType;
    category: BusinessIndustry;
    title: string;
    description: string;
    urgency: 'normal' | 'high';
    status: RequestStatus;
    views: number;
    responses: number;
    createdAt: Date;
    expiresAt: Date;
}

export interface RaidBoss {
    id: string;
    name: string;
    maxHp: number;
    currentHp: number;
    image: string;
    level: number;
    rewards: string[];
}

export type EventType = 'business' | 'sport' | 'social';

export interface CommunityEvent {
    id: string;
    title: string;
    type: EventType;
    date: Date;
    location: string;
    organizerId: string;
    description: string;
    imageUrl?: string;
    price?: string;
    capacity?: number;
    attendees: string[]; // User IDs
    isOfficial?: boolean;
}

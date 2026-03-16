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

// === F3: Community Social Foundation Types ===

export type TrainingStyle = 'strength' | 'cardio' | 'group' | 'yoga' | 'crossfit' | 'swimming' | 'martial_arts' | 'flexibility';
export type FitnessGoal = 'lose_weight' | 'gain_muscle' | 'endurance' | 'flexibility' | 'health' | 'social' | 'competitive';
export type BuddyStatus = 'pending' | 'accepted' | 'declined';

export interface FitnessPassport {
    trainingStyles: TrainingStyle[];
    goals: FitnessGoal[];
    experienceYears: number;
    preferredSchedule: Array<{ day: string; time: string }>; // [{day: 'Вт', time: '18:00'}, ...]
    lookingFor: 'buddy' | 'group' | 'mentor' | 'none';
    bio: string; // Short fitness bio
}

export interface BuddyConnection {
    id: string;
    userId: string;
    buddyId: string;
    status: BuddyStatus;
    createdAt: string; // ISO
    sharedWorkouts: number;
    bondLevel: number; // 0-100
}

export interface OpenWorkout {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    date: string; // ISO
    time: string; // "18:00"
    maxParticipants: number;
    participants: string[]; // user IDs
    trainingStyle: TrainingStyle;
    level: 'any' | 'beginner' | 'intermediate' | 'advanced';
    isRecurring: boolean;
}

export interface BuddySuggestion {
    userId: string;
    compatibilityScore: number; // 0-100
    matchReasons: string[]; // ["Силовые тренировки", "Вт, Чт, Сб вечером", "3 общих buddy"]
}

// === F3.3: Challenge Teams Types ===

export type ChallengeCategory = 'steps' | 'workouts' | 'calories' | 'minutes' | 'custom';
export type ChallengeStatus = 'upcoming' | 'active' | 'completed';

export interface ChallengeTeam {
    id: string;
    name: string;
    members: string[]; // user IDs
    score: number;
    avatar?: string; // team emoji or URL
}

export interface Challenge {
    id: string;
    title: string;
    description: string;
    category: ChallengeCategory;
    target: number; // e.g. 10000 steps, 5 workouts
    unit: string; // "шагов", "тренировок", "минут"
    startDate: string; // ISO
    endDate: string; // ISO
    status: ChallengeStatus;
    teams: ChallengeTeam[];
    creatorId: string;
    prizeDescription?: string;
}

// === F3.5: Privacy & Safety Types ===

export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'fake_profile' | 'other';

export interface BlockedUser {
    userId: string;
    blockedAt: string; // ISO
    reason?: string;
}

export interface UserReport {
    id: string;
    reporterId: string;
    targetUserId: string;
    reason: ReportReason;
    description?: string;
    createdAt: string; // ISO
    status: 'pending' | 'reviewed' | 'resolved';
}

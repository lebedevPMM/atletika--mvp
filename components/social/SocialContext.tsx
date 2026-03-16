import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RaidBoss, SocialStatus, BusinessRequest, CommunityEvent, BuddyConnection, OpenWorkout, BuddySuggestion, BlockedUser, ReportReason, UserReport, Challenge, BuddyChat, Badge, SocialStreak } from './types';
import { MOCK_USERS, CURRENT_USER_MOCK, MOCK_REQUESTS, MOCK_EVENTS, MOCK_BUDDY_CONNECTIONS, MOCK_OPEN_WORKOUTS, MOCK_BUDDY_SUGGESTIONS, MOCK_CHALLENGES, MOCK_BUDDY_CHATS, MOCK_BADGES, MOCK_STREAKS } from './mockData';

interface SocialContextType {
    currentUser: UserProfile | null;
    activeUsers: UserProfile[]; // Users currently in gym bubble
    allMembers: UserProfile[]; // Directory Access
    requests: BusinessRequest[]; // Feed

    events: CommunityEvent[]; // Events
    selectedEventId: string | null;
    selectEvent: (id: string | null) => void;
    raidBoss: RaidBoss | null;
    checkIn: () => void;
    checkOut: () => void;
    updateStatus: (status: SocialStatus, message?: string) => void;
    logActivity: (damage: number) => void;
    toggleMusic: (track?: { artist: string; title: string }) => void;
    addRequest: (req: BusinessRequest) => void;
    toggleEventAttendance: (eventId: string) => void;
    isGuest: boolean;
    submitApplication: (data: any) => Promise<void>;

    // F3: Buddy System
    buddyConnections: BuddyConnection[];
    openWorkouts: OpenWorkout[];
    buddySuggestions: BuddySuggestion[];
    addBuddy: (userId: string) => void;
    removeBuddy: (connectionId: string) => void;
    acceptBuddy: (connectionId: string) => void;
    createOpenWorkout: (workout: Omit<OpenWorkout, 'id' | 'participants'>) => void;
    joinOpenWorkout: (workoutId: string) => void;
    leaveOpenWorkout: (workoutId: string) => void;

    // F3.3: Challenge Teams
    challenges: Challenge[];
    joinChallenge: (challengeId: string, teamId: string) => void;
    createChallenge: (challenge: Omit<Challenge, 'id' | 'status' | 'teams'>) => void;

    // F3.5: Privacy & Safety
    blockedUsers: BlockedUser[];
    blockUser: (userId: string, reason?: string) => void;
    unblockUser: (userId: string) => void;
    reportUser: (targetUserId: string, reason: ReportReason, description?: string) => void;
    toggleGhostMode: () => void;
    toggleShowRevenue: () => void;

    // F3.7: Buddy Chat
    buddyChats: BuddyChat[];
    sendBuddyMessage: (chatId: string, text: string) => void;
    getBuddyChatForUser: (userId: string) => BuddyChat | undefined;

    // F3.8: Gamification Badges & Streaks
    badges: Badge[];
    streaks: SocialStreak[];
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

const INITIAL_BOSS: RaidBoss = {
    id: 'boss_1',
    name: 'The Slother Juggernaut',
    maxHp: 1000000,
    currentHp: 850000,
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gluttony',
    level: 1,
    rewards: ['Free Protein Shake', 'Guest Pass']
};

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(CURRENT_USER_MOCK);
    const [allMembers] = useState<UserProfile[]>(MOCK_USERS);
    const [requests, setRequests] = useState<BusinessRequest[]>(MOCK_REQUESTS);
    const [events, setEvents] = useState<CommunityEvent[]>(MOCK_EVENTS);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [activeUsers, setActiveUsers] = useState<UserProfile[]>([]);
    const [raidBoss, setRaidBoss] = useState<RaidBoss | null>(INITIAL_BOSS);

    // F3: Buddy System state
    const [buddyConnections, setBuddyConnections] = useState<BuddyConnection[]>(MOCK_BUDDY_CONNECTIONS);
    const [openWorkouts, setOpenWorkouts] = useState<OpenWorkout[]>(MOCK_OPEN_WORKOUTS);
    const [buddySuggestions] = useState<BuddySuggestion[]>(MOCK_BUDDY_SUGGESTIONS);

    // F3.3: Challenge Teams state
    const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);

    // F3.7: Buddy Chat state
    const [buddyChats, setBuddyChats] = useState<BuddyChat[]>(MOCK_BUDDY_CHATS);

    // F3.8: Gamification Badges & Streaks state
    const [badges] = useState<Badge[]>(MOCK_BADGES);
    const [streaks] = useState<SocialStreak[]>(MOCK_STREAKS);

    // F3.5: Privacy & Safety state
    const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
    const [reports, setReports] = useState<UserReport[]>([]);

    // Simulation: Filter users who are "Geofenced" and NOT "Ghost", excluding blocked users
    useEffect(() => {
        const blockedIds = new Set(blockedUsers.map(b => b.userId));
        const visibleUsers = allMembers.filter(u =>
            u.isGeofenced &&
            !u.privacy.isGhostMode &&
            !blockedIds.has(u.id) &&
            !(currentUser?.privacy.isGhostMode && u.id === currentUser.id)
        );
        setActiveUsers(visibleUsers);
    }, [allMembers, blockedUsers, currentUser]);

    // Simulate Geofence Check-in/Check-out
    const checkIn = () => {
        if (currentUser) {
            const updatedUser = { ...currentUser, isGeofenced: true };
            setCurrentUser(updatedUser);
        }
    };

    const checkOut = () => {
        if (currentUser) {
            const updatedUser = { ...currentUser, isGeofenced: false };
            setCurrentUser(updatedUser);
        }
    };

    const updateStatus = (status: SocialStatus, message?: string) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, status, statusMessage: message });
        }
    };

    const logActivity = (damage: number) => {
        if (currentUser && raidBoss) {
            // Update user stats
            setCurrentUser({
                ...currentUser,
                stats: { ...currentUser.stats, level: currentUser.stats.level, reputation: currentUser.stats.reputation + 10 } // Simplified for now
            });
            // Damage boss
            setRaidBoss(prev => prev ? ({ ...prev, currentHp: Math.max(0, prev.currentHp - damage) }) : null);
        }
    };

    const toggleMusic = (track?: { artist: string; title: string }) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, musicTrack: track });
        }
    }

    const addRequest = (req: BusinessRequest) => {
        setRequests(prev => [req, ...prev]);
    }

    const toggleEventAttendance = (eventId: string) => {
        if (!currentUser) return;
        setEvents(prevEvents => prevEvents.map(event => {
            if (event.id === eventId) {
                const isAttending = event.attendees.includes(currentUser.id);
                return {
                    ...event,
                    attendees: isAttending
                        ? event.attendees.filter(id => id !== currentUser.id)
                        : [...event.attendees, currentUser.id]
                };
            }
            return event;
        }));
    };

    // F3: Buddy System methods
    const addBuddy = (userId: string) => {
        if (!currentUser) return;
        const newConnection: BuddyConnection = {
            id: `bc_${Date.now()}`,
            userId: currentUser.id,
            buddyId: userId,
            status: 'pending',
            createdAt: new Date().toISOString(),
            sharedWorkouts: 0,
            bondLevel: 0,
        };
        setBuddyConnections(prev => [...prev, newConnection]);
    };

    const removeBuddy = (connectionId: string) => {
        setBuddyConnections(prev => prev.filter(c => c.id !== connectionId));
    };

    const acceptBuddy = (connectionId: string) => {
        setBuddyConnections(prev =>
            prev.map(c => c.id === connectionId ? { ...c, status: 'accepted' as const } : c)
        );
    };

    const createOpenWorkout = (workout: Omit<OpenWorkout, 'id' | 'participants'>) => {
        if (!currentUser) return;
        const newWorkout: OpenWorkout = {
            ...workout,
            id: `ow_${Date.now()}`,
            participants: [currentUser.id],
        };
        setOpenWorkouts(prev => [...prev, newWorkout]);
    };

    const joinOpenWorkout = (workoutId: string) => {
        if (!currentUser) return;
        setOpenWorkouts(prev =>
            prev.map(w => {
                if (w.id === workoutId && !w.participants.includes(currentUser.id) && w.participants.length < w.maxParticipants) {
                    return { ...w, participants: [...w.participants, currentUser.id] };
                }
                return w;
            })
        );
    };

    const leaveOpenWorkout = (workoutId: string) => {
        if (!currentUser) return;
        setOpenWorkouts(prev =>
            prev.map(w => {
                if (w.id === workoutId) {
                    return { ...w, participants: w.participants.filter(id => id !== currentUser.id) };
                }
                return w;
            })
        );
    };

    // F3.3: Challenge Teams methods
    const joinChallenge = (challengeId: string, teamId: string) => {
        if (!currentUser) return;
        setChallenges(prev =>
            prev.map(ch => {
                if (ch.id === challengeId) {
                    return {
                        ...ch,
                        teams: ch.teams.map(team => {
                            if (team.id === teamId && !team.members.includes(currentUser.id) && team.members.length < 5) {
                                return { ...team, members: [...team.members, currentUser.id] };
                            }
                            return team;
                        }),
                    };
                }
                return ch;
            })
        );
    };

    const createChallenge = (challenge: Omit<Challenge, 'id' | 'status' | 'teams'>) => {
        const newChallenge: Challenge = {
            ...challenge,
            id: `ch_${Date.now()}`,
            status: 'upcoming',
            teams: [],
        };
        setChallenges(prev => [...prev, newChallenge]);
    };

    // F3.5: Privacy & Safety methods
    const blockUser = (userId: string, reason?: string) => {
        const newBlock: BlockedUser = {
            userId,
            blockedAt: new Date().toISOString(),
            reason,
        };
        setBlockedUsers(prev => [...prev, newBlock]);
    };

    const unblockUser = (userId: string) => {
        setBlockedUsers(prev => prev.filter(b => b.userId !== userId));
    };

    const reportUser = (targetUserId: string, reason: ReportReason, description?: string) => {
        if (!currentUser) return;
        const newReport: UserReport = {
            id: `report_${Date.now()}`,
            reporterId: currentUser.id,
            targetUserId,
            reason,
            description,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        setReports(prev => [...prev, newReport]);
    };

    const toggleGhostMode = () => {
        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                privacy: { ...currentUser.privacy, isGhostMode: !currentUser.privacy.isGhostMode },
            });
        }
    };

    const toggleShowRevenue = () => {
        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                privacy: { ...currentUser.privacy, showRevenue: !currentUser.privacy.showRevenue },
            });
        }
    };

    // F3.7: Buddy Chat methods
    const sendBuddyMessage = (chatId: string, text: string) => {
        if (!currentUser) return;
        const newMessage = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toISOString(),
            type: 'text' as const,
        };
        setBuddyChats(prev =>
            prev.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: [...chat.messages, newMessage],
                        lastMessageAt: newMessage.timestamp,
                    };
                }
                return chat;
            })
        );
    };

    const getBuddyChatForUser = (userId: string): BuddyChat | undefined => {
        return buddyChats.find(chat =>
            chat.participants.includes(userId) && chat.participants.includes(currentUser?.id || 'me')
        );
    };

    const isGuest = currentUser?.verificationStatus === 'guest';

    const submitApplication = async (data: any) => {
        // Mock API call
        console.log('Submitting application:', data);
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (currentUser) {
            setCurrentUser({
                ...currentUser,
                verificationStatus: 'pending',
                role: 'guest'
            });
        }
    };

    return (
        <SocialContext.Provider value={{
            currentUser,
            activeUsers,
            allMembers,
            requests,
            events,
            selectedEventId,
            selectEvent: setSelectedEventId,
            raidBoss,
            checkIn,
            checkOut,
            updateStatus,
            logActivity,
            toggleMusic,
            addRequest,
            toggleEventAttendance,
            isGuest,
            submitApplication,
            // F3: Buddy System
            buddyConnections,
            openWorkouts,
            buddySuggestions,
            addBuddy,
            removeBuddy,
            acceptBuddy,
            createOpenWorkout,
            joinOpenWorkout,
            leaveOpenWorkout,

            // F3.3: Challenge Teams
            challenges,
            joinChallenge,
            createChallenge,

            // F3.5: Privacy & Safety
            blockedUsers,
            blockUser,
            unblockUser,
            reportUser,
            toggleGhostMode,
            toggleShowRevenue,

            // F3.7: Buddy Chat
            buddyChats,
            sendBuddyMessage,
            getBuddyChatForUser,

            // F3.8: Gamification Badges & Streaks
            badges,
            streaks,
        }}>
            {children}
        </SocialContext.Provider>
    );
};

export const useSocial = () => {
    const context = useContext(SocialContext);
    if (context === undefined) {
        throw new Error('useSocial must be used within a SocialProvider');
    }
    return context;
};

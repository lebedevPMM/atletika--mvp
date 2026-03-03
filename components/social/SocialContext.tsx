import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RaidBoss, SocialStatus, BusinessRequest, CommunityEvent } from './types';
import { MOCK_USERS, CURRENT_USER_MOCK, MOCK_REQUESTS, MOCK_EVENTS } from './mockData';

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

    // Simulation: Filter users who are "Geofenced" and NOT "Ghost"
    useEffect(() => {
        // In a real app, this would query the backend for users in the same location
        const visibleUsers = allMembers.filter(u => u.isGeofenced && !u.privacy.isGhostMode);
        setActiveUsers(visibleUsers);
    }, [allMembers]);

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
            submitApplication
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

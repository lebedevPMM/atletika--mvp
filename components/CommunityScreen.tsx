import React, { useState } from 'react';
import { useSocial } from './social/SocialContext';
import { useTheme } from './ThemeContext';
import CheckInStatus from './social/CheckInStatus';
import GymActiveUsersList from './social/GymActiveUsersList';
import RaidBossWidget from './social/RaidBossWidget';
import StatusBeaconSelector from './social/StatusBeaconSelector';
import ChatListScreen from './ChatListScreen';
import RequestFeed from './social/RequestFeed';
import EventsList from './social/EventsList';
import { Users, MessageCircle, Briefcase, Calendar } from 'lucide-react';
import { ScreenName } from '../types';

interface CommunityScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

type Tab = 'active' | 'chats' | 'requests' | 'events';

const CommunityScreen: React.FC<CommunityScreenProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<Tab>('active');
    const { theme, isEmber } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            className="min-h-screen pb-24"
            style={{
                backgroundColor: isEmber ? 'var(--brand-bg-primary)' : undefined,
                color: isEmber ? 'var(--brand-text-primary)' : undefined
            }}
        >
            {!isEmber && <div className={`absolute inset-0 ${isDark ? 'bg-zinc-950' : 'bg-gray-50'} -z-10`} />}

            {/* Header */}
            <div
                className="sticky top-0 z-20 px-6 pt-12 pb-4 backdrop-blur-xl"
                style={isEmber ? {
                    background: 'var(--brand-nav-bg)',
                    borderBottom: '1px solid var(--brand-border)'
                } : undefined}
            >
                {!isEmber && <div className={`absolute inset-0 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'} -z-10`} />}
                <h1
                    className="text-2xl font-black uppercase italic tracking-tighter mb-4"
                    style={{ color: isEmber ? 'var(--brand-text-primary)' : undefined }}
                >
                    Network
                </h1>

                {/* Tabs */}
                <div
                    className="flex p-1 rounded-xl"
                    style={isEmber ? {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--brand-border)'
                    } : undefined}
                >
                    {!isEmber && <div className={`absolute inset-0 rounded-xl ${isDark ? 'bg-zinc-900' : 'bg-gray-100'} -z-10`} />}
                    <button
                        onClick={() => setActiveTab('active')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={isEmber ? {
                            background: activeTab === 'active' ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                            color: activeTab === 'active' ? 'var(--brand-accent)' : 'var(--brand-text-muted)',
                            boxShadow: activeTab === 'active' ? 'var(--brand-accent-glow)' : 'none'
                        } : undefined}
                    >
                        {!isEmber && <span className={activeTab === 'active' ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-black shadow-sm') : 'text-gray-400'}></span>}
                        <Users className="w-4 h-4" />
                        Gym
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={isEmber ? {
                            background: activeTab === 'requests' ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                            color: activeTab === 'requests' ? 'var(--brand-accent)' : 'var(--brand-text-muted)'
                        } : undefined}
                    >
                        <Briefcase className="w-4 h-4" />
                        Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={isEmber ? {
                            background: activeTab === 'events' ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                            color: activeTab === 'events' ? 'var(--brand-accent)' : 'var(--brand-text-muted)'
                        } : undefined}
                    >
                        <Calendar className="w-4 h-4" />
                        Events
                    </button>
                    <button
                        onClick={() => setActiveTab('chats')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                        style={isEmber ? {
                            background: activeTab === 'chats' ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                            color: activeTab === 'chats' ? 'var(--brand-accent)' : 'var(--brand-text-muted)'
                        } : undefined}
                    >
                        <MessageCircle className="w-4 h-4" />
                        Chats
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {activeTab === 'active' && (
                    <div className="space-y-6">
                        <CheckInStatus />
                        <StatusBeaconSelector />
                        <RaidBossWidget />
                        <GymActiveUsersList onNavigate={onNavigate} />
                    </div>
                )}

                {activeTab === 'requests' && (
                    <RequestFeed onNavigate={onNavigate} />
                )}

                {activeTab === 'events' && (
                    <EventsList onNavigate={onNavigate} />
                )}

                {activeTab === 'chats' && (
                    <div className="-mt-4 -mx-4">
                        <ChatListScreen onNavigate={onNavigate} embedded={true} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityScreen;

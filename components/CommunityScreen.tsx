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
import { Users, MessageCircle, Briefcase, Calendar, Compass, Trophy } from 'lucide-react';
import SuggestedBuddiesWidget from './social/SuggestedBuddiesWidget';
import YourCircleWidget from './social/YourCircleWidget';
import { ScreenName } from '../types';

interface CommunityScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

type Tab = 'active' | 'chats' | 'requests' | 'events' | 'discover';

const CommunityScreen: React.FC<CommunityScreenProps> = ({ onNavigate }) => {
    const [activeTab, setActiveTab] = useState<Tab>('active');
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div
            className="min-h-screen pb-24"
        >
            <div className={`absolute inset-0 ${isDark ? 'bg-zinc-950' : 'bg-gray-50'} -z-10`} />

            {/* Header */}
            <div
                className="sticky top-0 z-20 px-6 pt-12 pb-4 backdrop-blur-xl"
            >
                <div className={`absolute inset-0 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'} -z-10`} />
                <h1
                    className="text-2xl font-black uppercase italic tracking-tighter mb-4"
                >
                    Клуб
                </h1>

                {/* Tabs */}
                <div
                    className="flex p-1 rounded-xl"
                >
                    <div className={`absolute inset-0 rounded-xl ${isDark ? 'bg-zinc-900' : 'bg-gray-100'} -z-10`} />
                    <button
                        onClick={() => setActiveTab('active')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        <span className={activeTab === 'active' ? (isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-black shadow-sm') : 'text-gray-400'}></span>
                        <Users className="w-4 h-4" />
                        Зал
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        <Briefcase className="w-4 h-4" />
                        Запросы
                    </button>
                    <button
                        onClick={() => setActiveTab('events')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        <Calendar className="w-4 h-4" />
                        События
                    </button>
                    <button
                        onClick={() => setActiveTab('chats')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Чаты
                    </button>
                    <button
                        onClick={() => setActiveTab('discover')}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all"
                    >
                        <Compass className="w-4 h-4" />
                        Поиск
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

                {activeTab === 'discover' && (
                    <div className="space-y-6">
                        <SuggestedBuddiesWidget onNavigate={onNavigate} />
                        <YourCircleWidget onNavigate={onNavigate} />

                        {/* Open Workouts Preview */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    Открытые тренировки
                                </h3>
                                <button
                                    onClick={() => onNavigate('open_workouts')}
                                    className={`text-xs font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}
                                >
                                    Все
                                </button>
                            </div>
                            <button
                                onClick={() => onNavigate('open_workouts')}
                                className={`w-full p-4 rounded-2xl text-left active:scale-[0.98] transition-all ${isDark ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50' : 'bg-white shadow-sm hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-50'}`}>
                                        <Users className={`w-5 h-5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Найдите компанию для тренировки</p>
                                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                            Присоединяйтесь или создайте свою
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        {/* Buddy List link */}
                        <button
                            onClick={() => onNavigate('buddy_list')}
                            className={`w-full p-4 rounded-2xl text-left active:scale-[0.98] transition-all ${isDark ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50' : 'bg-white shadow-sm hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                    <Users className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Мои напарники</p>
                                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        Управление связями и запросами
                                    </p>
                                </div>
                            </div>
                        </button>

                        {/* Challenge Teams link */}
                        <button
                            onClick={() => onNavigate('challenge_teams')}
                            className={`w-full p-4 rounded-2xl text-left active:scale-[0.98] transition-all ${isDark ? 'bg-zinc-900 border border-zinc-800 hover:bg-zinc-800/50' : 'bg-white shadow-sm hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                                    <Trophy className={`w-5 h-5 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">Вызовы</p>
                                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        Командные соревнования на неделю
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityScreen;

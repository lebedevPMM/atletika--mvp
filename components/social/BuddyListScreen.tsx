import React from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, UserCheck, UserPlus, Users, ChevronRight, X, Check, Dumbbell, MessageCircle } from 'lucide-react';
import { ScreenName } from '../../types';

interface BuddyListScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const BuddyListScreen: React.FC<BuddyListScreenProps> = ({ onNavigate }) => {
    const { buddyConnections, allMembers, currentUser, acceptBuddy, removeBuddy } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const myId = currentUser?.id || 'me';

    // Incoming pending requests (someone invited me)
    const incomingPending = buddyConnections.filter(
        c => c.status === 'pending' && c.buddyId === myId
    );

    // Outgoing pending (I invited someone)
    const outgoingPending = buddyConnections.filter(
        c => c.status === 'pending' && c.userId === myId
    );

    // Accepted buddies
    const acceptedBuddies = buddyConnections.filter(
        c => c.status === 'accepted' && (c.userId === myId || c.buddyId === myId)
    );

    const getUserById = (id: string) => allMembers.find(u => u.id === id);

    const getBuddyUser = (connection: typeof buddyConnections[0]) => {
        const buddyId = connection.userId === myId ? connection.buddyId : connection.userId;
        return getUserById(buddyId);
    };

    const BondLevelBar = ({ level }: { level: number }) => (
        <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
            <div
                className="h-full rounded-full transition-all"
                style={{
                    width: `${level}%`,
                    background: level > 70
                        ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                        : level > 40
                            ? 'linear-gradient(90deg, #eab308, #f59e0b)'
                            : 'linear-gradient(90deg, #6b7280, #9ca3af)',
                }}
            />
        </div>
    );

    return (
        <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'} pb-24`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 sticky top-0 z-20 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-md`}>
                <button
                    onClick={() => onNavigate('BACK')}
                    className={`p-2 rounded-full transition-all active:scale-[0.95] ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Мои напарники</h1>
                <div className="ml-auto">
                    <button
                        onClick={() => onNavigate('community')}
                        className={`p-2 rounded-full transition-all active:scale-[0.95] ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                    >
                        <UserPlus className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Incoming Pending Requests */}
                {incomingPending.length > 0 && (
                    <div>
                        <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            Входящие запросы ({incomingPending.length})
                        </h2>
                        <div className="space-y-2">
                            {incomingPending.map(conn => {
                                const user = getBuddyUser(conn);
                                if (!user) return null;
                                return (
                                    <div
                                        key={conn.id}
                                        className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}
                                    >
                                        <img
                                            src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.nickname}`}
                                            className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                                            alt={user.firstName}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{user.firstName} {user.lastName}</p>
                                            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                Хочет стать вашим напарником
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => acceptBuddy(conn.id)}
                                                className="p-2 rounded-full bg-green-500 text-white active:scale-[0.95] transition-all"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => removeBuddy(conn.id)}
                                                className={`p-2 rounded-full active:scale-[0.95] transition-all ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-200 text-gray-500'}`}
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Outgoing Pending */}
                {outgoingPending.length > 0 && (
                    <div>
                        <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            Ожидают ответа ({outgoingPending.length})
                        </h2>
                        <div className="space-y-2">
                            {outgoingPending.map(conn => {
                                const user = getBuddyUser(conn);
                                if (!user) return null;
                                return (
                                    <div
                                        key={conn.id}
                                        className={`p-4 rounded-2xl flex items-center gap-3 opacity-70 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}
                                    >
                                        <img
                                            src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.nickname}`}
                                            className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                                            alt={user.firstName}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{user.firstName} {user.lastName}</p>
                                            <p className={`text-xs ${isDark ? 'text-yellow-500/70' : 'text-yellow-600'}`}>
                                                Запрос отправлен
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => removeBuddy(conn.id)}
                                            className={`text-xs px-3 py-1.5 rounded-lg active:scale-[0.95] transition-all ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-200 text-gray-500'}`}
                                        >
                                            Отменить
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Accepted Buddies */}
                <div>
                    <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        Напарники ({acceptedBuddies.length})
                    </h2>

                    {acceptedBuddies.length === 0 ? (
                        <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}>
                            <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                                <Users className={`w-8 h-8 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} />
                            </div>
                            <p className="font-bold mb-1">У вас пока нет напарников</p>
                            <p className={`text-sm mb-4 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                Найдите единомышленников для совместных тренировок
                            </p>
                            <button
                                onClick={() => onNavigate('community')}
                                className="px-6 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-sm active:scale-[0.98] transition-all"
                            >
                                Найти напарника
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {acceptedBuddies.map(conn => {
                                const user = getBuddyUser(conn);
                                if (!user) return null;
                                return (
                                    <div
                                        key={conn.id}
                                        className={`p-4 rounded-2xl flex items-center gap-3 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}
                                    >
                                        <button
                                            onClick={() => onNavigate('social_profile')}
                                            className="flex items-center gap-3 flex-1 min-w-0 text-left active:scale-[0.98] transition-all"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.nickname}`}
                                                    className="w-12 h-12 rounded-full bg-gray-200 object-cover"
                                                    alt={user.firstName}
                                                />
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${isDark ? 'border-zinc-900' : 'border-white'} ${user.status === 'green' ? 'bg-green-500' : user.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm truncate">{user.firstName} {user.lastName}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Dumbbell className={`w-3 h-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                                    <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                                        {conn.sharedWorkouts} совместных
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <BondLevelBar level={conn.bondLevel} />
                                                </div>
                                            </div>
                                        </button>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => onNavigate('buddy_chat')}
                                                className={`p-2.5 rounded-full transition-all active:scale-[0.95] ${isDark ? 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30' : 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100'}`}
                                                title="Написать"
                                            >
                                                <MessageCircle className="w-4.5 h-4.5" />
                                            </button>
                                            <ChevronRight
                                                className={`w-5 h-5 ${isDark ? 'text-zinc-600' : 'text-gray-400'} cursor-pointer`}
                                                onClick={() => onNavigate('social_profile')}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuddyListScreen;

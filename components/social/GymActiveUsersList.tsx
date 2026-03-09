import React from 'react';
import { useSocial } from './SocialContext';
import { UserProfile } from './types';
import { useTheme } from '../ThemeContext';
import { Dumbbell, Music, User } from 'lucide-react';
import { ScreenName } from '../../types';

interface GymActiveUsersListProps {
    onNavigate?: (screen: ScreenName, params?: any) => void;
}

const GymActiveUsersList: React.FC<GymActiveUsersListProps> = ({ onNavigate }) => {
    const { activeUsers, currentUser } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!currentUser?.isGeofenced) return null;

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center mb-3 px-1">
                <h3 className={`text-base font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>Сейчас в зале</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-200 text-gray-600'}`}>
                    {activeUsers.length} онлайн
                </span>
            </div>

            <div className="space-y-3">
                {activeUsers.length === 0 ? (
                    <div className={`text-center py-8 rounded-xl border border-dashed ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-gray-200 text-gray-400'}`}>
                        <p className="text-sm">Никого нет или вы в невидимом режиме</p>
                    </div>
                ) : (
                    activeUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            isDark={isDark}
                            onClick={() => onNavigate?.('social_profile', { userId: user.id })}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

const UserCard: React.FC<{ user: UserProfile, isDark: boolean, onClick?: () => void }> = ({ user, isDark, onClick }) => {
    const getStatusColor = (status: 'green' | 'yellow' | 'red') => {
        switch (status) {
            case 'green': return 'bg-green-500';
            case 'yellow': return 'bg-yellow-500';
            case 'red': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'} flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all`}
        >
            <div className="flex items-center gap-3">
                <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.nickname} className="w-full h-full object-cover" />
                        ) : (
                            <User className={`w-6 h-6 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`} />
                        )}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-zinc-900' : 'border-white'} ${getStatusColor(user.status)}`} />
                </div>

                <div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-gray-900'}`}>{user.firstName} {user.lastName?.[0]}.</h4>
                    {user.statusMessage && (
                        <p className={`text-xs italic ${isDark ? 'text-zinc-500' : 'text-gray-500'} mb-1`}>"{user.statusMessage}"</p>
                    )}

                    <div className="flex items-center gap-2 text-xs">
                        {user.currentActivity && (
                            <span className={`flex items-center gap-1 font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                                <Dumbbell className="w-3 h-3" />
                                {user.currentActivity}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                    Ур. {user.stats.level}
                </div>
                {user.musicTrack && (
                    <div className={`max-w-[80px] truncate text-[10px] flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        <Music className="w-3 h-3 shrink-0" />
                        {user.musicTrack.title}
                    </div>
                )}
            </div>
        </div>
    )
}

export default GymActiveUsersList;

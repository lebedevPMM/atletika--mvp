import React from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { Dumbbell, TrendingUp } from 'lucide-react';
import { MOCK_WEEKLY_CIRCLE } from './mockData';
import { ScreenName } from '../../types';

interface YourCircleWidgetProps {
    onNavigate: (screen: ScreenName) => void;
}

const YourCircleWidget: React.FC<YourCircleWidgetProps> = ({ onNavigate }) => {
    const { allMembers, currentUser } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const myId = currentUser?.id || 'me';

    const getUserById = (id: string) => {
        if (id === 'me' || id === myId) return currentUser;
        return allMembers.find(u => u.id === id);
    };

    // Sort by workouts descending
    const sorted = [...MOCK_WEEKLY_CIRCLE].sort((a, b) => b.workoutsThisWeek - a.workoutsThisWeek);
    const maxWorkouts = sorted[0]?.workoutsThisWeek || 1;

    return (
        <div className={`p-4 rounded-2xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <TrendingUp className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        Твой круг на этой неделе
                    </h3>
                </div>
            </div>

            <div className="space-y-3">
                {sorted.map((entry, idx) => {
                    const user = getUserById(entry.userId);
                    const isMe = entry.userId === 'me' || entry.userId === myId;
                    const barWidth = (entry.workoutsThisWeek / maxWorkouts) * 100;

                    return (
                        <div key={entry.userId} className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.nickname || 'U'}`}
                                    className={`w-8 h-8 rounded-full bg-gray-200 object-cover ${isMe ? 'ring-2 ring-cyan-500 ring-offset-1' : ''} ${isDark && isMe ? 'ring-offset-zinc-900' : ''}`}
                                    alt={user?.firstName || ''}
                                />
                            </div>

                            {/* Name + Bar */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium truncate ${isMe ? (isDark ? 'text-cyan-400 font-bold' : 'text-cyan-700 font-bold') : ''}`}>
                                        {isMe ? 'ТЫ' : user?.firstName || 'Участник'}
                                    </span>
                                    <span className={`text-sm font-bold tabular-nums ${isMe ? (isDark ? 'text-cyan-400' : 'text-cyan-700') : (isDark ? 'text-zinc-300' : 'text-gray-700')}`}>
                                        {entry.workoutsThisWeek}
                                    </span>
                                </div>
                                <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${barWidth}%`,
                                            background: isMe
                                                ? 'linear-gradient(90deg, #06b6d4, #0891b2)'
                                                : isDark
                                                    ? 'linear-gradient(90deg, #3f3f46, #52525b)'
                                                    : 'linear-gradient(90deg, #d1d5db, #9ca3af)',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Motivational footer */}
            {(() => {
                const myEntry = MOCK_WEEKLY_CIRCLE.find(e => e.userId === 'me' || e.userId === myId);
                const myCount = myEntry?.workoutsThisWeek || 0;
                const myRank = sorted.findIndex(e => e.userId === 'me' || e.userId === myId) + 1;
                if (myRank > 1) {
                    const leader = sorted[0];
                    const leaderUser = getUserById(leader.userId);
                    return (
                        <p className={`text-xs mt-3 pt-3 border-t text-center ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-gray-100 text-gray-400'}`}>
                            {leaderUser?.firstName || 'Лидер'} впереди на {leader.workoutsThisWeek - myCount} тренировок
                        </p>
                    );
                }
                return (
                    <p className={`text-xs mt-3 pt-3 border-t text-center ${isDark ? 'border-zinc-800 text-cyan-500/70' : 'border-gray-100 text-cyan-600'}`}>
                        Вы лидер круга на этой неделе!
                    </p>
                );
            })()}
        </div>
    );
};

export default YourCircleWidget;

import React from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { UserPlus, Clock, Star } from 'lucide-react';
import { ScreenName } from '../../types';

interface SuggestedBuddiesWidgetProps {
    onNavigate: (screen: ScreenName) => void;
}

const SuggestedBuddiesWidget: React.FC<SuggestedBuddiesWidgetProps> = ({ onNavigate }) => {
    const { buddySuggestions, allMembers, addBuddy } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getUserById = (id: string) => allMembers.find(u => u.id === id);

    const getScoreColor = (score: number) => {
        if (score > 70) return isDark ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-green-600 bg-green-50 border-green-200';
        if (score > 40) return isDark ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return isDark ? 'text-zinc-400 bg-zinc-800 border-zinc-700' : 'text-gray-500 bg-gray-100 border-gray-200';
    };

    if (buddySuggestions.length === 0) return null;

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                    Подходящие напарники
                </h3>
                <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                    Обновляется ежедневно
                </span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {buddySuggestions.map(suggestion => {
                    const user = getUserById(suggestion.userId);
                    if (!user) return null;

                    return (
                        <div
                            key={suggestion.userId}
                            className={`flex-shrink-0 w-56 p-4 rounded-2xl transition-all ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}
                        >
                            {/* Top: Avatar + Score */}
                            <div className="flex items-start gap-3 mb-3">
                                <img
                                    src={user.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user.nickname}`}
                                    className="w-11 h-11 rounded-full bg-gray-200 object-cover"
                                    alt={user.firstName}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate">{user.firstName}</p>
                                    <p className={`text-xs truncate ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        @{user.nickname}
                                    </p>
                                </div>
                                <div className={`px-2 py-1 rounded-lg text-xs font-bold border ${getScoreColor(suggestion.compatibilityScore)}`}>
                                    {suggestion.compatibilityScore}%
                                </div>
                            </div>

                            {/* Match Reasons Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {suggestion.matchReasons.map((reason, idx) => (
                                    <span
                                        key={idx}
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-100 text-gray-600'}`}
                                    >
                                        {reason}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => addBuddy(suggestion.userId)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-600 text-white text-xs font-bold active:scale-[0.98] transition-all"
                                >
                                    <UserPlus className="w-3.5 h-3.5" />
                                    Пригласить
                                </button>
                                <button
                                    className={`px-3 py-2 rounded-xl text-xs font-bold active:scale-[0.98] transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    <Clock className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SuggestedBuddiesWidget;

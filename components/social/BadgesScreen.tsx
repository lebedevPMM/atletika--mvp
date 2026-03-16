import React, { useState } from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Lock, Flame, Trophy } from 'lucide-react';
import { ScreenName } from '../../types';
import { Badge, BadgeRarity, SocialStreak } from './types';

interface BadgesScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const RARITY_COLORS: Record<BadgeRarity, { border: string; darkBorder: string; text: string; bg: string; darkBg: string; label: string }> = {
    common: {
        border: 'border-gray-300',
        darkBorder: 'border-zinc-600',
        text: 'text-gray-500',
        bg: 'bg-gray-100',
        darkBg: 'bg-zinc-800',
        label: 'Обычный',
    },
    rare: {
        border: 'border-blue-400',
        darkBorder: 'border-blue-500/50',
        text: 'text-blue-500',
        bg: 'bg-blue-50',
        darkBg: 'bg-blue-500/10',
        label: 'Редкий',
    },
    epic: {
        border: 'border-purple-400',
        darkBorder: 'border-purple-500/50',
        text: 'text-purple-500',
        bg: 'bg-purple-50',
        darkBg: 'bg-purple-500/10',
        label: 'Эпический',
    },
    legendary: {
        border: 'border-yellow-400',
        darkBorder: 'border-yellow-500/50',
        text: 'text-yellow-500',
        bg: 'bg-yellow-50',
        darkBg: 'bg-yellow-500/10',
        label: 'Легендарный',
    },
};

const STREAK_LABELS: Record<SocialStreak['type'], { label: string; icon: string }> = {
    buddy_workout: { label: 'Парные тренировки', icon: '\u{1F4AA}' },
    daily_checkin: { label: 'Ежедневные посещения', icon: '\u{1F525}' },
    challenge_participation: { label: 'Участие в вызовах', icon: '\u{1F3AF}' },
};

const BadgesScreen: React.FC<BadgesScreenProps> = ({ onNavigate }) => {
    const { badges, streaks } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [expandedBadge, setExpandedBadge] = useState<string | null>(null);

    const unlockedCount = badges.filter(b => b.unlockedAt).length;

    const toggleBadge = (badgeId: string) => {
        setExpandedBadge(prev => prev === badgeId ? null : badgeId);
    };

    const renderStreakCard = (streak: SocialStreak) => {
        const config = STREAK_LABELS[streak.type];
        return (
            <div
                key={streak.type}
                className={`flex-1 min-w-0 p-3 rounded-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-sm'}`}
            >
                <div className="text-center">
                    <div className="text-xl mb-1">{config.icon}</div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xl font-black">{streak.currentStreak}</span>
                    </div>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        {config.label}
                    </p>
                    <p className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        Лучший: {streak.bestStreak}
                    </p>
                </div>
            </div>
        );
    };

    const renderBadgeCard = (badge: Badge) => {
        const isUnlocked = !!badge.unlockedAt;
        const hasProgress = !isUnlocked && badge.progress !== undefined && badge.progress > 0;
        const rarity = RARITY_COLORS[badge.rarity];
        const isExpanded = expandedBadge === badge.id;

        return (
            <div
                key={badge.id}
                onClick={() => toggleBadge(badge.id)}
                className={`relative p-3 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isDark
                        ? `bg-zinc-900 ${isUnlocked ? rarity.darkBorder : 'border-zinc-800'}`
                        : `bg-white ${isUnlocked ? rarity.border : 'border-gray-200'} shadow-sm`
                } ${!isUnlocked ? 'opacity-60' : ''}`}
            >
                {/* Lock overlay for locked badges */}
                {!isUnlocked && (
                    <div className="absolute top-2 right-2">
                        <Lock className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                    </div>
                )}

                {/* Badge icon */}
                <div className="text-center mb-2">
                    <span className={`text-3xl ${!isUnlocked ? 'grayscale' : ''}`} style={{ filter: !isUnlocked ? 'grayscale(0.7)' : undefined }}>
                        {badge.icon}
                    </span>
                </div>

                {/* Badge name */}
                <p className={`text-xs font-bold text-center mb-1 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {badge.name}
                </p>

                {/* Rarity label */}
                <div className="flex justify-center mb-1.5">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${rarity.text}`}>
                        {rarity.label}
                    </span>
                </div>

                {/* Progress bar for partially completed */}
                {hasProgress && (
                    <div className="mt-1.5">
                        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                            <div
                                className={`h-full rounded-full transition-all ${
                                    badge.rarity === 'rare' ? 'bg-blue-500' :
                                    badge.rarity === 'epic' ? 'bg-purple-500' :
                                    badge.rarity === 'legendary' ? 'bg-yellow-500' :
                                    'bg-gray-400'
                                }`}
                                style={{ width: `${badge.progress}%` }}
                            />
                        </div>
                        <p className={`text-[10px] text-center mt-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            {badge.progress}%
                        </p>
                    </div>
                )}

                {/* Expanded description */}
                {isExpanded && (
                    <div className={`mt-2 pt-2 border-t ${isDark ? 'border-zinc-700' : 'border-gray-100'}`}>
                        <p className={`text-[11px] text-center ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {badge.description}
                        </p>
                        <p className={`text-[10px] text-center mt-1 font-medium ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            {badge.requirement}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'} pb-24`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 sticky top-0 z-20 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-md`}>
                <button
                    onClick={() => onNavigate('BACK')}
                    className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold flex-1">Достижения</h1>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-500">{unlockedCount}/{badges.length}</span>
                </div>
            </div>

            <div className="px-4 space-y-6">
                {/* Streaks Section */}
                <div>
                    <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        <Flame className="w-4 h-4 inline-block mr-1 text-orange-500" />
                        Текущие серии
                    </h2>
                    <div className="flex gap-2">
                        {streaks.map(renderStreakCard)}
                    </div>
                </div>

                {/* Badges Grid */}
                <div>
                    <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                        <Trophy className="w-4 h-4 inline-block mr-1 text-yellow-500" />
                        Все значки
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                        {badges.map(renderBadgeCard)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BadgesScreen;

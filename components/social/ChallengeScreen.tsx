import React from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { Trophy, Users, Flame, Timer, Plus, ArrowLeft, Target, Zap } from 'lucide-react';
import { ScreenName } from '../../types';
import { Challenge, ChallengeCategory } from './types';

interface ChallengeScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const CATEGORY_CONFIG: Record<ChallengeCategory, { icon: React.ReactNode; label: string; color: string; bgColor: string; darkBgColor: string }> = {
    steps: {
        icon: <Target className="w-3.5 h-3.5" />,
        label: 'Шаги',
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        darkBgColor: 'bg-blue-500/10',
    },
    workouts: {
        icon: <Flame className="w-3.5 h-3.5" />,
        label: 'Тренировки',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        darkBgColor: 'bg-orange-500/10',
    },
    calories: {
        icon: <Zap className="w-3.5 h-3.5" />,
        label: 'Калории',
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        darkBgColor: 'bg-red-500/10',
    },
    minutes: {
        icon: <Timer className="w-3.5 h-3.5" />,
        label: 'Минуты',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        darkBgColor: 'bg-purple-500/10',
    },
    custom: {
        icon: <Trophy className="w-3.5 h-3.5" />,
        label: 'Особый',
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-50',
        darkBgColor: 'bg-cyan-500/10',
    },
};

const ChallengeScreen: React.FC<ChallengeScreenProps> = ({ onNavigate }) => {
    const { challenges, allMembers, currentUser, joinChallenge } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const myId = currentUser?.id || 'me';

    const activeChallenges = challenges.filter(c => c.status === 'active');
    const upcomingChallenges = challenges.filter(c => c.status === 'upcoming');

    const getUserName = (userId: string): string => {
        if (userId === myId) return 'Вы';
        const user = allMembers.find(u => u.id === userId);
        return user ? user.firstName : userId;
    };

    const getDaysInfo = (challenge: Challenge): { current: number; total: number; remaining: number } => {
        const start = new Date(challenge.startDate);
        const end = new Date(challenge.endDate);
        const now = new Date();
        const totalMs = end.getTime() - start.getTime();
        const elapsedMs = now.getTime() - start.getTime();
        const total = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
        const current = Math.max(1, Math.min(total, Math.ceil(elapsedMs / (1000 * 60 * 60 * 24))));
        const remaining = Math.max(0, total - current);
        return { current, total, remaining };
    };

    const getDaysUntilStart = (challenge: Challenge): number => {
        const start = new Date(challenge.startDate);
        const now = new Date();
        return Math.max(0, Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    };

    const getMaxScore = (challenge: Challenge): number => {
        if (challenge.teams.length === 0) return challenge.target;
        return Math.max(...challenge.teams.map(t => t.score), 1);
    };

    const isUserInChallenge = (challenge: Challenge): boolean => {
        return challenge.teams.some(team => team.members.includes(myId));
    };

    const ActiveChallengeCard = ({ challenge }: { challenge: Challenge }) => {
        const days = getDaysInfo(challenge);
        const cat = CATEGORY_CONFIG[challenge.category];
        const maxScore = getMaxScore(challenge);
        const sortedTeams = [...challenge.teams].sort((a, b) => b.score - a.score);

        return (
            <div className={`rounded-2xl p-4 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cat.color} ${isDark ? cat.darkBgColor : cat.bgColor}`}>
                                {cat.icon}
                                {cat.label}
                            </span>
                            <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                День {days.current} / {days.total}
                            </span>
                        </div>
                        <h3 className="font-bold text-base">{challenge.title}</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {challenge.description}
                        </p>
                    </div>
                </div>

                {/* Progress bar (days) */}
                <div className="mb-4">
                    <div className={`w-full h-1.5 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`}>
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                            style={{ width: `${(days.current / days.total) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            Осталось {days.remaining} дн.
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                            Цель: {challenge.target.toLocaleString()} {challenge.unit}
                        </span>
                    </div>
                </div>

                {/* Team standings */}
                <div className="space-y-2">
                    {sortedTeams.map((team, index) => {
                        const progressPct = Math.min(100, (team.score / challenge.target) * 100);
                        const isMyTeam = team.members.includes(myId);
                        return (
                            <div
                                key={team.id}
                                className={`p-3 rounded-xl ${isMyTeam
                                    ? (isDark ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200')
                                    : (isDark ? 'bg-zinc-800/50' : 'bg-gray-50')
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">{team.avatar || '#'}</span>
                                        <span className={`font-bold text-sm ${isMyTeam ? (isDark ? 'text-cyan-400' : 'text-cyan-700') : ''}`}>
                                            {index === 0 ? '1.' : `${index + 1}.`} {team.name}
                                        </span>
                                        {isMyTeam && (
                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isDark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                                                ВЫ
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-sm tabular-nums">
                                        {team.score.toLocaleString()}
                                    </span>
                                </div>
                                {/* Score progress */}
                                <div className={`w-full h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-gray-200'}`}>
                                    <div
                                        className={`h-full rounded-full transition-all ${isMyTeam
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                                            : (isDark ? 'bg-zinc-500' : 'bg-gray-400')
                                        }`}
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                                {/* Members */}
                                <div className="flex items-center gap-1 mt-1.5">
                                    <Users className={`w-3 h-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                    <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                        {team.members.map(id => getUserName(id)).join(', ')}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Prize */}
                {challenge.prizeDescription && (
                    <div className={`mt-3 flex items-center gap-2 p-2.5 rounded-xl ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                        <Trophy className={`w-4 h-4 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`} />
                        <span className={`text-xs font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                            {challenge.prizeDescription}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const UpcomingChallengeCard = ({ challenge }: { challenge: Challenge }) => {
        const daysUntil = getDaysUntilStart(challenge);
        const cat = CATEGORY_CONFIG[challenge.category];
        const alreadyJoined = isUserInChallenge(challenge);

        return (
            <div className={`rounded-2xl p-4 ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}>
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cat.color} ${isDark ? cat.darkBgColor : cat.bgColor}`}>
                                {cat.icon}
                                {cat.label}
                            </span>
                            <span className={`text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                Через {daysUntil} дн.
                            </span>
                        </div>
                        <h3 className="font-bold text-base">{challenge.title}</h3>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {challenge.description}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            <Target className="w-3.5 h-3.5" />
                            <span>{challenge.target.toLocaleString()} {challenge.unit}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            <Users className="w-3.5 h-3.5" />
                            <span>{challenge.teams.length} команд</span>
                        </div>
                    </div>

                    {!alreadyJoined ? (
                        <button
                            className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs active:scale-[0.98] transition-all"
                        >
                            Присоединиться
                        </button>
                    ) : (
                        <span className={`text-xs font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                            Вы участвуете
                        </span>
                    )}
                </div>

                {/* Prize */}
                {challenge.prizeDescription && (
                    <div className={`mt-3 flex items-center gap-2 p-2.5 rounded-xl ${isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
                        <Trophy className={`w-4 h-4 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`} />
                        <span className={`text-xs font-medium ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                            {challenge.prizeDescription}
                        </span>
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
                    className={`p-2 rounded-full transition-all active:scale-[0.95] ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Вызовы</h1>
            </div>

            <div className="px-4 space-y-6">
                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                    <div>
                        <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            Активные ({activeChallenges.length})
                        </h2>
                        <div className="space-y-3">
                            {activeChallenges.map(challenge => (
                                <ActiveChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Upcoming Challenges */}
                {upcomingChallenges.length > 0 && (
                    <div>
                        <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            Скоро ({upcomingChallenges.length})
                        </h2>
                        <div className="space-y-3">
                            {upcomingChallenges.map(challenge => (
                                <UpcomingChallengeCard key={challenge.id} challenge={challenge} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {activeChallenges.length === 0 && upcomingChallenges.length === 0 && (
                    <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}>
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                            <Trophy className={`w-8 h-8 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} />
                        </div>
                        <p className="font-bold mb-1">Пока нет вызовов</p>
                        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Создайте первый командный вызов!
                        </p>
                    </div>
                )}
            </div>

            {/* FAB — Create new challenge */}
            <button
                className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-cyan-600 text-white shadow-lg shadow-cyan-600/30 flex items-center justify-center active:scale-[0.95] transition-all z-30"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ChallengeScreen;

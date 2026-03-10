import React from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Dumbbell, Music, Zap, Hand, MessageSquare, Briefcase, Trophy, Building2, Medal } from 'lucide-react';
import { ScreenName } from '../../types';

interface SocialProfileScreenProps {
    onNavigate: (screen: ScreenName) => void;
    userId?: string;
}

const SocialProfileScreen: React.FC<SocialProfileScreenProps> = ({ onNavigate, userId }) => {
    const { allMembers } = useSocial(); // Search in ALL members, not just active
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const targetUser = allMembers.find(u => u.id === userId) || allMembers[0];

    if (!targetUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Пользователь не найден</p>
                <button onClick={() => onNavigate('BACK')}>Назад</button>
            </div>
        )
    }

    const isBusinessVisible = !targetUser.privacy.isGhostMode;

    return (
        <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'} pb-24`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-4 sticky top-0 z-20 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-md`}>
                <button onClick={() => onNavigate('BACK')} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}>
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">Профиль</h1>
            </div>

            <div className="flex flex-col items-center pt-4 pb-8 px-6">
                {/* Avatar & Ident */}
                <div className="w-28 h-28 rounded-full p-1 border-2 border-cyan-500 mb-4 relative shadow-lg shadow-cyan-500/20">
                    <img src={targetUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${targetUser.nickname}`} className="w-full h-full rounded-full bg-gray-200 object-cover" alt={targetUser.nickname} />
                    <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 ${isDark ? 'border-zinc-950' : 'border-gray-50'} ${targetUser.status === 'green' ? 'bg-green-500' : targetUser.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                </div>

                <h2 className="text-3xl font-black mb-1 text-center tracking-tight">{targetUser.firstName} {targetUser.lastName}</h2>
                <p className={`text-sm mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>@{targetUser.nickname}</p>

                <div className="flex items-center gap-3 mb-8">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-600'}`}>
                        {targetUser.role}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-100 text-yellow-700'}`}>
                        <Trophy className="w-3 h-3" /> Karma {targetUser.stats.reputation}
                    </span>
                </div>

                {/* Business DNA Card */}
                <div className={`w-full p-6 rounded-3xl mb-4 relative overflow-hidden ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-xl shadow-gray-200/50'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -mr-10 -mt-10"></div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-wider opacity-70">Бизнес-профиль</h3>
                    </div>

                    {isBusinessVisible ? (
                        <div className="space-y-4 relative z-10">
                            <div>
                                <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Компания</p>
                                <div className="font-bold text-lg flex items-center gap-2">
                                    <Building2 className="w-4 h-4 opacity-50" />
                                    {targetUser.business.companyName}
                                </div>
                                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>{targetUser.business.role}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Отрасль</p>
                                    <p className="font-medium">{targetUser.business.industry}</p>
                                </div>
                                {targetUser.privacy.showRevenue && (
                                    <div>
                                        <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Выручка</p>
                                        <p className="font-medium text-green-500">{targetUser.business.revenueRange}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs opacity-50 uppercase tracking-widest mb-2">Экспертиза</p>
                                <div className="flex flex-wrap gap-2">
                                    {targetUser.business.expertise.map(tag => (
                                        <span key={tag} className={`px-2 py-1 rounded-lg text-xs font-medium border ${isDark ? 'border-zinc-700 bg-zinc-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4 opacity-50 italic">
                            Информация скрыта пользователем
                        </div>
                    )}
                </div>

                {/* Sports DNA Card */}
                <div className={`w-full p-6 rounded-3xl mb-8 relative overflow-hidden ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-xl shadow-gray-200/50'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-bl-[100px] -mr-10 -mt-10"></div>

                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                            <Dumbbell className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-wider opacity-70">Спорт-профиль</h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs opacity-50 uppercase tracking-widest mb-1">Основные виды спорта</p>
                                <div className="font-bold text-lg">{targetUser.sports.mainSports.join(', ')}</div>
                            </div>
                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${targetUser.sports.level === 'pro' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-gray-300'}`}>
                                {targetUser.sports.level}
                            </div>
                        </div>

                        {targetUser.sports.achievements.length > 0 && (
                            <div>
                                <p className="text-xs opacity-50 uppercase tracking-widest mb-2">Достижения</p>
                                <div className="space-y-2">
                                    {targetUser.sports.achievements.map(ach => (
                                        <div key={ach} className="flex items-center gap-2 text-sm">
                                            <Medal className="w-4 h-4 text-yellow-500" />
                                            {ach}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 w-full">
                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-cyan-600 text-white font-bold active:scale-95 transition-transform shadow-lg shadow-cyan-500/30">
                        <Hand className="w-6 h-6" />
                        Дать пять
                    </button>
                    <button className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl font-bold active:scale-95 transition-transform ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white shadow-sm hover:bg-gray-50'}`}>
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Запросить место
                    </button>
                    <button className={`col-span-2 flex items-center justify-center gap-2 p-4 rounded-2xl font-bold active:scale-95 transition-transform ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white shadow-sm hover:bg-gray-50'}`}>
                        <MessageSquare className="w-5 h-5" />
                        Написать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SocialProfileScreen;

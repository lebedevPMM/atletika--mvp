import React, { useState } from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Dumbbell, Music, Zap, Hand, MessageSquare, Briefcase, Trophy, Building2, Medal, MoreVertical, Ban, Flag, X, AlertTriangle, Send } from 'lucide-react';
import { ScreenName } from '../../types';
import { ReportReason } from './types';

interface SocialProfileScreenProps {
    onNavigate: (screen: ScreenName) => void;
    userId?: string;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Спам' },
    { value: 'harassment', label: 'Оскорбления или травля' },
    { value: 'inappropriate', label: 'Неуместный контент' },
    { value: 'fake_profile', label: 'Фейковый профиль' },
    { value: 'other', label: 'Другое' },
];

const SocialProfileScreen: React.FC<SocialProfileScreenProps> = ({ onNavigate, userId }) => {
    const { allMembers, blockUser, reportUser, blockedUsers } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // F3.5: Menu & modals state
    const [showMenu, setShowMenu] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showReportSheet, setShowReportSheet] = useState(false);
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [reportDescription, setReportDescription] = useState('');
    const [reportSubmitted, setReportSubmitted] = useState(false);

    const targetUser = allMembers.find(u => u.id === userId) || allMembers[0];
    const isBlocked = targetUser ? blockedUsers.some(b => b.userId === targetUser.id) : false;

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
                <h1 className="text-lg font-bold flex-1">Профиль</h1>
                <button
                    onClick={() => setShowMenu(true)}
                    className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                >
                    <MoreVertical className="w-5 h-5" />
                </button>
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

            {/* F3.5: More Menu Bottom Sheet */}
            {showMenu && (
                <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowMenu(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div
                        className={`relative w-full max-w-sm rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-200 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                        <div className="space-y-2">
                            <button
                                onClick={() => { setShowMenu(false); setShowBlockConfirm(true); }}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left font-medium transition-colors ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-gray-50 text-gray-900'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <Ban className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{isBlocked ? 'Разблокировать' : 'Заблокировать'}</p>
                                    <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                        {isBlocked ? 'Снять блокировку пользователя' : 'Скрыть из ленты и списков'}
                                    </p>
                                </div>
                            </button>
                            <button
                                onClick={() => { setShowMenu(false); setShowReportSheet(true); }}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left font-medium transition-colors ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-gray-50 text-gray-900'}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Flag className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">Пожаловаться</p>
                                    <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>Сообщить о нарушении</p>
                                </div>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowMenu(false)}
                            className={`w-full mt-4 p-3 rounded-2xl text-center font-medium text-sm ${isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            )}

            {/* F3.5: Block Confirmation Dialog */}
            {showBlockConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={() => setShowBlockConfirm(false)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        className={`relative w-full max-w-sm rounded-3xl p-6 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                            {isBlocked ? <Ban className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
                        </div>
                        <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {isBlocked ? 'Разблокировать' : 'Заблокировать'} {targetUser.firstName}?
                        </h3>
                        <p className={`text-sm text-center mb-6 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {isBlocked
                                ? 'Пользователь снова сможет видеть вас и отправлять сообщения.'
                                : 'Пользователь не сможет видеть вас в зале и отправлять сообщения. Вы перестанете видеть этого пользователя.'
                            }
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => {
                                    blockUser(targetUser.id);
                                    setShowBlockConfirm(false);
                                }}
                                className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200/50"
                            >
                                {isBlocked ? 'Да, разблокировать' : 'Да, заблокировать'}
                            </button>
                            <button
                                onClick={() => setShowBlockConfirm(false)}
                                className={`w-full py-3.5 rounded-xl font-medium ${isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* F3.5: Report Bottom Sheet */}
            {showReportSheet && (
                <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => { setShowReportSheet(false); setSelectedReason(null); setReportDescription(''); setReportSubmitted(false); }}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div
                        className={`relative w-full max-w-sm rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-200 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

                        {reportSubmitted ? (
                            <div className="text-center py-6">
                                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Flag className="w-7 h-7" />
                                </div>
                                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Жалоба отправлена</h3>
                                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Мы рассмотрим обращение в течение 24 часов.</p>
                                <button
                                    onClick={() => { setShowReportSheet(false); setSelectedReason(null); setReportDescription(''); setReportSubmitted(false); }}
                                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-bold"
                                >
                                    Готово
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Пожаловаться</h3>
                                    <button
                                        onClick={() => { setShowReportSheet(false); setSelectedReason(null); setReportDescription(''); }}
                                        className={`p-1 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <p className={`text-sm mb-4 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>Выберите причину жалобы:</p>

                                <div className="space-y-2 mb-5">
                                    {REPORT_REASONS.map(r => (
                                        <button
                                            key={r.value}
                                            onClick={() => setSelectedReason(r.value)}
                                            className={`w-full text-left p-3.5 rounded-xl text-sm font-medium transition-colors border ${
                                                selectedReason === r.value
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : isDark
                                                        ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-750'
                                                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>

                                {selectedReason && (
                                    <div className="mb-5">
                                        <textarea
                                            value={reportDescription}
                                            onChange={e => setReportDescription(e.target.value)}
                                            placeholder="Опишите проблему (необязательно)"
                                            rows={3}
                                            className={`w-full p-3 rounded-xl text-sm border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                                isDark ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                                            }`}
                                        />
                                    </div>
                                )}

                                <button
                                    disabled={!selectedReason}
                                    onClick={() => {
                                        if (selectedReason) {
                                            reportUser(targetUser.id, selectedReason, reportDescription || undefined);
                                            setReportSubmitted(true);
                                        }
                                    }}
                                    className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Отправить жалобу
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SocialProfileScreen;

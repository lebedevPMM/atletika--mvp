import React, { useState } from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Plus, Users, Calendar, Clock, Dumbbell, MapPin, ChevronDown, X } from 'lucide-react';
import { ScreenName } from '../../types';
import { TrainingStyle, OpenWorkout } from './types';

interface OpenWorkoutsScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const TRAINING_STYLE_LABELS: Record<TrainingStyle, string> = {
    strength: 'Силовая',
    cardio: 'Кардио',
    group: 'Групповая',
    yoga: 'Йога',
    crossfit: 'Кроссфит',
    swimming: 'Плавание',
    martial_arts: 'Единоборства',
    flexibility: 'Растяжка',
};

const LEVEL_LABELS: Record<string, string> = {
    any: 'Любой',
    beginner: 'Начинающий',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
};

const OpenWorkoutsScreen: React.FC<OpenWorkoutsScreenProps> = ({ onNavigate }) => {
    const { openWorkouts, allMembers, currentUser, joinOpenWorkout, leaveOpenWorkout, createOpenWorkout } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [filterStyle, setFilterStyle] = useState<TrainingStyle | 'all'>('all');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Create form state
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('18:00');
    const [newMax, setNewMax] = useState(4);
    const [newStyle, setNewStyle] = useState<TrainingStyle>('strength');
    const [newLevel, setNewLevel] = useState<'any' | 'beginner' | 'intermediate' | 'advanced'>('any');

    const myId = currentUser?.id || 'me';

    const getUserById = (id: string) => allMembers.find(u => u.id === id);

    const filteredWorkouts = openWorkouts.filter(w =>
        filterStyle === 'all' || w.trainingStyle === filterStyle
    );

    const handleCreate = () => {
        if (!newTitle.trim() || !newDate) return;
        createOpenWorkout({
            creatorId: myId,
            title: newTitle,
            description: newDescription,
            date: newDate,
            time: newTime,
            maxParticipants: newMax,
            trainingStyle: newStyle,
            level: newLevel,
            isRecurring: false,
        });
        setShowCreateForm(false);
        setNewTitle('');
        setNewDescription('');
        setNewDate('');
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
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
                <h1 className="text-lg font-bold">Открытые тренировки</h1>
            </div>

            {/* Filter Pills */}
            <div className="px-4 pb-3">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                        onClick={() => setFilterStyle('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all active:scale-[0.98] ${filterStyle === 'all' ? 'bg-cyan-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-600')}`}
                    >
                        Все
                    </button>
                    {(Object.keys(TRAINING_STYLE_LABELS) as TrainingStyle[]).map(style => (
                        <button
                            key={style}
                            onClick={() => setFilterStyle(style)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all active:scale-[0.98] ${filterStyle === style ? 'bg-cyan-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-600')}`}
                        >
                            {TRAINING_STYLE_LABELS[style]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Workouts List */}
            <div className="px-4 space-y-3">
                {filteredWorkouts.length === 0 ? (
                    <div className={`p-8 rounded-2xl text-center ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}>
                        <Dumbbell className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} />
                        <p className="font-bold mb-1">Нет тренировок</p>
                        <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                            Создайте первую открытую тренировку
                        </p>
                    </div>
                ) : (
                    filteredWorkouts.map(workout => {
                        const creator = getUserById(workout.creatorId);
                        const isJoined = workout.participants.includes(myId);
                        const isFull = workout.participants.length >= workout.maxParticipants;
                        const isCreator = workout.creatorId === myId;

                        return (
                            <div
                                key={workout.id}
                                className={`p-4 rounded-2xl transition-all ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-sm'}`}
                            >
                                {/* Top row: style badge + recurring */}
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-700'}`}>
                                        {TRAINING_STYLE_LABELS[workout.trainingStyle]}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                        {LEVEL_LABELS[workout.level]}
                                    </span>
                                    {workout.isRecurring && (
                                        <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                            Регулярная
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-base mb-1">{workout.title}</h3>
                                <p className={`text-sm mb-3 line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    {workout.description}
                                </p>

                                {/* Meta row */}
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                        <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                            {formatDate(workout.date)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                        <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                            {workout.time}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className={`w-3.5 h-3.5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                                        <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                            {workout.participants.length}/{workout.maxParticipants}
                                        </span>
                                    </div>
                                </div>

                                {/* Creator + Participants avatars + Action */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {creator && (
                                            <img
                                                src={creator.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${creator.nickname}`}
                                                className="w-7 h-7 rounded-full bg-gray-200 object-cover"
                                                alt={creator.firstName}
                                            />
                                        )}
                                        {/* Participant avatars (stacked) */}
                                        <div className="flex -space-x-2">
                                            {workout.participants
                                                .filter(pid => pid !== workout.creatorId)
                                                .slice(0, 3)
                                                .map(pid => {
                                                    const pUser = getUserById(pid);
                                                    return pUser ? (
                                                        <img
                                                            key={pid}
                                                            src={pUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${pUser.nickname}`}
                                                            className={`w-6 h-6 rounded-full bg-gray-200 object-cover border-2 ${isDark ? 'border-zinc-900' : 'border-white'}`}
                                                            alt={pUser.firstName}
                                                        />
                                                    ) : null;
                                                })}
                                        </div>
                                        {creator && (
                                            <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                                {creator.firstName}
                                            </span>
                                        )}
                                    </div>

                                    {isCreator ? (
                                        <span className={`text-xs px-3 py-1.5 rounded-lg font-bold ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-500'}`}>
                                            Ваша
                                        </span>
                                    ) : isJoined ? (
                                        <button
                                            onClick={() => leaveOpenWorkout(workout.id)}
                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold active:scale-[0.98] transition-all ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                        >
                                            Покинуть
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => !isFull && joinOpenWorkout(workout.id)}
                                            disabled={isFull}
                                            className={`text-xs px-3 py-1.5 rounded-lg font-bold active:scale-[0.98] transition-all ${isFull ? 'opacity-40 cursor-not-allowed' : ''} ${isDark ? 'bg-cyan-600 text-white' : 'bg-cyan-600 text-white'}`}
                                        >
                                            {isFull ? 'Мест нет' : 'Присоединиться'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* FAB */}
            <button
                onClick={() => setShowCreateForm(true)}
                className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center active:scale-[0.95] transition-all z-30"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Create Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateForm(false)} />
                    <div className={`relative w-full max-w-md rounded-t-3xl p-6 pb-10 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold">Новая тренировка</h2>
                            <button
                                onClick={() => setShowCreateForm(false)}
                                className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    Название
                                </label>
                                <input
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    placeholder="Вечерняя силовая"
                                    className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-zinc-800 text-white placeholder:text-zinc-600 border border-zinc-700' : 'bg-gray-100 text-gray-900 placeholder:text-gray-400 border border-gray-200'}`}
                                />
                            </div>

                            <div>
                                <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    Описание
                                </label>
                                <textarea
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                    placeholder="Что будем делать?"
                                    rows={2}
                                    className={`w-full px-4 py-3 rounded-xl text-sm resize-none ${isDark ? 'bg-zinc-800 text-white placeholder:text-zinc-600 border border-zinc-700' : 'bg-gray-100 text-gray-900 placeholder:text-gray-400 border border-gray-200'}`}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        Дата
                                    </label>
                                    <input
                                        type="date"
                                        value={newDate}
                                        onChange={e => setNewDate(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        Время
                                    </label>
                                    <input
                                        type="time"
                                        value={newTime}
                                        onChange={e => setNewTime(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        Тип
                                    </label>
                                    <select
                                        value={newStyle}
                                        onChange={e => setNewStyle(e.target.value as TrainingStyle)}
                                        className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}
                                    >
                                        {(Object.keys(TRAINING_STYLE_LABELS) as TrainingStyle[]).map(s => (
                                            <option key={s} value={s}>{TRAINING_STYLE_LABELS[s]}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`text-xs font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                        Макс. чел.
                                    </label>
                                    <input
                                        type="number"
                                        value={newMax}
                                        onChange={e => setNewMax(Number(e.target.value))}
                                        min={2}
                                        max={20}
                                        className={`w-full px-4 py-3 rounded-xl text-sm ${isDark ? 'bg-zinc-800 text-white border border-zinc-700' : 'bg-gray-100 text-gray-900 border border-gray-200'}`}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={!newTitle.trim() || !newDate}
                                className={`w-full py-3.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-all ${!newTitle.trim() || !newDate ? 'opacity-40 cursor-not-allowed' : ''} bg-cyan-600 text-white`}
                            >
                                Создать тренировку
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpenWorkoutsScreen;

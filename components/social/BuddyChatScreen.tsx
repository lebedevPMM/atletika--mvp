import React, { useState, useRef, useEffect } from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { ArrowLeft, Send, Dumbbell, ChevronRight } from 'lucide-react';
import { ScreenName } from '../../types';
import { BuddyChatMessage } from './types';

interface BuddyChatScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const BuddyChatScreen: React.FC<BuddyChatScreenProps> = ({ onNavigate }) => {
    const { buddyChats, sendBuddyMessage, getBuddyChatForUser, allMembers, currentUser, openWorkouts } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // For demo purposes, pick the first buddy chat or use a target user
    // In real app, this would come from navigation params
    const targetUserId = buddyChats.length > 0
        ? buddyChats[0].participants.find(id => id !== (currentUser?.id || 'me')) || 'u1'
        : 'u1';

    const chat = getBuddyChatForUser(targetUserId);
    const buddyUser = allMembers.find(u => u.id === targetUserId);
    const myId = currentUser?.id || 'me';

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat?.messages.length]);

    const handleSend = () => {
        const trimmed = inputText.trim();
        if (!trimmed || !chat) return;
        sendBuddyMessage(chat.id, trimmed);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Сегодня';
        if (d.toDateString() === yesterday.toDateString()) return 'Вчера';
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    };

    // Group messages by date
    const getDateLabel = (iso: string) => formatDate(iso);

    const getWorkoutDetails = (workoutId?: string) => {
        if (!workoutId) return null;
        return openWorkouts.find(w => w.id === workoutId);
    };

    const renderWorkoutInvite = (msg: BuddyChatMessage, isMine: boolean) => {
        const workout = getWorkoutDetails(msg.metadata?.workoutId);
        return (
            <div className={`max-w-[85%] ${isMine ? 'ml-auto' : 'mr-auto'}`}>
                <div
                    className={`rounded-2xl overflow-hidden ${
                        isMine
                            ? 'bg-cyan-600 text-white'
                            : isDark
                                ? 'bg-zinc-800 text-white'
                                : 'bg-white text-gray-900 shadow-sm'
                    }`}
                >
                    {/* Invite header */}
                    <div className={`px-3 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
                        isMine ? 'bg-cyan-700/50' : isDark ? 'bg-zinc-700/50' : 'bg-gray-100'
                    }`}>
                        <Dumbbell className="w-3.5 h-3.5" />
                        <span>Приглашение на тренировку</span>
                    </div>
                    {/* Invite body */}
                    <div className="px-3 py-2.5">
                        <p className="text-sm font-medium">{msg.text}</p>
                        {workout && (
                            <div className={`mt-2 p-2 rounded-lg ${
                                isMine ? 'bg-cyan-700/30' : isDark ? 'bg-zinc-700/50' : 'bg-gray-50'
                            }`}>
                                <p className="font-bold text-sm">{workout.title}</p>
                                <p className={`text-xs mt-0.5 ${isMine ? 'text-cyan-100' : isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                                    {workout.date} в {workout.time}
                                </p>
                            </div>
                        )}
                    </div>
                    {/* Join button (only for received invites) */}
                    {!isMine && (
                        <button
                            onClick={() => onNavigate('open_workouts')}
                            className={`w-full px-3 py-2.5 flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-[0.98] ${
                                isDark ? 'bg-cyan-600 text-white hover:bg-cyan-500' : 'bg-cyan-600 text-white hover:bg-cyan-500'
                            }`}
                        >
                            Присоединиться
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <p className={`text-[10px] mt-1 ${isMine ? 'text-right' : ''} ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                </p>
            </div>
        );
    };

    const renderMessage = (msg: BuddyChatMessage) => {
        const isMine = msg.senderId === myId;

        if (msg.type === 'workout_invite') {
            return renderWorkoutInvite(msg, isMine);
        }

        return (
            <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%]`}>
                    <div
                        className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMine
                                ? 'bg-cyan-600 text-white rounded-br-md'
                                : isDark
                                    ? 'bg-zinc-800 text-white rounded-bl-md'
                                    : 'bg-white text-gray-900 shadow-sm rounded-bl-md'
                        }`}
                    >
                        {msg.text}
                    </div>
                    <p className={`text-[10px] mt-1 ${isMine ? 'text-right' : ''} ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        {formatTime(msg.timestamp)}
                    </p>
                </div>
            </div>
        );
    };

    // Empty state
    if (!chat || !buddyUser) {
        return (
            <div className={`min-h-screen flex flex-col ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
                {/* Header */}
                <div className={`p-4 flex items-center gap-3 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-md`}>
                    <button
                        onClick={() => onNavigate('BACK')}
                        className={`p-2 rounded-full transition-all active:scale-[0.95] ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold">Чат</h1>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}>
                        <Send className={`w-8 h-8 ${isDark ? 'text-zinc-600' : 'text-gray-400'}`} />
                    </div>
                    <p className="font-bold mb-1">Нет сообщений</p>
                    <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                        Начните разговор с вашим напарником
                    </p>
                </div>
            </div>
        );
    }

    // Build date-grouped messages
    let lastDateLabel = '';

    return (
        <div className={`h-screen flex flex-col ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
            {/* Header */}
            <div className={`p-4 flex items-center gap-3 sticky top-0 z-20 ${isDark ? 'bg-zinc-950/80 border-b border-zinc-800/50' : 'bg-white/80 border-b border-gray-200/50'} backdrop-blur-md`}>
                <button
                    onClick={() => onNavigate('BACK')}
                    className={`p-2 rounded-full transition-all active:scale-[0.95] ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`}
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                    <img
                        src={buddyUser.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${buddyUser.nickname}`}
                        className="w-10 h-10 rounded-full bg-gray-200 object-cover"
                        alt={buddyUser.firstName}
                    />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${isDark ? 'border-zinc-950' : 'border-white'} ${
                        buddyUser.status === 'green' ? 'bg-green-500' : buddyUser.status === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{buddyUser.firstName} {buddyUser.lastName}</p>
                    <p className={`text-xs ${
                        buddyUser.status === 'green'
                            ? 'text-green-500'
                            : isDark ? 'text-zinc-400' : 'text-gray-500'
                    }`}>
                        {buddyUser.status === 'green' ? 'онлайн' : buddyUser.status === 'yellow' ? 'занят' : 'не беспокоить'}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 no-scrollbar">
                {chat.messages.map((msg) => {
                    const dateLabel = getDateLabel(msg.timestamp);
                    const showDate = dateLabel !== lastDateLabel;
                    lastDateLabel = dateLabel;

                    return (
                        <React.Fragment key={msg.id}>
                            {showDate && (
                                <div className="flex justify-center my-3">
                                    <span className={`text-[11px] px-3 py-1 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-200 text-gray-500'}`}>
                                        {dateLabel}
                                    </span>
                                </div>
                            )}
                            {renderMessage(msg)}
                        </React.Fragment>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className={`p-3 flex items-end gap-2 ${isDark ? 'bg-zinc-900 border-t border-zinc-800' : 'bg-white border-t border-gray-200'}`}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Сообщение..."
                    className={`flex-1 px-4 py-2.5 rounded-full text-sm outline-none transition-colors ${
                        isDark
                            ? 'bg-zinc-800 text-white placeholder-zinc-500 focus:bg-zinc-700'
                            : 'bg-gray-100 text-gray-900 placeholder-gray-400 focus:bg-gray-200'
                    }`}
                />
                <button
                    onClick={handleSend}
                    disabled={!inputText.trim()}
                    className={`p-2.5 rounded-full transition-all active:scale-[0.95] ${
                        inputText.trim()
                            ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                            : isDark
                                ? 'bg-zinc-800 text-zinc-600'
                                : 'bg-gray-200 text-gray-400'
                    }`}
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default BuddyChatScreen;

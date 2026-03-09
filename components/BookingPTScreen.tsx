import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
    ArrowLeft,
    Calendar as CalendarIcon,
    ChevronRight,
    User,
    Clock,
    MapPin,
    Filter,
    WifiOff,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronDown
} from 'lucide-react';

interface BookingPTScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const BookingPTScreen: React.FC<BookingPTScreenProps> = ({ onNavigate }) => {
    const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isOffline, setIsOffline] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Filters
    const [selectedTrainer, setSelectedTrainer] = useState<string>('all');

    // Mock Data
    const trainers = [
        { id: 'all', name: 'Все тренеры' },
        { id: 'ivan', name: 'Иван К.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
        { id: 'anna', name: 'Анна М.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka' },
    ];

    const slots = [
        { id: 1, time: '09:00', trainerId: 'ivan', trainer: 'Иван К.', location: 'Тренажерный зал', status: 'free', price: 2500 },
        { id: 2, time: '10:00', trainerId: 'anna', trainer: 'Анна М.', location: 'Зона функционального тренинга', status: 'free', price: 3000 },
        { id: 3, time: '11:00', trainerId: 'ivan', trainer: 'Иван К.', location: 'Тренажерный зал', status: 'booked', client: 'Вы' },
        { id: 4, time: '14:00', trainerId: 'anna', trainer: 'Анна М.', location: 'Зона Пилатес', status: 'blocked' },
        { id: 5, time: '16:00', trainerId: 'ivan', trainer: 'Иван К.', location: 'Тренажерный зал', status: 'free', price: 2500 },
    ];

    // Logic
    const handleDateChange = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + days);
        setSelectedDate(newDate);
        simulateLoading();
    };

    const simulateLoading = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    };

    const handleBook = (slotId: number) => {
        if (isOffline) return;
        onNavigate('booking_pt_details');
    };

    // Helper to generate week days
    const getWeekDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(selectedDate);
            d.setDate(selectedDate.getDate() - selectedDate.getDay() + 1 + i); // Start from Monday logic simplified
            days.push(d);
        }
        return days;
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            {/* Offline Banner */}
            {isOffline && (
                <div className="bg-gray-900 text-white px-4 py-3 flex items-center gap-3 text-sm font-bold sticky top-0 z-30">
                    <WifiOff className="w-4 h-4" />
                    <span className="opacity-90">Нет сети. Обновление недоступно.</span>
                </div>
            )}

            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-20">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                            <ArrowLeft className="w-6 h-6 text-gray-700" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-none">Календарь ПТ</h1>
                            <p className="text-xs text-blue-600 font-bold mt-1" onClick={() => onNavigate('booking_schedule')}>Всё расписание</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('week')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                        >
                            Неделя
                        </button>
                        <button
                            onClick={() => setViewMode('month')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                        >
                            Месяц
                        </button>
                    </div>
                </div>

                {/* Date Navigator */}
                <div className="flex items-center justify-between px-4 pb-4 border-b border-gray-100">
                    <button onClick={() => handleDateChange(-7)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-base font-bold text-gray-900 capitalize">
                        {selectedDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => handleDateChange(7)} className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Week View Grid */}
                {viewMode === 'week' && (
                    <div className="flex justify-between px-2 py-2">
                        {getWeekDays().map((date, idx) => {
                            const isSelected = date.getDate() === selectedDate.getDate();
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                                <button
                                    key={idx}
                                    onClick={() => { setSelectedDate(date); simulateLoading(); }}
                                    className={`flex flex-col items-center justify-center w-11 h-16 rounded-xl transition-all relative ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className="text-[10px] font-bold uppercase mb-0.5 opacity-70">
                                        {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                                    </span>
                                    <span className={`text-base font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                        {date.getDate()}
                                    </span>
                                    {isToday && !isSelected && <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>}
                                </button>
                            )
                        })}
                    </div>
                )}

                {/* Filters */}
                <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                    {trainers.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setSelectedTrainer(t.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap transition-colors ${selectedTrainer === t.id
                                    ? 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200'
                                }`}
                        >
                            {t.avatar && (
                                <img src={t.avatar} className="w-4 h-4 rounded-full" alt="" />
                            )}
                            {t.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Slots Content */}
            <div className="p-4 space-y-4 flex-1">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : slots.filter(s => selectedTrainer === 'all' || s.trainerId === selectedTrainer).length > 0 ? (
                    slots.filter(s => selectedTrainer === 'all' || s.trainerId === selectedTrainer).map(slot => (
                        <div key={slot.id} className="flex gap-4 group">
                            {/* Time Column */}
                            <div className="w-14 flex flex-col items-center pt-1">
                                <span className="text-lg font-extrabold text-gray-900 leading-none">{slot.time}</span>
                            </div>

                            {/* Card */}
                            <div
                                onClick={() => slot.status !== 'blocked' && handleBook(slot.id)}
                                className={`flex-1 rounded-2xl p-4 shadow-sm border border-gray-100 relative transition-all active:scale-[0.98] ${slot.status === 'blocked' ? 'bg-gray-50 opacity-60' : 'bg-white hover:border-blue-200 cursor-pointer'
                                    }`}
                            >
                                {slot.status === 'booked' && (
                                    <div className="absolute right-0 top-0 bg-green-50 text-green-700 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" />
                                        Вы записаны
                                    </div>
                                )}

                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${slot.trainerId}`} alt={slot.trainer} className="w-full h-full" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-sm">{slot.trainer}</h3>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <MapPin className="w-3 h-3" />
                                                {slot.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {slot.status === 'free' && (
                                    <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                                        <span className="text-sm font-bold text-gray-900">{slot.price} ₽</span>
                                        <button className="text-xs font-bold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm shadow-blue-200">
                                            Записаться
                                        </button>
                                    </div>
                                )}

                                {slot.status === 'booked' && (
                                    <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                                        <button className="flex-1 text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                                            Перенести
                                        </button>
                                        <button className="flex-1 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                                            Отменить
                                        </button>
                                    </div>
                                )}

                                {slot.status === 'blocked' && (
                                    <div className="mt-2 text-xs font-medium text-gray-400 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Слот недоступен
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">Нет свободных слотов</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingPTScreen;

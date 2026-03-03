import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
    ArrowLeft,
    Bell,
    Shield,
    Globe,
    Database,
    Trash2,
    Check,
    ChevronRight,
    Moon
} from 'lucide-react';

interface TrainerPreferencesScreenProps {
    onNavigate: (screen: ScreenName) => void;
}

const TrainerPreferencesScreen: React.FC<TrainerPreferencesScreenProps> = ({ onNavigate }) => {
    // Mock Settings State
    const [notifications, setNotifications] = useState({
        sessionReminders: true,
        scheduleChanges: true,
        communityUpdates: false
    });

    const [security, setSecurity] = useState({
        biometrics: true
    });

    const [interfaceSettings, setInterfaceSettings] = useState({
        language: 'ru',
        timeFormat: '24h'
    });

    const [cacheSize, setCacheSize] = useState('124 MB');

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleClearCache = () => {
        setCacheSize('0 KB');
        alert('Кеш успешно очищен');
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-6">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => onNavigate('trainer_settings')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Настройки</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Notifications Group */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Уведомления</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-50">
                            <div>
                                <p className="font-bold text-sm text-gray-900">Напоминания о занятиях</p>
                                <p className="text-xs text-gray-500">За 15 минут до начала</p>
                            </div>
                            <Switch checked={notifications.sessionReminders} onChange={() => toggleNotification('sessionReminders')} />
                        </div>
                        <div className="flex items-center justify-between p-4 border-b border-gray-50">
                            <div>
                                <p className="font-bold text-sm text-gray-900">Изменения в расписании</p>
                                <p className="text-xs text-gray-500">Отмены и новые записи</p>
                            </div>
                            <Switch checked={notifications.scheduleChanges} onChange={() => toggleNotification('scheduleChanges')} />
                        </div>
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="font-bold text-sm text-gray-900">Новости сообщества</p>
                            </div>
                            <Switch checked={notifications.communityUpdates} onChange={() => toggleNotification('communityUpdates')} />
                        </div>
                    </div>
                </section>

                {/* Security Group */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Безопасность</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="font-bold text-sm text-gray-900">Вход по FaceID</p>
                                </div>
                            </div>
                            <Switch checked={security.biometrics} onChange={() => setSecurity(prev => ({ ...prev, biometrics: !prev.biometrics }))} />
                        </div>
                    </div>
                </section>

                {/* Interface Group */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Интерфейс</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <button className="w-full flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50">
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-sm text-gray-900">Язык</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Русский</span>
                                <ChevronRight className="w-4 h-4 text-gray-300" />
                            </div>
                        </button>
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-3">
                                <Moon className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-sm text-gray-900">Тёмная тема</span>
                            </div>
                            <span className="text-xs text-gray-400">Авто (Система)</span>
                        </div>
                    </div>
                </section>

                {/* Storage Group */}
                <section>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Хранилище</h2>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-gray-400" />
                                <span className="font-bold text-sm text-gray-900">Размер кеша</span>
                            </div>
                            <span className="text-sm text-gray-500 font-mono">{cacheSize}</span>
                        </div>
                        <button
                            onClick={handleClearCache}
                            className="w-full p-4 flex items-center justify-center gap-2 text-red-500 font-bold text-sm active:bg-red-50 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Очистить кеш
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
};

// Helper internal Switch component
const Switch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <div
        onClick={onChange}
        className={`w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
);

export default TrainerPreferencesScreen;

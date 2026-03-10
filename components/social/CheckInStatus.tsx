import React, { useState } from 'react';
import { useSocial } from './SocialContext';
import { MapPin, LogOut, CheckCircle, Shield } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import ConfirmDialog from '../ui/ConfirmDialog';

const CheckInStatus: React.FC = () => {
    const { currentUser, checkIn, checkOut } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [showCheckOutConfirm, setShowCheckOutConfirm] = useState(false);

    if (!currentUser) return null;

    return (
        <div className={`rounded-xl p-4 mb-4 border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentUser.isGeofenced ? 'bg-green-500/20 text-green-500' : 'bg-gray-200 text-gray-500'}`}>
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                            {currentUser.isGeofenced ? 'Вы в зале' : 'Вы не в клубе'}
                        </h3>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                            {currentUser.isGeofenced ? 'Ваш профиль видим другим' : 'Вы скрыты в "Пузыре приватности"'}
                        </p>
                    </div>
                </div>

                {currentUser.isGeofenced && (
                    <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded text-xs font-medium text-blue-500 border border-blue-500/20">
                        <Shield className="w-3 h-3" />
                        <span>Вы в зоне</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2">
                {!currentUser.isGeofenced ? (
                    <button
                        onClick={checkIn}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Отметиться
                    </button>
                ) : (
                    <button
                        onClick={() => setShowCheckOutConfirm(true)}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        <LogOut className="w-4 h-4" />
                        Уйти
                    </button>
                )}
            </div>

            <p className={`mt-3 text-[10px] text-center ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Данные удаляются автоматически при выходе из зоны (100м)
            </p>

            <ConfirmDialog
                open={showCheckOutConfirm}
                title="Уйти из зала?"
                message="Ваш профиль станет невидимым для других участников клуба."
                confirmLabel="Уйти"
                cancelLabel="Остаться"
                onConfirm={() => { checkOut(); setShowCheckOutConfirm(false); }}
                onCancel={() => setShowCheckOutConfirm(false)}
            />
        </div>
    );
};

export default CheckInStatus;

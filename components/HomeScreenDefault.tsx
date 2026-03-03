
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
    Bell,
    ChevronRight,
    Wallet,
    Star,
    CreditCard,
    QrCode,
    RefreshCw,
    WifiOff,
    Dumbbell
} from 'lucide-react';
import { useHomeData } from '../hooks/useHomeData';

interface HomeScreenDefaultProps {
    onNavigate: (screen: string) => void;
    toggleBrandTheme: () => void;
    brandTheme: 'default' | 'ember';
}

export const HomeScreenDefault: React.FC<HomeScreenDefaultProps> = ({ onNavigate, brandTheme }) => {
    const { data, loading, error, offline, refetch: fetchData } = useHomeData();

    // Analytics helper
    const logEvent = (name: string, params?: any) => {
        console.log(`[Analytics] ${name}`, params);
    };

    useEffect(() => {
        logEvent('screen_view_home_default');
    }, []);

    const handleRefresh = () => {
        logEvent('home_refresh', { type: 'manual' });
        fetchData();
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-cyan-600 dark:text-cyan-500 animate-spin" />
                    <span className="text-gray-500 text-sm font-medium">Загрузка...</span>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 transition-colors duration-300">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 text-center max-w-sm w-full transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Нет связи</h3>
                    <p className="text-sm text-gray-500 dark:text-zinc-500 mb-6">Не удалось загрузить данные. Проверьте подключение к интернету.</p>
                    <button
                        onClick={handleRefresh}
                        className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold active:scale-[0.98] transition-transform hover:bg-cyan-500"
                    >
                        Повторить
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen relative bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 text-gray-900 dark:text-white">

            {/* Background Ambience */}
            <div
                className="absolute top-0 left-0 w-full h-[500px] pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, rgba(8, 145, 178, 0.1), transparent)' }}
            />

            {/* Offline Banner */}
            {offline && (
                <div className="bg-red-500 text-white text-xs font-bold py-2 px-4 text-center sticky top-0 z-30 flex items-center justify-center gap-2 shadow-sm">
                    <WifiOff className="w-3 h-3" /> ОФФЛАЙН РЕЖИМ
                </div>
            )}

            {/* Header */}
            <div className={`px-6 pt-12 pb-4 sticky ${offline ? 'top-8' : 'top-0'} z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-zinc-800/50 transition-colors`}>
                <div className="flex justify-between items-center mb-6">
                    <div
                        onClick={() => onNavigate('club_details')}
                        className="cursor-pointer active:opacity-70 transition-opacity"
                    >
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">{data.clubName}</h1>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-1">
                            {data.clubLocation} <ChevronRight className="w-3 h-3" />
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            logEvent('home_notifications_open');
                            onNavigate('notifications');
                        }}
                        className="relative p-2.5 bg-gray-100 dark:bg-zinc-900 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors border border-gray-200 dark:border-zinc-800"
                    >
                        <Bell className="w-5 h-5 text-gray-400 dark:text-zinc-400" />
                        {data.unreadNotifications > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></span>
                        )}
                    </button>
                </div>

                {/* Stories */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-6 px-6">
                    {/* Add Story Button */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
                        <div className="w-16 h-16 rounded-full border border-dashed border-gray-300 dark:border-zinc-700 p-1 flex items-center justify-center hover:border-cyan-500 transition-colors">
                            <div className="w-full h-full bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-500">
                                <span className="text-xl font-light">+</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Создать</span>
                    </div>

                    {data.stories.map((story) => (
                        <div
                            key={story.id}
                            onClick={() => onNavigate('stories')}
                            className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group"
                        >
                            <div className={`w-16 h-16 rounded-full border-2 p-0.5 group-active:scale-95 transition-all ${story.isViewed ? 'border-gray-200 dark:border-zinc-800 opacity-50' : 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]'}`}>
                                <img
                                    src={story.imageUrl}
                                    className="w-full h-full rounded-full object-cover"
                                    alt={story.title}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-gray-500 dark:text-zinc-400 max-w-[60px] truncate uppercase tracking-wider">
                                {story.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-5 space-y-8">

                {/* QR Pass Teaser */}
                <button
                    onClick={() => onNavigate('qr_pass')}
                    className="w-full p-1 pr-4 rounded-3xl shadow-2xl flex items-center justify-between group active:scale-[0.99] transition-transform overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-zinc-900 dark:to-zinc-800 border border-transparent dark:border-zinc-700" />
                    <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center ml-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <QrCode className="w-7 h-7 text-black" />
                        </div>
                        <div className="text-left">
                            <p className="text-base font-bold text-white">Клубный пропуск</p>
                            <p className="text-[10px] uppercase tracking-wider text-[#9ca3af]">Нажмите для входа</p>
                        </div>
                    </div>
                    <div
                        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)]"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                </button>

                {/* Status Grid (4 Tiles) */}
                <section className="grid grid-cols-2 gap-3">
                    {/* Tariff */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'plan' });
                            onNavigate('tariff_details');
                        }}
                        className="p-4 rounded-3xl flex items-center gap-3 transition-all group shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-[rgba(6,182,212,0.1)]"
                        >
                            <CreditCard className="w-5 h-5 text-[#0891b2]" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className={`text-xs font-bold truncate ${!data.tariff?.isActive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                {data.tariff ? data.tariff.name : 'Нет тарифа'}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500">
                                {data.tariff ? 'Активен' : 'Купить'}
                            </p>
                        </div>
                    </button>

                    {/* Wallet - DEBT STATE SUPPORT */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'bill' });
                            onNavigate('wallet');
                        }}
                        className={`p-4 rounded-3xl flex items-center gap-3 transition-all group shadow-sm backdrop-blur-md border hover:bg-gray-100 dark:hover:bg-zinc-800 ${data.wallet.hasDebt
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' // Red background for debt
                                : 'bg-white/50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800'
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${data.wallet.hasDebt ? 'bg-red-100 dark:bg-red-900/50' : 'bg-[rgba(34,197,94,0.1)]'
                                }`}
                        >
                            <Wallet className="w-5 h-5" style={{ color: data.wallet.hasDebt ? '#ef4444' : '#22c55e' }} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p
                                className={`text-xs font-bold truncate ${data.wallet.hasDebt ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
                            >
                                {data.wallet.balance} {data.wallet.currency}
                            </p>
                            <p className={`text-[10px] uppercase tracking-wider ${data.wallet.hasDebt ? 'text-red-400' : 'text-gray-500 dark:text-zinc-500'}`}>
                                {data.wallet.hasDebt ? 'Долг' : 'Счет'}
                            </p>
                        </div>
                    </button>

                    {/* Bonuses */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'bonus' });
                            onNavigate('loyalty');
                        }}
                        className="p-4 rounded-3xl flex items-center gap-3 transition-all group shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-[rgba(234,179,8,0.1)]"
                        >
                            <Star className="w-5 h-5 text-[#eab308]" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate text-gray-900 dark:text-white">{data.bonuses.amount}</p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500">Бонусы</p>
                        </div>
                    </button>

                    {/* Services (Packages) */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'services' });
                            onNavigate('purchased_services');
                        }}
                        className="p-4 rounded-3xl flex items-center gap-3 transition-all group shadow-sm bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-[rgba(168,85,247,0.1)]"
                        >
                            <Dumbbell className="w-5 h-5 text-[#a855f7]" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate text-gray-900 dark:text-white">
                                {data.services ? `Ост: ${data.services.left}` : 'Пусто'}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-zinc-500">Пакеты услуг</p>
                        </div>
                    </button>
                </section>

                {/* Next Activity - Big Card */}
                <section>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h2 className="text-lg font-black uppercase italic tracking-wider text-gray-900 dark:text-white">
                            Далее по плану
                        </h2>
                        <button
                            onClick={() => onNavigate('booking_schedule')}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900 hover:bg-cyan-200 dark:hover:bg-cyan-900/50"
                        >
                            Расписание
                        </button>
                    </div>

                    {data.nextBooking ? (
                        <div
                            onClick={() => {
                                logEvent('home_next_booking_open');
                                onNavigate('booking_class_details');
                            }}
                            className="p-6 rounded-[2rem] relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer group shadow-xl hover:shadow-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
                        >
                            <div
                                className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-125 duration-500 bg-[rgba(6,182,212,0.05)]"
                            ></div>

                            <div className="flex items-start gap-5 relative z-10">
                                <div
                                    className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shrink-0 relative"
                                >
                                    <div className="absolute inset-0 bg-gray-200 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700" />
                                    <img src={data.nextBooking.trainerAvatar} className="w-full h-full object-cover relative z-10" alt="Trainer" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-2">
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400"
                                        >
                                            {data.nextBooking.date}
                                        </span>
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-zinc-400"
                                        >
                                            {data.nextBooking.time}
                                        </span>
                                    </div>
                                    <h3
                                        className="font-bold text-xl leading-tight truncate mb-1 text-gray-900 dark:text-white"
                                    >
                                        {data.nextBooking.title}
                                    </h3>
                                    <p
                                        className="text-xs truncate text-gray-500 dark:text-zinc-500"
                                    >
                                        {data.nextBooking.subtitle}
                                    </p>
                                </div>
                                <div
                                    className="self-center p-3 rounded-full transition-colors shrink-0 bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-600 group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-black group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_#06b6d4]"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-gray-200 dark:border-zinc-800 border-dashed text-center">
                            <p className="text-sm font-medium text-gray-500 dark:text-zinc-500 mb-6">Нет запланированных тренировок.</p>
                            <button
                                onClick={() => {
                                    logEvent('home_cta_book_click');
                                    onNavigate('booking_schedule');
                                }}
                                className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors uppercase tracking-wider"
                            >
                                Записаться
                            </button>
                        </div>
                    )}
                </section>

                {/* Promo / News Horizontal Scroll */}
                {data.promos.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-wider mb-4 px-1">Главное</h2>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
                            {data.promos.map((promo) => (
                                <button
                                    key={promo.id}
                                    onClick={() => {
                                        logEvent('home_promo_open', { id: promo.id, type: promo.type });
                                        onNavigate('news_detail');
                                    }}
                                    className="min-w-[280px] h-44 rounded-3xl overflow-hidden relative active:scale-95 transition-transform shrink-0 border border-gray-200 dark:border-zinc-800 shadow-lg group"
                                >
                                    <img
                                        src={promo.imageUrl}
                                        className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity"
                                        alt={promo.title}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-left">
                                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1 block">
                                            {promo.subtitle}
                                        </span>
                                        <h3 className="text-white font-bold text-base leading-tight max-w-[90%]">
                                            {promo.title}
                                        </h3>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default HomeScreenDefault;


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
}

export const HomeScreenDefault: React.FC<HomeScreenDefaultProps> = ({ onNavigate }) => {
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
            <div className="flex items-center justify-center min-h-screen bg-t-bg transition-colors duration-300">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-t-accent animate-spin" />
                    <span className="text-t-text-muted text-sm font-medium">Загрузка...</span>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-t-bg p-4 transition-colors duration-300">
                <div className="bg-t-bg-elevated p-6 rounded-tk-lg shadow-tk-card border border-t-border text-center max-w-sm w-full transition-colors">
                    <h3 className="text-lg font-bold text-t-text mb-2">Нет связи</h3>
                    <p className="text-sm text-t-text-muted mb-6">Не удалось загрузить данные. Проверьте подключение к интернету.</p>
                    <button
                        onClick={handleRefresh}
                        className="w-full bg-t-accent text-white py-3 rounded-tk-md font-bold active:scale-[0.98] transition-transform hover:opacity-90"
                    >
                        Повторить
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen relative bg-t-bg transition-colors duration-300 text-t-text">

            {/* Background Ambience */}
            <div
                className="absolute top-0 left-0 w-full h-[500px] pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--t-accent) 10%, transparent), transparent)' }}
            />

            {/* Offline Banner */}
            {offline && (
                <div className="bg-red-500 text-white text-xs font-bold py-2 px-4 text-center sticky top-0 z-30 flex items-center justify-center gap-2 shadow-tk-card">
                    <WifiOff className="w-3 h-3" /> ОФФЛАЙН РЕЖИМ
                </div>
            )}

            {/* Header */}
            <div className={`px-6 pt-12 pb-4 sticky ${offline ? 'top-8' : 'top-0'} z-20 bg-t-bg/80 backdrop-blur-[var(--t-backdrop-blur)] border-b border-t-border/50 transition-colors`}>
                <div className="flex justify-between items-center mb-6">
                    <div
                        onClick={() => onNavigate('club_details')}
                        className="cursor-pointer active:opacity-70 transition-opacity"
                    >
                        <h1 className="text-2xl font-black text-t-text tracking-tighter uppercase italic">{data.clubName}</h1>
                        <p className="text-xs text-t-text-muted font-bold tracking-widest uppercase flex items-center gap-1">
                            {data.clubLocation} <ChevronRight className="w-3 h-3" />
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            logEvent('home_notifications_open');
                            onNavigate('notifications');
                        }}
                        className="relative p-2.5 bg-t-bg-elevated rounded-tk-full hover:bg-t-bg-surface transition-colors border border-t-border"
                    >
                        <Bell className="w-5 h-5 text-t-text-secondary" />
                        {data.unreadNotifications > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-t-accent rounded-tk-full shadow-[0_0_10px_var(--t-accent)]"></span>
                        )}
                    </button>
                </div>

                {/* Stories */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-6 px-6">
                    {/* Add Story Button */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
                        <div className="w-16 h-16 rounded-tk-full border border-dashed border-t-border p-1 flex items-center justify-center hover:border-t-accent transition-colors">
                            <div className="w-full h-full bg-t-bg-elevated rounded-tk-full flex items-center justify-center text-t-accent">
                                <span className="text-xl font-light">+</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-t-text-muted uppercase tracking-wider">Создать</span>
                    </div>

                    {data.stories.map((story) => (
                        <div
                            key={story.id}
                            onClick={() => onNavigate('stories')}
                            className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group"
                        >
                            <div className={`w-16 h-16 rounded-tk-full border-2 p-0.5 group-active:scale-95 transition-all ${story.isViewed ? 'border-t-border opacity-50' : 'border-t-accent shadow-[0_0_15px_var(--t-accent-glow)]'}`}>
                                <img
                                    src={story.imageUrl}
                                    className="w-full h-full rounded-tk-full object-cover"
                                    alt={story.title}
                                />
                            </div>
                            <span className="text-[10px] font-medium text-t-text-secondary max-w-[60px] truncate uppercase tracking-wider">
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
                    className="w-full p-1 pr-4 rounded-tk-lg shadow-tk-card flex items-center justify-between group active:scale-[0.99] transition-transform overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-t-bg-elevated to-t-bg-surface border border-t-border" />
                    <div className="absolute inset-0 bg-t-accent/5 group-hover:bg-t-accent/10 transition-colors"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div
                            className="w-14 h-14 rounded-tk-lg flex items-center justify-center ml-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <QrCode className="w-7 h-7 text-black" />
                        </div>
                        <div className="text-left">
                            <p className="text-base font-bold text-t-text">Клубный пропуск</p>
                            <p className="text-[10px] uppercase tracking-wider text-t-text-muted">Нажмите для входа</p>
                        </div>
                    </div>
                    <div
                        className="relative z-10 w-10 h-10 rounded-tk-full flex items-center justify-center bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.1)]"
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
                        className="p-4 rounded-tk-lg flex items-center gap-3 transition-all group shadow-tk-card bg-t-bg-elevated/50 backdrop-blur-[var(--t-backdrop-blur)] border border-t-border hover:bg-t-bg-surface"
                    >
                        <div
                            className="w-10 h-10 rounded-tk-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-t-accent/10"
                        >
                            <CreditCard className="w-5 h-5 text-t-accent" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className={`text-xs font-bold truncate ${!data.tariff?.isActive ? 'text-red-500' : 'text-t-text'}`}>
                                {data.tariff ? data.tariff.name : 'Нет тарифа'}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-t-text-muted">
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
                        className={`p-4 rounded-tk-lg flex items-center gap-3 transition-all group shadow-tk-card backdrop-blur-[var(--t-backdrop-blur)] border hover:bg-t-bg-surface ${data.wallet.hasDebt
                                ? 'bg-t-error/10 border-t-error/30' // Red background for debt
                                : 'bg-t-bg-elevated/50 border-t-border'
                            }`}
                    >
                        <div
                            className={`w-10 h-10 rounded-tk-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${data.wallet.hasDebt ? 'bg-t-error/20' : 'bg-t-success/10'
                                }`}
                        >
                            <Wallet className="w-5 h-5" style={{ color: data.wallet.hasDebt ? '#ef4444' : '#22c55e' }} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p
                                className={`text-xs font-bold truncate ${data.wallet.hasDebt ? 'text-t-error' : 'text-t-text'}`}
                            >
                                {data.wallet.balance} {data.wallet.currency}
                            </p>
                            <p className={`text-[10px] uppercase tracking-wider ${data.wallet.hasDebt ? 'text-red-400' : 'text-t-text-muted'}`}>
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
                        className="p-4 rounded-tk-lg flex items-center gap-3 transition-all group shadow-tk-card bg-t-bg-elevated/50 backdrop-blur-[var(--t-backdrop-blur)] border border-t-border hover:bg-t-bg-surface"
                    >
                        <div
                            className="w-10 h-10 rounded-tk-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-[rgba(234,179,8,0.1)]"
                        >
                            <Star className="w-5 h-5 text-[#eab308]" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate text-t-text">{data.bonuses.amount}</p>
                            <p className="text-[10px] uppercase tracking-wider text-t-text-muted">Бонусы</p>
                        </div>
                    </button>

                    {/* Services (Packages) */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'services' });
                            onNavigate('purchased_services');
                        }}
                        className="p-4 rounded-tk-lg flex items-center gap-3 transition-all group shadow-tk-card bg-t-bg-elevated/50 backdrop-blur-[var(--t-backdrop-blur)] border border-t-border hover:bg-t-bg-surface"
                    >
                        <div
                            className="w-10 h-10 rounded-tk-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform bg-[rgba(168,85,247,0.1)]"
                        >
                            <Dumbbell className="w-5 h-5 text-[#a855f7]" />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate text-t-text">
                                {data.services ? `Ост: ${data.services.left}` : 'Пусто'}
                            </p>
                            <p className="text-[10px] uppercase tracking-wider text-t-text-muted">Пакеты услуг</p>
                        </div>
                    </button>
                </section>

                {/* Next Activity - Big Card */}
                <section>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h2 className="text-lg font-black uppercase italic tracking-wider text-t-text">
                            Далее по плану
                        </h2>
                        <button
                            onClick={() => onNavigate('booking_schedule')}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-tk-full uppercase tracking-wider transition-colors text-t-accent bg-t-accent/10 border border-t-accent/20 hover:bg-t-accent/20"
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
                            className="p-6 rounded-tk-lg relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer group shadow-tk-card bg-t-bg-elevated border border-t-border"
                        >
                            <div
                                className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-125 duration-500 bg-t-accent/5"
                            ></div>

                            <div className="flex items-start gap-5 relative z-10">
                                <div
                                    className="w-16 h-16 rounded-tk-lg overflow-hidden shadow-tk-card shrink-0 relative"
                                >
                                    <div className="absolute inset-0 bg-t-bg-surface border border-t-border" />
                                    <img src={data.nextBooking.trainerAvatar} className="w-full h-full object-cover relative z-10" alt="Trainer" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-2">
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-tk-sm tracking-wider bg-t-accent/10 border border-t-accent/20 text-t-accent"
                                        >
                                            {data.nextBooking.date}
                                        </span>
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-tk-sm tracking-wider bg-t-bg-surface border border-t-border text-t-text-secondary"
                                        >
                                            {data.nextBooking.time}
                                        </span>
                                    </div>
                                    <h3
                                        className="font-bold text-xl leading-tight truncate mb-1 text-t-text"
                                    >
                                        {data.nextBooking.title}
                                    </h3>
                                    <p
                                        className="text-xs truncate text-t-text-muted"
                                    >
                                        {data.nextBooking.subtitle}
                                    </p>
                                </div>
                                <div
                                    className="self-center p-3 rounded-tk-full transition-colors shrink-0 bg-t-bg border border-t-border text-t-text-muted group-hover:bg-t-accent group-hover:text-white group-hover:border-t-accent group-hover:shadow-[0_0_15px_var(--t-accent)]"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-t-bg-elevated p-8 rounded-tk-lg border border-t-border border-dashed text-center">
                            <p className="text-sm font-medium text-t-text-muted mb-6">Нет запланированных тренировок.</p>
                            <button
                                onClick={() => {
                                    logEvent('home_cta_book_click');
                                    onNavigate('booking_schedule');
                                }}
                                className="bg-t-text text-t-bg px-6 py-3 rounded-tk-md text-sm font-bold shadow-tk-card hover:opacity-90 transition-colors uppercase tracking-wider"
                            >
                                Записаться
                            </button>
                        </div>
                    )}
                </section>

                {/* Promo / News Horizontal Scroll */}
                {data.promos.length > 0 && (
                    <section>
                        <h2 className="text-lg font-black text-t-text uppercase italic tracking-wider mb-4 px-1">Главное</h2>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
                            {data.promos.map((promo) => (
                                <button
                                    key={promo.id}
                                    onClick={() => {
                                        logEvent('home_promo_open', { id: promo.id, type: promo.type });
                                        onNavigate('news_detail');
                                    }}
                                    className="min-w-[280px] h-44 rounded-tk-lg overflow-hidden relative active:scale-95 transition-transform shrink-0 border border-t-border shadow-tk-card group"
                                >
                                    <img
                                        src={promo.imageUrl}
                                        className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-80 transition-opacity"
                                        alt={promo.title}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-left">
                                        <span className="text-[10px] font-bold text-t-accent uppercase tracking-widest mb-1 block">
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

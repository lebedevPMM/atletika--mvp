import React, { useEffect } from 'react';
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
    Dumbbell,
    Flame,
    Zap
} from 'lucide-react';
import { useHomeData } from '../hooks/useHomeData';

interface HomeScreenEmberProps {
    onNavigate: (screen: string) => void;
    toggleBrandTheme: () => void;
    brandTheme: 'default' | 'ember';
}

export const HomeScreenEmber: React.FC<HomeScreenEmberProps> = ({ onNavigate }) => {
    const { data, loading, error, offline, refetch: fetchData } = useHomeData();

    const logEvent = (name: string, params?: any) => {
        console.log(`[Analytics] ${name}`, params);
    };

    useEffect(() => {
        logEvent('screen_view_home_ember');
    }, []);

    const handleRefresh = () => {
        logEvent('home_refresh', { type: 'manual' });
        fetchData();
    };

    // Loading
    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--ember-bg, #080808)' }}>
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--ember-accent, #ff4d00)' }} />
                    <span className="text-sm font-ember font-semibold tracking-wider uppercase" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                        Загрузка...
                    </span>
                </div>
            </div>
        );
    }

    // Error
    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4" style={{ backgroundColor: 'var(--ember-bg, #080808)' }}>
                <div className="ember-card p-6 text-center max-w-sm w-full">
                    <h3 className="text-lg font-ember font-bold tracking-wide" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                        Нет связи
                    </h3>
                    <p className="text-sm mt-2 mb-6" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                        Не удалось загрузить данные.
                    </p>
                    <button
                        onClick={handleRefresh}
                        className="w-full py-3 rounded-xl font-ember font-bold uppercase tracking-widest active:scale-[0.98] transition-all"
                        style={{ backgroundColor: 'var(--ember-accent, #ff4d00)', color: '#000' }}
                    >
                        Повторить
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="pb-24 min-h-screen relative font-ember"
            style={{ backgroundColor: 'var(--ember-bg, #080808)', color: 'var(--ember-text-primary, #e0e0e0)' }}
        >
            {/* Ember Ambient Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Top orange glow */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full ember-pulse"
                    style={{ background: 'radial-gradient(ellipse, rgba(255,77,0,0.06) 0%, transparent 70%)' }}
                />
                {/* Dot matrix overlay */}
                <div className="absolute inset-0 ember-dot-matrix opacity-30" />
            </div>

            {/* Offline Banner */}
            {offline && (
                <div
                    className="text-white text-xs font-bold py-2 px-4 text-center sticky top-0 z-30 flex items-center justify-center gap-2 font-ember tracking-widest uppercase"
                    style={{ backgroundColor: '#dc2626' }}
                >
                    <WifiOff className="w-3 h-3" /> ОФФЛАЙН
                </div>
            )}

            {/* Header */}
            <div
                className={`px-6 pt-12 pb-4 sticky ${offline ? 'top-8' : 'top-0'} z-20 backdrop-blur-xl border-b`}
                style={{
                    backgroundColor: 'rgba(8,8,8,0.85)',
                    borderColor: 'rgba(255,77,0,0.1)'
                }}
            >
                <div className="flex justify-between items-center mb-5">
                    <div
                        onClick={() => onNavigate('club_details')}
                        className="cursor-pointer active:opacity-70 transition-opacity"
                    >
                        <h1
                            className="text-2xl font-bold tracking-[0.15em] uppercase"
                            style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}
                        >
                            {data.clubName}
                        </h1>
                        <p
                            className="text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center gap-1 mt-0.5"
                            style={{ color: 'var(--ember-text-secondary, #666)' }}
                        >
                            {data.clubLocation} <ChevronRight className="w-3 h-3" />
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            logEvent('home_notifications_open');
                            onNavigate('notifications');
                        }}
                        className="relative p-2.5 rounded-full transition-colors border"
                        style={{
                            backgroundColor: 'var(--ember-surface, #111)',
                            borderColor: 'rgba(255,255,255,0.06)'
                        }}
                    >
                        <Bell className="w-5 h-5" style={{ color: 'var(--ember-text-secondary, #666)' }} />
                        {data.unreadNotifications > 0 && (
                            <span
                                className="absolute top-2 right-2.5 w-2 h-2 rounded-full"
                                style={{ backgroundColor: 'var(--ember-accent, #ff4d00)', boxShadow: '0 0 10px rgba(255,77,0,0.8)' }}
                            />
                        )}
                    </button>
                </div>

                {/* Ember Glow Bar Separator */}
                <div className="ember-glow-bar mb-4" />

                {/* Stories */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1 -mx-6 px-6">
                    {/* Add Story */}
                    <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
                        <div
                            className="w-16 h-16 rounded-full border border-dashed p-1 flex items-center justify-center transition-colors hover:border-[var(--ember-accent)]"
                            style={{ borderColor: 'rgba(255,77,0,0.3)' }}
                        >
                            <div
                                className="w-full h-full rounded-full flex items-center justify-center"
                                style={{ backgroundColor: 'var(--ember-surface, #111)' }}
                            >
                                <span className="text-xl font-light" style={{ color: 'var(--ember-accent, #ff4d00)' }}>+</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                            Создать
                        </span>
                    </div>

                    {data.stories.map((story) => (
                        <div
                            key={story.id}
                            onClick={() => onNavigate('stories')}
                            className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group"
                        >
                            <div
                                className="w-16 h-16 rounded-full p-0.5 group-active:scale-95 transition-all"
                                style={{
                                    border: story.isViewed
                                        ? '2px solid rgba(255,255,255,0.1)'
                                        : '2px solid var(--ember-accent, #ff4d00)',
                                    boxShadow: story.isViewed ? 'none' : '0 0 12px rgba(255,77,0,0.4)',
                                    opacity: story.isViewed ? 0.5 : 1
                                }}
                            >
                                <img
                                    src={story.imageUrl}
                                    className="w-full h-full rounded-full object-cover"
                                    alt={story.title}
                                />
                            </div>
                            <span className="text-[10px] font-semibold max-w-[60px] truncate uppercase tracking-[0.12em]"
                                style={{ color: 'var(--ember-text-secondary, #666)' }}
                            >
                                {story.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-5 space-y-7 relative z-10">

                {/* QR Pass — Ember Bezel Card */}
                <button
                    onClick={() => onNavigate('qr_pass')}
                    className="w-full p-1 pr-4 rounded-[24px] flex items-center justify-between group active:scale-[0.99] transition-all overflow-hidden relative ember-card"
                >
                    {/* Accent gradient overlay on hover */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: 'linear-gradient(135deg, rgba(255,77,0,0.05), transparent)' }}
                    />
                    <div className="flex items-center gap-4 relative z-10">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center ml-1"
                            style={{
                                backgroundColor: 'var(--ember-accent, #ff4d00)',
                                boxShadow: '0 0 20px rgba(255,77,0,0.4)'
                            }}
                        >
                            <QrCode className="w-7 h-7 text-black" />
                        </div>
                        <div className="text-left">
                            <p className="text-base font-bold tracking-wider" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                                Клубный пропуск
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                                Нажмите для входа
                            </p>
                        </div>
                    </div>
                    <div
                        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center border transition-colors group-hover:border-[var(--ember-accent)]"
                        style={{
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            borderColor: 'rgba(255,255,255,0.08)'
                        }}
                    >
                        <ChevronRight className="w-5 h-5" style={{ color: 'var(--ember-text-secondary, #666)' }} />
                    </div>
                </button>

                {/* Status Grid (4 Tiles) — Ember Bezel Style */}
                <section className="grid grid-cols-2 gap-3">
                    {/* Tariff */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'plan' });
                            onNavigate('tariff_details');
                        }}
                        className="ember-card p-4 rounded-[20px] flex items-center gap-3 transition-all group hover:translate-y-[-1px]"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: 'rgba(255,77,0,0.1)' }}
                        >
                            <CreditCard className="w-5 h-5" style={{ color: 'var(--ember-accent, #ff4d00)' }} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className={`text-xs font-bold truncate tracking-wide ${!data.tariff?.isActive ? 'text-red-500' : ''}`}
                                style={data.tariff?.isActive ? { color: 'var(--ember-text-primary, #e0e0e0)' } : {}}
                            >
                                {data.tariff ? data.tariff.name : 'Нет тарифа'}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                                {data.tariff ? 'Активен' : 'Купить'}
                            </p>
                        </div>
                    </button>

                    {/* Wallet */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'bill' });
                            onNavigate('wallet');
                        }}
                        className={`p-4 rounded-[20px] flex items-center gap-3 transition-all group hover:translate-y-[-1px] ${
                            data.wallet.hasDebt ? 'border border-red-800/50' : 'ember-card'
                        }`}
                        style={data.wallet.hasDebt ? {
                            backgroundColor: 'rgba(127,29,29,0.15)',
                            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.6)',
                            borderRadius: '20px'
                        } : {}}
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                            style={{
                                backgroundColor: data.wallet.hasDebt ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.1)'
                            }}
                        >
                            <Wallet className="w-5 h-5" style={{ color: data.wallet.hasDebt ? '#ef4444' : '#22c55e' }} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className={`text-xs font-bold truncate tracking-wide ${data.wallet.hasDebt ? 'text-red-400' : ''}`}
                                style={!data.wallet.hasDebt ? { color: 'var(--ember-text-primary, #e0e0e0)' } : {}}
                            >
                                {data.wallet.balance} {data.wallet.currency}
                            </p>
                            <p className={`text-[10px] uppercase tracking-[0.15em] ${data.wallet.hasDebt ? 'text-red-400/70' : ''}`}
                                style={!data.wallet.hasDebt ? { color: 'var(--ember-text-secondary, #666)' } : {}}
                            >
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
                        className="ember-card p-4 rounded-[20px] flex items-center gap-3 transition-all group hover:translate-y-[-1px]"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: 'rgba(234,179,8,0.1)' }}
                        >
                            <Star className="w-5 h-5" style={{ color: '#eab308' }} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate tracking-wide" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                                {data.bonuses.amount}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                                Бонусы
                            </p>
                        </div>
                    </button>

                    {/* Services */}
                    <button
                        onClick={() => {
                            logEvent('home_tile_click', { tile: 'services' });
                            onNavigate('purchased_services');
                        }}
                        className="ember-card p-4 rounded-[20px] flex items-center gap-3 transition-all group hover:translate-y-[-1px]"
                    >
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: 'rgba(138,43,226,0.1)' }}
                        >
                            <Dumbbell className="w-5 h-5" style={{ color: 'var(--ember-accent-dim, #8a2be2)' }} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-xs font-bold truncate tracking-wide" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                                {data.services ? `Ост: ${data.services.left}` : 'Пусто'}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                                Пакеты услуг
                            </p>
                        </div>
                    </button>
                </section>

                {/* Decorative Glow Bar */}
                <div className="ember-glow-bar" />

                {/* Next Activity — Big Ember Card */}
                <section>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h2 className="text-lg font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                            Далее по плану
                        </h2>
                        <button
                            onClick={() => onNavigate('booking_schedule')}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-[0.15em] transition-colors border"
                            style={{
                                color: 'var(--ember-accent, #ff4d00)',
                                backgroundColor: 'rgba(255,77,0,0.08)',
                                borderColor: 'rgba(255,77,0,0.2)'
                            }}
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
                            className="ember-card p-6 rounded-[24px] relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer group"
                        >
                            {/* Accent corner glow */}
                            <div
                                className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10 rounded-full transition-transform group-hover:scale-150 duration-700"
                                style={{ background: 'radial-gradient(circle, rgba(255,77,0,0.08) 0%, transparent 70%)' }}
                            />

                            <div className="flex items-start gap-5 relative z-10">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 relative"
                                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                                >
                                    <div className="absolute inset-0" style={{ backgroundColor: 'var(--ember-surface, #111)' }} />
                                    <img src={data.nextBooking.trainerAvatar} className="w-full h-full object-cover relative z-10" alt="Trainer" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex gap-2 mb-2">
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border"
                                            style={{
                                                color: 'var(--ember-accent, #ff4d00)',
                                                backgroundColor: 'rgba(255,77,0,0.08)',
                                                borderColor: 'rgba(255,77,0,0.2)'
                                            }}
                                        >
                                            {data.nextBooking.date}
                                        </span>
                                        <span
                                            className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border"
                                            style={{
                                                color: 'var(--ember-text-secondary, #666)',
                                                backgroundColor: 'rgba(255,255,255,0.03)',
                                                borderColor: 'rgba(255,255,255,0.06)'
                                            }}
                                        >
                                            {data.nextBooking.time}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl leading-tight truncate mb-1" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                                        {data.nextBooking.title}
                                    </h3>
                                    <p className="text-xs truncate" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                                        {data.nextBooking.subtitle}
                                    </p>
                                </div>
                                <div
                                    className="self-center p-3 rounded-full transition-all shrink-0 border group-hover:ember-glow"
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        borderColor: 'rgba(255,255,255,0.06)',
                                        color: 'var(--ember-text-secondary, #666)'
                                    }}
                                >
                                    <ChevronRight className="w-5 h-5 group-hover:text-[var(--ember-accent)]" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="ember-card p-8 rounded-[24px] text-center border-dashed"
                            style={{ borderColor: 'rgba(255,77,0,0.15)' }}
                        >
                            <Flame className="w-8 h-8 mx-auto mb-3 ember-pulse" style={{ color: 'rgba(255,77,0,0.3)' }} />
                            <p className="text-sm font-medium mb-6" style={{ color: 'var(--ember-text-secondary, #666)' }}>
                                Нет запланированных тренировок.
                            </p>
                            <button
                                onClick={() => {
                                    logEvent('home_cta_book_click');
                                    onNavigate('booking_schedule');
                                }}
                                className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-[0.15em] transition-all active:scale-[0.98]"
                                style={{
                                    backgroundColor: 'var(--ember-accent, #ff4d00)',
                                    color: '#000',
                                    boxShadow: '0 0 20px rgba(255,77,0,0.3)'
                                }}
                            >
                                Записаться
                            </button>
                        </div>
                    )}
                </section>

                {/* Promo / News */}
                {data.promos.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase tracking-[0.15em] mb-4 px-1" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                            Главное
                        </h2>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5">
                            {data.promos.map((promo) => (
                                <button
                                    key={promo.id}
                                    onClick={() => {
                                        logEvent('home_promo_open', { id: promo.id, type: promo.type });
                                        onNavigate('news_detail');
                                    }}
                                    className="min-w-[280px] h-44 rounded-[24px] overflow-hidden relative active:scale-95 transition-transform shrink-0 group"
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        boxShadow: 'var(--ember-bezel)'
                                    }}
                                >
                                    <img
                                        src={promo.imageUrl}
                                        className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                                        alt={promo.title}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-left">
                                        <span
                                            className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block"
                                            style={{ color: 'var(--ember-accent, #ff4d00)' }}
                                        >
                                            {promo.subtitle}
                                        </span>
                                        <h3 className="font-bold text-base leading-tight max-w-[90%]" style={{ color: 'var(--ember-text-primary, #e0e0e0)' }}>
                                            {promo.title}
                                        </h3>
                                    </div>
                                    {/* Bottom ember glow line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[1px]"
                                        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,77,0,0.4), transparent)' }}
                                    />
                                </button>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default HomeScreenEmber;

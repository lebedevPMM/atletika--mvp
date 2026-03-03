
import React from 'react';
import { useHomeData } from '../hooks/useHomeData';
import {
    Bell,
    ChevronRight,
    Wallet,
    Star,
    CreditCard,
    QrCode,
    Dumbbell,
    Play,
    Settings,
    Zap,
    WifiOff
} from 'lucide-react';

interface HomeScreenPastelProps {
    onNavigate: (screen: string) => void;
    toggleBrandTheme: () => void;
    brandTheme: 'default' | 'neon' | 'pastel';
}

export const HomeScreenPastel: React.FC<HomeScreenPastelProps> = ({ onNavigate, toggleBrandTheme, brandTheme }) => {
    const { data, loading, offline } = useHomeData();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F2F4F8] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-[#F2F4F6] text-[#1F2937] pb-32 overflow-x-hidden font-sans">

            {/* Offline Badge */}
            {offline && (
                <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 text-center w-full sticky top-0 z-50 flex items-center justify-center gap-2 shadow-sm">
                    <WifiOff className="w-3 h-3" />
                    ОФФЛАЙН РЕЖИМ
                </div>
            )}

            {/* Dev Mode Theme Toggle */}
            <button
                onClick={toggleBrandTheme}
                className="absolute top-24 right-4 z-50 p-2 bg-white/50 backdrop-blur-md border border-gray-200 rounded-full shadow-lg text-gray-500 hover:bg-white transition-colors flex items-center gap-2 group"
                title="Dev Mode: Switch Theme"
            >
                <Zap className="w-5 h-5 text-[#8B5CF6]" />
                <span className="text-[10px] font-mono uppercase tracking-wider hidden group-hover:block pr-1 text-[#8B5CF6]">
                    {brandTheme}
                </span>
            </button>

            {/* Header - Minimal & Clean */}
            <header className="px-8 pt-16 pb-6 flex justify-between items-center bg-[#F2F4F6] relative z-30">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">{data.clubName}</h1>
                    <p className="text-sm font-medium text-[#9CA3AF] mt-1">{data.clubLocation}</p>
                </div>
                <div
                    onClick={() => onNavigate('profile')}
                    className="w-14 h-14 rounded-[24px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-1 cursor-pointer hover:scale-105 transition-transform"
                >
                    <img src={data.userAvatar} className="w-full h-full rounded-[20px] object-cover" />
                </div>
            </header>

            <div className="px-8 space-y-8">

                {/* 1. Hero Card - Super Soft */}
                <div
                    onClick={() => onNavigate(data.nextBooking ? 'booking_class_details' : 'booking_schedule')}
                    className="bg-white rounded-[40px] p-8 shadow-[0_20px_60px_-10px_rgba(139,92,246,0.15)] relative overflow-hidden group cursor-pointer transition-transform active:scale-[0.99]"
                >
                    {/* Soft Ambient Blobs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F5F3FF] rounded-full blur-3xl -mr-20 -mt-20 opacity-80 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#FFF1F2] rounded-full blur-3xl -ml-10 -mb-10 opacity-80 pointer-events-none"></div>

                    <div className="relative z-10 flex justify-between items-start mb-8">
                        <span className="bg-[#F3F4F6] text-[#4B5563] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full">
                            Сегодня
                        </span>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#8B5CF6]">
                            <Bell className="w-5 h-5 fill-current" />
                            {data.unreadNotifications > 0 && (
                                <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-white"></div>
                            )}
                        </div>
                    </div>

                    {data.nextBooking ? (
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-[#1F2937] leading-tight mb-2">
                                {data.nextBooking.title}
                            </h2>
                            <p className="text-[#6B7280] font-medium text-sm mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
                                {data.nextBooking.time} • {data.nextBooking.subtitle}
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-[#8B5CF6]/30 shadow-lg group-hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 ml-1 fill-current" />
                                </div>
                                <span className="text-sm font-bold text-[#1F2937]">Начать</span>
                            </div>
                        </div>
                    ) : (
                        <div className="relative z-10 text-center py-4">
                            <h3 className="text-xl font-bold text-[#1F2937] mb-2">Нет планов</h3>
                            <button className="text-[#8B5CF6] font-bold text-sm hover:underline">Открыть расписание</button>
                        </div>
                    )}
                </div>

                {/* 2. Quick Actions - Pill Row */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
                    {/* QR Pass */}
                    <button
                        onClick={() => onNavigate('qr_pass')}
                        className="bg-[#1F2937] text-white pl-4 pr-8 py-4 rounded-[24px] shadow-lg flex items-center gap-4 shrink-0 hover:bg-black transition-colors"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                            <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest block mb-0.5">Вход</span>
                            <span className="text-lg font-bold block">QR Код</span>
                        </div>
                    </button>

                    {/* Wallet - Supports Debt State */}
                    <button
                        onClick={() => onNavigate('wallet')}
                        className={`pl-4 pr-8 py-4 rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center gap-4 shrink-0 transition-all ${data.wallet.hasDebt
                            ? 'bg-red-50 hover:bg-red-100 ring-2 ring-red-500/20'
                            : 'bg-white hover:shadow-md'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${data.wallet.hasDebt ? 'bg-red-100' : 'bg-[#ECFDF5]'}`}>
                            <Wallet className={`w-6 h-6 ${data.wallet.hasDebt ? 'text-red-500' : 'text-[#10B981]'}`} />
                        </div>
                        <div className="text-left">
                            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${data.wallet.hasDebt ? 'text-red-400' : 'text-[#9CA3AF]'}`}>
                                {data.wallet.hasDebt ? 'Задолженность' : 'Баланс'}
                            </span>
                            <span className={`text-lg font-bold block ${data.wallet.hasDebt ? 'text-red-600' : 'text-[#1F2937]'}`}>
                                {data.wallet.balance} {data.wallet.currency}
                            </span>
                        </div>
                    </button>
                </div>

                {/* 3. Vertical Stack - No Borders, Just Softness */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-bold text-[#1F2937]">Активность</h3>
                        <Settings className="w-5 h-5 text-[#D1D5DB]" />
                    </div>

                    {/* Row 1: Bonuses & Tariff */}
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            onClick={() => onNavigate('loyalty')}
                            className="bg-white p-6 rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center text-center gap-3 cursor-pointer hover:translate-y-[-2px] transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#FFFBEB] flex items-center justify-center">
                                <Star className="w-6 h-6 text-[#F59E0B] fill-current" />
                            </div>
                            <div>
                                <span className="text-2xl font-black text-[#1F2937] block">{data.bonuses.amount}</span>
                                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Бонусы</span>
                            </div>
                        </div>

                        <div
                            onClick={() => onNavigate('tariff_details')}
                            className="bg-white p-6 rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center text-center gap-3 cursor-pointer hover:translate-y-[-2px] transition-transform"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-[#3B82F6]" />
                            </div>
                            <div>
                                <span className="text-sm font-bold text-[#1F2937] block mb-1">{data.tariff?.name?.split(' ')[0] || '-'}</span>
                                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Тариф</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Services Long Card */}
                    <div
                        onClick={() => onNavigate('purchased_services')}
                        className="bg-white p-6 rounded-[32px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] flex items-center justify-between cursor-pointer group"
                    >
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-[20px] bg-[#F5F3FF] flex items-center justify-center text-[#8B5CF6]">
                                <Dumbbell className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-[#1F2937]">{data.services?.name || 'Пакеты'}</h4>
                                <p className="text-sm text-[#9CA3AF]">Осталось: {data.services?.left || 0}</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default HomeScreenPastel;

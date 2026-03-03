import React from 'react';
import { useHomeData } from '../hooks/useHomeData';
import {
    Bell,
    Zap,
    Trophy,
    QrCode,
    WifiOff,
    Footprints,
    Timer,
    Flame
} from 'lucide-react';
import { BentoGrid, BentoItem } from './ui/BentoGrid';
import { FloatingNav } from './ui/FloatingNav';
import { ActivityRing } from './ui/ActivityRing';
import clsx from 'clsx';

interface HomeScreenNeonProps {
    onNavigate: (screen: string) => void;
    toggleBrandTheme: () => void;
    brandTheme: 'default' | 'neon' | 'pastel';
}

export const HomeScreenNeon: React.FC<HomeScreenNeonProps> = ({ onNavigate, toggleBrandTheme, brandTheme }) => {
    const { data, loading, offline } = useHomeData();

    // Mock data for new design elements if not present in original data
    const steps = 6420;
    const stepsGoal = 10000;
    const kcal = 840;
    const kcalGoal = 1200;

    if (loading) {
        return (
            <div className="min-h-screen bg-void flex items-center justify-center">
                <div className="text-neon-lime font-black text-2xl animate-pulse tracking-tighter">LOADING SYSTEMS...</div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-void text-white pb-32 overflow-x-hidden selection:bg-neon-lime selection:text-black font-sans">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full bg-void-gradient pointer-events-none" />

            {/* Header */}
            <header className="px-5 pt-14 pb-4 flex justify-between items-end relative z-10">
                <div>
                    <h1 className="text-[2.5rem] font-display font-black italic tracking-tighter uppercase leading-[0.85] text-glow drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        FITNESS<br />
                        <span className="text-neon-lime drop-shadow-[0_0_15px_rgba(210,255,0,0.5)]">HUB</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2 opacity-60">
                        <div className="w-2 h-2 bg-neon-lime rounded-full animate-pulse shadow-neon-lime"></div>
                        <span className="text-xs font-mono uppercase tracking-widest text-[#888]">{data.clubLocation || 'Saint-P'}</span>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    {/* Dev Mode Toggle */}
                    <button
                        onClick={toggleBrandTheme}
                        className="p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Zap className="w-5 h-5 text-neon-lime" />
                    </button>

                    {/* Notification Bell */}
                    <div
                        onClick={() => onNavigate('notifications')}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm active:scale-95 transition-transform relative"
                    >
                        <Bell className="w-5 h-5 text-white" />
                        {data.unreadNotifications > 0 && (
                            <div className="absolute top-3 right-3 w-2 h-2 bg-neon-lime rounded-full shadow-neon-lime"></div>
                        )}
                    </div>
                </div>
            </header>

            {/* Stories Strip */}
            <div className="pl-5 overflow-x-auto no-scrollbar mb-6 flex gap-4 relative z-10 py-2">
                {data.stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => onNavigate('stories')}>
                        <div className={`w-16 h-16 rounded-full p-[2px] transition-all duration-300 ${story.isViewed ? 'bg-[#333]' : 'bg-gradient-to-tr from-neon-lime to-neon-lavender shadow-neon-lime'}`}>
                            <div className="w-full h-full rounded-full border-2 border-void overflow-hidden relative">
                                <img src={story.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <BentoGrid>
                {/* Hero Card: Today's Challenge - 1:1 Implementation */}
                {/* "Complex overlay: Image + Gradient Mask + Lime Backlight" */}
                <BentoItem span={{ mobile: 12, desktop: 8 }} className="min-h-[320px] !p-0 overflow-hidden relative group">
                    {/* 1. Lime Ambient Light from corner */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-lime blur-[100px] opacity-20 z-0 pointer-events-none" />

                    {/* 2. Background Image */}
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* 3. Gradient Mask (Deep Black to Transparent) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent z-10" />


                    <div className="relative z-20 h-full p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="px-3 py-1 bg-neon-lime text-black text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-[0_0_15px_rgba(210,255,0,0.4)]">
                                Mission #042
                            </span>
                            <Trophy className="text-neon-lime w-6 h-6 drop-shadow-[0_0_8px_rgba(210,255,0,0.8)]" />
                        </div>

                        <div>
                            {/* Typography: Syne, Expanded, Italic */}
                            <h2 className="text-4xl md:text-5xl font-display font-black italic uppercase leading-[0.9] mb-3 text-white drop-shadow-lg">
                                Cardio<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-lime to-white drop-shadow-[0_0_5px_rgba(210,255,0,0.8)]">Overdrive</span>
                            </h2>
                            {/* Typography: Mono for description */}
                            <p className="font-mono text-xs text-[#888] mb-6 max-w-[220px] leading-relaxed">
                                // TARGET: 160 BPM<br />
                                Push your limits with high intensity interval training protocol.
                            </p>

                            {/* Button: "Toxic" Esthetic, Skewed */}
                            <button className="bg-neon-lime text-black px-10 py-4 font-bold uppercase tracking-wider text-xs hover:bg-white transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(210,255,0,0.6)] skew-x-[-12deg] border border-transparent hover:border-neon-lime">
                                <span className="skew-x-[12deg] inline-block">INITIATE</span>
                            </button>
                        </div>
                    </div>
                </BentoItem>

                {/* Vertical Stat: Steps - "Mega-Numerals" */}
                <BentoItem span={{ mobile: 6, desktop: 4 }} className="flex flex-col items-center justify-between py-6 bg-[#0A0A0A] border border-white/5 text-center group hover:border-neon-lime/30">
                    <div className="w-full flex justify-end px-4">
                        <Footprints className="w-5 h-5 text-neon-lime opacity-50" />
                    </div>

                    <div className="relative">
                        {/* Activity Ring with Glow */}
                        <ActivityRing
                            progress={(steps / stepsGoal) * 100}
                            size={110}
                            color="#D2FF00"
                            strokeWidth={6}
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-display font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                {(steps / 1000).toFixed(1)}k
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-mono uppercase text-[#666] tracking-widest">Steps Today</span>
                    </div>
                </BentoItem>

                {/* Vertical Stat: Kcal */}
                <BentoItem span={{ mobile: 6, desktop: 4 }} className="flex flex-col items-center justify-between py-6 bg-[#0A0A0A] border border-white/5 text-center group hover:border-neon-lavender/30">
                    <div className="w-full flex justify-end px-4">
                        <Flame className="w-5 h-5 text-neon-lavender opacity-50" />
                    </div>

                    <div className="relative">
                        <ActivityRing
                            progress={(kcal / kcalGoal) * 100}
                            size={110}
                            color="#E6E6FA"
                            strokeWidth={6}
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-display font-black italic text-white drop-shadow-[0_0_10px_rgba(230,230,250,0.2)]">
                                {kcal}
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-mono uppercase text-[#666] tracking-widest">Kcal Burned</span>
                    </div>
                </BentoItem>

                {/* Quick Action: QR Code */}
                <BentoItem span={{ mobile: 12, desktop: 4 }} className="flex justify-between items-center group cursor-pointer bg-white/5 hover:bg-white/10 !overflow-visible" >
                    {/* Glow behind */}
                    <div className="absolute inset-0 bg-neon-purple/5 blur-xl group-hover:bg-neon-purple/10 transition-colors" />

                    <div
                        onClick={() => onNavigate('qr_pass')}
                        className="absolute inset-0 z-10"
                    />
                    <div className="flex flex-col relative z-20">
                        <span className="text-neon-purple font-display font-black text-2xl uppercase italic drop-shadow-[0_0_5px_rgba(184,169,251,0.5)]">Access Pass</span>
                        <span className="text-[10px] text-[#888] font-mono mt-1">ID: 8092-XF</span>
                    </div>
                    <QrCode className="relative z-20 w-16 h-16 text-neon-purple opacity-80 group-hover:opacity-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 transform drop-shadow-[0_0_10px_rgba(184,169,251,0.4)]" />
                </BentoItem>

                {/* Timer / Next Event */}
                <BentoItem span={{ mobile: 12, desktop: 4 }} className="bg-[#0A0A0A] border border-white/5">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-center gap-2 text-neon-lime">
                            <Timer className="w-4 h-4 drop-shadow-[0_0_5px_rgba(210,255,0,0.5)]" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neon-lime">In Proccess</span>
                        </div>
                        <div className="mt-2">
                            <div className="text-2xl font-display font-black uppercase italic truncate text-white">
                                {data.nextBooking?.title || 'Rest Day'}
                            </div>
                            <div className="text-xs font-mono text-[#666] mt-1">
                                {data.nextBooking?.time || 'No upcoming classes'} • Main Hall
                            </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[#222] mt-4 rounded-full overflow-hidden">
                            <div className="h-full w-[35%] bg-neon-lime shadow-[0_0_10px_#D2FF00]" />
                        </div>
                    </div>
                </BentoItem>

            </BentoGrid>

            {/* Bottom Spacing - "Anti-Gravity" lift */}
            <div className="h-32" />

            {/* Floating Nav - Center Stage */}
            <FloatingNav activeTab="home" onNavigate={onNavigate} />

            {/* Offline Badge */}
            {offline && (
                <div className="bg-red-600/90 text-white text-xs font-bold px-4 py-1 text-center w-full fixed top-0 z-50 backdrop-blur-md flex items-center justify-center gap-2">
                    <WifiOff className="w-3 h-3" />
                    OFFLINE MODE
                </div>
            )}
        </div>
    );
};

export default HomeScreenNeon;

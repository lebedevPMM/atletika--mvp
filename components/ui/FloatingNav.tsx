import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, Users, Settings } from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
    id: string;
    icon: React.ElementType;
    label: string;
}

interface FloatingNavProps {
    activeTab: string;
    onNavigate: (tab: string) => void;
}

const navItems: NavItem[] = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'booking_schedule', icon: Calendar, label: 'Schedule' },
    { id: 'community', icon: Users, label: 'Club' },
    { id: 'profile', icon: Settings, label: 'Profile' }
];

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeTab, onNavigate }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="glass-nav rounded-full px-6 py-3 flex gap-8 items-center">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id || (item.id === 'home' && !activeTab);

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className="relative group flex flex-col items-center justify-center p-2"
                        >
                            <div className="relative z-10">
                                <item.icon
                                    className={clsx(
                                        "w-6 h-6 transition-colors duration-300",
                                        isActive ? "text-cyan-400" : "text-white/40 group-hover:text-white/80"
                                    )}
                                />
                            </div>

                            {/* Active Indicator (Glow Blob) */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-bg"
                                    className="absolute inset-0 bg-white/5 rounded-full blur-[2px] -z-0"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}

                            {/* Active Dot */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-dot"
                                    className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

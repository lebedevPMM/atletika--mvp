import React from 'react';
import { useSocial } from './SocialContext';
import { Swords, Trophy, Flame } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const RaidBossWidget: React.FC = () => {
    const { raidBoss, currentUser } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!raidBoss) return null;

    const hpPercentage = Math.max(0, (raidBoss.currentHp / raidBoss.maxHp) * 100);

    return (
        <div className={`mt-6 rounded-2xl overflow-hidden relative ${isDark ? 'bg-zinc-900' : 'bg-gray-900 text-white'}`}>
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 opacity-20">
                <img src={raidBoss.image} alt="Boss Background" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            <div className="relative p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="bg-red-500/20 text-red-500 p-1.5 rounded-lg">
                                <Swords className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-red-500">Рейд-босс клуба</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{raidBoss.name}</h3>
                        <div className="text-xs text-zinc-400 mt-1">Ур. {raidBoss.level} • {raidBoss.rewards[0]}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold font-mono text-white">
                            {(raidBoss.currentHp / 1000).toFixed(0)}k
                            <span className="text-sm text-zinc-500 font-normal ml-1">ОЗ</span>
                        </div>
                    </div>
                </div>

                {/* Health Bar */}
                <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden mb-4 border border-zinc-700">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-1000 ease-out"
                        style={{ width: `${hpPercentage}%` }}
                    />
                </div>

                <div className="flex justify-between items-center text-xs text-zinc-400">
                    <span>Урон за сегодня</span>
                    <span className="text-white font-medium">-{100 - hpPercentage}%</span>
                </div>

                {/* Your Contribution */}
                {currentUser && (
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            <span className="text-zinc-300">Ваша репутация:</span>
                        </div>
                        <span className="font-mono text-yellow-400 font-bold">
                            {currentUser.stats.reputation.toLocaleString()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RaidBossWidget;

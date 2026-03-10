import React, { useState } from 'react';
import { useSocial } from './social/SocialContext';
import { useTheme } from './ThemeContext';
import { ScreenName } from '../types';
import { Search, Filter, Briefcase, Trophy, ChevronRight, Building2, MapPin } from 'lucide-react';
import { UserProfile, BusinessIndustry, SportLevel } from './social/types';

interface DirectoryScreenProps {
    onNavigate: (screen: ScreenName, params?: any) => void;
}

type FilterTab = 'all' | 'business' | 'sport';

const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ onNavigate }) => {
    const { allMembers } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
    const [selectedIndustry, setSelectedIndustry] = useState<BusinessIndustry | 'All'>('All');

    // --- Filtering Logic ---
    const filteredMembers = allMembers.filter(user => {
        const matchesSearch =
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.business.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.business.industry.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesIndustry = selectedIndustry === 'All' || user.business.industry === selectedIndustry;

        return matchesSearch && matchesIndustry;
    });

    return (
        <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-gray-900'} pb-24`}>
            {/* Header */}
            <div className={`p-4 sticky top-0 z-10 ${isDark ? 'bg-zinc-950/90' : 'bg-white/90'} backdrop-blur-md border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
                <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Каталог</h1>

                {/* Search Bar */}
                <div className="relative mb-4">
                    <Search className={`absolute left-4 top-3.5 w-5 h-5 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`} />
                    <input
                        type="text"
                        placeholder="Поиск по людям, компаниям, интересам..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full py-3pl-12 pr-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 ${isDark ? 'bg-zinc-900 border-zinc-800 placeholder-zinc-600' : 'bg-gray-100 border-gray-200 placeholder-gray-400'}`}
                        style={{ paddingLeft: '3rem' }}
                    />
                </div>

                {/* Quick Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Finance', 'Real Estate', 'Technology', 'Retail'].map(ind => (
                        <button
                            key={ind}
                            onClick={() => setSelectedIndustry(ind as any)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${selectedIndustry === ind
                                ? 'bg-cyan-500 text-white'
                                : isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-gray-100 text-gray-600'}`}
                        >
                            {ind}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4 space-y-4">
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                    {filteredMembers.length} Members Found
                </h2>

                {filteredMembers.map(user => (
                    <button
                        key={user.id}
                        onClick={() => onNavigate('social_profile', { userId: user.id })}
                        className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 group active:scale-[0.99] transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-gray-100 shadow-sm hover:border-cyan-200'}`}
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                                <img src={user.avatarUrl} alt={user.nickname} className="w-full h-full object-cover" />
                            </div>
                            <div className={`absolute bottom-0 right-0 px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-white border-gray-200 text-gray-500'}`}>
                                Lvl {user.stats.level}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-lg leading-tight truncate">{user.firstName} {user.lastName}</h3>
                                {user.stats.reputation > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                                        <Trophy className="w-3 h-3" /> {user.stats.reputation}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 text-sm font-medium text-cyan-500 mb-1">
                                <Building2 className="w-3 h-3" />
                                <span className="truncate">{user.business.companyName}</span>
                            </div>

                            <p className={`text-xs truncate mb-2 ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
                                {user.business.role} • {user.business.industry}
                            </p>

                            {/* DNA Tags */}
                            <div className="flex gap-1 overflow-hidden">
                                {user.business.expertise.slice(0, 2).map(tag => (
                                    <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                                        #{tag}
                                    </span>
                                ))}
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${isDark ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
                                    {user.sports.mainSports[0]}
                                </span>
                            </div>
                        </div>

                        <ChevronRight className={`w-5 h-5 ${isDark ? 'text-zinc-700' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DirectoryScreen;

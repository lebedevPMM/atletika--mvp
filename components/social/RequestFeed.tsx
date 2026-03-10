import React, { useState } from 'react';
import { useSocial } from './SocialContext';
import { useTheme } from '../ThemeContext';
import { Filter, Users, Tag, Clock, Eye, MessageSquare, ChevronRight, Briefcase, Plus } from 'lucide-react';
import { BusinessRequest, RequestType } from './types';
import { ScreenName } from '../../types';

interface RequestFeedProps {
    onNavigate?: (screen: ScreenName) => void;
}

const RequestFeed: React.FC<RequestFeedProps> = ({ onNavigate }) => {
    const { requests, allMembers, isGuest } = useSocial();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [activeType, setActiveType] = useState<'all' | RequestType>('all');

    const filteredRequests = activeType === 'all'
        ? requests
        : requests.filter(r => r.type === activeType);

    const getAuthor = (id: string) => allMembers.find(m => m.id === id);

    const getTypeColor = (type: RequestType) => {
        switch (type) {
            case 'need': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'offer': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'ask': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'lifestyle': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {['all', 'need', 'offer', 'ask', 'lifestyle'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type as any)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all ${activeType === type
                            ? (isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-gray-900 text-white border-gray-900')
                            : (isDark ? 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50')
                            }`}
                    >
                        {type === 'all' ? 'Все запросы' : type === 'need' ? 'Нужно' : type === 'offer' ? 'Предлагаю' : type === 'ask' ? 'Вопрос' : 'Стиль жизни'}
                    </button>
                ))}
            </div>

            {/* Create Button */}
            <button
                onClick={() => {
                    if (isGuest) {
                        onNavigate?.('onboarding_application');
                    } else {
                        onNavigate?.('request_create');
                    }
                }}
                className={`w-full py-3 rounded-xl border border-dashed flex items-center justify-center gap-2 transition-all ${isDark ? 'border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900' : 'border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
                {isGuest ? (
                    <>
                        <Briefcase className="w-5 h-5" />
                        <span className="font-bold text-sm">Подать заявку на публикацию</span>
                    </>
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        <span className="font-bold text-sm">Создать запрос</span>
                    </>
                )}
            </button>

            {/* Feed */}
            <div className="space-y-4">
                {filteredRequests.map(req => {
                    const author = getAuthor(req.authorId);
                    return (
                        <div key={req.id} className={`p-4 rounded-2xl relative overflow-hidden group transition-all ${isDark ? 'bg-zinc-900 hover:bg-zinc-800/80' : 'bg-white shadow-sm hover:shadow-md'}`}>
                            {/* Urgency Stripe */}
                            {req.urgency === 'high' && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                            )}

                            {/* Header */}
                            <div className="flex justify-between items-start mb-3 pl-2">
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getTypeColor(req.type)}`}>
                                    {req.type}
                                </div>
                                <div className={`text-[10px] font-medium flex items-center gap-1 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    <Clock className="w-3 h-3" />
                                    2d left
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pl-2 mb-4">
                                <h3 className={`text-base font-bold mb-1 leading-snug ${isDark ? 'text-zinc-100' : 'text-gray-900'}`}>
                                    {req.title}
                                </h3>
                                <p className={`text-xs line-clamp-2 mb-3 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
                                    {req.description}
                                </p>

                                {/* Tags */}
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-gray-100 text-gray-600'}`}>
                                        {req.category}
                                    </span>
                                    {req.urgency === 'high' && (
                                        <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-red-500 text-white">
                                            🔥 URGENT
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Footer: User & Stats */}
                            <div className="pl-2 flex justify-between items-center pt-3 border-t border-dashed border-gray-200 dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    {author?.avatarUrl ? (
                                        <img src={author.avatarUrl} className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200" />
                                    )}
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold leading-none ${isDark ? 'text-zinc-300' : 'text-gray-900'}`}>{author?.firstName}</span>
                                        <span className={`text-[9px] ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>{author?.business.companyName}</span>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-3 text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3.5 h-3.5" />
                                        {req.views}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {req.responses}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RequestFeed;

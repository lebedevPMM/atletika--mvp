
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  WifiOff,
  RefreshCw,
  Search,
  Filter,
  Clock,
  ArrowRight,
  Bell
} from 'lucide-react';

interface ClubNewsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type NewsItem = {
  id: number;
  type: 'news' | 'promo' | 'event';
  title: string;
  subtitle: string;
  date: string;
  image: string;
  read: boolean;
  categoryLabel: string;
  badgeColor?: string;
};

const ClubNewsScreen: React.FC<ClubNewsScreenProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'promo' | 'event' | 'news'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Mock Data
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 99,
      type: 'news',
      title: 'Technogym Live: Update Cardio Zone',
      subtitle: 'New treadmills with virtual routes are now available in the gym.',
      image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000&auto=format&fit=crop',
      date: 'Today',
      categoryLabel: 'Important',
      badgeColor: 'bg-red-600',
      read: false
    },
    {
      id: 1,
      type: 'promo',
      title: '20% Off Sports Massage',
      subtitle: 'Valid until September 15 for all Gold cardholders.',
      date: 'Until Sep 15',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
      categoryLabel: 'Promo',
      badgeColor: 'bg-yellow-600',
      read: true
    },
    {
      id: 2,
      type: 'event',
      title: 'DJ Set in Cardio Zone',
      subtitle: 'Train to the best tracks from Moscow club residents.',
      date: 'Sep 12, 19:00',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=800&auto=format&fit=crop',
      categoryLabel: 'Event',
      badgeColor: 'bg-purple-600',
      read: false
    },
    {
      id: 3,
      type: 'news',
      title: 'Schedule Change',
      subtitle: 'Club closes at 22:00 on September 20 for maintenance.',
      date: 'Sep 20',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
      categoryLabel: 'Schedule',
      badgeColor: 'bg-blue-600',
      read: true
    },
    {
      id: 4,
      type: 'promo',
      title: 'Refer a Friend - Get a Month Free',
      subtitle: 'Referral program updated. Bonuses are now credited instantly.',
      date: 'All September',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop',
      categoryLabel: 'Bonus',
      badgeColor: 'bg-green-600',
      read: true
    }
  ]);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      // Toggle offline state for demo
      setIsOffline(prev => !prev);
    }, 1500);
  };

  const handleOpenNews = (item: NewsItem) => {
    // Mark as read locally
    const updatedNews = news.map(n => n.id === item.id ? { ...n, read: true } : n);
    setNews(updatedNews);

    // Navigate based on type
    if (item.type === 'event') {
      onNavigate('news_detail'); // Simplified for MVP
    } else {
      onNavigate('news_detail');
    }
  };

  const filteredNews = news.filter(n => filter === 'all' || n.type === filter);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md px-4 pt-4 pb-2 shadow-lg border-b border-zinc-800 sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('home')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-6 h-6 text-zinc-300" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Club News</h1>
              <p className="text-xs text-zinc-500">Events, Promos & Updates</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-2 rounded-full hover:bg-zinc-800 text-zinc-400 transition-all ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'news', label: 'News' },
            { id: 'promo', label: 'Promos' },
            { id: 'event', label: 'Events' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${filter === cat.id
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4">

        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 animate-in slide-in-from-top-2">
            <WifiOff className="w-5 h-5 shrink-0" />
            <div className="text-xs">
              <span className="font-bold block text-red-400">No Connection</span>
              Showing cached news.
            </div>
            <button
              onClick={handleRefresh}
              className="ml-auto text-xs font-bold bg-red-500/20 px-3 py-1.5 rounded-lg hover:bg-red-500/30 transition-colors text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && filteredNews.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-800 animate-pulse">
                <div className="h-40 bg-zinc-800 rounded-xl mb-4"></div>
                <div className="h-4 bg-zinc-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* News List */}
        {!isLoading && filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenNews(item)}
              className="bg-zinc-900 rounded-3xl shadow-sm border border-zinc-800 overflow-hidden cursor-pointer active:scale-[0.99] transition-transform group hover:border-zinc-700"
            >
              {/* Cover Image */}
              <div className="h-48 w-full relative overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`text-[10px] font-bold text-white px-2.5 py-1 rounded-lg uppercase tracking-wide shadow-lg ${item.badgeColor || 'bg-zinc-600'}`}>
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <div className="flex items-start gap-3 mb-1">
                    {!item.read && (
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0 mt-2 ring-2 ring-cyan-500/30 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    )}
                    <h3 className="font-black text-lg leading-tight text-white shadow-sm italic uppercase">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center text-zinc-300 text-xs font-medium gap-3 mt-1">
                    <span className="flex items-center gap-1 opacity-80">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtitle Body */}
              <div className="p-4 pt-3 flex justify-between items-center bg-zinc-900 relative z-20">
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 flex-1 pr-4 group-hover:text-zinc-300 transition-colors">
                  {item.subtitle}
                </p>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-500" />
                </div>
              </div>
            </div>
          ))
        ) : !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <Search className="w-10 h-10 opacity-20" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No news yet</h3>
            <p className="text-sm max-w-[200px] text-zinc-500">Nothing published in this category yet.</p>
            <button
              onClick={() => setFilter('all')}
              className="mt-6 px-6 py-2 bg-cyan-500/10 text-cyan-500 rounded-xl font-bold text-sm hover:bg-cyan-500/20 transition-colors"
            >
              Show All
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClubNewsScreen;

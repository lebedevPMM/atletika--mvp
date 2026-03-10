
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  Filter,
  User,
  Users,
  Clock,
  MapPin,
  X,
  Calendar as CalendarIcon,
  ChevronRight,
  SlidersHorizontal,
  Droplets,
  Wallet,
  Ticket,
  Trophy,
  Smile,
  Flame,
  Sparkles
} from 'lucide-react';
import Button from './ui/Button';

interface BookingScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type FilterType = 'all' | 'group' | 'pt' | 'spa' | 'event';

const BookingScreen: React.FC<BookingScreenProps> = ({ onNavigate }) => {
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [filterType, setFilterType] = useState<FilterType>('spa');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- STANDARD FILTERS ---
  const [trainerFilter, setTrainerFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');

  // --- GROUP SPECIFIC ---
  const [directionFilter, setDirectionFilter] = useState('');

  // --- PT SPECIFIC ---
  const [selectedPtService, setSelectedPtService] = useState('pt60');
  const [selectedPtTrainer, setSelectedPtTrainer] = useState('any');

  // --- SPA SPECIFIC ---
  const [spaCategoryFilter, setSpaCategoryFilter] = useState('all');

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [selectedDate, filterType, selectedPtService, selectedPtTrainer, spaCategoryFilter, trainerFilter, timeFilter]);

  // Generate dynamic dates
  const weekDays = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isToday = i === 0;
    const isTomorrow = i === 1;
    return {
      dayName: isToday ? 'Сегодня' : isTomorrow ? 'Завтра' : d.toLocaleDateString('ru-RU', { weekday: 'short' }),
      date: d.getDate().toString(),
      full: d,
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    };
  });

  // --- MOCK DATA: PT SERVICES ---
  const ptServices = [
    { id: 'pt60', name: 'ПТ 60 мин', price: 2500, duration: '60 мин' },
    { id: 'pt30', name: 'ПТ 30 мин', price: 1500, duration: '30 мин' },
    { id: 'split', name: 'Сплит (2 чел)', price: 3500, duration: '60 мин' },
    { id: 'diagnostics', name: 'Диагностика', price: 0, duration: '45 мин' },
  ];

  // --- MOCK DATA: PT TRAINERS ---
  const trainers = [
    { id: 'any', name: 'Любой тренер', avatar: null, rating: null },
    { id: 'ivan', name: 'Иван К.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan', rating: 4.9, level: 'Elite' },
    { id: 'anna', name: 'Анна М.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', rating: 5.0, level: 'Master' },
    { id: 'alex', name: 'Алексей С.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', rating: 4.8, level: 'Pro' },
  ];

  // --- MOCK DATA: SPA SERVICES ---
  const spaServices = [
    {
      id: 'spa1',
      title: 'Спортивный массаж',
      category: 'massage',
      duration: '60 мин',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop',
      requiresPrepayment: true,
      requiresConfirmation: false,
      description: 'Глубокая проработка мышц',
      rating: 4.9
    },
    {
      id: 'spa2',
      title: 'Релакс-массаж',
      category: 'massage',
      duration: '90 мин',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1519823551278-64ac927accc9?q=80&w=800&auto=format&fit=crop',
      requiresPrepayment: true,
      requiresConfirmation: false,
      description: 'Снятие стресса и усталости',
      rating: 4.8
    },
    {
      id: 'spa3',
      title: 'Уход за лицом "Сияние"',
      category: 'face',
      duration: '45 мин',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      requiresPrepayment: false,
      requiresConfirmation: true,
      description: 'Очищение и увлажнение',
      rating: 5.0
    },
    {
      id: 'spa4',
      title: 'Аренда русской бани',
      category: 'sauna',
      duration: '120 мин',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      requiresPrepayment: true,
      requiresConfirmation: true,
      description: 'До 4 человек',
      rating: 4.9
    }
  ];

  const spaCategories = [
    { id: 'all', label: 'Все' },
    { id: 'massage', label: 'Массаж' },
    { id: 'face', label: 'Лицо' },
    { id: 'body', label: 'Тело' },
    { id: 'sauna', label: 'Бани' },
  ];

  // --- MOCK DATA: SLOTS (Combined) ---
  const slots = [
    // PT Slots
    {
      id: 101, type: 'pt', time: '09:00', trainerId: 'ivan', trainer: 'Иван К.',
      location: 'Тренажерный зал', serviceIds: ['pt60', 'pt30', 'diagnostics'],
      canBook: true, price: 2500
    },
    {
      id: 102, type: 'pt', time: '10:00', trainerId: 'anna', trainer: 'Анна М.',
      location: 'Зона функционального тренинга', serviceIds: ['pt60', 'split'],
      canBook: true, price: 3000
    },
    {
      id: 105, type: 'pt', time: '13:00', trainerId: 'anna', trainer: 'Анна М.',
      location: 'Зона Пилатес', serviceIds: ['pt60', 'pt30'],
      canBook: true, price: 3000
    },

    // Group Classes
    {
      id: 1, type: 'group', time: '09:00', title: 'Утренняя йога', direction: 'mind_body',
      trainer: 'Анна Морозова', duration: '60 мин', totalSpots: 12, bookedSpots: 7,
      intensity: 'low', price: null, level: 'Для всех', location: 'Зал №2', canBook: true
    },
    {
      id: 3, type: 'group', time: '13:00', title: 'CrossFit WOD', direction: 'strength',
      trainer: 'Сергей Д.', duration: '45 мин', totalSpots: 10, bookedSpots: 10,
      intensity: 'high', price: null, level: 'Advanced', location: 'Зона кроссфита', canBook: false, reason: 'Мест нет'
    },
  ];

  // --- FILTERING LOGIC ---
  const filteredSlots = slots.filter(s => {
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (selectedDate % 2 !== s.id % 2) return false;

    if (filterType === 'pt') {
      const matchService = s.serviceIds?.includes(selectedPtService);
      const matchTrainer = selectedPtTrainer === 'any' || s.trainerId === selectedPtTrainer;
      return matchService && matchTrainer;
    }

    const matchesTrainer = trainerFilter ? s.trainer.includes(trainerFilter) : true;
    const matchesTime = timeFilter === 'morning' ? parseInt(s.time) < 12 :
      timeFilter === 'evening' ? parseInt(s.time) >= 17 : true;
    return matchesTrainer && matchesTime;
  });

  const filteredSpaServices = spaServices.filter(s => {
    return spaCategoryFilter === 'all' || s.category === spaCategoryFilter;
  });

  const handleSlotClick = (slot: any) => {
    if (!slot.canBook && !slot.waitlist && !slot.price) return;
    if (slot.type === 'pt') onNavigate('booking_pt_details');
    else onNavigate('booking_class_details');
  };

  const handleSpaClick = (serviceId: string) => {
    onNavigate('booking_spa_details');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pt': return <User className="w-3 h-3" />;
      case 'spa': return <Droplets className="w-3 h-3" />;
      default: return <Users className="w-3 h-3" />;
    }
  };

  const getIntensityColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  const SkeletonCard = () => (
    <div className="flex gap-4 animate-pulse">
      <div className="w-[50px] flex flex-col items-end pt-2 gap-2">
        <div className="h-4 w-10 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        <div className="h-3 w-8 bg-gray-200 dark:bg-zinc-800 rounded"></div>
      </div>
      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-gray-200 dark:border-zinc-800 h-32">
        <div className="flex justify-between mb-3">
          <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-4 w-8 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
        <div className="h-3 w-20 bg-gray-200 dark:bg-zinc-800 rounded mb-4"></div>
      </div>
    </div>
  );

  return (
    <div
      className="pb-24 min-h-screen flex flex-col transition-colors duration-300"
    >
      <div className="absolute inset-0 bg-gray-50 dark:bg-zinc-950 -z-10" />
      {/* Sticky Header */}
      <div
        className="backdrop-blur-md shadow-sm sticky top-0 z-20 transition-colors"
      >
        <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 border-b border-gray-200 dark:border-zinc-800 -z-10" />
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h1
            className="text-xl font-black italic tracking-tighter uppercase transition-colors"
          >
            Запись
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('calendar_sync')}
              className="p-2.5 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-500 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
            {filterType !== 'pt' && filterType !== 'spa' && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl transition-colors ${showFilters ? 'bg-cyan-600 text-white' : 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-400'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Date Strip */}
        {filterType !== 'event' && filterType !== 'spa' && (
          <div className="flex overflow-x-auto no-scrollbar px-4 pb-3 gap-2 pt-1 border-b border-gray-200 dark:border-zinc-800/50">
            {weekDays.map((d, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex flex-col items-center justify-center min-w-[60px] h-[64px] rounded-xl transition-all duration-200 relative overflow-hidden ${selectedDate === index
                  ? 'bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)] transform scale-105'
                  : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-zinc-500'
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase mb-0.5 ${selectedDate === index ? 'text-white/80' : 'text-gray-400 dark:text-zinc-600'}`}>
                  {d.dayName}
                </span>
                <span className="text-lg font-extrabold leading-none">{d.date}</span>
              </button>
            ))}
          </div>
        )}

        {/* --- PT FILTERS --- */}
        {filterType === 'pt' && (
          <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 space-y-3 transition-colors">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {ptServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedPtService(service.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${selectedPtService === service.id
                    ? 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/50 shadow-lg shadow-cyan-900/20'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                    }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {trainers.map((trainer) => (
                <button
                  key={trainer.id}
                  onClick={() => setSelectedPtTrainer(trainer.id)}
                  className={`flex flex-col items-center gap-1 min-w-[60px] transition-opacity ${selectedPtTrainer !== trainer.id && selectedPtTrainer !== 'any' ? 'opacity-50' : 'opacity-100'}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 overflow-hidden ${selectedPtTrainer === trainer.id ? 'border-cyan-500 ring-2 ring-cyan-100 dark:ring-cyan-900' : 'border-gray-200 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800'
                    }`}>
                    {trainer.id === 'any' ? (
                      <Users className="w-6 h-6 text-gray-400 dark:text-zinc-500" />
                    ) : (
                      <img src={trainer.avatar!} alt={trainer.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <span className={`text-[10px] font-bold truncate max-w-[64px] ${selectedPtTrainer === trainer.id ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 dark:text-zinc-600'}`}>
                    {trainer.id === 'any' ? 'Любой' : trainer.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- SPA FILTERS --- */}
        {filterType === 'spa' && (
          <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 transition-colors">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {spaCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSpaCategoryFilter(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border flex items-center gap-2 ${spaCategoryFilter === cat.id
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 border-gray-200 dark:border-zinc-700'
                    }`}
                >
                  {cat.id === 'all' && <Sparkles className="w-3.5 h-3.5" />}
                  {cat.id === 'massage' && <User className="w-3.5 h-3.5" />}
                  {cat.id === 'face' && <Smile className="w-3.5 h-3.5" />}
                  {cat.id === 'sauna' && <Flame className="w-3.5 h-3.5" />}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Generic Filter Drawer (Group) */}
        {showFilters && filterType === 'group' && (
          <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 animate-in slide-in-from-top-2 transition-colors">
            <div className="space-y-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <select className="flex-1 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm rounded-xl px-3 py-2.5 outline-none" value={directionFilter} onChange={(e) => setDirectionFilter(e.target.value)}>
                  <option value="">Все направления</option>
                  <option value="mind_body">Mind & Body</option>
                  <option value="strength">Силовые</option>
                </select>
                <select className="flex-1 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white text-sm rounded-xl px-3 py-2.5 outline-none" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
                  <option value="">Любое время</option>
                  <option value="morning">Утро</option>
                  <option value="evening">Вечер</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button onClick={() => { setDirectionFilter(''); setTimeFilter(''); }} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:text-red-400">
                  <X className="w-3 h-3" /> Сбросить
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Type Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm transition-colors">
          {[
            { id: 'group', label: 'Групповые', icon: Users },
            { id: 'pt', label: 'Персональные', icon: User },
            { id: 'spa', label: 'SPA & Wellness', icon: Droplets },
            { id: 'event', label: 'События', icon: Ticket },
            { id: 'all', label: 'Все', icon: null },
          ].map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id as FilterType)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 border ${filterType === type.id
                  ? 'bg-gray-100 dark:bg-zinc-100 text-gray-900 dark:text-zinc-900 border-white shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                  : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-500 border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:text-gray-700 dark:hover:text-zinc-300'
                  }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {type.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="p-4 space-y-5 flex-1">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filterType === 'spa' ? (
          // --- SPA CATALOG RENDER ---
          <div className="space-y-4">
            {filteredSpaServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleSpaClick(service.id)}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden cursor-pointer active:scale-[0.99] transition-all flex group"
              >
                <div className="w-28 bg-gray-200 dark:bg-zinc-800 shrink-0 relative overflow-hidden">
                  <img src={service.image} className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:opacity-100 transition-opacity" alt={service.title} />
                  {service.requiresPrepayment && (
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md rounded-full p-1.5 border border-white/10">
                      <Wallet className="w-3 h-3 text-cyan-400" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 line-clamp-2 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="flex items-end justify-between mt-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-zinc-600" />
                      {service.duration}
                    </div>
                    <div className="text-right">
                      {service.requiresConfirmation && (
                        <div className="text-[9px] text-orange-500 font-bold uppercase mb-0.5">Подтверждение</div>
                      )}
                      <span className="font-black text-gray-900 dark:text-white text-base tracking-tight">{service.price} ₽</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredSpaServices.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-zinc-600">
                <p>Услуги не найдены</p>
              </div>
            )}
          </div>
        ) : filterType === 'event' ? (
          // --- EVENT LIST RENDER (Simplified) ---
          <div className="text-center py-12 text-gray-500 dark:text-zinc-600">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">Скоро анонсы событий...</p>
          </div>
        ) : (
          // --- SCHEDULE SLOT RENDER (Combined Group & PT) ---
          filteredSlots.length > 0 ? (
            filteredSlots.map((slot) => {
              // --- PT CARD RENDER ---
              if (slot.type === 'pt') {
                const service = ptServices.find(s => s.id === selectedPtService);
                const price = slot.price || service?.price || 0;

                return (
                  <div key={slot.id} className="flex gap-4 group">
                    <div className="flex flex-col items-end pt-1 gap-1 min-w-[50px] text-right">
                      <span className="text-lg font-black text-gray-900 dark:text-white leading-none font-mono">{slot.time}</span>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-1.5 rounded border border-gray-200 dark:border-zinc-800">{service?.duration || '60 мин'}</span>
                    </div>
                    <div
                      onClick={() => handleSlotClick(slot)}
                      className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden transition-all active:scale-[0.98] ${!slot.canBook ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-cyan-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden border border-gray-200 dark:border-zinc-700">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${slot.trainerId}`} alt={slot.trainer} className="w-full h-full" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">{slot.trainer}</h3>
                            <p className="text-xs text-gray-500 dark:text-zinc-500">{slot.location}</p>
                          </div>
                        </div>
                        {slot.canBook ? (
                          <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 p-1.5 rounded-lg border border-cyan-500/20">
                            <User className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 px-2 py-1 rounded">
                            {slot.reason || 'Недоступно'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 pt-3">
                        <span className="text-xs font-medium text-gray-400 dark:text-zinc-400">
                          {service?.name}
                        </span>
                        {slot.canBook && (
                          <div className="flex items-center gap-2">
                            {price > 0 ? (
                              <span className="text-sm font-bold text-gray-900 dark:text-white">{price} ₽</span>
                            ) : (
                              <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-lg border border-green-200 dark:border-green-900/30">Бесплатно</span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              // --- GROUP CARD RENDER ---
              const spotsLeft = slot.totalSpots - slot.bookedSpots;
              const isClosed = !slot.canBook;

              return (
                <div key={slot.id} className="flex gap-4 group">
                  <div className="flex flex-col items-end pt-1 gap-1 min-w-[50px] text-right">
                    <span className="text-lg font-black text-gray-900 dark:text-white leading-none font-mono">{slot.time}</span>
                    <span className="text-[10px] font-bold text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-1.5 rounded border border-gray-200 dark:border-zinc-800">{slot.duration}</span>
                  </div>
                  <div
                    onClick={() => handleSlotClick(slot)}
                    className={`flex-1 bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 relative overflow-hidden transition-all active:scale-[0.98] ${isClosed ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-cyan-500/50 hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isClosed ? 'bg-gray-300 dark:bg-zinc-700' : getIntensityColor(slot.intensity)}`}></div>
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <div className="flex-1 pr-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">{slot.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{slot.location}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
                        {getTypeIcon(slot.type)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3 pl-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-gray-200 dark:ring-zinc-700">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${slot.trainer.replace(' ', '')}`} alt={slot.trainer} className="w-full h-full" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-zinc-300">{slot.trainer}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-dashed border-gray-200 dark:border-zinc-800 pt-3 pl-2">
                      {isClosed ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-lg">
                          {slot.reason || 'Закрыто'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-lg border text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-900/30">
                          {spotsLeft} мест
                        </span>
                      )}
                      <div className="flex items-center gap-2">
                        {!isClosed && <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-900/20 px-2 py-1 rounded-lg border border-cyan-200 dark:border-cyan-900/30">Входит в Пакет</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 text-gray-500 dark:text-zinc-700 border border-gray-200 dark:border-zinc-800">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Нет доступных слотов</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-500 mb-4 max-w-[200px]">
                Попробуйте выбрать другую дату или тренера.
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setSelectedDate(selectedDate + 1)} size="sm">
                  Следующий день
                </Button>
                <Button onClick={() => { setSelectedPtTrainer('any'); setSelectedPtService('pt60'); }} variant="secondary" size="sm">
                  Сбросить
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BookingScreen;

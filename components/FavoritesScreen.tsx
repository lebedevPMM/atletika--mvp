
import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  User,
  CalendarDays,
  Heart,
  Star,
  ChevronRight,
  Clock,
  MapPin,
  Zap,
  Sparkles,
  Users,
  Calendar,
  Search,
  Trash2,
  AlertCircle,
  WifiOff,
  CalendarCheck
} from 'lucide-react';

interface FavoritesScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type Tab = 'trainers' | 'services';

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<Tab>('trainers');
  const [isOffline, setIsOffline] = useState(false); // Mock offline state

  // Mock Data: Trainers
  const [trainers, setTrainers] = useState([
    {
      id: 1,
      name: 'Анна Морозова',
      role: 'Мастер-тренер',
      rating: 5.0,
      reviews: 124,
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      tags: ['Йога', 'Пилатес', 'Stretching'],
      nextSlot: 'Сегодня, 14:00',
      isAvailable: true
    },
    {
      id: 2,
      name: 'Алексей Смирнов',
      role: 'Элит-тренер',
      rating: 4.9,
      reviews: 86,
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      tags: ['Силовые', 'CrossFit', 'TRX'],
      nextSlot: 'Завтра, 10:00',
      isAvailable: true
    },
    {
      id: 3,
      name: 'Дмитрий Петров',
      role: 'Инструктор',
      rating: 4.7,
      reviews: 42,
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      tags: ['Бокс', 'Кардио'],
      nextSlot: null,
      isAvailable: false // Example: Trainer left or unavailable
    },
  ]);

  // Mock Data: Services
  const [services, setServices] = useState([
    {
      id: 1,
      title: 'Йога Flow',
      category: 'Групповые',
      duration: '60 мин',
      price: 0, // Free
      image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=400&auto=format&fit=crop',
      type: 'group',
      isAvailable: true
    },
    {
      id: 2,
      title: 'Спортивный массаж',
      category: 'SPA',
      duration: '60 мин',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400&auto=format&fit=crop',
      type: 'spa',
      isAvailable: true
    },
    {
      id: 3,
      title: 'HIIT Intensive',
      category: 'Групповые',
      duration: '45 мин',
      price: 0,
      image: 'https://images.unsplash.com/photo-1517963879466-e025cf3bd992?q=80&w=400&auto=format&fit=crop',
      type: 'group',
      isAvailable: false // Archived service
    },
  ]);

  const handleRemove = (e: React.MouseEvent, id: number, type: Tab) => {
    e.stopPropagation();
    if (type === 'trainers') {
      setTrainers(prev => prev.filter(t => t.id !== id));
    } else {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleBook = (e: React.MouseEvent, type: 'trainer' | 'group' | 'spa') => {
    e.stopPropagation();
    if (type === 'trainer') onNavigate('booking_pt_details');
    else if (type === 'spa') onNavigate('booking_spa_details');
    else onNavigate('booking_class_details');
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'group': return <Users className="w-3 h-3" />;
      case 'spa': return <Sparkles className="w-3 h-3" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  const getServiceBadgeColor = (type: string) => {
    switch (type) {
      case 'group': return 'bg-purple-100 text-purple-700';
      case 'spa': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Избранное</h1>
        </div>
        {isOffline && <WifiOff className="w-5 h-5 text-gray-400" />}
      </div>

      {/* Tabs */}
      <div className="px-4 pt-4 pb-2">
        <div className="bg-gray-200 p-1 rounded-xl flex">
          <button
            onClick={() => setActiveTab('trainers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'trainers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Тренеры <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{trainers.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase rounded-lg transition-all ${activeTab === 'services' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Услуги <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{services.length}</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4 pb-24">
        {activeTab === 'trainers' ? (
          trainers.length > 0 ? (
            trainers.map((trainer) => (
              <div
                key={trainer.id}
                onClick={() => trainer.isAvailable && onNavigate('trainer_about')}
                className={`bg-white p-4 rounded-2xl shadow-sm border transition-all active:scale-[0.99] ${trainer.isAvailable ? 'border-gray-100 hover:border-blue-200 cursor-pointer' : 'border-gray-100 opacity-60 grayscale'}`}
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                    <img src={trainer.img} alt={trainer.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm truncate">{trainer.name}</h4>
                        <p className="text-xs text-blue-600 font-bold mb-1">{trainer.role}</p>
                      </div>
                      <button
                        onClick={(e) => handleRemove(e, trainer.id, 'trainers')}
                        className="p-2 -mr-2 -mt-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <div className="flex items-center gap-1 text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded">
                        <Star className="w-3 h-3 fill-current" /> {trainer.rating}
                      </div>
                      <span>({trainer.reviews} отзывов)</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {trainer.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-medium bg-gray-50 text-gray-500 px-2 py-0.5 rounded border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-3 flex items-center justify-between">
                  {trainer.isAvailable ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        <CalendarCheck className="w-3.5 h-3.5" />
                        {trainer.nextSlot}
                      </div>
                      <button
                        onClick={(e) => handleBook(e, 'trainer')}
                        className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-transform"
                      >
                        Записаться
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg flex-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Недоступен
                      </div>
                      <span className="text-[10px] text-gray-400">Сотрудник больше не работает</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={User}
              title="Нет любимых тренеров"
              desc="Добавляйте тренеров в избранное, чтобы быстро записываться к ним."
              cta="Найти тренера"
              action={() => onNavigate('club_team')}
            />
          )
        ) : (
          services.length > 0 ? (
            services.map((service) => (
              <div
                key={service.id}
                onClick={() => service.isAvailable && onNavigate(service.type === 'spa' ? 'booking_spa_details' : 'booking_class_details')}
                className={`bg-white p-3 rounded-2xl shadow-sm border flex gap-4 transition-all active:scale-[0.99] group ${service.isAvailable ? 'border-gray-100 hover:border-blue-200 cursor-pointer' : 'border-gray-100 opacity-60 grayscale'}`}
              >
                <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden shrink-0 relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  {service.isAvailable && (
                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase flex items-center gap-1 ${getServiceBadgeColor(service.category)}`}>
                      {getServiceIcon(service.type)} {service.category}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">{service.title}</h4>
                    <button
                      onClick={(e) => handleRemove(e, service.id, 'services')}
                      className="text-red-500 p-1 hover:bg-red-50 rounded-full -mr-1 -mt-1"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {service.duration}
                  </div>

                  <div className="flex items-end justify-between mt-1">
                    <div>
                      {service.isAvailable ? (
                        service.price > 0 ? (
                          <span className="font-extrabold text-gray-900">{service.price} ₽</span>
                        ) : (
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Бесплатно</span>
                        )
                      ) : (
                        <span className="text-xs font-bold text-gray-400">В архиве</span>
                      )}
                    </div>

                    {service.isAvailable && (
                      <button
                        onClick={(e) => handleBook(e, service.type as any)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform"
                      >
                        Записаться
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              icon={CalendarDays}
              title="Нет любимых услуг"
              desc="Сохраняйте интересные занятия и процедуры, чтобы не потерять их."
              cta="Открыть каталог"
              action={() => onNavigate('service_catalog')}
            />
          )
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, desc, cta, action }: { icon: any, title: string, desc: string, cta: string, action: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
      <Icon className="w-10 h-10" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-[240px] mb-8 leading-relaxed">{desc}</p>
    <button
      onClick={action}
      className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center gap-2"
    >
      <Search className="w-4 h-4" /> {cta}
    </button>
  </div>
);

export default FavoritesScreen;

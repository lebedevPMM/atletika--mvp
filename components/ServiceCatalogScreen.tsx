
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Filter, 
  ChevronRight, 
  Zap, 
  Clock, 
  Tag, 
  X,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface ServiceCatalogScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type CategoryType = 'all' | 'tariff' | 'package' | 'spa' | 'event';

const ServiceCatalogScreen: React.FC<ServiceCatalogScreenProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock Data based on Spec
  const items = [
    { 
      id: 1, 
      type: 'tariff', 
      title: 'Абонемент 12 посещений', 
      description: 'Доступ в тренажерный зал и кардио-зону. Срок действия 45 дней.',
      price: 12000, 
      oldPrice: null, 
      tag: 'Хит', 
      tagColor: 'bg-orange-500',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      features: ['45 дней', 'Заморозка 7 дн']
    },
    { 
      id: 2, 
      type: 'spa', 
      title: 'СПА массаж 60 минут', 
      description: 'Расслабляющий массаж всего тела с аромамаслами.',
      price: 3500, 
      oldPrice: null, 
      tag: 'New', 
      tagColor: 'bg-green-600',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop',
      features: ['60 мин', 'Халат и тапочки']
    },
    { 
      id: 3, 
      type: 'tariff', 
      title: 'Безлимит: Год', 
      description: 'Полный доступ 24/7, бассейн, групповые программы.',
      price: 45000, 
      oldPrice: 52000, 
      tag: 'Выгода 15%', 
      tagColor: 'bg-red-500',
      image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=600&auto=format&fit=crop',
      features: ['12 мес', 'Заморозка 30 дн']
    },
    { 
      id: 4, 
      type: 'package', 
      title: '10 Персональных тренировок', 
      description: 'Занятия с тренером категории Мастер. Составление программы питания.',
      price: 22000, 
      oldPrice: null, 
      tag: null, 
      tagColor: '',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
      features: ['Срок 60 дней', 'Любой тренер']
    },
    { 
      id: 5, 
      type: 'event', 
      title: 'Марафон похудения', 
      description: '4 недели интенсивных тренировок, план питания и контроль куратора.',
      price: 5000, 
      oldPrice: 7000, 
      tag: 'Старт 1 Окт', 
      tagColor: 'bg-blue-600',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
      features: ['Online + Offline']
    }
  ];

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'tariff', label: 'Тарифы' },
    { id: 'package', label: 'Пакеты' },
    { id: 'spa', label: 'СПА' },
    { id: 'event', label: 'Мероприятия' },
  ];

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Каталог услуг</h1>
          <button 
            onClick={() => onNavigate('cart')}
            className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {/* Mock Cart Badge */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Найти абонемент или услугу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition-colors ${showFilters ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as CategoryType)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                activeCategory === cat.id 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Extended Filters (Expandable) */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100 animate-in slide-in-from-top-2">
             <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Фильтры</p>
                <button onClick={() => setShowFilters(false)} className="text-[10px] font-bold text-blue-600">Сбросить</button>
             </div>
             <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 active:bg-gray-50">Длительность</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 active:bg-gray-50">Цена</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 active:bg-gray-50">Только акции</button>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => onNavigate('shop_product_details')}
                className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden group active:scale-[0.99] transition-transform cursor-pointer"
              >
                {/* Image Section */}
                <div className="w-28 h-32 bg-gray-200 rounded-2xl shrink-0 overflow-hidden relative">
                   <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                   {item.tag && (
                     <div className={`absolute top-0 left-0 ${item.tagColor} text-white text-[10px] font-bold px-2 py-1 rounded-br-xl shadow-sm z-10`}>
                       {item.tag}
                     </div>
                   )}
                </div>

                {/* Content Section */}
                <div className="flex-1 flex flex-col justify-between py-1">
                   <div>
                     <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">{item.title}</h3>
                     </div>
                     <p className="text-xs text-gray-500 leading-snug line-clamp-2 mb-2">{item.description}</p>
                     
                     <div className="flex flex-wrap gap-1">
                       {item.features.map((feat, i) => (
                         <span key={i} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                           {feat}
                         </span>
                       ))}
                     </div>
                   </div>

                   <div className="flex items-end justify-between mt-2">
                      <div>
                        {item.oldPrice && (
                          <span className="text-[10px] text-gray-400 line-through block decoration-red-400">
                            {item.oldPrice.toLocaleString()} ₽
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          {item.price === 0 ? (
                             <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Бесплатно</span>
                          ) : (
                             <>
                                <span className="text-lg font-extrabold text-gray-900">
                                  {item.price.toLocaleString()}
                                </span>
                                <span className="text-xs font-bold text-gray-500">₽</span>
                             </>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('shop_product_details'); }}
                        className="bg-blue-600 text-white p-2 rounded-xl shadow-md active:bg-blue-700 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
               <Search className="w-8 h-8" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-1">Ничего не найдено</h3>
             <p className="text-sm text-gray-500 mb-6 max-w-[200px]">
               Попробуйте изменить параметры поиска или фильтры.
             </p>
             <button 
               onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
               className="text-blue-600 font-bold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
             >
               Сбросить фильтры
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceCatalogScreen;

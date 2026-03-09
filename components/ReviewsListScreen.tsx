
import React, { useState, useMemo } from 'react';
import { ScreenName } from '../types';
import { 
  ArrowLeft, 
  Star, 
  ThumbsUp, 
  Edit3, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  User, 
  Flag,
  SlidersHorizontal,
  MessageCircle,
  ChevronRight
} from 'lucide-react';

interface ReviewsListScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type SortOption = 'newest' | 'highest' | 'lowest';
type FilterType = 'all' | 'gym' | 'group' | 'trainer' | 'spa';

const ReviewsListScreen: React.FC<ReviewsListScreenProps> = ({ onNavigate }) => {
  const [sort, setSort] = useState<SortOption>('newest');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<number[]>([]);

  // Mock Summary Data
  const summary = {
    average: 4.8,
    total: 312,
    breakdown: [240, 50, 15, 5, 2] // Counts for 5, 4, 3, 2, 1 stars
  };

  const totalReviews = summary.breakdown.reduce((a, b) => a + b, 0);

  // Mock Reviews Data
  const reviewsData = [
    {
      id: 1,
      name: 'Марина В.',
      date: '2024-09-10',
      rating: 5,
      text: 'Лучший клуб в районе! Занимаюсь с тренером Алексеем уже полгода, результат - минус 10 кг. Очень нравится зона SPA после тренировки.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      likes: 12,
      type: 'trainer',
      tags: ['Персонал', 'Результат'],
      trainerId: 101,
      trainerName: 'Алексей Смирнов'
    },
    {
      id: 2,
      name: 'Константин П.',
      date: '2024-09-08',
      rating: 4,
      text: 'Хороший зал, чисто и уютно. Но вечером бывает многовато народу на кардио, приходится ждать дорожку. В остальном все супер, особенно новые тренажеры Technogym.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Konstantin',
      likes: 5,
      type: 'gym',
      tags: ['Оборудование', 'Чистота']
    },
    {
      id: 3,
      name: 'Аноним',
      date: '2024-09-01',
      rating: 5,
      text: 'Очень нравится зона бассейна. Всегда чистая вода и приятная температура. Рекомендую аквааэробику с Еленой!',
      avatar: null,
      likes: 8,
      type: 'spa',
      tags: ['Бассейн']
    },
    {
      id: 4,
      name: 'Ольга К.',
      date: '2024-08-25',
      rating: 2,
      text: 'Грязно в раздевалке уже второй раз за неделю. Просьба клинингу работать внимательнее.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
      likes: 2,
      type: 'gym',
      tags: ['Чистота']
    },
    {
      id: 5,
      name: 'Иван И.',
      date: '2024-08-20',
      rating: 5,
      text: 'Групповые программы огонь! Йога Flow по четвергам - мастхэв для расслабления.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
      likes: 15,
      type: 'group',
      tags: ['Групповые']
    }
  ];

  const filteredReviews = useMemo(() => {
    let result = [...reviewsData];

    // Filter
    if (filter !== 'all') {
      result = result.filter(r => r.type === filter);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sort === 'highest') return b.rating - a.rating;
      if (sort === 'lowest') return a.rating - b.rating;
      return 0;
    });

    return result;
  }, [filter, sort]);

  const toggleExpand = (id: number) => {
    setExpandedReviews(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getSortLabel = (s: SortOption) => {
    switch(s) {
      case 'newest': return 'Сначала новые';
      case 'highest': return 'Сначала высокие';
      case 'lowest': return 'Сначала низкие';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Отзывы о клубе</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* Rating Summary Block */}
        <div className="bg-white p-6 mb-2 border-b border-gray-100">
           <div className="flex items-center gap-6">
             <div className="text-center min-w-[80px]">
               <div className="text-5xl font-extrabold text-gray-900 tracking-tighter">{summary.average}</div>
               <div className="flex text-yellow-400 justify-center my-1.5">
                 {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(summary.average) ? 'fill-current' : 'text-gray-300'}`} />)}
               </div>
               <div className="text-xs text-gray-400 font-medium">{summary.total} оценок</div>
             </div>
             
             <div className="flex-1 space-y-1.5 border-l border-gray-100 pl-6">
               {[5, 4, 3, 2, 1].map((stars, idx) => {
                 const count = summary.breakdown[idx]; // 5 stars is index 0
                 const percent = (count / totalReviews) * 100;
                 return (
                   <div key={stars} className="flex items-center gap-3 text-xs">
                     <span className="w-2 font-bold text-gray-400">{stars}</span>
                     <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-yellow-400 rounded-full" 
                         style={{ width: `${percent}%` }}
                       ></div>
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        </div>

        {/* Filters & Sort */}
        <div className="sticky top-[60px] z-10 bg-gray-50/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100 space-y-3">
           {/* Sort Dropdown */}
           <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900">{filteredReviews.length} отзывов</h2>
              <div className="relative">
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm active:bg-gray-50"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  {getSortLabel(sort)}
                </button>
                {showSortMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)}></div>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden py-1">
                      {(['newest', 'highest', 'lowest'] as SortOption[]).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => { setSort(opt); setShowSortMenu(false); }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${sort === opt ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                        >
                          {getSortLabel(opt)}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
           </div>

           {/* Type Chips */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Все' },
                { id: 'trainer', label: 'Тренеры' },
                { id: 'group', label: 'Групповые' },
                { id: 'gym', label: 'Зал' },
                { id: 'spa', label: 'SPA' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setFilter(chip.id as FilterType)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    filter === chip.id 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
           </div>
        </div>

        {/* Reviews List */}
        <div className="p-4 space-y-4">
           {filteredReviews.length > 0 ? filteredReviews.map((review) => {
             const isExpanded = expandedReviews.includes(review.id);
             const isLong = review.text.length > 120;

             return (
               <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative group">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 text-gray-400 font-bold">
                          {review.avatar ? (
                            <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{review.name}</h4>
                          <span className="text-[10px] text-gray-400">{review.date}</span>
                        </div>
                     </div>
                     <div className="flex bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                       ))}
                     </div>
                  </div>
                  
                  {/* Tags */}
                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {review.tags.map((tag, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Text */}
                  <div className="relative">
                    <p className={`text-sm text-gray-800 leading-relaxed ${!isExpanded && isLong ? 'line-clamp-3' : ''}`}>
                      {review.text}
                    </p>
                    {isLong && (
                      <button 
                        onClick={() => toggleExpand(review.id)}
                        className="text-xs font-bold text-blue-600 mt-1 hover:underline"
                      >
                        {isExpanded ? 'Скрыть' : 'Читать далее'}
                      </button>
                    )}
                  </div>

                  {/* Linked Trainer */}
                  {review.trainerId && (
                    <div 
                      onClick={() => onNavigate('trainer_profile')}
                      className="mt-4 p-2 bg-blue-50 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                       <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                         <User className="w-4 h-4 text-blue-700" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[10px] text-blue-600 font-bold uppercase">Тренер</p>
                         <p className="text-xs font-bold text-gray-900">{review.trainerName}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-blue-400" />
                    </div>
                  )}
                  
                  {/* Footer Actions */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3 mt-4">
                     <button className="text-xs text-gray-500 font-medium flex items-center gap-1.5 hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50">
                       <ThumbsUp className="w-3.5 h-3.5" /> Полезно ({review.likes})
                     </button>
                     <button className="text-xs text-gray-400 font-medium flex items-center gap-1.5 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50">
                       <Flag className="w-3.5 h-3.5" /> Пожаловаться
                     </button>
                  </div>
               </div>
             );
           }) : (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <MessageCircle className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Пока нет отзывов</h3>
                <p className="text-sm text-gray-500 max-w-[200px]">Будьте первым, кто поделится мнением о клубе!</p>
             </div>
           )}
        </div>
      </div>

      {/* Write Review FAB */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => onNavigate('review_create')}
          className="px-6 py-4 bg-gray-900 text-white rounded-full shadow-xl shadow-gray-400 flex items-center gap-2 active:scale-95 transition-transform hover:bg-black hover:shadow-2xl"
        >
          <Edit3 className="w-5 h-5" />
          <span className="font-bold text-sm">Написать отзыв</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewsListScreen;

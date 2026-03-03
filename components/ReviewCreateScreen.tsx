
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Star,
  X,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  MessageSquare,
  Calendar,
  Loader2,
  ThumbsUp,
  Info
} from 'lucide-react';

interface ReviewCreateScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type EligibilityStatus = 'checking' | 'eligible' | 'ineligible';

const ReviewCreateScreen: React.FC<ReviewCreateScreenProps> = ({ onNavigate }) => {
  // --- STATE ---
  const [eligibility, setEligibility] = useState<EligibilityStatus>('checking');

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(true); // Default true per spec
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- CONFIG ---
  const MIN_CHARS = 20;
  const MAX_CHARS = 2000;
  const TAGS_LIST = ['Чистота', 'Персонал', 'Оборудование', 'Раздевалки', 'Групповые', 'Атмосфера'];

  // --- EFFECTS ---
  useEffect(() => {
    // Simulate API check for eligibility (GET /clubs/{id}/review/eligibility)
    const timer = setTimeout(() => {
      // Mock logic: 90% chance eligible for demo
      setEligibility(Math.random() > 0.1 ? 'eligible' : 'ineligible');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // --- HANDLERS ---
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    // Simulate API POST
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate('review_result');
    }, 1500);
  };

  const handleSupportRedirect = () => {
    onNavigate('complaint'); // Or 'support'
  };

  // --- VALIDATION ---
  const isLowRating = rating > 0 && rating <= 2;
  const isTextValid = text.length === 0 || (text.length >= MIN_CHARS && text.length <= MAX_CHARS);
  const canSubmit = rating > 0 && agreedToRules && isTextValid && !isSubmitting;

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5: return 'Отлично! 😍';
      case 4: return 'Хорошо 🙂';
      case 3: return 'Нормально 😐';
      case 2: return 'Плохо 😕';
      case 1: return 'Ужасно 😫';
      default: return 'Нажмите для оценки';
    }
  };

  // --- RENDER: LOADING ---
  if (eligibility === 'checking') {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // --- RENDER: INELIGIBLE (No visit found) ---
  if (eligibility === 'ineligible') {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="p-4">
          <button onClick={() => onNavigate('reviews_list')} className="p-2 -ml-2 rounded-full hover:bg-gray-200 w-fit">
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center -mt-20">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <Calendar className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Нет недавних посещений</h2>
          <p className="text-gray-500 mb-8 text-sm max-w-xs leading-relaxed">
            Оставить отзыв можно только после завершенной тренировки или посещения клуба.
          </p>
          <button
            onClick={() => onNavigate('booking_schedule')}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Записаться на тренировку
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: FORM ---
  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 bg-white/90 backdrop-blur-md">
        <button onClick={() => onNavigate('reviews_list')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <X className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Оценить клуб</h1>
        <div className="w-10"></div>{/* Spacer */}
      </div>

      <div className="p-6 flex-1 overflow-y-auto">

        {/* Rating Section */}
        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="flex gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform active:scale-90 focus:outline-none p-1"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${star <= (hoverRating || rating)
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                      : 'text-gray-200'
                    }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <p className={`text-sm font-bold mt-2 animate-in fade-in transition-colors ${rating > 0 ? 'text-gray-800' : 'text-gray-400'}`}>
            {getRatingLabel(hoverRating || rating)}
          </p>
        </div>

        {/* Logic: Low Rating Interception */}
        {isLowRating ? (
          <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 mb-6 flex flex-col gap-3 animate-in slide-in-from-top-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm">Что-то пошло не так?</h3>
            </div>
            <p className="text-xs text-orange-800 leading-relaxed">
              Нам очень жаль, что ваш визит прошел неудачно. Вы можете написать напрямую управляющему, чтобы мы оперативно решили проблему.
            </p>
            <button
              onClick={handleSupportRedirect}
              className="w-full bg-white text-orange-700 py-3 rounded-xl border border-orange-200 font-bold text-sm shadow-sm flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Написать управляющему
            </button>
            <div className="text-center">
              <button
                onClick={() => setRating(0)} // Reset to force reconsideration or allow editing if they insist
                className="text-[10px] text-orange-400 underline mt-1"
              >
                Нет, я хочу оставить публичный отзыв
              </button>
            </div>
          </div>
        ) : (
          /* High/Normal Rating Form */
          <>
            {/* Tags */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Что понравилось?</label>
              <div className="flex flex-wrap gap-2">
                {TAGS_LIST.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${isSelected
                          ? 'bg-gray-900 text-white border-gray-900 shadow-md transform scale-105'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Ваш комментарий</label>
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Расскажите подробнее о ваших впечатлениях..."
                  className={`w-full h-32 bg-gray-50 border rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none placeholder:text-gray-400 ${text.length > 0 && text.length < MIN_CHARS ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500/50'
                    }`}
                />
                {text.length > 0 && (
                  <span className={`absolute bottom-3 right-3 text-[10px] font-bold ${text.length < MIN_CHARS || text.length > MAX_CHARS ? 'text-red-500' : 'text-gray-400'}`}>
                    {text.length} / {MAX_CHARS}
                  </span>
                )}
              </div>
              {text.length > 0 && text.length < MIN_CHARS && (
                <p className="text-[10px] text-red-500 mt-1 ml-1 animate-in fade-in">Минимум {MIN_CHARS} символов</p>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4 mb-8">
              {/* Anonymity Toggle */}
              <div
                onClick={() => setIsAnonymous(!isAnonymous)}
                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 cursor-pointer active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${isAnonymous ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                    {isAnonymous ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Анонимный отзыв</p>
                    <p className="text-[10px] text-gray-500">
                      {isAnonymous ? 'Ваше имя будет скрыто' : 'Опубликовать от моего имени'}
                    </p>
                  </div>
                </div>
                <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors duration-200 ${isAnonymous ? 'bg-purple-600' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${isAnonymous ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
              </div>

              {/* Rules Consent Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${agreedToRules ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                  {agreedToRules && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
                <input type="checkbox" className="hidden" checked={agreedToRules} onChange={() => setAgreedToRules(!agreedToRules)} />
                <p className="text-xs text-gray-500 leading-snug select-none">
                  Я подтверждаю, что отзыв основан на реальном посещении и соглашаюсь с <span className="text-blue-600 underline">правилами публикации</span> (без оскорблений и спама).
                </p>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      {!isLowRating && (
        <div className="p-4 border-t border-gray-100 safe-area-bottom bg-white">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Публикация...
              </>
            ) : (
              <>
                <ThumbsUp className="w-5 h-5" /> Отправить отзыв
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCreateScreen;

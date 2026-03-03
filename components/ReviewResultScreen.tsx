import React, { useState } from 'react';
import { ScreenName } from '../types';
import { CheckCircle2, Home, User, Clock, AlertTriangle, RotateCcw } from 'lucide-react';

interface ReviewResultScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ResultStatus = 'published' | 'pending' | 'failed';

const ReviewResultScreen: React.FC<ReviewResultScreenProps> = ({ onNavigate }) => {
  // DEV STATE: Toggle this to see different states
  const [status, setStatus] = useState<ResultStatus>('published');

  // Dev control to switch states
  const toggleStatus = () => {
    if (status === 'published') setStatus('pending');
    else if (status === 'pending') setStatus('failed');
    else setStatus('published');
  };

  const renderContent = () => {
    switch (status) {
      case 'published':
        return {
          icon: <CheckCircle2 className="w-12 h-12 text-green-600" />,
          bg: 'bg-green-100',
          title: 'Спасибо за отзыв!',
          msg: 'Ваше мнение помогает нам становиться лучше. Отзыв опубликован и доступен в профиле тренера.',
          primaryAction: {
            label: 'Вернуться к профилю',
            icon: User,
            onClick: () => onNavigate('trainer_profile')
          },
          secondaryAction: {
            label: 'На главную',
            icon: Home,
            onClick: () => onNavigate('home')
          }
        };
      case 'pending':
        return {
          icon: <Clock className="w-12 h-12 text-orange-600" />,
          bg: 'bg-orange-100',
          title: 'Отзыв на модерации',
          msg: 'Мы проверяем все отзывы перед публикацией. Это обычно занимает не более 24 часов.',
          primaryAction: {
            label: 'Вернуться к профилю',
            icon: User,
            onClick: () => onNavigate('trainer_profile')
          },
          secondaryAction: {
            label: 'На главную',
            icon: Home,
            onClick: () => onNavigate('home')
          }
        };
      case 'failed':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-600" />,
          bg: 'bg-red-100',
          title: 'Не удалось отправить',
          msg: 'Произошла ошибка при отправке отзыва. Пожалуйста, проверьте соединение и попробуйте снова.',
          primaryAction: {
            label: 'Повторить',
            icon: RotateCcw,
            onClick: () => {
              // Simulate retry
              setStatus('pending');
              setTimeout(() => setStatus('published'), 1500);
            }
          },
          secondaryAction: {
            label: 'Отмена',
            icon: Home,
            onClick: () => onNavigate('trainer_profile')
          }
        };
    }
  };

  const content = renderContent();
  const Icon = content.primaryAction.icon;
  const SecondaryIcon = content.secondaryAction.icon;

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300 relative">

      {/* Dev Toggle (Hidden in prod) */}
      <button
        onClick={toggleStatus}
        className="absolute top-4 right-4 text-[10px] text-gray-300 border border-gray-100 px-2 py-1 rounded hover:bg-gray-50"
      >
        Toggle State ({status})
      </button>

      <div className={`w-24 h-24 ${content.bg} rounded-full flex items-center justify-center mb-8 mx-auto shadow-sm`}>
        {content.icon}
      </div>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{content.title}</h1>
      <p className="text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
        {content.msg}
      </p>

      <div className="w-full space-y-3 max-w-sm">
        <button
          onClick={content.primaryAction.onClick}
          className={`w-full text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all ${status === 'failed' ? 'bg-red-600 shadow-red-200' :
              status === 'pending' ? 'bg-orange-500 shadow-orange-200' :
                'bg-blue-600 shadow-blue-200'
            }`}
        >
          <Icon className="w-5 h-5" />
          {content.primaryAction.label}
        </button>
        <button
          onClick={content.secondaryAction.onClick}
          className="w-full bg-gray-50 text-gray-900 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <SecondaryIcon className="w-5 h-5" />
          {content.secondaryAction.label}
        </button>
      </div>
    </div>
  );
};

export default ReviewResultScreen;
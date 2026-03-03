
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowRight, Sparkles, Activity, Zap } from 'lucide-react';

interface IntroScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onNavigate }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "Твой клуб\nв кармане",
      subtitle: "Доступ в клуб по QR-коду, управление услугами и расписание.",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
      icon: Sparkles
    },
    {
      title: "Умные\nтренировки",
      subtitle: "Нейрофитнес, отслеживание прогресса и персональные планы.",
      image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop",
      icon: Activity
    },
    {
      title: "Энергия\nи драйв",
      subtitle: "Присоединяйся к сообществу Atletika+ и достигай большего.",
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop",
      icon: Zap
    }
  ];

  const handleNext = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    } else {
      onNavigate('auth_phone');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Image */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === slide ? 'opacity-60' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 dark:from-zinc-950 dark:via-zinc-950/80 to-transparent"></div>

      <div className="flex-1 flex flex-col justify-end p-8 relative z-10 pb-16">

        <div className="mb-8">
          <div className="w-12 h-12 bg-cyan-600 dark:bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
            {React.createElement(slides[slide].icon, { className: "w-6 h-6 text-white" })}
          </div>

          <h1 className="text-5xl font-black text-gray-900 dark:text-white italic uppercase leading-[0.9] tracking-tighter mb-4 whitespace-pre-line animate-in slide-in-from-right-4 duration-500 key-{slide}">
            {slides[slide].title}
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 font-medium max-w-xs leading-relaxed animate-in fade-in duration-700 delay-150">
            {slides[slide].subtitle}
          </p>
        </div>

        {/* Indicators */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === slide ? 'w-8 bg-cyan-600 dark:bg-cyan-500' : 'w-2 bg-gray-300 dark:bg-zinc-800'}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl"
        >
          {slide === slides.length - 1 ? 'Начать' : 'Далее'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
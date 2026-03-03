
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

interface StoriesScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const StoriesScreen: React.FC<StoriesScreenProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const stories = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000&auto=format&fit=crop',
      title: 'New Treadmills',
      desc: 'Already in the cardio zone! Come and test them.',
      action: 'Details',
      link: 'news_detail'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000&auto=format&fit=crop',
      title: 'Group Workouts',
      desc: 'Updated schedule for September.',
      action: 'Open Schedule',
      link: 'booking_schedule'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop',
      title: 'Massage Discount',
      desc: 'Only until the end of the week -20%.',
      action: 'Book Now',
      link: 'booking_spa_details'
    }
  ];

  const duration = 5000; // 5 seconds per story

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          handleNext();
          return 0;
        }
        return oldProgress + (100 / (duration / 100)); // Update every 100ms
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onNavigate('home');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleAction = () => {
    const link = stories[currentIndex].link as ScreenName;
    if (link) onNavigate(link);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 flex flex-col safe-area-top safe-area-bottom">
      {/* Progress Bars */}
      <div className="absolute top-4 left-0 right-0 z-20 flex gap-1 px-2">
        {stories.map((_, idx) => (
          <div key={idx} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
            <div
              className={`h-full bg-white transition-all ease-linear ${idx < currentIndex ? 'w-full' :
                  idx === currentIndex ? 'w-full origin-left' : 'w-0'
                }`}
              style={idx === currentIndex ? { width: `${progress}%` } : {}}
            ></div>
          </div>
        ))}
      </div>

      {/* Header Controls */}
      <div className="absolute top-8 left-0 right-0 z-20 px-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center font-bold text-xs shadow-lg shadow-cyan-500/20">A+</div>
          <span className="font-bold text-sm">Atletika+</span>
          <span className="text-xs text-zinc-300 ml-1">1h</span>
        </div>
        <button onClick={() => onNavigate('home')} className="p-2 bg-black/20 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 bg-zinc-900 data-joyride-step='stories-step'">
        {/* Joyride Target (invisible overlay if needed, but data attr is safer) */}

        <img
          src={stories[currentIndex].image}
          alt="Story"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20"></div>

        {/* Navigation Touch Areas */}
        <div className="absolute inset-0 flex z-10">
          <div className="w-1/3 h-full" onClick={handlePrev}></div>
          <div className="w-2/3 h-full" onClick={handleNext}></div>
        </div>

        {/* Text Overlay */}
        <div className="absolute bottom-12 left-0 right-0 p-6 z-20 text-white">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-black mb-2 leading-tight uppercase italic">{stories[currentIndex].title}</h2>
            <p className="text-base text-zinc-200 mb-6">{stories[currentIndex].desc}</p>

            <button
              onClick={handleAction}
              className="w-full bg-white text-black py-4 rounded-xl font-bold active:scale-95 transition-transform flex items-center justify-center gap-1 hover:bg-zinc-200"
            >
              {stories[currentIndex].action} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesScreen;
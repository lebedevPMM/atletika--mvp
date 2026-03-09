import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Play, Pause, SkipForward, Maximize2, Cast, Volume2, Timer } from 'lucide-react';

interface OnlineWorkoutPlayerScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const OnlineWorkoutPlayerScreen: React.FC<OnlineWorkoutPlayerScreenProps> = ({ onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45); // seconds for current exercise
  const [progress, setProgress] = useState(30); // video progress %

  const exercise = {
    name: 'Приседания с выпрыгиванием',
    next: 'Планка на локтях',
    set: '2/4',
    reps: '45 сек',
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft]);

  return (
    <div className="bg-black min-h-screen flex flex-col text-white relative">
      {/* Video Placeholder Area */}
      <div className="relative w-full aspect-[9/16] md:aspect-video bg-gray-900 flex items-center justify-center overflow-hidden">
         {/* Mock Video Content */}
         <img 
           src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop" 
           className="w-full h-full object-cover opacity-60"
           alt="Workout"
         />
         
         {/* Top Controls Overlay */}
         <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
            <button onClick={() => onNavigate('BACK')} className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-4">
               <Cast className="w-5 h-5 text-white" />
               <Volume2 className="w-5 h-5 text-white" />
            </div>
         </div>

         {/* Center Play Button */}
         {!isPlaying && (
           <button 
             onClick={() => setIsPlaying(true)}
             className="absolute z-20 w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/50 active:scale-95 transition-transform"
           >
             <Play className="w-8 h-8 text-white fill-current ml-1" />
           </button>
         )}

         {/* Bottom Overlay Info */}
         <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="mb-6">
               <h2 className="text-2xl font-bold mb-1">{exercise.name}</h2>
               <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold">{exercise.set}</span>
                  <span>{exercise.reps}</span>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/20 rounded-full mb-6 overflow-hidden">
               <div className="bg-blue-500 h-full rounded-full" style={{ width: `${progress}%` }}></div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-blue-400" />
                  <span className="text-3xl font-mono font-bold">{timeLeft < 10 ? `00:0${timeLeft}` : `00:${timeLeft}`}</span>
               </div>
               
               <div className="flex gap-4">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="p-4 bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
                    {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>
                  <button className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                    <SkipForward className="w-6 h-6 text-white" />
                  </button>
               </div>
            </div>
         </div>
      </div>

      {/* Up Next Section (Below Video) */}
      <div className="flex-1 bg-gray-900 p-6 rounded-t-3xl -mt-6 relative z-30 border-t border-white/10">
         <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6"></div>
         
         <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wide">Далее</h3>
            <button className="text-xs font-bold text-blue-400">Весь список</button>
         </div>

         <div className="bg-gray-800 p-4 rounded-2xl flex items-center gap-4 border border-gray-700">
            <div className="w-16 h-16 bg-gray-700 rounded-xl overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" />
               <div className="absolute bottom-1 right-1 bg-black/60 px-1 rounded text-[9px] font-bold">0:45</div>
            </div>
            <div>
               <h4 className="font-bold text-white text-lg">{exercise.next}</h4>
               <p className="text-sm text-gray-400">Корпус • Статика</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default OnlineWorkoutPlayerScreen;
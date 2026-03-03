import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Trophy, Lock, Zap, Award } from 'lucide-react';

interface AchievementsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onNavigate }) => {
  const achievements = [
    { id: 1, title: 'Первые шаги', desc: 'Посетить клуб 3 раза', icon: '👣', progress: 100, unlocked: true },
    { id: 2, title: 'Ранняя пташка', desc: 'Тренировка до 08:00 утра', icon: '🌅', progress: 100, unlocked: true },
    { id: 3, title: 'Марафонец', desc: '10 кардио тренировок', icon: '🏃', progress: 60, unlocked: false },
    { id: 4, title: 'Железный человек', desc: 'Поднять в сумме 10 тонн', icon: '🏋️', progress: 25, unlocked: false },
    { id: 5, title: 'Йог', desc: 'Посетить 5 занятий йогой', icon: '🧘', progress: 40, unlocked: false },
    { id: 6, title: 'Душа компании', desc: 'Привести друга', icon: '🤝', progress: 0, unlocked: false },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="bg-gray-900 min-h-screen text-white pb-20">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 sticky top-0 z-10 bg-gray-900/90 backdrop-blur-sm">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-800">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold">Достижения</h1>
      </div>

      <div className="p-6">
        {/* Summary */}
        <div className="text-center mb-8">
           <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/20">
             <Trophy className="w-12 h-12 text-white" />
           </div>
           <h2 className="text-3xl font-extrabold mb-1">{unlockedCount} / {achievements.length}</h2>
           <p className="text-gray-400 text-sm">Получено наград</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((item) => (
            <div 
              key={item.id} 
              className={`p-4 rounded-2xl border flex flex-col items-center text-center relative overflow-hidden ${
                item.unlocked 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-gray-900 border-gray-800 opacity-60'
              }`}
            >
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{item.desc}</p>
              
              {!item.unlocked && (
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-auto">
                  <div 
                    className="bg-blue-500 h-1.5 rounded-full" 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              )}
              
              {!item.unlocked && (
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                </div>
              )}
              
              {item.unlocked && (
                <div className="absolute top-2 right-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsScreen;
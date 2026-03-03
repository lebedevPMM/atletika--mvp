import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, BookOpen, PlayCircle, CheckCircle2, Lock, ChevronRight, GraduationCap } from 'lucide-react';

interface TrainerEducationScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerEducationScreen: React.FC<TrainerEducationScreenProps> = ({ onNavigate }) => {
  const activeCourses = [
    { id: 1, title: 'Техники продаж ПТ', progress: 75, totalModules: 8, completedModules: 6, color: 'bg-blue-600' },
    { id: 2, title: 'Анатомия: Плечевой пояс', progress: 30, totalModules: 5, completedModules: 1, color: 'bg-orange-500' },
  ];

  const catalog = [
    { id: 101, title: 'Нутрициология для тренеров', category: 'Hard Skills', duration: '4 часа', type: 'video' },
    { id: 102, title: 'Психология общения с клиентом', category: 'Soft Skills', duration: '2 часа', type: 'text' },
    { id: 103, title: 'Первая помощь (CPR)', category: 'Safety', duration: '3 часа', type: 'offline', locked: true },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Академия</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24">
        
        {/* My Learning */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-gray-500" /> Мое обучение
             </h2>
           </div>
           
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4">
              {activeCourses.map((course) => (
                <div key={course.id} className="w-64 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 shrink-0 flex flex-col justify-between h-40 relative overflow-hidden group">
                   <div className={`absolute top-0 left-0 w-1 h-full ${course.color}`}></div>
                   <div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1 block">В процессе</span>
                     <h3 className="font-bold text-gray-900 leading-snug mb-2">{course.title}</h3>
                   </div>
                   
                   <div>
                     <div className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                       <span>{course.progress}%</span>
                       <span>{course.completedModules}/{course.totalModules} модулей</span>
                     </div>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                       <div className={`h-full ${course.color}`} style={{ width: `${course.progress}%` }}></div>
                     </div>
                   </div>
                   
                   <button className="absolute bottom-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                     <PlayCircle className="w-5 h-5 text-gray-600" />
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Catalog */}
        <div>
           <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-lg font-bold text-gray-900">Каталог курсов</h2>
             <button className="text-blue-600 text-xs font-bold">Все</button>
           </div>

           <div className="space-y-3">
             {catalog.map((item) => (
               <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-transform">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.locked ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-600'}`}>
                        {item.locked ? <Lock className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                     </div>
                     <div>
                       <h4 className={`font-bold text-sm ${item.locked ? 'text-gray-400' : 'text-gray-900'}`}>{item.title}</h4>
                       <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.category}</span>
                         <span className="text-xs text-gray-400">• {item.duration}</span>
                       </div>
                     </div>
                  </div>
                  {!item.locked && <ChevronRight className="w-5 h-5 text-gray-300" />}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerEducationScreen;
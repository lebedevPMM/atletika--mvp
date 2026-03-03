import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, CheckSquare, Plus, Calendar, Clock, Square, CheckSquare as CheckSquareIcon } from 'lucide-react';

interface TrainerTaskScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerTaskScreen: React.FC<TrainerTaskScreenProps> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Позвонить новому лиду (Анна К.)', due: 'Сегодня, 14:00', type: 'call', done: false },
    { id: 2, title: 'Продлить блок тренировок (Игорь)', due: 'Сегодня, 18:00', type: 'sales', done: false },
    { id: 3, title: 'Поздравить с ДР (Марина В.)', due: 'Завтра', type: 'crm', done: false },
    { id: 4, title: 'Сдать отчет за неделю', due: 'Пятница', type: 'admin', done: true },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const pendingTasks = tasks.filter(t => !t.done);
  const completedTasks = tasks.filter(t => t.done);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Задачи</h1>
        </div>
        <button className="bg-gray-900 text-white p-2 rounded-lg shadow-md active:scale-95 transition-transform">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Активные ({pendingTasks.length})</h2>
        <div className="space-y-3 mb-6">
          {pendingTasks.map(task => (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-3 active:scale-[0.99] transition-transform cursor-pointer"
            >
               <Square className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
               <div className="flex-1">
                 <p className="text-sm font-bold text-gray-900 leading-snug mb-1">{task.title}</p>
                 <div className="flex items-center gap-2">
                   <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                     task.type === 'call' ? 'bg-green-100 text-green-700' : 
                     task.type === 'sales' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                   }`}>
                     {task.type.toUpperCase()}
                   </span>
                   <span className="text-xs text-gray-400 flex items-center gap-1">
                     <Clock className="w-3 h-3" /> {task.due}
                   </span>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {completedTasks.length > 0 && (
          <>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Завершено</h2>
            <div className="space-y-3 opacity-60">
              {completedTasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className="bg-gray-100 p-4 rounded-xl border border-gray-200 flex items-center gap-3 cursor-pointer"
                >
                   <CheckSquareIcon className="w-5 h-5 text-green-600 shrink-0" />
                   <p className="text-sm font-medium text-gray-500 line-through decoration-gray-400">{task.title}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerTaskScreen;
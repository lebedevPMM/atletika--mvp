import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Plus, Trash2, Save, GripVertical, ChevronDown, ChevronUp, Copy, Dumbbell } from 'lucide-react';

interface TrainerPlanScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerPlanScreen: React.FC<TrainerPlanScreenProps> = ({ onNavigate }) => {
  const [activeDay, setActiveDay] = useState(1);
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  // Mock Plan Data
  const [days, setDays] = useState([
    {
      id: 1,
      title: 'День 1: Ноги',
      exercises: [
        { id: 101, name: 'Приседания со штангой', sets: '4', reps: '10', weight: '60', notes: 'Глубокий сед' },
        { id: 102, name: 'Жим ногами', sets: '3', reps: '15', weight: '120', notes: '' },
      ]
    },
    {
      id: 2,
      title: 'День 2: Грудь и Плечи',
      exercises: []
    }
  ]);

  const handleUpdateExercise = (dayId: number, exId: number, field: string, value: string) => {
    setDays(days.map(d => d.id === dayId ? { 
      ...d, 
      exercises: d.exercises.map(e => e.id === exId ? { ...e, [field]: value } : e) 
    } : d));
  };

  const handleDeleteExercise = (dayId: number, exId: number) => {
    setDays(days.map(d => d.id === dayId ? { ...d, exercises: d.exercises.filter(e => e.id !== exId) } : d));
  };

  const currentDayData = days.find(d => d.id === activeDay);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-none">Конструктор</h1>
            <p className="text-xs text-gray-500">Мария Иванова</p>
          </div>
        </div>
        <button className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform flex items-center gap-2">
          <Save className="w-3.5 h-3.5" /> Сохранить
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Days Strip */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {days.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setActiveDay(day.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeDay === day.id 
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                  : 'bg-white border-gray-200 text-gray-500'
              }`}
            >
              День {idx + 1}
            </button>
          ))}
          <button className="px-3 py-2 rounded-xl bg-gray-50 text-gray-400 border border-dashed border-gray-300 hover:border-blue-300 hover:text-blue-500 transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {/* Day Title Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
             <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Название тренировки</label>
             <input 
               type="text" 
               value={currentDayData?.title}
               className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 border-none p-0 focus:ring-0"
               placeholder="Например: День ног"
             />
          </div>

          {/* Exercises */}
          <div className="space-y-3">
            {currentDayData?.exercises.map((ex, idx) => (
              <div key={ex.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300">
                
                {/* Header */}
                <div 
                  onClick={() => setExpandedExercise(expandedExercise === ex.id ? null : ex.id)}
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 cursor-grab active:cursor-grabbing">
                       <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-gray-900">{idx + 1}. {ex.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                      {ex.sets} x {ex.reps}
                    </span>
                    {expandedExercise === ex.id ? <ChevronUp className="w-4 h-4 text-gray-400"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
                  </div>
                </div>

                {/* Expanded Form */}
                {expandedExercise === ex.id && (
                  <div className="px-4 pb-4 pt-0 bg-white space-y-4 animate-in slide-in-from-top-2">
                    <div className="h-px bg-gray-100 mb-4 mx-2"></div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Упражнение</label>
                      <input 
                        type="text" 
                        value={ex.name} 
                        onChange={(e) => handleUpdateExercise(activeDay, ex.id, 'name', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500" 
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block text-center">Подходы</label>
                        <input 
                          type="number" 
                          value={ex.sets}
                          onChange={(e) => handleUpdateExercise(activeDay, ex.id, 'sets', e.target.value)} 
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-center font-bold focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block text-center">Повторы</label>
                        <input 
                          type="text" 
                          value={ex.reps} 
                          onChange={(e) => handleUpdateExercise(activeDay, ex.id, 'reps', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-center font-bold focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block text-center">Вес (кг)</label>
                        <input 
                          type="number" 
                          value={ex.weight} 
                          onChange={(e) => handleUpdateExercise(activeDay, ex.id, 'weight', e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-center font-bold focus:outline-none focus:border-blue-500" 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Комментарий</label>
                      <input 
                        type="text" 
                        value={ex.notes} 
                        onChange={(e) => handleUpdateExercise(activeDay, ex.id, 'notes', e.target.value)}
                        placeholder="Техника, темп, отдых..." 
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500" 
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                       <button className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-2">
                         <Copy className="w-3.5 h-3.5" /> Дублировать
                       </button>
                       <button 
                         onClick={() => handleDeleteExercise(activeDay, ex.id)}
                         className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-2"
                       >
                         <Trash2 className="w-3.5 h-3.5" /> Удалить
                       </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate('trainer_exercise_library')}
            className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-white hover:border-blue-300 hover:text-blue-500 transition-colors group"
          >
            <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
               <Plus className="w-5 h-5" />
            </div>
            Добавить упражнение
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainerPlanScreen;
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Wrench, Camera, AlertTriangle, Plus, QrCode, Clock } from 'lucide-react';

interface TrainerEquipmentReportScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerEquipmentReportScreen: React.FC<TrainerEquipmentReportScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [desc, setDesc] = useState('');

  const history = [
    { id: 1, item: 'Беговая дорожка №4', issue: 'Стук при беге', date: 'Вчера', status: 'pending', priority: 'high' },
    { id: 2, item: 'Гантельный ряд', issue: 'Отсутствует гантель 12кг', date: '10 Сен', status: 'fixed', priority: 'low' },
  ];

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Оборудование</h1>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === 'new' ? 'history' : 'new')}
          className="text-xs font-bold bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600"
        >
          {activeTab === 'new' ? 'История заявок' : 'Новая заявка'}
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'new' ? (
          <div className="space-y-6">
             <button className="w-full bg-blue-600 text-white p-6 rounded-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform">
               <QrCode className="w-6 h-6" />
               <span className="font-bold">Сканировать QR на тренажере</span>
             </button>

             <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Название / Инвентарный номер</label>
                  <input type="text" placeholder="Например: Жим ногами (Technogym)" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Приоритет</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map(p => (
                      <button 
                        key={p} 
                        onClick={() => setPriority(p as any)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                          priority === p 
                            ? (p === 'high' ? 'bg-red-600 text-white' : p === 'medium' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white') 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p === 'low' ? 'Низкий' : p === 'medium' ? 'Средний' : 'Высокий'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Описание проблемы</label>
                  <textarea 
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Что сломалось?"
                    className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-medium flex flex-col items-center justify-center gap-1 hover:border-blue-400 hover:text-blue-500 transition-colors">
                   <Camera className="w-6 h-6" />
                   <span className="text-xs">Добавить фото</span>
                </button>
             </div>

             <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all">
               Отправить заявку
             </button>
          </div>
        ) : (
          <div className="space-y-3">
             {history.map(item => (
               <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-gray-900 text-sm">{item.item}</h3>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getPriorityColor(item.priority)}`}>
                       {item.priority}
                     </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{item.issue}</p>
                  <div className="flex justify-between items-center border-t border-gray-50 pt-2">
                     <span className="text-[10px] text-gray-400 flex items-center gap-1">
                       <Clock className="w-3 h-3" /> {item.date}
                     </span>
                     <span className={`text-xs font-bold ${item.status === 'fixed' ? 'text-green-600' : 'text-yellow-600'}`}>
                       {item.status === 'fixed' ? 'Исправлено' : 'В работе'}
                     </span>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerEquipmentReportScreen;
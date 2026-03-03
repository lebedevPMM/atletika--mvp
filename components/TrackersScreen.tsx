import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Activity, Watch, Smartphone, Link2, RefreshCw, Heart } from 'lucide-react';

interface TrackersScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrackersScreen: React.FC<TrackersScreenProps> = ({ onNavigate }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const trackers = [
    { 
      id: 1, 
      name: 'Apple Health', 
      icon: Activity, 
      status: 'connected', 
      lastSync: '10 мин назад', 
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      data: ['Шаги', 'Пульс', 'Активность'] 
    },
    { 
      id: 2, 
      name: 'Google Fit', 
      icon: Heart, 
      status: 'disconnected', 
      lastSync: null, 
      color: 'bg-white border border-gray-200 text-blue-600',
      iconColor: 'text-blue-600',
      data: []
    },
    { 
      id: 3, 
      name: 'Garmin', 
      icon: Watch, 
      status: 'connected', 
      lastSync: '1 час назад', 
      color: 'bg-black',
      data: ['Тренировки', 'GPS'] 
    },
    { 
      id: 4, 
      name: 'Strava', 
      icon: Smartphone, 
      status: 'disconnected', 
      lastSync: null, 
      color: 'bg-[#FC4C02]',
      data: [] 
    },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Гаджеты</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-[100px] -mr-4 -mt-4"></div>
          <div className="relative z-10 flex gap-4">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
               <Link2 className="w-6 h-6" />
             </div>
             <div>
               <h3 className="font-bold text-gray-900 mb-1">Единый центр здоровья</h3>
               <p className="text-xs text-gray-500 leading-relaxed">
                 Подключите внешние источники, чтобы тренер видел вашу полную активность: шаги, сон, домашние тренировки.
               </p>
             </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
             <h3 className="font-bold text-gray-900">Доступные сервисы</h3>
             {isSyncing && <span className="text-xs text-blue-600 font-medium animate-pulse">Синхронизация...</span>}
          </div>
          
          {trackers.map((tracker) => {
            const Icon = tracker.icon;
            const isConnected = tracker.status === 'connected';
            
            return (
              <div key={tracker.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 transition-all active:scale-[0.99]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm ${tracker.color}`}>
                      <Icon className={`w-6 h-6 ${tracker.iconColor || 'text-white'}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{tracker.name}</h3>
                      {isConnected ? (
                        <p className="text-xs text-green-600 flex items-center gap-1 font-medium mt-0.5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Подключено
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-0.5">Не настроено</p>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      isConnected 
                        ? 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' 
                        : 'bg-gray-900 text-white border-transparent hover:bg-gray-800 shadow-md'
                    }`}
                  >
                    {isConnected ? 'Настроить' : 'Подключить'}
                  </button>
                </div>

                {isConnected && (
                  <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                     <div className="flex gap-2">
                       {tracker.data.map((d, i) => (
                         <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                           {d}
                         </span>
                       ))}
                     </div>
                     <span className="text-[10px] text-gray-400">Синхр: {tracker.lastSync}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 safe-area-bottom">
         <button 
           onClick={handleSync}
           disabled={isSyncing}
           className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70"
         >
           <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
           {isSyncing ? 'Обновляем данные...' : 'Синхронизировать сейчас'}
         </button>
      </div>
    </div>
  );
};

export default TrackersScreen;
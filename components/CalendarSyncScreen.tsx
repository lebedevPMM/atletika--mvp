
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  RefreshCw, 
  Settings, 
  AlertTriangle, 
  Bell,
  Smartphone,
  CheckSquare,
  Square,
  Loader2
} from 'lucide-react';

interface CalendarSyncScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type PermissionStatus = 'granted' | 'denied' | 'prompt';

const CalendarSyncScreen: React.FC<CalendarSyncScreenProps> = ({ onNavigate }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>('prompt');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Settings
  const [selectedCalendarId, setSelectedCalendarId] = useState('cal_1');
  
  // "По умолчанию все" per spec
  const [syncTypes, setSyncTypes] = useState({
    group: true,
    pt: true,
    spa: true,
    event: true
  });
  
  // "Можно несколько напоминаний" per spec
  const [reminders, setReminders] = useState<string[]>(['1h']);

  // Mock System Calendars
  const deviceCalendars = [
    { id: 'cal_1', name: 'Личный (iCloud)', color: 'bg-blue-500' },
    { id: 'cal_2', name: 'Рабочий (Exchange)', color: 'bg-purple-500' },
    { id: 'cal_3', name: 'Family Shared', color: 'bg-green-500' },
  ];

  const reminderOptions = [
    { id: '1h', label: 'За 1 час' },
    { id: '3h', label: 'За 3 часа' },
    { id: '24h', label: 'За день' },
  ];

  const handleToggleMaster = () => {
    if (isEnabled) {
      // Turning off
      setIsEnabled(false);
    } else {
      // Turning on - Request Permission Simulation
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        // Simulate permission logic: 
        // In a real app, we check OS permission here.
        // For demo, let's say 80% chance granted, 20% denied to show that state.
        const isSuccess = Math.random() > 0.2; 
        if (isSuccess) {
          setPermissionStatus('granted');
          setIsEnabled(true);
        } else {
          setPermissionStatus('denied');
          setIsEnabled(false); // Switch stays off if denied
        }
      }, 1000);
    }
  };

  const handleOpenSettings = () => {
    // Simulate opening OS settings
    alert('Открываем настройки устройства...');
    setPermissionStatus('granted'); // Auto-fix for demo
    setIsEnabled(true);
  };

  const toggleSyncType = (key: keyof typeof syncTypes) => {
    setSyncTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Синхронизация</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24 space-y-6">
        
        {/* Master Toggle Card */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isEnabled ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                   {isSyncing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calendar className="w-6 h-6" />}
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-base">Календарь</h3>
                   <p className="text-xs text-gray-500 mt-0.5">Экспорт событий в телефон</p>
                 </div>
              </div>
              
              <button 
                onClick={handleToggleMaster}
                disabled={isSyncing}
                className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${isEnabled ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
           </div>

           {/* Permission Denied Warning */}
           {permissionStatus === 'denied' && !isEnabled && !isSyncing && (
             <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-bold mb-1">Нет доступа к календарю</p>
                  <p className="text-xs text-red-600 mb-3 leading-relaxed">
                    Приложению нужно разрешение на чтение и запись календаря, чтобы добавлять тренировки.
                  </p>
                  <button 
                    onClick={handleOpenSettings}
                    className="text-xs font-bold bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2 active:bg-gray-50"
                  >
                    <Settings className="w-3.5 h-3.5" /> Открыть настройки
                  </button>
                </div>
             </div>
           )}
        </div>

        {/* Configuration Sections (Only visible if enabled) */}
        {isEnabled && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Calendar Selection */}
            <section>
               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Выбор календаря</h2>
               <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {deviceCalendars.map((cal, idx) => (
                    <button
                      key={cal.id}
                      onClick={() => setSelectedCalendarId(cal.id)}
                      className={`w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors ${idx !== deviceCalendars.length - 1 ? 'border-b border-gray-50' : ''}`}
                    >
                       <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${cal.color}`}></div>
                          <span className={`text-sm font-medium ${selectedCalendarId === cal.id ? 'text-gray-900' : 'text-gray-600'}`}>
                            {cal.name}
                          </span>
                       </div>
                       {selectedCalendarId === cal.id && (
                         <div className="text-blue-600">
                           <Check className="w-5 h-5" strokeWidth={2.5} />
                         </div>
                       )}
                    </button>
                  ))}
               </div>
               <p className="text-[10px] text-gray-400 mt-2 ml-2">
                 События будут добавляться сюда.
               </p>
            </section>

            {/* 2. Types to Sync */}
            <section>
               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1">Какие записи добавлять</h2>
               <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {[
                    { id: 'group', label: 'Групповые программы' },
                    { id: 'pt', label: 'Персональные тренировки' },
                    { id: 'spa', label: 'SPA & Wellness' },
                    { id: 'event', label: 'Мероприятия' },
                  ].map((item, idx) => {
                    const isChecked = syncTypes[item.id as keyof typeof syncTypes];
                    return (
                      <div 
                        key={item.id} 
                        onClick={() => toggleSyncType(item.id as any)}
                        className={`flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 ${idx !== 3 ? 'border-b border-gray-50' : ''}`}
                      >
                         <span className="text-sm font-medium text-gray-900">{item.label}</span>
                         <div className={`transition-colors ${isChecked ? 'text-blue-600' : 'text-gray-300'}`}>
                           {isChecked ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                         </div>
                      </div>
                    );
                  })}
               </div>
            </section>

            {/* 3. Reminders */}
            <section>
               <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-1 flex items-center gap-2">
                 <Bell className="w-3.5 h-3.5" /> Напоминания
               </h2>
               <div className="flex gap-2">
                  {reminderOptions.map((opt) => {
                    const isActive = reminders.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleReminder(opt.id)}
                        className={`flex-1 py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                          isActive 
                            ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                            : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
               </div>
               <p className="text-[10px] text-gray-400 mt-2 ml-2 leading-tight">
                 Можно выбрать несколько. Если ОС ограничивает, будет использовано одно стандартное.
               </p>
            </section>

          </div>
        )}
      </div>

      {/* Save Button (Conceptually triggers a sync update) */}
      {isEnabled && (
        <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
          <button 
            onClick={() => onNavigate('my_schedule')}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <RefreshCw className="w-5 h-5" />
            Синхронизировать сейчас
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarSyncScreen;

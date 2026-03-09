
import React from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  Zap,
  Check,
  Megaphone,
  User,
  Settings,
  AlertTriangle
} from 'lucide-react';

interface NotificationsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onNavigate }) => {
  // Simulate a state where system permissions are denied (common case for prompts)
  const isSystemPermissionDenied = true;

  const notifications = [
    {
      id: 1,
      type: 'reminder',
      title: 'Напоминание о тренировке',
      message: 'Ждем вас сегодня в 19:00 на Йога Flow. Не забудьте взять полотенце!',
      time: '2 часа назад',
      dateGroup: 'Сегодня',
      read: false
    },
    {
      id: 2,
      type: 'trainer',
      title: 'Новое сообщение',
      message: 'Алексей Смирнов: "Привет! Завтра все в силе?"',
      time: '14:30',
      dateGroup: 'Сегодня',
      read: true
    },
    {
      id: 3,
      type: 'promo',
      title: 'Скидка на массаж -20%',
      message: 'Только в эти выходные специальное предложение для владельцев карт Gold.',
      time: '10 Сен',
      dateGroup: 'Ранее',
      read: true
    },
    {
      id: 4,
      type: 'system',
      title: 'Изменение в расписании',
      message: 'Тренировка Body Pump (12 Сен) переносится на 18:30.',
      time: '09 Сен',
      dateGroup: 'Ранее',
      read: true
    }
  ];

  const grouped = notifications.reduce((acc, note) => {
    (acc[note.dateGroup] = acc[note.dateGroup] || []).push(note);
    return acc;
  }, {} as Record<string, typeof notifications>);

  const getIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <CalendarClock className="w-5 h-5 text-cyan-400" />;
      case 'promo': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'system': return <Megaphone className="w-5 h-5 text-zinc-400" />;
      case 'trainer': return <User className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-cyan-500/10 border border-cyan-500/20';
      case 'promo': return 'bg-yellow-500/10 border border-yellow-500/20';
      case 'system': return 'bg-zinc-800 border border-zinc-700';
      case 'trainer': return 'bg-green-500/10 border border-green-500/20';
      default: return 'bg-zinc-800';
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md p-4 shadow-lg border-b border-zinc-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-300" />
          </button>
          <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Notifications</h1>
        </div>
        <button className="text-cyan-400 text-xs font-bold bg-cyan-950/50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-cyan-900/50 transition-colors border border-cyan-900">
          <Check className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="p-4 space-y-6">

        {/* System Permission Banner (Per Spec) */}
        {isSystemPermissionDenied && (
          <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-400 mb-1">Notifications Disabled</h3>
              <p className="text-xs text-red-300/80 mb-3 leading-snug">
                You might miss important schedule changes. Enable them in device settings.
              </p>
              <button className="bg-zinc-900 text-red-400 text-xs font-bold px-4 py-2 rounded-lg border border-red-500/20 shadow-sm flex items-center gap-2 hover:bg-zinc-800">
                <Settings className="w-3.5 h-3.5" />
                Open Settings
              </button>
            </div>
          </div>
        )}

        {Object.entries(grouped).map(([group, items]) => (
          <div key={group}>
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3 ml-1">{group}</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => item.type === 'trainer' && onNavigate('chat_list')}
                  className={`bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-800 relative overflow-hidden transition-all active:scale-[0.99] ${!item.read ? 'ring-1 ring-cyan-500/30' : ''}`}
                >
                  {!item.read && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"></div>
                  )}

                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(item.type)}`}>
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 pr-4">
                        <h3 className={`text-sm font-bold truncate ${item.read ? 'text-zinc-400' : 'text-white'}`}>{item.title}</h3>
                        <span className="text-[10px] text-zinc-600 font-medium whitespace-nowrap ml-2">{item.time}</span>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">{item.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
              <Bell className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-white font-medium">No new notifications</p>
            <p className="text-zinc-500 text-sm mt-1">Important club messages will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;

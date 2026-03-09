import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Clock, MapPin, XCircle, Hourglass, CheckCircle2, Bell, AlertCircle } from 'lucide-react';

interface WaitlistScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const WaitlistScreen: React.FC<WaitlistScreenProps> = ({ onNavigate }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // MOCK DATA with different states
  const [waitlist, setWaitlist] = useState([
    {
      id: 1,
      title: 'Pilates Reformer',
      date: '14 Сен, Суббота',
      time: '11:00',
      trainer: 'Елена Соколова',
      position: 2,
      totalQueue: 5,
      location: 'Студия Пилатеса',
      status: 'joined' as const,
      offerExpiresAt: null
    },
    {
      id: 2,
      title: 'TRX Advanced',
      date: '15 Сен, Воскресенье',
      time: '14:00',
      trainer: 'Алексей Смирнов',
      position: 1,
      totalQueue: 3,
      location: 'Функциональная зона',
      status: 'offered' as const, // Simulating "Spot Available"
      offerExpiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins from now
    }
  ]);

  // Timer Logic for Offered Spots
  const [timeLeft, setTimeLeft] = useState<string>('15:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const offeredItem = waitlist.find(i => i.status === 'offered');
      if (offeredItem && offeredItem.offerExpiresAt) {
        const diff = offeredItem.offerExpiresAt.getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeft('00:00');
          // Logic to handle expiration (e.g., auto-remove) would go here
        } else {
          const m = Math.floor(diff / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [waitlist]);

  const handleLeave = (id: number) => {
    if (confirm('Вы действительно хотите покинуть очередь?')) {
      setWaitlist(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleAccept = (id: number) => {
    // Navigate to confirmation
    onNavigate('booking_confirm');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Лист ожидания</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Info Banner */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <Hourglass className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-sm text-blue-800 leading-relaxed">
            Если место освободится, мы пришлем уведомление. У вас будет 15 минут на подтверждение.
          </p>
        </div>

        {/* Notification Toggle */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Уведомлять о местах</p>
              <p className="text-xs text-gray-500">Push-уведомления</p>
            </div>
          </div>
          <div
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`w-12 h-7 rounded-full flex items-center px-0.5 cursor-pointer transition-colors duration-300 ${notificationsEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </div>
        </div>

        {waitlist.length > 0 ? (
          waitlist.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl p-5 shadow-sm border relative overflow-hidden transition-all ${item.status === 'offered' ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-100'
              }`}>

              {/* Status Badge */}
              {item.status === 'joined' ? (
                <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1.5 rounded-bl-xl">
                  Очередь: #{item.position}
                </div>
              ) : (
                <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-bl-xl flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Осталось {timeLeft}
                </div>
              )}

              <div className="mb-4 pr-16">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.trainer}</p>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {item.date} • {item.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {item.location}
                </div>
              </div>

              {item.status === 'offered' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAccept(item.id)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200 active:scale-95 transition-transform flex items-center justify-center gap-2 animate-pulse"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Подтвердить
                  </button>
                  <button
                    onClick={() => handleLeave(item.id)}
                    className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleLeave(item.id)}
                  className="w-full py-2.5 border border-red-100 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Покинуть очередь
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p>Вы нигде не стоите в очереди</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistScreen;
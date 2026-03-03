import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  ClipboardList,
  Activity,
  AlertTriangle,
  FileText,
  History,
  Info,
  ChevronRight,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Plus,
  Save,
  Dumbbell
} from 'lucide-react';

interface TrainerClientProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// MOCK DATA TYPES
interface ClientProfile {
  id: number;
  name: string;
  age: number;
  avatar: string;
  phone: string;
  goal: string;
  tags: string[]; // 'Newbie', 'PT', 'Medical'
  membership: {
    status: 'active' | 'expired' | 'frozen' | 'none';
    planName: string;
    validTo: string;
  };
  purchases: {
    id: number;
    title: string;
    countLeft: number;
    countTotal: number;
    icon: 'pt' | 'massage' | 'group';
  }[];
  upcomingBookings: {
    id: number;
    title: string;
    date: string;
    time: string;
    trainer: string;
    type: string;
  }[];
  stats: {
    lastVisit: string;
    visitsLastMonth: number;
    totalVisits: number;
  };
}

const TrainerClientProfileScreen: React.FC<TrainerClientProfileScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'history'>('overview');
  const [noteInput, setNoteInput] = useState('');

  // Mock Data
  const client: ClientProfile = {
    id: 101,
    name: "Елена Смирнова",
    age: 28,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    phone: "+7 900 123-45-67",
    goal: "Снижение веса, тонус",
    tags: ['Новичок', 'ПТ', 'Сколиоз'],
    membership: {
      status: 'active',
      planName: 'Безлимит: Год',
      validTo: '12.12.2025'
    },
    purchases: [
      { id: 1, title: 'ПТ с Анной', countLeft: 8, countTotal: 10, icon: 'pt' },
      { id: 2, title: 'Массаж общий', countLeft: 5, countTotal: 5, icon: 'massage' }
    ],
    upcomingBookings: [
      { id: 10, title: 'Сила и выносливость', date: 'Сегодня', time: '19:00', trainer: 'Вы', type: 'group' },
      { id: 11, title: 'Йога Flow', date: '14 Сен', time: '10:00', trainer: 'Марина К.', type: 'group' }
    ],
    stats: {
      lastVisit: '10 Сентября',
      visitsLastMonth: 12,
      totalVisits: 45
    }
  };

  const [notes, setNotes] = useState([
    { id: 1, date: '10.09.2024', author: 'Вы', text: 'Техника приседаний улучшилась. Жалоб на спину нет.' },
    { id: 2, date: '05.09.2024', author: 'Анна М. (Врач)', text: 'Рекомендовано избегать осевых нагрузок >20кг.' }
  ]);

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const newNote = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      author: 'Вы',
      text: noteInput
    };
    setNotes([newNote, ...notes]);
    setNoteInput('');
  };

  const getMembershipColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'frozen': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* Membership Card */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide">Абонемент</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getMembershipColor(client.membership.status)}`}>
            {client.membership.status === 'active' ? 'Активен' : 'Истек'}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{client.membership.planName}</p>
            <p className="text-xs text-gray-500">До {client.membership.validTo}</p>
          </div>
        </div>
      </section>

      {/* Purchased Services */}
      <section>
        <h3 className="font-bold text-gray-900 mb-3 px-1">Пакеты услуг</h3>
        <div className="space-y-3">
          {client.purchases.length > 0 ? (
            client.purchases.map(pkg => (
              <div key={pkg.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    {pkg.icon === 'massage' ? <Activity className="w-5 h-5" /> : <Dumbbell className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{pkg.title}</h4>
                    <p className="text-xs text-gray-500">Покупка №{pkg.id * 123}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-gray-900">{pkg.countLeft} <span className="text-gray-400 font-normal">/ {pkg.countTotal}</span></span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-400 text-xs">
              Нет активных пакетов
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Bookings */}
      <section>
        <h3 className="font-bold text-gray-900 mb-3 px-1">Ближайшие записи</h3>
        <div className="space-y-3">
          {client.upcomingBookings.map(booking => (
            <button
              key={booking.id}
              onClick={() => onNavigate('booking_class_details')}
              className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-blue-600 font-bold uppercase">{booking.date}</span>
                  <span className="text-sm font-bold text-gray-900">{booking.time}</span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-gray-900 text-sm">{booking.title}</h4>
                  <p className="text-xs text-gray-500">{booking.trainer}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-around">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-gray-900">{client.stats.visitsLastMonth}</p>
          <p className="text-xs text-gray-500">За 30 дней</p>
        </div>
        <div className="w-px bg-gray-100 h-10"></div>
        <div className="text-center">
          <p className="text-2xl font-extrabold text-gray-900">{client.stats.totalVisits}</p>
          <p className="text-xs text-gray-500">Всего</p>
        </div>
      </div>

      <div className="space-y-2">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Посещение клуба</p>
                <p className="text-xs text-gray-500">10.09.2024 в 18:30</p>
              </div>
            </div>
            <span className="text-xs font-bold text-gray-400">Вход по карте</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
      <div className="bg-yellow-50 p-3 rounded-xl mb-4 text-xs text-yellow-800 border border-yellow-100 flex gap-2">
        <Info className="w-4 h-4 shrink-0" />
        Заметки видны только сотрудникам клуба.
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto mb-4">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-3 rounded-xl border border-gray-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-gray-500">{note.date} • {note.author}</span>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">{note.text}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-2 rounded-2xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all flex gap-2 items-end sticky bottom-0">
        <textarea
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Добавить заметку..."
          className="flex-1 p-2 text-sm outline-none resize-none max-h-24 bg-transparent"
          rows={1}
        />
        <button
          onClick={handleAddNote}
          disabled={!noteInput.trim()}
          className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-200"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header Profile */}
      <div className="bg-white pb-0 shadow-sm z-10 sticky top-0">
        <div className="p-4 pb-2">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => onNavigate('trainer_clients_list')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Профиль клиента</h1>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md shrink-0">
              <img src={client.avatar} alt={client.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">{client.name}</h2>
              <p className="text-xs text-gray-500 mb-2">{client.age} лет • {client.goal}</p>
              <div className="flex flex-wrap gap-1">
                {client.tags.map(tag => (
                  <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <button onClick={() => onNavigate('chat_room')} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:bg-blue-100 transition-colors">
              <MessageSquare className="w-4 h-4" /> Написать
            </button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold flex items-center justify-center gap-2 active:bg-gray-200 transition-colors">
              <Phone className="w-4 h-4" /> Позвонить
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
              }`}
          >
            Обзор
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
              }`}
          >
            История
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'notes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
              }`}
          >
            Заметки
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-20">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'notes' && renderNotes()}
      </div>
    </div>
  );
};

export default TrainerClientProfileScreen;
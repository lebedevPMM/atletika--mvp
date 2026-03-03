
import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Search,
  Phone,
  MessageSquare,
  Filter,
  AlertTriangle,
  MoreHorizontal,
  Plus,
  Users,
  UserCheck
} from 'lucide-react';

interface TrainerClientsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ClientStatus = 'active' | 'frozen' | 'expired' | 'attention';

interface Client {
  id: number;
  name: string;
  status: ClientStatus;
  plan: string;
  sessionsLeft: number;
  totalSessions: number;
  lastVisit: string;
  img: string;
  isMyClient: boolean;
  phone: string;
}

const TrainerClientsScreen: React.FC<TrainerClientsScreenProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'my'>('my');

  const clients: Client[] = [
    {
      id: 1,
      name: 'Алексей Смирнов',
      status: 'attention',
      plan: 'Набор массы',
      sessionsLeft: 2,
      totalSessions: 10,
      lastVisit: '14 дней назад',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      isMyClient: true,
      phone: '+79001112233'
    },
    {
      id: 2,
      name: 'Мария Иванова',
      status: 'active',
      plan: 'Снижение веса',
      sessionsLeft: 8,
      totalSessions: 10,
      lastVisit: 'Вчера',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      isMyClient: true,
      phone: '+79004445566'
    },
    {
      id: 3,
      name: 'Иван Кузнецов',
      status: 'active',
      plan: 'Реабилитация',
      sessionsLeft: 5,
      totalSessions: 12,
      lastVisit: '2 дня назад',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
      isMyClient: true,
      phone: '+79007778899'
    },
    {
      id: 4,
      name: 'Дмитрий Петров',
      status: 'frozen',
      plan: '-',
      sessionsLeft: 0,
      totalSessions: 0,
      lastVisit: '1 месяц назад',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      isMyClient: false,
      phone: '+79000000000'
    },
    {
      id: 5,
      name: 'Ольга Соколова',
      status: 'expired',
      plan: 'Безлимит год',
      sessionsLeft: 0,
      totalSessions: 0,
      lastVisit: '3 дня назад',
      img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
      isMyClient: false,
      phone: '+79001231231'
    }
  ];

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);
    const matchesFilter = filter === 'all' || (filter === 'my' && c.isMyClient);
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case 'active':
        return <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">Активен</span>;
      case 'frozen':
        return <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Заморозка</span>;
      case 'expired':
        return <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">Истек</span>;
      case 'attention':
        return <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Риск</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 pb-2 shadow-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('trainer_home')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Клиенты</h1>
          </div>
          <button className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <Plus className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-3">
          {/* Filter Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setFilter('my')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'my'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <UserCheck className="w-4 h-4" /> Мои клиенты
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Users className="w-4 h-4" /> Все в клубе
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по имени или телефону..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            onClick={() => onNavigate('trainer_client_profile')}
            className={`bg-white p-4 rounded-2xl shadow-sm border relative overflow-hidden active:scale-[0.99] transition-transform ${client.status === 'attention' ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'}`}
          >
            {client.status === 'frozen' && (
              <div className="absolute inset-0 bg-gray-50/50 z-10 pointer-events-none"></div>
            )}

            <div className="flex items-start gap-4 relative z-0">
              {/* Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
                  <img src={client.img} alt={client.name} className="w-full h-full object-cover" />
                </div>
                {client.isMyClient && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 shadow-sm border-2 border-white">
                    <UserCheck className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-base truncate pr-2">{client.name}</h3>
                  {getStatusBadge(client.status)}
                </div>

                <p className="text-xs text-gray-500 mb-2">{client.plan}</p>

                {/* Sessions Bar */}
                {client.totalSessions > 0 ? (
                  <div className="mb-1">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className={client.sessionsLeft < 3 ? 'text-red-500' : 'text-blue-600'}>
                        Осталось: {client.sessionsLeft}
                      </span>
                      <span className="text-gray-400">из {client.totalSessions}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${client.sessionsLeft < 3 ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${(client.sessionsLeft / client.totalSessions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-400 mt-2">Нет активных пакетов</div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center relative z-0">
              <span className={`text-[10px] font-medium ${client.status === 'attention' ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>Был(а): {client.lastVisit}</span>
              <div className="flex gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onNavigate('chat_room'); }}
                  className="p-2 text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-2 text-green-600 bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Никого не нашли</h3>
            <p className="text-sm text-gray-500">Попробуйте изменить параметры поиска или фильтры</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 font-bold text-sm"
              >
                Сбросить поиск
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerClientsScreen;

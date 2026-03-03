import React, { useState } from 'react';
import { ScreenName } from '../types';
import { MapPin, ArrowRight, Building2, CheckCircle2, Clock, LogOut, Search, Lock } from 'lucide-react';

interface TrainerSelectClubScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

interface Club {
  id: number;
  name: string;
  code: string;
  role: string;
  address: string;
  status: 'active' | 'inactive';
  distance?: string;
}

const TrainerSelectClubScreen: React.FC<TrainerSelectClubScreenProps> = ({ onNavigate }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOffline, setIsOffline] = useState(false); // Mock offline state

  const clubs: Club[] = [
    {
      id: 1,
      name: 'Atletika+ Moscow City',
      code: 'MSC-01',
      role: 'Топ-тренер',
      address: 'Пресненская наб., 12',
      status: 'active',
      distance: '1.2 км'
    },
    {
      id: 2,
      name: 'Atletika+ Tverskaya',
      code: 'TVR-05',
      role: 'Инструктор',
      address: 'Тверская ул., 22',
      status: 'active',
      distance: '3.5 км'
    },
    {
      id: 3,
      name: 'Atletika+ Khamovniki',
      code: 'KHM-03',
      role: 'Тренер',
      address: 'Усачева ул., 11',
      status: 'inactive'
    },
  ];

  const filteredClubs = clubs.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (club: Club) => {
    if (club.status === 'inactive') return;

    setSelectedId(club.id);
    // Simulate shift start delay
    setTimeout(() => {
      onNavigate('trainer_home');
    }, 800);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col p-6 text-white safe-area-top safe-area-bottom">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Начало смены</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" /> 08:55
            {isOffline && <span className="text-red-400 font-bold ml-2">• Offline</span>}
          </p>
        </div>
        <button onClick={() => onNavigate('trainer_login')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700">
          <LogOut className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Поиск клуба..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 px-2 pb-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Доступные локации</p>

        <div className="space-y-4">
          {filteredClubs.map((club) => {
            const isActive = club.status === 'active';
            const isSelected = selectedId === club.id;

            return (
              <button
                key={club.id}
                onClick={() => handleSelect(club)}
                disabled={!isActive}
                className={`w-full text-left p-5 rounded-2xl border transition-all relative overflow-hidden group ${isActive ? 'active:scale-[0.98]' : 'opacity-60 cursor-not-allowed grayscale-[0.5]'
                  } ${isSelected
                    ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/50'
                    : 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                  }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-gray-700'}`}>
                    {isActive ? <Building2 className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-gray-400" />}
                  </div>
                  {isSelected && <CheckCircle2 className="w-6 h-6 text-white animate-in zoom-in" />}
                  {!isActive && <span className="text-[10px] font-bold bg-gray-700 px-2 py-1 rounded text-gray-400">Закрыт</span>}
                </div>

                <h3 className="font-bold text-lg mb-1">{club.name}</h3>
                <p className={`text-sm mb-4 ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{club.address}</p>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-1 rounded ${isSelected ? 'bg-black/20' : 'bg-black/40'}`}>
                    {club.code}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                    {club.role}
                  </span>
                  {club.distance && (
                    <span className={`flex items-center gap-1 text-[10px] ml-auto ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                      <MapPin className="w-3 h-3" /> {club.distance}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            Клубы не найдены
          </div>
        )}
      </div>

      <div className="text-center mt-4">
        <p className="text-[10px] text-gray-600">
          При выборе клуба активируется геолокация для подтверждения присутствия.
        </p>
      </div>
    </div>
  );
};

export default TrainerSelectClubScreen;
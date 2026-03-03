
import React, { useState, useMemo } from 'react';
import { ScreenName } from '../types';
import {
  MapPin,
  Search,
  Check,
  ChevronRight,
  Building2,
  ArrowRight,
  AlertCircle,
  Lock,
  Snowflake,
  Clock,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface ClubSelectScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// --- TYPES FROM SPEC ---
type AccessStatus = 'active' | 'frozen' | 'expired' | 'blocked';

interface Branch {
  id: number;
  name: string;
  address: string;
  distance: string;
  hours: string;
}

interface Club {
  id: number;
  name: string;
  logoUrl?: string;
  image: string;
  status: AccessStatus;
  isDefault: boolean;
  branches: Branch[];
}

const ClubSelectScreen: React.FC<ClubSelectScreenProps> = ({ onNavigate }) => {
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- MOCK DATA ---
  const clubs: Club[] = [
    {
      id: 1,
      name: 'Atletika+ Premium',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
      status: 'active',
      isDefault: true,
      branches: [
        { id: 101, name: 'Moscow City', address: 'Пресненская наб., 12', distance: '0.8 км', hours: 'Пн-Вс: 00-24' },
        { id: 102, name: 'Тверская', address: 'Тверская ул., 22', distance: '4.2 км', hours: 'Пн-Пт: 07-24' }
      ]
    },
    {
      id: 2,
      name: 'Atletika+ Khamovniki',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1000&auto=format&fit=crop',
      status: 'frozen',
      isDefault: false,
      branches: [
        { id: 201, name: 'Хамовники', address: 'Усачева ул., 11', distance: '6.5 км', hours: 'Пн-Пт: 08-23' }
      ]
    },
    {
      id: 3,
      name: 'Atletika+ Gym',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop',
      status: 'expired',
      isDefault: false,
      branches: [
        { id: 301, name: 'Сокол', address: 'Ленинградский пр., 80', distance: '10.2 км', hours: 'Пн-Вс: 09-22' }
      ]
    }
  ];

  const filteredClubs = useMemo(() => {
    return clubs.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.branches.some(b => b.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  const handleClubClick = (club: Club) => {
    if (club.status === 'expired' || club.status === 'blocked') {
      setSelectedClubId(club.id);
      setSelectedBranchId(null);
      return;
    }

    if (selectedClubId === club.id) {
      setSelectedClubId(null);
      setSelectedBranchId(null);
    } else {
      setSelectedClubId(club.id);
      if (club.branches.length === 1) {
        setSelectedBranchId(club.branches[0].id);
      } else {
        setSelectedBranchId(null);
      }
    }
  };

  const handleBranchClick = (e: React.MouseEvent, branchId: number) => {
    e.stopPropagation();
    setSelectedBranchId(branchId);
  };

  const handleContinue = () => {
    if (!selectedBranchId) return;

    const selectedClub = clubs.find(c => c.id === selectedClubId);
    if (selectedClub?.status === 'expired') {
      onNavigate('support');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('home');
    }, 300);
  };

  const getStatusBadge = (status: AccessStatus) => {
    switch (status) {
      case 'active':
        return <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border border-green-200 dark:border-green-500/20">Активен</span>;
      case 'frozen':
        return <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase flex items-center gap-1 border border-blue-200 dark:border-blue-500/20"><Snowflake className="w-3 h-3" /> Заморожен</span>;
      case 'expired':
        return <span className="bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase flex items-center gap-1 border border-red-200 dark:border-red-500/20"><Lock className="w-3 h-3" /> Истек</span>;
      default:
        return null;
    }
  };

  const NoAccessPlaceholder = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-red-500/20 shadow-sm animate-in fade-in transition-colors">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-200 dark:border-red-500/20">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Нет доступа к клубу</h3>
      <p className="text-sm text-gray-500 dark:text-zinc-500 mb-6 leading-relaxed">
        Срок вашего абонемента истек или доступ был отозван. Свяжитесь с администрацией для продления.
      </p>
      <button
        onClick={() => onNavigate('support')}
        className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:bg-cyan-500"
      >
        Связаться с поддержкой
      </button>
    </div>
  );

  const selectedClub = clubs.find(c => c.id === selectedClubId);
  const isNoAccess = selectedClub?.status === 'expired' || selectedClub?.status === 'blocked';

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col relative font-sans transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 pb-2 shadow-sm sticky top-0 z-20 safe-area-top border-b border-gray-100 dark:border-zinc-800 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter italic uppercase">Выбор клуба</h1>
          <button className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-400 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Local Search */}
        <div className="relative mb-2">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Поиск по названию или городу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 dark:bg-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 border border-transparent focus:bg-white dark:focus:bg-zinc-900"
          />
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto pb-32">
        {filteredClubs.length > 0 ? filteredClubs.map((club) => {
          const isSelected = selectedClubId === club.id;
          const isStatusRestricted = club.status === 'expired' || club.status === 'blocked';

          return (
            <div
              key={club.id}
              onClick={() => handleClubClick(club)}
              className={`bg-white dark:bg-zinc-900 rounded-2xl shadow-sm dark:shadow-lg border transition-all duration-300 overflow-hidden ${isSelected && !isStatusRestricted
                ? 'border-cyan-500 ring-1 ring-cyan-500/50'
                : 'border-gray-200 dark:border-zinc-800'
                } ${isStatusRestricted && isSelected ? 'border-red-500/50' : ''} ${isStatusRestricted && !isSelected ? 'grayscale opacity-60' : 'cursor-pointer active:scale-[0.99] hover:border-gray-300 dark:hover:border-zinc-700'}`}
            >
              {/* Club Basic Card */}
              <div className="flex gap-4 p-3 relative">
                <div className="w-20 h-20 bg-gray-200 dark:bg-zinc-800 rounded-xl shrink-0 overflow-hidden relative border border-gray-100 dark:border-zinc-700">
                  <img src={club.image} alt={club.name} className="w-full h-full object-cover opacity-90 dark:opacity-80" />
                  {isSelected && !isStatusRestricted && (
                    <div className="absolute inset-0 bg-cyan-600/20 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-cyan-600 rounded-full p-1 shadow-md">
                        <Check className="w-4 h-4 text-white" strokeWidth={4} />
                      </div>
                    </div>
                  )}
                  {isStatusRestricted && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 py-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-[15px]">{club.name}</h3>
                      {getStatusBadge(club.status)}
                    </div>

                    {/* Sub-info line */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-zinc-500 font-medium">
                      {club.branches.length === 1 ? (
                        <>
                          <MapPin className="w-3 h-3 text-gray-400 dark:text-zinc-600" />
                          <span className="truncate">{club.branches[0].address}</span>
                        </>
                      ) : (
                        <>
                          <Building2 className="w-3 h-3 text-cyan-500" />
                          <span className="text-cyan-600 dark:text-cyan-500">{club.branches.length} филиалов</span>
                        </>
                      )}
                    </div>
                  </div>

                  {club.isDefault && !isSelected && (
                    <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-widest mt-1">Последний выбор</span>
                  )}
                </div>
              </div>

              {/* Branch Selection List */}
              {isSelected && club.branches.length > 1 && !isStatusRestricted && (
                <div className="border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/30 animate-in slide-in-from-top-2 duration-300">
                  <div className="px-4 py-2 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-400 dark:text-zinc-600 uppercase tracking-widest">Выберите филиал</p>
                  </div>
                  {club.branches.map(branch => (
                    <div
                      key={branch.id}
                      onClick={(e) => handleBranchClick(e, branch.id)}
                      className={`px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800 cursor-pointer transition-colors ${selectedBranchId === branch.id ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-bold ${selectedBranchId === branch.id ? 'text-cyan-700 dark:text-cyan-500' : 'text-gray-900 dark:text-white'}`}>{branch.name}</p>
                          {selectedBranchId === branch.id && <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-500" strokeWidth={3} />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">{branch.address}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {branch.hours}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {branch.distance}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-colors ${selectedBranchId === branch.id ? 'text-cyan-500' : 'text-gray-300 dark:text-zinc-700'}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* No Access Case */}
              {isSelected && isStatusRestricted && (
                <div className="p-4 border-t border-red-100 dark:border-red-500/20 bg-red-50/50 dark:bg-red-950/10 animate-in slide-in-from-top-2">
                  <NoAccessPlaceholder />
                </div>
              )}
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 dark:text-zinc-600">
            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-zinc-800">
              <Search className="w-8 h-8 opacity-30" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-zinc-400 mb-1">Ничего не найдено</h3>
            <p className="text-sm px-10">Попробуйте изменить запрос.</p>
            <button onClick={() => setSearchTerm('')} className="mt-4 text-cyan-600 dark:text-cyan-500 font-bold text-sm hover:underline">Сбросить поиск</button>
          </div>
        )}
      </div>

      {/* Sticky Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 p-4 pb-8 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-colors">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedBranchId || isNoAccess || isLoading}
            className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${!selectedBranchId || isNoAccess
              ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-not-allowed shadow-none'
              : 'bg-cyan-600 text-white shadow-cyan-500/20 hover:bg-cyan-500'
              }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Загрузка...
              </span>
            ) : (
              <>
                <span>Продолжить</span>
                <ArrowRight className="w-5 h-5 opacity-60" />
              </>
            )}
          </button>

          {!selectedClubId && (
            <p className="text-[10px] text-gray-400 dark:text-zinc-600 text-center mt-3 font-medium uppercase tracking-widest animate-pulse">
              Выберите клуб для входа
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubSelectScreen;

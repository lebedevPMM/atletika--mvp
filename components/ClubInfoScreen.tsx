
import React, { useState, useMemo } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  ChevronRight,
  Star,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
  Gift,
  Share2,
  Mail,
  AlertCircle,
  Copy,
  Car,
  Search,
  Building2,
  Award,
  X
} from 'lucide-react';

interface ClubInfoScreenProps {
  onNavigate: (screen: ScreenName) => void;
  initialTab?: 'info' | 'contacts' | 'team';
}

const ClubInfoScreen: React.FC<ClubInfoScreenProps> = ({ onNavigate, initialTab = 'info' }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'contacts' | 'team'>(initialTab);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showHours, setShowHours] = useState(false);

  // Branch Selection State
  const [selectedBranchId, setSelectedBranchId] = useState(1);
  const [showBranchSelect, setShowBranchSelect] = useState(false);

  // Team State
  const [teamSearch, setTeamSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState<'all' | 'gym' | 'group' | 'spa'>('all');

  // --- MOCK DATA ---
  const branches = [
    { id: 1, name: 'Moscow City', address: 'Пресненская наб., 12', phone: '+7 (495) 123-45-67', status: 'open' },
    { id: 2, name: 'Tverskaya', address: 'Тверская ул., 22', phone: '+7 (495) 987-65-43', status: 'open' },
  ];

  const currentBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const club = {
    name: `Atletika+ ${currentBranch.name}`,
    address: currentBranch.address,
    rating: 4.9,
    isOpen: true,
    statusText: 'Открыто до 24:00',
    phone: currentBranch.phone,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop',
    schedule: [
      { day: 'Будни', hours: '07:00 - 24:00' },
      { day: 'Выходные', hours: '09:00 - 22:00' },
    ],
    contacts: [
      { id: 1, type: 'phone', label: 'Ресепшн', value: currentBranch.phone, action: 'call', icon: Phone, color: 'bg-green-100 text-green-600' },
      { id: 2, type: 'phone', label: 'Отдел продаж', value: '+7 (495) 123-45-00', action: 'call', icon: Users, color: 'bg-blue-100 text-blue-600' },
      { id: 3, type: 'whatsapp', label: 'WhatsApp', value: 'Написать', action: 'link', icon: MessageSquare, color: 'bg-green-50 text-green-700' },
      { id: 4, type: 'telegram', label: 'Telegram Bot', value: '@atletika_bot', action: 'link', icon: Navigation, color: 'bg-blue-50 text-blue-500' },
      { id: 5, type: 'email', label: 'Email', value: 'info@atletika.plus', action: 'email', icon: Mail, color: 'bg-gray-100 text-gray-500' },
    ],
    directions: 'Вход в башню «Запад», стойка ресепшн на 1 этаже. Для прохода потребуется паспорт.',
    parking: 'Городская парковка №3803 (380₽/час). Бесплатно по воскресеньям. Подземный паркинг — по запросу у менеджера.',
    socials: [
      { id: 'site', label: 'Website', icon: '🌐', link: '#' },
      { id: 'vk', label: 'VK', icon: 'VK', link: '#' },
      { id: 'tg', label: 'Telegram', icon: 'TG', link: '#' },
    ]
  };

  const team = [
    { id: 1, name: 'Алексей Смирнов', role: 'Мастер-тренер', type: 'gym', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix', rating: 4.9, exp: 8, tags: ['Силовые', 'Реабилитация', 'Осанка'], branchIds: [1, 2] },
    { id: 2, name: 'Мария Иванова', role: 'Инструктор ГП', type: 'group', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka', rating: 5.0, exp: 5, tags: ['Йога', 'Stretching', 'Mind Body'], branchIds: [1] },
    { id: 3, name: 'Дмитрий Петров', role: 'Тренер по боксу', type: 'gym', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', rating: 4.8, exp: 12, tags: ['Бокс', 'Кардио', 'Функционал'], branchIds: [1, 2] },
    { id: 4, name: 'Елена Соколова', role: 'Мастер СПА', type: 'spa', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', rating: 5.0, exp: 4, tags: ['Массаж', 'SPA', 'Релакс'], branchIds: [2] },
    { id: 5, name: 'Игорь Волков', role: 'Тренер ТЗ', type: 'gym', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan', rating: 4.7, exp: 6, tags: ['Бодибилдинг', 'Силовые'], branchIds: [1] },
    { id: 6, name: 'Ольга Сидорова', role: 'Пилатес', type: 'group', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga', rating: 4.9, exp: 7, tags: ['Пилатес', 'Осанка', 'Здоровая спина'], branchIds: [1, 2] },
  ];

  const filteredTeam = useMemo(() => {
    return team.filter(person => {
      // Branch filter
      if (!person.branchIds.includes(selectedBranchId)) return false;

      // Text search (Name or Tags)
      const term = teamSearch.toLowerCase();
      const matchesSearch = person.name.toLowerCase().includes(term) ||
        person.tags.some(tag => tag.toLowerCase().includes(term));

      // Category filter
      const matchesCategory = teamFilter === 'all' || person.type === teamFilter;

      return matchesSearch && matchesCategory;
    });
  }, [teamSearch, teamFilter, selectedBranchId]);

  const faq = [
    { id: 1, q: 'Как заморозить карту?', a: 'В разделе "Профиль" -> "Мой тариф" или позвонив на ресепшн.' },
    { id: 2, q: 'Правила отмены записи', a: 'Отмена без штрафа возможна за 3 часа до начала занятия.' },
    { id: 3, q: 'Что взять с собой?', a: 'Форму, кроссовки. Полотенце и воду мы предоставляем.' },
    { id: 4, q: 'Гостевой визит', a: 'Доступен 1 раз в месяц для держателей карт Gold и Platinum.' },
  ];

  const docs = [
    { id: 1, title: 'Правила клуба', type: 'PDF' },
    { id: 2, title: 'Договор оферты', type: 'PDF' },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleBack = () => {
    if (activeTab !== 'info') {
      setActiveTab('info');
    } else {
      onNavigate('BACK');
    }
  };

  // --- RENDER: CONTACTS TAB ---
  if (activeTab === 'contacts') {
    return (
      <div className="bg-zinc-950 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-zinc-900/80 backdrop-blur-md p-4 shadow-lg border-b border-zinc-800 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
                <ArrowLeft className="w-6 h-6 text-zinc-300" />
              </button>
              <div>
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter cursor-pointer">Contacts</h1>
                {branches.length > 1 && (
                  <button
                    onClick={() => setShowBranchSelect(!showBranchSelect)}
                    className="flex items-center gap-1 text-xs text-cyan-400 font-bold mt-0.5"
                  >
                    {currentBranch.name} <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <button className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Branch Selector Dropdown */}
        {showBranchSelect && (
          <div className="absolute top-[70px] left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-30 shadow-2xl animate-in slide-in-from-top-2">
            {branches.map(branch => (
              <button
                key={branch.id}
                onClick={() => { setSelectedBranchId(branch.id); setShowBranchSelect(false); }}
                className={`w-full text-left p-4 flex items-center justify-between ${branch.id === selectedBranchId ? 'bg-cyan-950/30 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
              >
                <span className="font-medium text-sm">{branch.name}</span>
                {branch.id === selectedBranchId && <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto pb-24">
          {/* Map Preview */}
          <div className="h-60 relative w-full bg-zinc-900 border-b border-zinc-800">
            <img src={club.mapImage} className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" alt="Map" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(6,182,212,0.6)]"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
              <button className="w-full bg-white text-black py-3 rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-zinc-200">
                <Navigation className="w-4 h-4 text-black" />
                Open Maps (Yandex/Google)
              </button>
            </div>
          </div>

          <div className="px-4 -mt-6 relative z-10 space-y-4">
            <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg border border-zinc-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-white leading-tight mb-1 italic uppercase">{club.name}</h2>
                  <p className="text-xs text-zinc-500 font-medium">Premium Fitness Club</p>
                </div>
                <div className="bg-zinc-800 p-2 rounded-full border border-zinc-700">
                  <Building2 className="w-5 h-5 text-zinc-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300 font-medium leading-snug">{club.address}</p>
                    <button
                      onClick={() => alert('Address copied')}
                      className="text-xs text-cyan-500 font-bold mt-1 flex items-center gap-1 active:opacity-60 hover:text-cyan-400 transition-colors"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>

                <div className="h-px bg-zinc-800"></div>

                <div className="space-y-2">
                  <div
                    onClick={() => setShowHours(!showHours)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-zinc-500 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-green-400 tracking-wide">{club.statusText}</p>
                      </div>
                    </div>
                    {showHours ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                  </div>

                  {showHours && (
                    <div className="pl-8 text-sm text-zinc-400 space-y-1 animate-in slide-in-from-top-1 bg-zinc-950/50 p-3 rounded-lg mt-2 border border-zinc-800">
                      {club.schedule.map((sch, i) => (
                        <div key={i} className="flex justify-between">
                          <span className="font-medium text-zinc-500">{sch.day}</span>
                          <span className="font-bold text-zinc-200">{sch.hours}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-zinc-600 uppercase tracking-wide ml-2">Contact Us</h3>
            <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-sm border border-zinc-800">
              {club.contacts.map((contact, idx) => (
                <button
                  key={contact.id}
                  className={`w-full flex items-center justify-between p-4 active:bg-zinc-800 transition-colors ${idx !== club.contacts.length - 1 ? 'border-b border-zinc-800' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 ${contact.type === 'whatsapp' ? 'bg-green-500/10 text-green-500' : contact.type === 'telegram' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-400'}`}>
                      <contact.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{contact.label}</p>
                      <p className="text-xs text-zinc-500">{contact.value}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-500" />
                </button>
              ))}
            </div>

            <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                  <Navigation className="w-4 h-4" /> Directions
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{club.directions}</p>
              </div>
              <div className="h-px bg-zinc-800"></div>
              <div>
                <h3 className="text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center gap-2">
                  <Car className="w-4 h-4" /> Parking
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{club.parking}</p>
              </div>
            </div>

            <div className="py-6 text-center space-y-6">
              <div className="flex justify-center gap-3">
                {club.socials.map(soc => (
                  <button key={soc.id} className="flex flex-col items-center gap-1 group w-16">
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 flex items-center justify-center group-active:scale-95 transition-transform group-hover:border-cyan-500/50 group-hover:bg-zinc-800">
                      <span className="font-bold text-white text-sm">{typeof soc.icon === 'string' ? soc.icon : ''}</span>
                    </div>
                    <span className="text-[10px] text-zinc-600 font-medium group-hover:text-zinc-400 transition-colors">{soc.label}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-600 leading-relaxed">
                <p className="font-bold text-zinc-500">LLC «Atletika Plus»</p>
                <p>INN 7700000000 • OGRN 1027700000000</p>
                <button className="text-zinc-500 font-medium underline mt-2 hover:text-zinc-300 transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: TEAM TAB (UPDATED PER SPEC) ---
  if (activeTab === 'team') {
    return (
      <div className="bg-zinc-950 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-zinc-900/80 backdrop-blur-md px-4 pt-4 pb-2 shadow-lg border-b border-zinc-800 sticky top-0 z-20">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-6 h-6 text-zinc-300" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Team</h1>
                {branches.length > 1 && (
                  <button
                    onClick={() => setShowBranchSelect(!showBranchSelect)}
                    className="flex items-center gap-1 text-xs text-cyan-400 font-bold bg-cyan-950/30 border border-cyan-900/50 px-2 py-1 rounded-lg hover:bg-cyan-900/50 transition-colors"
                  >
                    {currentBranch.name} <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-500">{filteredTeam.length} specialists</p>
            </div>
          </div>

          {/* Branch Selector Dropdown (Team Tab) */}
          {showBranchSelect && (
            <div className="absolute top-[60px] left-0 right-0 bg-zinc-900 border-b border-zinc-800 z-30 shadow-2xl animate-in slide-in-from-top-2 p-1">
              {branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => { setSelectedBranchId(branch.id); setShowBranchSelect(false); }}
                  className={`w-full text-left p-3 flex items-center justify-between rounded-lg ${branch.id === selectedBranchId ? 'bg-cyan-950/30 text-cyan-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
                >
                  <span className="font-medium text-sm">{branch.name}</span>
                  {branch.id === selectedBranchId && <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_5px_rgba(6,182,212,0.8)]"></div>}
                </button>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name or tags..."
              value={teamSearch}
              onChange={(e) => setTeamSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-10 text-sm focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all font-medium placeholder:text-zinc-600 text-white"
            />
            {teamSearch && (
              <button
                onClick={() => setTeamSearch('')}
                className="absolute right-3 top-3 p-0.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Segmented Picker */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'gym', label: 'Gym' },
              { id: 'group', label: 'Group' },
              { id: 'spa', label: 'SPA' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTeamFilter(filter.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${teamFilter === filter.id
                  ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-3 pb-24 bg-zinc-950">
          {filteredTeam.length > 0 ? (
            filteredTeam.map((person) => (
              <div
                key={person.id}
                onClick={() => onNavigate('trainer_about')}
                className="bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-800 flex items-start gap-4 active:scale-[0.99] transition-transform hover:bg-zinc-800 cursor-pointer group"
              >
                {/* Avatar Area */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-800 overflow-hidden border border-zinc-700 group-hover:border-zinc-600 transition-colors">
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  {person.rating > 0 && (
                    <div className="absolute -bottom-2 -right-2 bg-zinc-900 px-2 py-1 rounded-lg shadow-lg border border-zinc-800 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-[10px] font-black text-white">{person.rating}</span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-black text-white text-base mb-0.5 truncate group-hover:text-cyan-400 transition-colors">{person.name}</h3>
                  <p className="text-[11px] text-cyan-600 font-bold uppercase tracking-wide mb-2">{person.role}</p>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                      <Award className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Exp {person.exp} {person.exp % 10 === 1 && person.exp !== 11 ? 'yr' : 'yrs'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {person.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-bold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md uppercase border border-zinc-800 truncate max-w-[100px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="self-center p-2 text-zinc-600">
                  <ChevronRight className="w-5 h-5 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
              <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                <Users className="w-10 h-10 opacity-20" />
              </div>
              <h3 className="text-lg font-bold text-white">No one found</h3>
              <p className="text-sm max-w-[200px] mt-1 text-zinc-500">Try changing filters or search terms.</p>
              <button
                onClick={() => { setTeamSearch(''); setTeamFilter('all'); }}
                className="mt-6 text-cyan-500 font-bold text-sm hover:text-cyan-400"
              >
                Reset all
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: INFO TAB (Dashboard) ---
  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col pb-10">
      {/* Cover Image & Nav */}
      <div className="relative h-72 shrink-0">
        <img src={club.image} className="w-full h-full object-cover grayscale transition-all duration-1000 hover:grayscale-0" alt="Club" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/40"></div>

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 safe-area-top">
          <button onClick={() => onNavigate('BACK')} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${club.isOpen ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}>
              {club.isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="text-xs font-medium flex items-center gap-1 opacity-90 text-zinc-300">
              <Clock className="w-3 h-3" /> {club.schedule[0].hours}
            </span>
          </div>
          <h1 className="text-2xl font-black italic uppercase leading-tight mb-1">{club.name}</h1>
          <button
            onClick={() => setActiveTab('contacts')}
            className="text-sm opacity-80 flex items-center gap-1 hover:text-cyan-400 transition-colors text-left font-medium"
          >
            <MapPin className="w-3.5 h-3.5" /> {club.address} <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-20 space-y-6">

        {/* Quick Actions Card */}
        <div className="bg-zinc-900 rounded-2xl p-4 shadow-lg border border-zinc-800 flex justify-between items-center">
          <button onClick={() => setActiveTab('contacts')} className="flex flex-col items-center gap-1 flex-1 active:scale-95 transition-transform group">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors border border-blue-500/20">
              <Navigation className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white">Route</span>
          </button>
          <div className="w-px h-8 bg-zinc-800"></div>
          <button onClick={() => setActiveTab('contacts')} className="flex flex-col items-center gap-1 flex-1 active:scale-95 transition-transform group">
            <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center group-hover:bg-green-500/20 transition-colors border border-green-500/20">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white">Call</span>
          </button>
          <div className="w-px h-8 bg-zinc-800"></div>
          <button
            onClick={() => onNavigate('chat_list')}
            className="flex flex-col items-center gap-1 flex-1 active:scale-95 transition-transform group"
          >
            <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white">Chat</span>
          </button>
        </div>

        {/* Team Section Preview */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-bold text-white text-base uppercase tracking-wider text-xs opacity-80">Our Team</h2>
            <button
              onClick={() => setActiveTab('team')}
              className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              All ({team.length + 12}) <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {team.slice(0, 4).map(t => (
              <div
                key={t.id}
                onClick={() => onNavigate('trainer_about')}
                className="w-24 shrink-0 flex flex-col items-center text-center cursor-pointer active:opacity-70 group"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden mb-2 border-2 border-zinc-700 shadow-sm group-hover:border-cyan-500/50 transition-colors">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>
                <p className="text-xs font-bold text-zinc-300 leading-tight group-hover:text-white transition-colors">{t.name}</p>
                <p className="text-[10px] text-zinc-500 truncate w-full">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Loyalty Banner */}
        <div
          onClick={() => onNavigate('loyalty')}
          className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-black rounded-2xl p-5 text-white shadow-xl border border-zinc-800 relative overflow-hidden active:scale-[0.99] transition-transform group cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full -mr-10 -mt-10 blur-xl group-hover:bg-yellow-600/20 transition-colors"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Loyalty Program</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tighter">1 250</span>
                <span className="text-sm font-medium text-zinc-500">pts</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="h-1.5 w-24 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                  <div className="h-full bg-yellow-600 w-[65%] shadow-[0_0_8px_rgba(202,138,4,0.5)]"></div>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Gold</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <Gift className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* FAQ & Rules */}
        <section>
          <h2 className="font-bold text-white text-base mb-3 px-1 uppercase tracking-wider text-xs opacity-80">FAQ & Rules</h2>
          <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
            {faq.map((item) => (
              <div key={item.id} className="border-b border-zinc-800 last:border-0">
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-200 pr-4">{item.q}</span>
                  {expandedFaq === item.id ? <ChevronUp className="w-4 h-4 text-zinc-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />}
                </button>
                {expandedFaq === item.id && (
                  <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed bg-zinc-950/30">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            {docs.map(doc => (
              <button
                key={doc.id}
                onClick={() => onNavigate('document_view')}
                className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 shadow-sm flex items-center gap-2 text-left hover:border-zinc-700 transition-colors active:scale-95 group"
              >
                <FileText className="w-4 h-4 text-zinc-500 shrink-0 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold text-zinc-300 truncate group-hover:text-white transition-colors">{doc.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Extra Feedback Link */}
        <button
          onClick={() => onNavigate('complaint')}
          className="w-full py-4 text-xs font-bold text-zinc-600 hover:text-zinc-400 flex items-center justify-center gap-2 transition-colors uppercase tracking-wide"
        >
          <AlertCircle className="w-3 h-3" /> Report a problem
        </button>

      </div>
    </div>
  );
};

export default ClubInfoScreen;

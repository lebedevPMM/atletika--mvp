import React, { useState } from 'react';
import { ScreenName } from '../types';
import type { CardId, ClientCard, HealthProfile } from '../types/client-card';
import {
  useClientCard,
  useClientPurchases,
  useClientBookings,
  useClientVisits,
  useClientNotes,
} from '../hooks/useClientCard';
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  ClipboardList,
  Activity,
  AlertTriangle,
  FileText,
  History,
  Heart,
  Info,
  ChevronRight,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  Plus,
  Save,
  Dumbbell,
} from 'lucide-react';

interface TrainerClientProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const DEMO_CARD_ID = 'card-001' as CardId;

const getAge = (dob: string | null): number | null => {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob).getTime()) / 31557600000);
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-400 text-xs">
    {message}
  </div>
);

const TrainerClientProfileScreen: React.FC<TrainerClientProfileScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'history' | 'notes'>('overview');
  const [noteInput, setNoteInput] = useState('');

  const { card, loading: cardLoading } = useClientCard(DEMO_CARD_ID);
  const { purchases, loading: purchasesLoading } = useClientPurchases(DEMO_CARD_ID, activeTab === 'overview');
  const { bookings, loading: bookingsLoading } = useClientBookings(DEMO_CARD_ID, activeTab === 'overview');
  const { visits, loading: visitsLoading } = useClientVisits(DEMO_CARD_ID, activeTab === 'history');
  const { notes, loading: notesLoading, addNote } = useClientNotes(DEMO_CARD_ID, undefined, activeTab === 'notes');

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    addNote(noteInput, 'trainer-1', 'trainer', 'Вы');
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

  const getMembershipLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активен';
      case 'frozen': return 'Заморожен';
      case 'expired': return 'Истек';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  // Loading state
  if (cardLoading || !card) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const age = getAge(card.personalInfo.dateOfBirth);

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      {/* Membership Card */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide">Абонемент</h3>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getMembershipColor(card.membership.status)}`}>
            {getMembershipLabel(card.membership.status)}
          </span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{card.membership.planName}</p>
            <p className="text-xs text-gray-500">
              {card.membership.validTo
                ? `До ${new Date(card.membership.validTo).toLocaleDateString('ru-RU')}`
                : 'Бессрочный'}
            </p>
          </div>
        </div>
      </section>

      {/* Visit Summary Mini-Card */}
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-around">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-gray-900">{card.visitSummary.visitsLast30Days}</p>
          <p className="text-xs text-gray-500">За 30 дней</p>
        </div>
        <div className="w-px bg-gray-100 h-10"></div>
        <div className="text-center">
          <p className="text-2xl font-extrabold text-gray-900">{card.visitSummary.totalVisits}</p>
          <p className="text-xs text-gray-500">Всего</p>
        </div>
      </section>

      {/* Purchased Services */}
      <section>
        <h3 className="font-bold text-gray-900 mb-3 px-1">Пакеты услуг</h3>
        <div className="space-y-3">
          {purchases.length > 0 ? (
            purchases.map(pkg => (
              <div key={pkg.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    {pkg.type === 'pt' ? (
                      <Dumbbell className="w-5 h-5" />
                    ) : pkg.type === 'spa' ? (
                      <Activity className="w-5 h-5" />
                    ) : (
                      <ClipboardList className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{pkg.title}</h4>
                    <p className="text-xs text-gray-500">{pkg.type === 'pt' ? 'Персональная' : pkg.type === 'spa' ? 'SPA' : 'Групповая'}</p>
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
          {bookings.length > 0 ? (
            bookings.map(booking => (
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
                    <p className="text-xs text-gray-500">{booking.trainerName || 'Без тренера'}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            ))
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl text-center text-gray-400 text-xs">
              Нет предстоящих записей
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderHealth = () => {
    const hp = card?.healthProfile;
    if (!hp) return <EmptyState message="Профиль здоровья не заполнен" />;
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
        {/* Contraindications */}
        {hp.contraindications.length > 0 && (
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" /> Противопоказания
            </h3>
            <div className="flex flex-wrap gap-2">
              {hp.contraindications.map((c, i) => (
                <span key={i} className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium">{c}</span>
              ))}
            </div>
          </section>
        )}
        {/* Injuries */}
        {hp.injuries.length > 0 && (
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">Травмы</h3>
            <div className="flex flex-wrap gap-2">
              {hp.injuries.map((inj, i) => (
                <span key={i} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-medium">{inj}</span>
              ))}
            </div>
          </section>
        )}
        {/* Limits */}
        {hp.limitsText && (
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">Ограничения</h3>
            <p className="text-sm text-gray-700">{hp.limitsText}</p>
          </section>
        )}
        {/* Allergies */}
        {hp.allergiesText && (
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-2">Аллергии</h3>
            <p className="text-sm text-gray-700">{hp.allergiesText}</p>
          </section>
        )}
        {/* Visibility */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3">Видимость данных</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Тренер</span>
              <span className={hp.visibility.showTrainer ? 'text-green-600 font-bold' : 'text-gray-400'}>
                {hp.visibility.showTrainer ? 'Видит' : 'Скрыто'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Методист</span>
              <span className={hp.visibility.showMethodist ? 'text-green-600 font-bold' : 'text-gray-400'}>
                {hp.visibility.showMethodist ? 'Видит' : 'Скрыто'}
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-around">
        <div className="text-center">
          <p className="text-2xl font-extrabold text-gray-900">{card.visitSummary.visitsLast30Days}</p>
          <p className="text-xs text-gray-500">За 30 дней</p>
        </div>
        <div className="w-px bg-gray-100 h-10"></div>
        <div className="text-center">
          <p className="text-2xl font-extrabold text-gray-900">{card.visitSummary.totalVisits}</p>
          <p className="text-xs text-gray-500">Всего</p>
        </div>
      </div>

      <div className="space-y-2">
        {visits.length > 0 ? (
          visits.map(v => (
            <div key={v.id} className="bg-white p-4 rounded-xl border border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${v.status === 'completed' ? 'bg-green-400' : v.status === 'no_show' ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{v.title}</p>
                  <p className="text-xs text-gray-500">{v.date}{v.trainerName ? ` \u2022 ${v.trainerName}` : ''}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-gray-400">{v.duration ? `${v.duration} мин` : ''}</span>
            </div>
          ))
        ) : (
          <EmptyState message="Нет записей о посещениях" />
        )}
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
        {notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} className="bg-white p-3 rounded-xl border border-gray-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-gray-500">
                  {new Date(note.createdAt).toLocaleDateString('ru-RU')} {'\u2022'} {note.authorName}
                </span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed">{note.text}</p>
            </div>
          ))
        ) : (
          <EmptyState message="Заметок пока нет" />
        )}
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
            <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Профиль клиента</h1>
          </div>

          {card && (
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md shrink-0">
                <img src={card.personalInfo.avatarUrl || ''} alt={`${card.personalInfo.firstName} ${card.personalInfo.lastName}`} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                  {card.personalInfo.firstName} {card.personalInfo.lastName}
                </h2>
                <p className="text-xs text-gray-500 mb-2">
                  {age !== null ? `${age} лет` : ''}{age !== null && card.membership.planName ? ' \u2022 ' : ''}{card.membership.planName}
                </p>
                <div className="flex flex-wrap gap-1">
                  {card.personalInfo.tags.map(tag => (
                    <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-medium border border-gray-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

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
            onClick={() => setActiveTab('health')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'health' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
              }`}
          >
            Здоровье
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
        {activeTab === 'health' && renderHealth()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'notes' && renderNotes()}
      </div>
    </div>
  );
};

export default TrainerClientProfileScreen;

import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  MoreVertical,
  Plus,
  Play,
  Square,
  User,
  XCircle,
  Save,
  AlertCircle
} from 'lucide-react';

interface TrainerClassDetailsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ClassStatus = 'planned' | 'in_progress' | 'done' | 'canceled';
type AttendeeStatus = 'registered' | 'arrived' | 'no_show';

interface Attendee {
  id: number;
  name: string;
  phone?: string;
  status: AttendeeStatus;
  img: string;
  hasDebt?: boolean;
}

const TrainerClassDetailsScreen: React.FC<TrainerClassDetailsScreenProps> = ({ onNavigate }) => {
  // MOCK STATE
  const [classStatus, setClassStatus] = useState<ClassStatus>('planned');
  const [note, setNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(true);

  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 1, name: 'Елена Смирнова', status: 'arrived', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' },
    { id: 2, name: 'Максим Ковалев', status: 'registered', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max' },
    { id: 3, name: 'Ольга Петрова', status: 'registered', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga', hasDebt: true },
    { id: 4, name: 'Иван Иванов', status: 'no_show', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan' },
  ]);

  const handleStartClass = () => {
    if (confirm('Начать занятие?')) {
      setClassStatus('in_progress');
    }
  };

  const handleFinishClass = () => {
    if (confirm('Завершить занятие? Это зафиксирует время и спишет услуги у участников.')) {
      setClassStatus('done');
    }
  };

  const toggleAttendeeStatus = (id: number) => {
    if (classStatus === 'done') return; // Read only if done

    setAttendees(attendees.map(a => {
      if (a.id === id) {
        let nextStatus: AttendeeStatus = 'registered';
        if (a.status === 'registered') nextStatus = 'arrived';
        else if (a.status === 'arrived') nextStatus = 'no_show';
        else if (a.status === 'no_show') nextStatus = 'registered';

        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    setIsNoteSaved(false);
  };

  const saveNote = () => {
    // API call simulation
    setTimeout(() => setIsNoteSaved(true), 500);
  };

  const getStatusColor = (status: AttendeeStatus) => {
    switch (status) {
      case 'arrived': return 'text-green-600 bg-green-50 border-green-100';
      case 'no_show': return 'text-red-600 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusLabel = (status: AttendeeStatus) => {
    switch (status) {
      case 'arrived': return 'Пришел';
      case 'no_show': return 'Не пришел';
      default: return 'Записан';
    }
  };

  const getActionIcon = (status: AttendeeStatus) => {
    switch (status) {
      case 'arrived': return <CheckCircle2 className="w-6 h-6 text-green-600" fill="currentColor" stroke="white" />;
      case 'no_show': return <XCircle className="w-6 h-6 text-red-500" />;
      default: return <Circle className="w-6 h-6 text-gray-300" />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">Сила и Выносливость</h1>
            <p className="text-xs text-gray-500">Групповая • Зал №2</p>
          </div>
        </div>

        {/* Class Status Badge */}
        <div className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${classStatus === 'in_progress' ? 'bg-green-100 text-green-700 animate-pulse' :
            classStatus === 'done' ? 'bg-gray-100 text-gray-500' :
              'bg-blue-50 text-blue-700'
          }`}>
          {classStatus === 'in_progress' ? 'Идет занятие' :
            classStatus === 'done' ? 'Завершено' : 'Запланировано'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">

        {/* Time Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Сегодня, 12 Сен</p>
              <p className="text-xs text-gray-500">Четверг</p>
            </div>
          </div>
          <div className="w-px h-8 bg-gray-100"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">19:00 - 20:30</p>
              <p className="text-xs text-gray-500">90 мин</p>
            </div>
          </div>
        </div>

        {/* Action Buttons (Main CTA) */}
        {classStatus === 'planned' && (
          <button
            onClick={handleStartClass}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" /> Начать занятие
          </button>
        )}

        {classStatus === 'in_progress' && (
          <button
            onClick={handleFinishClass}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Square className="w-5 h-5 fill-current" /> Завершить занятие
          </button>
        )}

        {/* Participants */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-gray-900">Участники ({attendees.filter(a => a.status === 'arrived').length}/{attendees.length})</h3>
            <button className="text-blue-600 text-xs font-bold flex items-center gap-1">
              <Plus className="w-3 h-3" /> Добавить
            </button>
          </div>

          <div className="space-y-2">
            {attendees.map((person) => (
              <div key={person.id} className={`bg-white p-3 rounded-xl border flex items-center justify-between ${person.hasDebt ? 'border-red-200 shadow-sm shadow-red-50' : 'border-gray-100'
                } ${classStatus === 'done' ? 'opacity-70' : ''}`}>

                <div
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => onNavigate('trainer_client_profile')}
                >
                  <div className="relative">
                    <img src={person.img} alt={person.name} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                    {person.hasDebt && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">!</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{person.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${getStatusColor(person.status)}`}>
                        {getStatusLabel(person.status)}
                      </span>
                      {person.hasDebt && (
                        <span className="text-[10px] text-red-500 font-medium">Долг</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Attendance Toggle */}
                  <button
                    disabled={classStatus === 'done'}
                    onClick={() => toggleAttendeeStatus(person.id)}
                    className="p-2 rounded-full hover:bg-gray-50 active:scale-90 transition-transform disabled:opacity-50"
                  >
                    {getActionIcon(person.status)}
                  </button>

                  <button className="p-2 text-gray-300 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h3 className="font-bold text-gray-900 mb-2 px-1">Заметка тренера</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            <textarea
              value={note}
              onChange={handleNoteChange}
              placeholder="Как прошло занятие? Особенности, инциденты..."
              className="w-full p-3 text-sm min-h-[100px] resize-none outline-none text-gray-700"
              disabled={classStatus === 'done'}
            ></textarea>
            <div className="bg-gray-50 px-3 py-2 flex justify-between items-center border-t border-gray-100">
              <span className="text-xs text-gray-400">Видно только сотрудникам</span>
              {classStatus !== 'done' && (
                <button
                  onClick={saveNote}
                  disabled={isNoteSaved}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isNoteSaved ? 'text-gray-400 bg-transparent' : 'bg-blue-600 text-white shadow-sm'
                    }`}
                >
                  {isNoteSaved ? (
                    <><CheckCircle2 className="w-3 h-3" /> Сохранено</>
                  ) : (
                    <><Save className="w-3 h-3" /> Сохранить</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Info Block (e.g. for Debt) */}
        {attendees.some(a => a.hasDebt) && (
          <div className="bg-red-50 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800">
              <span className="font-bold block mb-1">Внимание: Есть клиенты с долгом</span>
              У некоторых участников есть задолженность. Пожалуйста, напомните им обратиться на ресепшен до или после занятия.
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TrainerClassDetailsScreen;
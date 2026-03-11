import React, { useState } from 'react';
import { ScreenName } from '../types';
import { Plus, ChevronRight, BookOpen, Users } from 'lucide-react';

interface MethodistProgramsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ProgramStatus = 'active' | 'draft' | 'archive';
type FilterType = 'all' | 'active' | 'draft' | 'archive';

interface Program {
  id: number;
  name: string;
  weeks: number;
  daysPerWeek: number;
  author: string;
  clients: number;
  status: ProgramStatus;
}

const programs: Program[] = [
  { id: 1, name: 'Силовая база', weeks: 12, daysPerWeek: 4, author: 'Петров А.', clients: 32, status: 'active' },
  { id: 2, name: 'Похудение 2.0', weeks: 8, daysPerWeek: 5, author: 'Смирнова М.', clients: 18, status: 'active' },
  { id: 3, name: 'Функциональный тренинг', weeks: 6, daysPerWeek: 3, author: 'Козлов Д.', clients: 45, status: 'active' },
  { id: 4, name: 'Реабилитация спины', weeks: 4, daysPerWeek: 3, author: 'Методист', clients: 8, status: 'draft' },
  { id: 5, name: 'Марафон выносливости', weeks: 16, daysPerWeek: 6, author: 'Иванов С.', clients: 0, status: 'archive' },
];

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'active', label: 'Активные' },
  { key: 'draft', label: 'Черновики' },
  { key: 'archive', label: 'Архив' },
];

const statusConfig: Record<ProgramStatus, { label: string; bg: string; text: string }> = {
  active: { label: 'Активна', bg: 'bg-green-50', text: 'text-green-700' },
  draft: { label: 'Черновик', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  archive: { label: 'Архив', bg: 'bg-gray-100', text: 'text-gray-500' },
};

const MethodistProgramsScreen: React.FC<MethodistProgramsScreenProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredPrograms = activeFilter === 'all'
    ? programs
    : programs.filter((p) => p.status === activeFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">Программы</h1>
        <button className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Filter Chips */}
      <div className="px-4 py-3 overflow-x-auto">
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Program Cards */}
      <div className="px-4 pb-24">
        {filteredPrograms.map((program) => {
          const status = statusConfig[program.status];
          return (
            <button
              key={program.id}
              onClick={() => onNavigate('methodist_program_detail')}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-3 flex items-center gap-3 text-left"
            >
              {/* Icon */}
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{program.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {program.weeks} нед • {program.daysPerWeek} дн/нед
                </p>
                <p className="text-xs text-gray-500">Автор: {program.author}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    {program.clients} клиентов
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Chevron */}
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MethodistProgramsScreen;

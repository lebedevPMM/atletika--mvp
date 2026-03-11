import React, { useState, useMemo } from 'react';
import { ScreenName } from '../types';
import { Users, Star, AlertTriangle, ChevronRight } from 'lucide-react';

interface MethodistTrainersScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

interface Trainer {
  id: number;
  name: string;
  spec: string;
  rating: number;
  clients: number;
  kpi: number;
  img: string;
}

type FilterType = 'all' | 'by_rating' | 'problematic';

const trainers: Trainer[] = [
  { id: 1, name: 'Алексей Петров', spec: 'Силовые', rating: 4.8, clients: 15, kpi: 92, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 2, name: 'Мария Смирнова', spec: 'Групповые', rating: 4.5, clients: 28, kpi: 88, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2' },
  { id: 3, name: 'Дмитрий Козлов', spec: 'Функциональный', rating: 4.2, clients: 12, kpi: 75, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dmitry' },
  { id: 4, name: 'Ольга Николаева', spec: 'Йога/Пилатес', rating: 4.7, clients: 20, kpi: 95, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga2' },
  { id: 5, name: 'Сергей Иванов', spec: 'Бокс', rating: 3.4, clients: 8, kpi: 45, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey' },
  { id: 6, name: 'Анна Волкова', spec: 'Танцы', rating: 3.8, clients: 10, kpi: 58, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
];

const filterLabels: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'by_rating', label: 'По рейтингу' },
  { key: 'problematic', label: 'Проблемные' },
];

const getKpiColor = (kpi: number): string => {
  if (kpi >= 70) return 'bg-green-500';
  if (kpi >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

const MethodistTrainersScreen: React.FC<MethodistTrainersScreenProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const attentionCount = trainers.filter(t => t.kpi < 60).length;
  const avgRating = (trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1);

  const filteredTrainers = useMemo(() => {
    let result = [...trainers];

    if (activeFilter === 'problematic') {
      result = result.filter(t => t.kpi < 60);
    }

    if (activeFilter === 'by_rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-gray-900">Тренеры</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-purple-50 rounded-2xl p-3 text-center">
            <Users className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{trainers.length}</div>
            <div className="text-xs text-gray-500">Всего</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-3 text-center">
            <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{avgRating}<span className="text-yellow-500">★</span></div>
            <div className="text-xs text-gray-500">Ср. рейтинг</div>
          </div>
          <div className="bg-red-50 rounded-2xl p-3 text-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <div className="text-lg font-bold text-gray-900">{attentionCount}</div>
            <div className="text-xs text-gray-500">Внимание</div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2">
          {filterLabels.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Trainer Cards */}
        <div className="space-y-3">
          {filteredTrainers.map(trainer => (
            <button
              key={trainer.id}
              onClick={() => onNavigate('methodist_trainer_profile')}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <img
                  src={trainer.img}
                  alt={trainer.name}
                  className="w-12 h-12 rounded-full bg-gray-100 flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900">{trainer.name}</div>
                      <div className="text-xs text-gray-500">{trainer.spec}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>

                  {/* Rating & Clients */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{trainer.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">{trainer.clients} клиентов</span>
                  </div>

                  {/* KPI Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">KPI: {trainer.kpi}%</span>
                      {trainer.kpi < 60 && (
                        <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          Внимание
                        </span>
                      )}
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className={`h-2 rounded-full ${getKpiColor(trainer.kpi)}`}
                        style={{ width: `${trainer.kpi}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Empty state for problematic filter */}
        {filteredTrainers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-500 text-sm">Нет тренеров по выбранному фильтру</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MethodistTrainersScreen;

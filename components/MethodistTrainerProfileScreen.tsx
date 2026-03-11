import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Star, TrendingUp, Users, Target, BookOpen, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MethodistTrainerProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ratingData = [
  { month: 'Окт', rating: 4.5 },
  { month: 'Ноя', rating: 4.6 },
  { month: 'Дек', rating: 4.4 },
  { month: 'Янв', rating: 4.7 },
  { month: 'Фев', rating: 4.8 },
  { month: 'Мар', rating: 4.8 },
];

const reviews = [
  { name: 'Елена К.', stars: 5, text: 'Отличный тренер! Всегда объясняет технику и следит за безопасностью.' },
  { name: 'Михаил Д.', stars: 5, text: 'Программа отлично подобрана, прогресс виден уже через месяц.' },
  { name: 'Анна С.', stars: 4, text: 'Хороший специалист, но иногда опаздывает на 5 минут.' },
];

const programs = [
  { name: 'Силовая база', duration: '12 недель', clients: 32 },
  { name: 'Функциональный тренинг', duration: '6 недель', clients: 12 },
];

const MethodistTrainerProfileScreen: React.FC<MethodistTrainerProfileScreenProps> = ({ onNavigate }) => {
  const [notes, setNotes] = useState('');

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Профиль тренера</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-purple-600">АП</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Алексей Петров</h2>
          <p className="text-gray-500 mt-1">Силовые тренировки</p>
          <p className="text-gray-400 text-sm mt-1">Стаж: 8 лет</p>
          <div className="flex gap-2 mt-3">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">NSCA-CPT</span>
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">FPA Level 3</span>
          </div>
        </div>

        {/* KPI Block */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-bold text-gray-400 uppercase">Рейтинг</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">4.8★</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-xs font-bold text-gray-400 uppercase">NPS</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">72</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-xs font-bold text-gray-400 uppercase">Удержание</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">92%</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span className="text-xs font-bold text-gray-400 uppercase">Продажи</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-xs text-gray-400">от плана</p>
          </div>
        </div>

        {/* Rating Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-4">Динамика рейтинга</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ratingData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis domain={[4, 5]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill: '#7C3AED', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Client Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-3">Отзывы клиентов</h3>
          <div className="space-y-3">
            {reviews.map((review, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{review.name}</span>
                  <span className="text-orange-400 text-sm">{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Programs */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-500" />
            Назначенные программы
          </h3>
          <div className="space-y-2">
            {programs.map((prog, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{prog.name}</p>
                    <p className="text-xs text-gray-400">{prog.duration}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{prog.clients} кл.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Methodist Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <h3 className="font-bold text-gray-900 mb-3">Заметки методиста</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Заметки методиста..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
          <button className="mt-2 flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors">
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
            Назначить программу
          </button>
          <button className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
            Запланировать аттестацию
          </button>
        </div>
      </div>
    </div>
  );
};

export default MethodistTrainerProfileScreen;

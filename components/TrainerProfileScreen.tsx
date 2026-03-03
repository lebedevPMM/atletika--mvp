import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Phone,
  Mail,
  Building2,
  CheckCircle2,
  Shield,
  MapPin,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface TrainerProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerProfileScreen: React.FC<TrainerProfileScreenProps> = ({ onNavigate }) => {
  // Mock Employee Data
  const employee = {
    id: 102,
    name: 'Анна Морозова',
    role: 'Тренер групповых программ',
    phone: '+7 999 123-45-67',
    email: 'anna.m@atletika.plus',
    avatar: null,
    clubs: [
      { id: 1, name: 'Atletika+ Moscow City', address: 'Пресненская наб., 12', active: true },
      { id: 2, name: 'Atletika+ Tverskaya', address: 'Тверская ул., 22', active: true },
    ],
    permissions: [
      'Проведение групповых занятий',
      'Персональные тренировки',
      'Просмотр профилей клиентов',
      'Управление расписанием'
    ]
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('trainer_settings')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Профиль сотрудника</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-md mb-4">
            {employee.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
          <p className="text-blue-600 font-medium text-sm mb-4">{employee.role}</p>

          <div className="flex gap-2 w-full">
            <div className="flex-1 bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-gray-700 text-sm font-medium">
              <Phone className="w-4 h-4 text-gray-400" /> {employee.phone}
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-50 p-2 rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-gray-700 text-sm font-medium">
            <Mail className="w-4 h-4 text-gray-400" /> {employee.email}
          </div>
        </div>

        {/* Clubs */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-2">Доступные клубы</h3>
          <div className="space-y-3">
            {employee.clubs.map((club) => (
              <div key={club.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${club.active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{club.name}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {club.address}
                    </p>
                  </div>
                </div>
                {club.active && (
                  <button
                    onClick={() => onNavigate('trainer_select_club')}
                    className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
                  >
                    Сменить
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Permissions */}
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-2">Права доступа</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {employee.permissions.map((perm, i) => (
              <div key={i} className="p-4 border-b border-gray-50 last:border-0 flex items-center gap-3">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">{perm}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Info */}
        <section className="text-center pt-4">
          <p className="text-xs text-gray-400">
            Версия приложения: 1.0.0 (Build 142) <br />
            ID сотрудника: {employee.id}
          </p>
        </section>

      </div>
    </div>
  );
};

export default TrainerProfileScreen;
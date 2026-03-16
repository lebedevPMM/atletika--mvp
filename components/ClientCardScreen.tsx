import React from 'react';
import { ScreenName } from '../types';
import type { CardId } from '../types/client-card';
import { useClientCard, useClientBookings, useClientPlan } from '../hooks/useClientCard';
import {
  ArrowLeft,
  Target,
  TrendingDown,
  Heart,
  ChevronRight,
} from 'lucide-react';

interface ClientCardScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const DEMO_CARD_ID = 'card-001' as CardId;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

const ClientCardScreen: React.FC<ClientCardScreenProps> = ({ onNavigate }) => {
  const { card, loading: cardLoading } = useClientCard(DEMO_CARD_ID);
  const { bookings } = useClientBookings(DEMO_CARD_ID);
  const { plan } = useClientPlan(DEMO_CARD_ID);

  if (cardLoading || !card) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const name = `${card.personalInfo.firstName} ${card.personalInfo.lastName}`;
  const ps = card.progressSummary;

  // Membership status styling
  const statusMap: Record<string, { label: string; color: string }> = {
    active: { label: 'Активен', color: 'bg-green-50 text-green-700' },
    expired: { label: 'Истёк', color: 'bg-red-50 text-red-700' },
    frozen: { label: 'Заморожен', color: 'bg-blue-50 text-blue-700' },
    pending: { label: 'Ожидание', color: 'bg-yellow-50 text-yellow-700' },
    cancelled: { label: 'Отменён', color: 'bg-gray-100 text-gray-600' },
  };
  const statusInfo = statusMap[card.membership.status] ?? statusMap.active;

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => onNavigate('BACK')}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Моя карта</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile strip */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <img
            src={card.personalInfo.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default'}
            alt={name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-lg truncate">{name}</h2>
            <p className="text-xs text-gray-500">{card.membership.planName}</p>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Training Plan card */}
        {plan && (
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" /> Тренировочный план
            </h3>
            <p className="font-bold text-gray-900 text-sm mb-1">{plan.title}</p>
            <p className="text-xs text-gray-500 mb-3">{plan.goal}</p>
            <div className="relative h-2 bg-gray-100 rounded-full mb-2">
              <div
                className="absolute h-2 bg-blue-500 rounded-full"
                style={{ width: `${plan.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Неделя {plan.currentWeek} / {plan.totalWeeks}</span>
              <span>{plan.progressPercent}%</span>
            </div>
          </section>
        )}

        {/* Progress summary card */}
        {ps && (
          <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-500" /> Прогресс
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Вес</p>
                <p className="text-xl font-extrabold text-gray-900">
                  {ps.weightCurrent}{' '}
                  <span className="text-sm font-normal text-gray-400">кг</span>
                </p>
                <p
                  className={`text-xs font-bold ${
                    ps.weightDelta && ps.weightDelta < 0
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {ps.weightDelta && ps.weightDelta < 0 ? '' : '+'}
                  {ps.weightDelta} кг
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Талия</p>
                <p className="text-xl font-extrabold text-gray-900">
                  {ps.waistCurrent}{' '}
                  <span className="text-sm font-normal text-gray-400">см</span>
                </p>
                <p
                  className={`text-xs font-bold ${
                    ps.waistDelta && ps.waistDelta < 0
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`}
                >
                  {ps.waistDelta && ps.waistDelta < 0 ? '' : '+'}
                  {ps.waistDelta} см
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Health card */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" /> Здоровье
          </h3>
          {card.healthProfile ? (
            <>
              {card.healthProfile.contraindications.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {card.healthProfile.contraindications.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => onNavigate('contraindications')}
                className="text-xs text-blue-600 font-bold"
              >
                Редактировать &rarr;
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('checkup')}
              className="w-full py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold"
            >
              Заполнить анкету здоровья
            </button>
          )}
        </section>

        {/* Upcoming bookings */}
        <section>
          <h3 className="font-bold text-gray-900 mb-3 px-1">Ближайшие записи</h3>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <button
                  key={b.id}
                  onClick={() => onNavigate('booking_class_details')}
                  className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-blue-600 font-bold">
                        {formatDate(b.date)}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{b.time}</span>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-gray-900 text-sm">{b.title}</h4>
                      {b.trainerName && (
                        <p className="text-xs text-gray-500">{b.trainerName}</p>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-400 text-sm">
              Нет предстоящих записей
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ClientCardScreen;

import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Package,
  Clock,
  ChevronRight,
  QrCode,
  Zap,
  Ticket,
  AlertCircle,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface PurchasedServicesScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type ServiceType = 'pt_pack' | 'spa_pack' | 'ticket' | 'single' | 'addon';
type ServiceStatus = 'active' | 'expired' | 'used' | 'refunded';

interface PurchasedItem {
  id: number;
  type: ServiceType;
  title: string;
  subtitle: string;
  qtyTotal: number;
  qtyLeft: number;
  validFrom: string;
  validTo: string; // DD.MM.YYYY
  status: ServiceStatus;
  color: string;
  price?: string; // For history
}

const PurchasedServicesScreen: React.FC<PurchasedServicesScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Helper to parse date for comparison (DD.MM.YYYY to Date)
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const isExpiringSoon = (dateStr: string) => {
    const date = parseDate(dateStr);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const activeServices: PurchasedItem[] = [
    {
      id: 1,
      type: 'pt_pack',
      title: 'Персональная тренировка',
      subtitle: 'Блок 10 занятий',
      qtyTotal: 10,
      qtyLeft: 3,
      validFrom: '01.01.2024',
      validTo: '25.01.2025', // Should flag as expiring soon if mocked date is close, using generic future date for safety
      status: 'active',
      color: 'bg-blue-600'
    },
    {
      id: 2,
      type: 'spa_pack',
      title: 'Спортивный массаж',
      subtitle: 'Абонемент на 5 сеансов',
      qtyTotal: 5,
      qtyLeft: 4,
      validFrom: '10.09.2024',
      validTo: '20.12.2024',
      status: 'active',
      color: 'bg-purple-600'
    },
    {
      id: 3,
      type: 'ticket',
      title: 'Семинар "Нутрициология"',
      subtitle: 'Входной билет',
      qtyTotal: 1,
      qtyLeft: 1,
      validFrom: '15.10.2024',
      validTo: '15.10.2024',
      status: 'active',
      color: 'bg-orange-500'
    }
  ];

  const historyServices: PurchasedItem[] = [
    {
      id: 101,
      type: 'pt_pack',
      title: 'Блок 10 персональных тренировок',
      subtitle: 'Использован полностью',
      qtyTotal: 10,
      qtyLeft: 0,
      validFrom: '01.06.2024',
      validTo: '01.09.2024',
      status: 'used',
      color: 'bg-gray-400',
      price: '25 000 ₽'
    },
    {
      id: 102,
      type: 'single',
      title: 'Протеиновый батончик',
      subtitle: 'Бар',
      qtyTotal: 1,
      qtyLeft: 0,
      validFrom: '10.09.2024',
      validTo: '10.09.2024',
      status: 'used',
      color: 'bg-gray-400',
      price: '300 ₽'
    }
  ];

  const handleBook = (item: PurchasedItem) => {
    if (item.type === 'pt_pack') {
      onNavigate('booking_pt_calendar');
    } else if (item.type === 'spa_pack') {
      onNavigate('booking_spa_details'); // Or generic booking with filter
    } else if (item.type === 'ticket') {
      onNavigate('event_details');
    } else {
      onNavigate('booking_schedule');
    }
  };

  const getIcon = (type: ServiceType) => {
    switch (type) {
      case 'pt_pack': return Zap;
      case 'spa_pack': return Package;
      case 'ticket': return Ticket;
      default: return Package;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Мои услуги</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-24 space-y-6">
        {/* Toggle */}
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Активные
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Архив
          </button>
        </div>

        {activeTab === 'active' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
            {activeServices.length > 0 ? (
              activeServices.map((pkg) => {
                const Icon = getIcon(pkg.type);
                const expiring = isExpiringSoon(pkg.validTo);

                return (
                  <div key={pkg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group">
                    <div className={`h-1.5 w-full ${pkg.color}`}></div>

                    {expiring && (
                      <div className="absolute top-3 right-3 bg-red-50 text-red-600 px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-red-100">
                        <AlertCircle className="w-3 h-3" />
                        Скоро истекает
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4 pr-16">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{pkg.title}</h3>
                          <p className="text-xs text-gray-500 font-medium">{pkg.subtitle}</p>
                        </div>
                      </div>

                      {/* Usage Visuals */}
                      {pkg.type !== 'ticket' && (
                        <div className="mb-5">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-gray-900">
                              {pkg.qtyTotal - pkg.qtyLeft} / {pkg.qtyTotal}
                            </span>
                            <span className="text-gray-400">Осталось: {pkg.qtyLeft}</span>
                          </div>
                          <div className="flex gap-1.5 h-2">
                            {Array.from({ length: pkg.qtyTotal }).map((_, i) => (
                              <div
                                key={i}
                                className={`flex-1 rounded-full ${i < (pkg.qtyTotal - pkg.qtyLeft) ? 'bg-gray-100' : pkg.color}`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className={`flex items-center gap-1.5 text-xs font-bold ${expiring ? 'text-red-500' : 'text-gray-400'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          До {pkg.validTo}
                        </div>

                        <div className="flex gap-2">
                          <button className="bg-gray-50 p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                            <QrCode className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleBook(pkg)}
                            className="text-white bg-gray-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md active:scale-95 transition-all"
                          >
                            {pkg.type === 'ticket' ? 'Открыть' : 'Записаться'}
                            <ChevronRight className="w-3 h-3 opacity-50" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">Нет активных услуг</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4">
            {historyServices.map((item, idx) => (
              <div key={item.id} className={`p-4 flex justify-between items-center ${idx !== historyServices.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                    {item.status === 'used' ? <CheckCircle2 className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm leading-none mb-1">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.validFrom} - {item.validTo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm text-gray-900 block">{item.price}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{item.status === 'used' ? 'Использован' : 'Истёк'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buy More */}
      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
        <button
          onClick={() => onNavigate('service_catalog')}
          className="w-full bg-blue-600 text-white p-4 rounded-xl shadow-lg shadow-blue-200 font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Package className="w-5 h-5" />
          Купить пакет услуг
        </button>
      </div>
    </div>
  );
};

export default PurchasedServicesScreen;
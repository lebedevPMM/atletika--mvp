
import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  CreditCard,
  QrCode,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface InvoiceScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type InvoiceStatus = 'open' | 'overdue' | 'paid';

interface InvoiceItem {
  id: number;
  title: string;
  desc?: string;
  price: number;
}

interface Invoice {
  id: string;
  number: string;
  title: string;
  reason?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
}

const InvoiceScreen: React.FC<InvoiceScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'unpaid' | 'history'>('unpaid');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'sbp' | 'card'>('sbp');

  // Mock Data
  const invoices: Invoice[] = [
    {
      id: 'inv-1',
      number: '8392-01',
      title: 'Штраф за неявку',
      reason: 'Неявка на ПТ 10.09 без предупреждения',
      amount: 1500,
      currency: '₽',
      status: 'overdue',
      dueDate: 'Вчера',
      createdAt: '10.09.2024',
      items: [
        { id: 1, title: 'Штраф: Поздняя отмена', price: 1500, desc: 'Пункт 4.2 правил клуба' }
      ]
    },
    {
      id: 'inv-2',
      number: '8392-02',
      title: 'Продление абонемента',
      reason: 'Ежемесячный платеж по тарифу "Безлимит"',
      amount: 3900,
      currency: '₽',
      status: 'open',
      dueDate: '15 Сен',
      createdAt: '12.09.2024',
      items: [
        { id: 1, title: 'Абонемент "Безлимит"', price: 3900, desc: 'Период: 15.09 - 15.10' }
      ]
    },
    {
      id: 'inv-3',
      number: '8300-99',
      title: 'Услуги бара',
      amount: 450,
      currency: '₽',
      status: 'paid',
      dueDate: '10 Сен',
      createdAt: '10.09.2024',
      items: [
        { id: 1, title: 'Вода 0.5', price: 150 },
        { id: 2, title: 'Протеиновый батончик', price: 300 }
      ]
    }
  ];

  const unpaidInvoices = invoices
    .filter(i => i.status !== 'paid')
    .sort((a, b) => (a.status === 'overdue' ? -1 : 1));

  const historyInvoices = invoices.filter(i => i.status === 'paid');

  const handlePay = () => {
    if (paymentMethod === 'sbp') {
      onNavigate('payment_sbp');
    } else {
      // Navigate to card selection screen for this invoice
      onNavigate('payment_methods');
    }
  };

  const renderStatusBadge = (status: InvoiceStatus, date: string) => {
    switch (status) {
      case 'overdue':
        return (
          <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
            <AlertTriangle className="w-3 h-3" /> Просрочено
          </div>
        );
      case 'paid':
        return (
          <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" /> Оплачено
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
            <Clock className="w-3 h-3" /> До {date}
          </div>
        );
    }
  };

  // --- DETAIL VIEW (Overlay) ---
  if (selectedInvoice) {
    return (
      <div className="bg-gray-50 h-full flex flex-col relative animate-in slide-in-from-right duration-300">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSelectedInvoice(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Детали счета</h1>
          <div className="w-8"></div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto pb-32">
          {/* Status Banner */}
          {selectedInvoice.status === 'overdue' && (
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-xs text-red-800 leading-snug font-medium">
                Оплата просрочена. Доступ в клуб может быть ограничен до погашения задолженности.
              </p>
            </div>
          )}

          {/* Invoice Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">

            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase mb-1">Сумма к оплате</p>
                <p className="text-4xl font-extrabold text-gray-900">{selectedInvoice.amount} ₽</p>
              </div>
              {renderStatusBadge(selectedInvoice.status, selectedInvoice.dueDate)}
            </div>

            <div className="space-y-4 border-t border-dashed border-gray-200 pt-6">
              {/* Invoice Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-gray-400">Номер счета</p>
                  <p className="font-bold text-gray-900 mt-0.5">#{selectedInvoice.number}</p>
                </div>
                <div>
                  <p className="text-gray-400">Дата выставления</p>
                  <p className="font-bold text-gray-900 mt-0.5">{selectedInvoice.createdAt}</p>
                </div>
              </div>

              {selectedInvoice.reason && (
                <div className="bg-gray-50 p-3 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Основание</p>
                  <p className="text-sm font-medium text-gray-900">{selectedInvoice.reason}</p>
                </div>
              )}

              {/* Items */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-3">Состав счета</p>
                <div className="space-y-3">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="pr-4">
                        <p className="font-bold text-gray-900">{item.title}</p>
                        {item.desc && <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>}
                      </div>
                      <p className="font-medium text-gray-900 whitespace-nowrap">{item.price} ₽</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods (Only for unpaid) */}
          {selectedInvoice.status !== 'paid' && (
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 ml-2">Способ оплаты</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('sbp')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'sbp'
                      ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0F1626] rounded-xl flex items-center justify-center text-white shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm">СБП (Быстрый платеж)</p>
                      <p className="text-xs text-green-600 font-medium">Без комиссии</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'sbp' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                    {paymentMethod === 'sbp' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === 'card'
                      ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-sm">Банковская карта</p>
                      <p className="text-xs text-gray-500 font-medium">Visa, MC, MIR</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sticky CTA */}
        {selectedInvoice.status !== 'paid' && (
          <div className="absolute bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button
              onClick={handlePay}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Оплатить {selectedInvoice.amount} ₽
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => onNavigate('wallet')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Счета на оплату</h1>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('unpaid')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'unpaid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            К оплате {unpaidInvoices.length > 0 && <span className="ml-1 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unpaidInvoices.length}</span>}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            История
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {activeTab === 'unpaid' ? (
          unpaidInvoices.length > 0 ? (
            <div className="space-y-3">
              {unpaidInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice)}
                  className={`bg-white p-4 rounded-2xl shadow-sm border relative overflow-hidden active:scale-[0.99] transition-transform cursor-pointer ${invoice.status === 'overdue' ? 'border-red-200' : 'border-gray-100'
                    }`}
                >
                  {invoice.status === 'overdue' && (
                    <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                      Просрочено
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Счет #{invoice.number}</span>
                      <h3 className="font-bold text-gray-900">{invoice.title}</h3>
                    </div>
                    <p className="font-extrabold text-lg text-gray-900">{invoice.amount} ₽</p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${invoice.status === 'overdue' ? 'text-red-600' : 'text-gray-500'}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      {invoice.status === 'overdue' ? 'Оплатить срочно' : `До ${invoice.dueDate}`}
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                      Оплатить <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Задолженности нет</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-[200px]">У вас нет неоплаченных счетов. Наслаждайтесь тренировками!</p>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {historyInvoices.length > 0 ? historyInvoices.map((invoice) => (
              <div key={invoice.id} className="bg-white p-4 rounded-2xl border border-gray-100 opacity-80">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{invoice.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{invoice.createdAt}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{invoice.amount} ₽</p>
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase mt-1 inline-block">Оплачено</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-gray-400 text-sm">История пуста</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceScreen;

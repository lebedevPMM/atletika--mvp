import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Wallet,
  CreditCard,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  ChevronRight,
  History,
  MoreHorizontal
} from 'lucide-react';

interface WalletScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'main' | 'bonus'>('main');

  const mainAccount = {
    balance: 1200,
    currency: '₽',
    cards: [
      { id: 1, type: 'visa', last4: '4589', bank: 'Tinkoff' }
    ],
    history: [
      { id: 1, title: 'Персональная тренировка', date: 'Сегодня', time: '10:30', amount: -2500, type: 'expense', category: 'Услуги' },
      { id: 2, title: 'Пополнение счета', date: '12 Сен', time: '14:20', amount: 5000, type: 'income', category: 'Пополнение' },
      { id: 3, title: 'Протеиновый батончик', date: '10 Сен', time: '18:45', amount: -300, type: 'expense', category: 'Бар' },
      { id: 4, title: 'Аренда полотенца', date: '08 Сен', time: '09:15', amount: -150, type: 'expense', category: 'Аренда' },
    ]
  };

  const bonusAccount = {
    balance: 350,
    level: 'Gold',
    nextLevel: 1000,
    cashback: 5,
  };

  // Group history by date
  const groupedHistory = mainAccount.history.reduce((acc, item) => {
    (acc[item.date] = acc[item.date] || []).push(item);
    return acc;
  }, {} as Record<string, typeof mainAccount.history>);

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md p-4 shadow-lg border-b border-zinc-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-zinc-300" />
          </button>
          <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Wallet</h1>
        </div>
        <button
          onClick={() => onNavigate('invoice')}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
        >
          <History className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Toggle */}
        <div className="bg-zinc-900 p-1 rounded-xl flex mb-6 border border-zinc-800">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'main' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Balance
          </button>
          <button
            onClick={() => setActiveTab('bonus')}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'bonus' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            Bonuses
          </button>
        </div>

        {activeTab === 'main' ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-800 to-black rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group border border-zinc-800">
              {/* Abstract decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Available Balance</p>
                  <CreditCard className="w-5 h-5 text-zinc-500" />
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black tracking-tight">{mainAccount.balance.toLocaleString()}</span>
                  <span className="text-2xl text-zinc-500 font-medium">{mainAccount.currency}</span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onNavigate('payment_card_add')}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <Plus className="w-4 h-4" /> Top Up
                  </button>
                  <button
                    onClick={() => onNavigate('payment_methods')}
                    className="w-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-800 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                    <ArrowDownLeft className="w-4 h-4 text-red-500" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Sept</span>
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Expenses</span>
                  <p className="text-lg font-bold text-white">8 450 ₽</p>
                </div>
              </div>
              <div
                onClick={() => onNavigate('purchased_services')}
                className="bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-800 flex flex-col justify-between active:scale-[0.98] transition-transform cursor-pointer group hover:bg-zinc-800"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <Gift className="w-4 h-4 text-cyan-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                </div>
                <div>
                  <span className="text-xs text-zinc-500">Services</span>
                  <p className="text-lg font-bold text-white">2 Active</p>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div>
              <h3 className="font-bold text-white mb-4 ml-1 uppercase text-xs tracking-wider opacity-60">History</h3>
              <div className="space-y-6">
                {Object.entries(groupedHistory).map(([date, items]) => (
                  <div key={date}>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2 ml-1">{date}</h4>
                    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
                      {items.map((item, idx) => (
                        <div key={item.id} className={`p-4 flex justify-between items-center ${idx !== items.length - 1 ? 'border-b border-zinc-800' : ''}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-400'}`}>
                              {item.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{item.title}</p>
                              <p className="text-xs text-zinc-500">{item.time} • {item.category}</p>
                            </div>
                          </div>
                          <span className={`font-bold text-sm ${item.type === 'income' ? 'text-green-500' : 'text-white'}`}>
                            {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {/* Loyalty Card */}
            <div
              onClick={() => onNavigate('loyalty')}
              className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-transform border border-yellow-500/30"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute -right-6 -bottom-6 text-white/20 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Gift className="w-40 h-40" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="bg-black/20 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider mb-2 inline-block border border-white/10">
                      {bonusAccount.level}
                    </span>
                    <h2 className="text-3xl font-black">{bonusAccount.balance} <span className="text-lg opacity-80 font-medium">pts</span></h2>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold opacity-90 mb-1.5">
                    <span>Cashback {bonusAccount.cashback}%</span>
                    <span>{bonusAccount.nextLevel - bonusAccount.balance} to Platinum</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-white h-1.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '35%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Block */}
            <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-cyan-500 mb-3 border border-zinc-700">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white mb-2">How to spend points?</h3>
              <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                Pay up to 30% of services and goods in the club. 1 point = 1 ruble.
              </p>
              <button
                onClick={() => onNavigate('loyalty')}
                className="px-6 py-2.5 bg-zinc-800 text-white rounded-xl text-sm font-bold hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                Rewards Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletScreen;
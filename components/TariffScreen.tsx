import React from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Snowflake,
  Check,
  Clock,
  Calendar,
  FileText,
  QrCode,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface TariffScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TariffScreen: React.FC<TariffScreenProps> = ({ onNavigate }) => {
  // MOCK STATE - In real app this comes from props or API
  // Change this to test status: 'active' | 'none' | 'expired'
  const status: 'active' | 'none' | 'expired' = 'active' as 'active' | 'none' | 'expired';
  const hasDebt = false; // Toggle to test debt view

  const tariff = {
    name: "Безлимит: Год",
    status: status,
    endDate: "12.03.2025",
    daysLeft: 184,
    freezeDaysTotal: 30,
    freezeDaysUsed: 5,
    features: [
      "Доступ в клуб 24/7",
      "Бассейн и SPA-зона",
      "Групповые программы",
      "5 Гостевых визитов",
      "Полотенце и халат"
    ]
  };

  const freezeProgress = (tariff.freezeDaysUsed / tariff.freezeDaysTotal) * 100;

  return (
    <div className="bg-zinc-950 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-zinc-900/80 backdrop-blur-md p-4 shadow-lg border-b border-zinc-800 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('profile')} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 transition-colors">
          <ArrowLeft className="w-6 h-6 text-zinc-300" />
        </button>
        <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">My Plan</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* DEBT ALERT */}
        {hasDebt && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="bg-red-500/20 p-2 rounded-full text-red-500 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-red-400 text-sm mb-1 uppercase tracking-wider">Access Restricted</h3>
              <p className="text-xs text-red-300/80 mb-3">You have an overdue payment. Please settle your debt to restore access.</p>
              <button
                onClick={() => onNavigate('invoice')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold active:scale-95 transition-transform shadow-lg shadow-red-900/20"
              >
                Pay 3 900 ₽
              </button>
            </div>
          </div>
        )}

        {/* LOGIC: NO TARIFF / EXPIRED */}
        {(status === 'none' || status === 'expired') && !hasDebt ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-700 mb-6 border border-zinc-800">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {status === 'expired' ? 'Plan Expired' : 'No Active Plan'}
            </h2>
            <p className="text-zinc-500 text-sm max-w-xs mb-8">
              Choose a training plan to get full access to club facilities.
            </p>
            <button
              onClick={() => onNavigate('service_catalog')}
              className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold shadow-[0_0_20px_rgba(8,145,178,0.3)] active:scale-95 transition-transform"
            >
              Choose Plan
            </button>
          </div>
        ) : (
          /* ACTIVE TARIFF VIEW */
          <>
            {/* Main Card */}
            <div className={`w-full aspect-[1.6] bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between group border border-zinc-800 ${hasDebt ? 'grayscale opacity-70' : ''}`}>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-600/20 rounded-full blur-[60px] -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/20 rounded-full blur-[40px] -ml-5 -mb-5"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${hasDebt ? 'bg-red-500' : 'bg-green-400'}`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {hasDebt ? 'Suspended' : 'Active'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tighter leading-none italic uppercase">{tariff.name}</h2>
                </div>
                <ShieldCheck className="w-8 h-8 text-zinc-600" />
              </div>

              <div className="relative z-10">
                <div className="flex gap-4 text-xs font-medium text-zinc-300 mb-4">
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" /> till {tariff.endDate}
                  </div>
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" /> {tariff.daysLeft} days
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('service_catalog')}
                    className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-zinc-200"
                  >
                    <Zap className="w-3.5 h-3.5" /> Extend
                  </button>
                  {!hasDebt && (
                    <button
                      onClick={() => onNavigate('qr_pass')}
                      className="w-12 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Freezing Section */}
            {!hasDebt && (
              <div className="bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Snowflake className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Freezing</h3>
                      <p className="text-xs text-zinc-500">Pause membership</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('freezing')}
                    className="text-xs font-bold bg-cyan-950/30 text-cyan-400 px-3 py-1.5 rounded-lg border border-cyan-900/50 hover:bg-cyan-900/50 transition-colors"
                  >
                    Manage
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-zinc-500">
                    <span>Used: {tariff.freezeDaysUsed}</span>
                    <span>Total: {tariff.freezeDaysTotal} days</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                      style={{ width: `${freezeProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Features List */}
            <div>
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3 ml-2">Included Features</h3>
              <div className="bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-800">
                <ul className="space-y-3">
                  {tariff.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-cyan-500" strokeWidth={3} />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Limits (Placeholder) */}
            <div className="bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-800 flex justify-between items-center text-sm">
              <span className="text-zinc-500">Guest Limit</span>
              <span className="font-bold text-white">2 of 5 visits</span>
            </div>

            {/* Contract Link */}
            <button
              onClick={() => onNavigate('document_view')}
              className="w-full bg-zinc-900 p-4 rounded-2xl shadow-sm border border-zinc-800 flex items-center justify-between group hover:bg-zinc-800 active:bg-zinc-800/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-zinc-800 p-2 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-white">Contract #1029384</span>
                  <span className="text-xs text-zinc-500">dated 12.03.2024</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TariffScreen;
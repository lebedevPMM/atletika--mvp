import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Monitor,
  User,
  ShieldAlert,
  FileText,
  ChevronRight,
  MessageSquare,
  Phone,
  Mail,
  Copy,
  Smartphone,
  AlertCircle
} from 'lucide-react';

interface TrainerSupportScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerSupportScreen: React.FC<TrainerSupportScreenProps> = ({ onNavigate }) => {
  const [showCopied, setShowCopied] = useState(false);

  // Mock Date
  const clubContacts = {
    reception: '+7 (495) 123-45-67',
    manager: '+7 (903) 999-88-77',
    managerName: 'Елена Смирнова'
  };

  const diagnostics = {
    appVersion: '1.0.0 (MVP)',
    build: '1045',
    os: 'iOS 17.2',
    device: 'iPhone 15 Pro',
    staffId: 'STF-2024-001',
    clubId: 'CLB-77-01'
  };

  const handleCopyDiagnostics = () => {
    // Mock copy to clipboard
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleCall = (number: string) => {
    alert(`Звонок на номер: ${number}`);
  };

  const handleEmail = () => {
    alert('Открытие почтового клиента: support@atletika.plus');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-6">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Поддержка</h1>
      </div>

      <div className="p-4 space-y-6">

        {/* 1. Club Contacts Section */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Контакты клуба</h2>

          {/* Urgent / Manager */}
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-4 items-start mb-3">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900 text-sm">Экстренная ситуация?</h3>
              <p className="text-xs text-red-800 mt-1 mb-3">
                Несчастный случай, конфликт или ЧП.
              </p>
              <button
                onClick={() => handleCall(clubContacts.manager)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform flex items-center gap-2"
              >
                <Phone className="w-3 h-3" />
                Позвонить управляющему
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleCall(clubContacts.reception)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 items-start active:bg-gray-50"
            >
              <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Phone className="w-4 h-4" /></div>
              <div>
                <span className="block font-bold text-gray-900 text-sm">Ресепшн</span>
                <span className="text-[10px] text-gray-500">{clubContacts.reception}</span>
              </div>
            </button>

            <button
              onClick={() => handleCall(clubContacts.manager)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 items-start active:bg-gray-50"
            >
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><User className="w-4 h-4" /></div>
              <div>
                <span className="block font-bold text-gray-900 text-sm">Менеджер</span>
                <span className="text-[10px] text-gray-500">{clubContacts.managerName}</span>
              </div>
            </button>
          </div>
        </section>

        {/* 2. Tech Support Section */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Техподдержка продукта</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={handleEmail}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 active:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Mail className="w-5 h-5" /></div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-gray-900">Email поддержка</span>
                  <span className="text-xs text-gray-500">Отвечаем в течение часа</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>

            <button className="w-full flex items-center justify-between p-4 active:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 text-sky-600 rounded-lg"><MessageSquare className="w-5 h-5" /></div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-gray-900">Чат в Telegram</span>
                  <span className="text-xs text-gray-500">Бот поддержки</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </section>

        {/* 3. Common Issues (FAQ) */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Частые проблемы</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: 'Не вижу расписание', icon: AlertCircle },
              { title: 'Клиент не найден', icon: User },
              { title: 'Ошибка списания', icon: FileText },
              { title: 'Как создать группу', icon: monitor }, // Note: using Monitor type, imported below
            ].map((item, idx) => (
              <button key={idx} className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-3 active:bg-gray-50 text-left">
                <div className="p-1.5 bg-gray-100 rounded-lg text-gray-500">
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs text-gray-700 leading-tight">{item.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Diagnostics */}
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 ml-2">Диагностика</h2>
          <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-y-3 mb-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Версия</p>
                <p className="text-xs font-mono text-gray-800">{diagnostics.appVersion}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Сборка</p>
                <p className="text-xs font-mono text-gray-800">{diagnostics.build}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Устройство</p>
                <p className="text-xs font-mono text-gray-800">{diagnostics.device}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">OS</p>
                <p className="text-xs font-mono text-gray-800">{diagnostics.os}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Staff ID</p>
                <p className="text-xs font-mono text-gray-800">{diagnostics.staffId}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Club ID</p>
                <p className="text-xs font-mono text-gray-800">{diagnostics.clubId}</p>
              </div>
            </div>

            <button
              onClick={handleCopyDiagnostics}
              className="w-full bg-white border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-bold text-gray-700 active:bg-gray-50 transition-colors"
            >
              {showCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {showCopied ? 'Скопировано' : 'Скопировать данные'}
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Приложите эти данные при обращении в поддержку
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

// Fix for icon usage in map
const monitor = Monitor;
const Check = ({ className }: { className?: string }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;


export default TrainerSupportScreen;
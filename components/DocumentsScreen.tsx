
import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { 
  ArrowLeft, 
  FileText, 
  ChevronRight, 
  Download, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Receipt, 
  Calendar, 
  AlertCircle, 
  FileCheck,
  ShieldCheck,
  Loader2,
  WifiOff,
  Filter
} from 'lucide-react';

interface DocumentsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

type GenStatus = 'idle' | 'generating' | 'ready' | 'error';

const DocumentsScreen: React.FC<DocumentsScreenProps> = ({ onNavigate }) => {
  const [activeGenStatus, setActiveGenStatus] = useState<GenStatus>('idle');
  const [genProgress, setGenProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false); // Mock offline state
  const [selectedMonth, setSelectedMonth] = useState('Сентябрь');

  // Club Documents (Static from Spec)
  const clubDocs = [
    { id: 1, title: 'Договор оферты', updatedAt: '12.01.2024', type: 'system' },
    { id: 2, title: 'Правила посещения', updatedAt: '01.09.2024', type: 'system' },
    { id: 3, title: 'Политика конфиденциальности', updatedAt: '20.08.2023', type: 'system' },
    { id: 4, title: 'Правила отмены и переносов', updatedAt: '15.02.2024', type: 'system' },
  ];

  // Financial Docs (Checks/Receipts)
  const financeDocs = [
    { id: 101, title: 'Абонемент "Безлимит 12"', amount: '45 000 ₽', date: '01.09.2024', type: 'receipt' },
    { id: 102, title: 'Персональная тренировка', amount: '2 500 ₽', date: '05.09.2024', type: 'receipt' },
    { id: 103, title: 'Спортивный массаж', amount: '3 500 ₽', date: '08.09.2024', type: 'receipt' },
  ];

  const handleGenerate = () => {
    if (isOffline) return;
    setActiveGenStatus('generating');
    setGenProgress(0);
    
    // Simulate generation progress for "large file" scenario from spec
    const interval = setInterval(() => {
      setGenProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveGenStatus('ready');
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-20 safe-area-top">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Справки и документы</h1>
        </div>
        {isOffline && <WifiOff className="w-5 h-5 text-red-400" />}
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-8 pb-12">
        
        {/* SECTION: CERTIFICATE GENERATION */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
             <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Заказ справок</h2>
             <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">PDF • TTL Link</span>
          </div>
          
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
             {activeGenStatus === 'idle' && (
               <div className="animate-in fade-in">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                       <FileCheck className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-bold text-gray-900">Справка о посещениях</h3>
                       <p className="text-xs text-gray-500 mt-1">Для компенсации от работодателя или налогового вычета.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                       <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Период</p>
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-bold">Янв 2024 — Сен 2024</span>
                             <Calendar className="w-4 h-4 text-gray-400" />
                          </div>
                       </div>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 leading-snug">
                      * Максимальный период генерации — 12 месяцев. Справка формируется автоматически на основе данных ваших чекинов.
                    </p>

                    <button 
                      onClick={handleGenerate}
                      disabled={isOffline}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Сформировать справку
                    </button>
                  </div>
               </div>
             )}

             {activeGenStatus === 'generating' && (
               <div className="py-8 flex flex-col items-center text-center animate-in zoom-in duration-300">
                  <div className="relative w-20 h-20 mb-4">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                        <circle cx="40" cy="40" r="36" stroke="#2563eb" strokeWidth="6" fill="none" 
                          strokeDasharray="226.2" strokeDashoffset={226.2 - (226.2 * genProgress / 100)} 
                          strokeLinecap="round" className="transition-all duration-300"
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                     </div>
                  </div>
                  <h3 className="font-bold text-gray-900">Идет генерация PDF</h3>
                  <p className="text-xs text-gray-500 mt-1">Подготавливаем данные о посещениях... {genProgress}%</p>
               </div>
             )}

             {activeGenStatus === 'ready' && (
               <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 bg-green-50 p-4 rounded-2xl border border-green-100 mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
                    <div>
                      <h3 className="font-bold text-green-900 text-sm">Справка готова!</h3>
                      <p className="text-[10px] text-green-700 uppercase font-bold mt-0.5">Ссылка активна 24 часа</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => alert('Загрузка справки...')}
                      className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Download className="w-5 h-5" /> Скачать (PDF, 1.2 MB)
                    </button>
                    <button 
                      onClick={() => setActiveGenStatus('idle')}
                      className="w-full py-2 text-xs font-bold text-gray-400"
                    >
                      Создать новую справку
                    </button>
                  </div>
               </div>
             )}
          </div>
        </section>

        {/* SECTION: FINANCIAL DOCUMENTS */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
             <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Финансы</h2>
             <div className="flex items-center gap-1.5 text-blue-600">
               <button 
                 onClick={() => setSelectedMonth('Август')}
                 className="text-[10px] font-bold bg-white border border-gray-100 px-2 py-0.5 rounded shadow-sm flex items-center gap-1"
               >
                 <Filter className="w-2.5 h-2.5" /> Сентябрь
               </button>
             </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {financeDocs.map((doc) => (
              <button 
                key={doc.id}
                onClick={() => onNavigate('document_view')}
                className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{doc.title}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{doc.date} • {doc.amount}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-black uppercase">Чек</span>
                   <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 px-2 text-center">
            Чеки за более ранние периоды доступны в разделе <span className="font-bold text-blue-600 underline" onClick={() => onNavigate('invoice')}>История оплат</span>
          </p>
        </section>

        {/* SECTION: CLUB DOCUMENTS */}
        <section>
          <div className="flex justify-between items-center mb-3 px-1">
             <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">Документы клуба</h2>
          </div>
          
          <div className="space-y-2">
            {clubDocs.map((doc) => (
              <button 
                key={doc.id}
                onClick={() => onNavigate('document_view')}
                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group active:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-gray-900">{doc.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Обновлено {doc.updatedAt}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </section>

        {/* SECURITY FOOTER */}
        <div className="flex flex-col items-center gap-4 pt-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" /> Доступ ограничен (SSL + Auth)
           </div>
           <p className="text-[11px] text-gray-400 text-center max-w-[240px] leading-relaxed px-4">
             Персональные документы требуют авторизации. Копии отправляются на ваш проверенный email.
           </p>
           <button 
             onClick={() => onNavigate('support')}
             className="text-xs font-bold text-blue-600 hover:underline"
           >
             Не нашли нужный документ? Напишите нам
           </button>
        </div>

      </div>
    </div>
  );
};

export default DocumentsScreen;

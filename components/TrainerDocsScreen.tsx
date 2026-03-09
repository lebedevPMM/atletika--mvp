import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, FileText, Download, Shield } from 'lucide-react';

interface TrainerDocsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerDocsScreen: React.FC<TrainerDocsScreenProps> = ({ onNavigate }) => {
  const docs = [
    { id: 1, title: 'Трудовой договор', type: 'PDF', size: '2.4 MB', required: false },
    { id: 2, title: 'Инструкция по технике безопасности', type: 'PDF', size: '1.1 MB', required: true },
    { id: 3, title: 'Регламент проведения ПТ', type: 'DOCX', size: '0.5 MB', required: true },
    { id: 4, title: 'График отпусков 2024', type: 'XLS', size: '0.8 MB', required: false },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Документы</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-3">
           <Shield className="w-10 h-10 text-blue-600 bg-blue-50 rounded-full p-2 shrink-0" />
           <div>
             <h3 className="font-bold text-sm text-gray-900">Обязательно к ознакомлению</h3>
             <p className="text-xs text-gray-500 mt-1">Пожалуйста, изучите документы с пометкой "Важно".</p>
           </div>
        </div>

        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                   <FileText className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                     {doc.title}
                     {doc.required && <span className="w-2 h-2 bg-red-500 rounded-full" title="Required"></span>}
                   </h4>
                   <p className="text-xs text-gray-400 uppercase">{doc.type} • {doc.size}</p>
                 </div>
               </div>
               <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                 <Download className="w-5 h-5" />
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerDocsScreen;
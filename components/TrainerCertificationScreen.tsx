import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Award, CheckCircle2, UploadCloud, Calendar, Clock } from 'lucide-react';

interface TrainerCertificationScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerCertificationScreen: React.FC<TrainerCertificationScreenProps> = ({ onNavigate }) => {
  const certs = [
    { id: 1, title: 'Персональный тренер FPA', issuer: 'FPA', date: 'Выдан 12.05.2022', status: 'verified' },
    { id: 2, title: 'Нутрициология. Базовый курс', issuer: 'Skillbox', date: 'Выдан 10.09.2023', status: 'verified' },
    { id: 3, title: 'Миофасциальный релиз', issuer: 'Fitness Expert', date: 'Загружен вчера', status: 'pending' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Мои сертификаты</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
             <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
               <Award className="w-8 h-8 text-gray-400" />
             </div>
             <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
               <div>
                 <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{cert.title}</h3>
                 <p className="text-xs text-gray-500">{cert.issuer}</p>
               </div>
               
               <div className="flex justify-between items-end">
                 <p className="text-[10px] text-gray-400">{cert.date}</p>
                 {cert.status === 'verified' ? (
                   <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                     <CheckCircle2 className="w-3 h-3" /> Подтвержден
                   </span>
                 ) : (
                   <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                     <Clock className="w-3 h-3" /> Проверка
                   </span>
                 )}
               </div>
             </div>
          </div>
        ))}

        <button className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors bg-white">
           <UploadCloud className="w-8 h-8" />
           <span className="text-sm font-medium">Загрузить новый сертификат</span>
           <span className="text-[10px]">JPG, PNG или PDF до 5 Мб</span>
        </button>
      </div>
    </div>
  );
};

export default TrainerCertificationScreen;
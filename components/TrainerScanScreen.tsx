import React, { useState } from 'react';
import { ScreenName } from '../types';
import { X, Camera, Zap, CheckCircle2, User } from 'lucide-react';

interface TrainerScanScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const TrainerScanScreen: React.FC<TrainerScanScreenProps> = ({ onNavigate }) => {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<any>(null);

  const simulateScan = () => {
    setScanning(false);
    setTimeout(() => {
      setResult({
        name: 'Мария Иванова',
        service: 'Персональная тренировка',
        time: '19:00',
        valid: true
      });
    }, 500);
  };

  if (result) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-1">{result.name}</h2>
        <p className="text-green-400 font-bold mb-6 text-lg">Доступ разрешен</p>
        
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm mb-8">
           <div className="flex items-center gap-3 mb-4 text-left">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Клиент</p>
                <p className="font-bold">{result.name}</p>
              </div>
           </div>
           <div className="border-t border-gray-700 pt-4 text-left">
              <p className="text-sm text-gray-400 mb-1">Услуга</p>
              <p className="font-bold text-lg">{result.service}</p>
              <p className="text-sm text-gray-500">{result.time}</p>
           </div>
        </div>

        <button 
          onClick={() => onNavigate('trainer_home')}
          className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold"
        >
          Готово
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col safe-area-top safe-area-bottom">
      {/* Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <button onClick={() => onNavigate('trainer_home')} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
          <X className="w-6 h-6" />
        </button>
        <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
          Сканирование...
        </div>
        <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white">
          <Zap className="w-6 h-6" />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
         {/* Mock Camera Feed */}
         <div className="absolute inset-0 bg-gray-800">
            <div className="w-full h-full opacity-30 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000')] bg-cover bg-center"></div>
         </div>

         {/* Scan Frame */}
         <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative">
               <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
               <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
               <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
               <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
               
               {/* Scanning Line */}
               <div className="absolute top-0 left-4 right-4 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-scan"></div>
            </div>
         </div>

         <div className="absolute bottom-20 left-0 right-0 text-center">
            <p className="text-white/80 text-sm mb-6">Наведите камеру на QR-код клиента</p>
            <button 
              onClick={simulateScan}
              className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
            >
              Симулировать скан
            </button>
         </div>
      </div>
    </div>
  );
};

export default TrainerScanScreen;
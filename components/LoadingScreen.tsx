
import React, { useEffect, useState } from 'react';
import { ScreenName } from '../types';
import { Loader2, AlertCircle, WifiOff, RefreshCw } from 'lucide-react';

interface LoadingScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'loading' | 'error' | 'offline'>('loading');
  const [message, setMessage] = useState('Загружаем данные клуба...');
  const [longLoading, setLongLoading] = useState(false);
  const [debugClicks, setDebugClicks] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  // Simulation Logic
  useEffect(() => {
    let mounted = true;

    // Long loading hint timer (6s rule from spec)
    const longTimer = setTimeout(() => {
      if (mounted && status === 'loading') setLongLoading(true);
    }, 6000);

    const loadData = async () => {
      try {
        if (!mounted) return;

        // Instant Transition
        const hasSeenIntro = localStorage.getItem('hasSeenIntro');
        if (hasSeenIntro) {
          onNavigate('login');
        } else {
          onNavigate('intro');
        }
      } catch (e) {
        if (mounted) setStatus('error');
      }
    };

    loadData();

    return () => {
      mounted = false;
      clearTimeout(longTimer);
    };
  }, [onNavigate, status]); // Added status to deps to allow retry logic to work if it resets status

  const handleRetry = () => {
    setStatus('loading');
    setLongLoading(false);
    setMessage('Повторная попытка...');
    // In a real app, this would re-trigger the data fetching function
  };

  const handleDebugTap = () => {
    setDebugClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) setShowDebug(true);
      return newCount;
    });
  };

  return (
    <div className="bg-blue-600 min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="z-10 flex flex-col items-center w-full max-w-xs px-6 animate-in fade-in zoom-in duration-700">

        {/* Logo */}
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-8">
          <span className="text-4xl font-extrabold text-blue-600 tracking-tighter">A+</span>
        </div>

        <h1 className="text-3xl font-bold mb-2 tracking-tight">Atletika+</h1>

        {/* State: Loading */}
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 mt-8 w-full min-h-[80px]">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-white/90" />
            </div>
            <p className="text-sm font-medium text-blue-100/80 text-center animate-pulse">
              {message}
            </p>

            {longLoading && (
              <div className="text-xs text-white/80 mt-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm text-center animate-in slide-in-from-bottom-2">
                Загрузка дольше обычного.<br />Проверьте интернет.
              </div>
            )}
          </div>
        )}

        {/* State: Error */}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 mt-8 w-full animate-in slide-in-from-bottom-4">
            <div className="bg-red-500/20 p-4 rounded-full backdrop-blur-sm">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium text-white text-center">
              Не удалось загрузить данные клуба
            </p>
            <button
              onClick={handleRetry}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Повторить
            </button>
          </div>
        )}

        {/* State: Offline (Mock trigger) */}
        {status === 'offline' && (
          <div className="flex flex-col items-center gap-4 mt-8 w-full animate-in slide-in-from-bottom-4">
            <div className="bg-white/10 p-4 rounded-full backdrop-blur-sm">
              <WifiOff className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium text-white/80">Нет сети</p>
            <button
              onClick={handleRetry}
              className="text-sm font-bold bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
            >
              Обновить
            </button>
          </div>
        )}

      </div>

      {/* Footer / Debug Area */}
      <div className="absolute bottom-8 w-full flex flex-col items-center gap-2 z-20">
        <button
          onClick={handleDebugTap}
          className="text-[10px] text-blue-200/40 font-mono active:text-white transition-colors"
        >
          v1.0.0 (MVP Build)
        </button>

        {showDebug && (
          <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl text-[10px] font-mono text-green-400 absolute bottom-12 border border-white/10 w-64 shadow-2xl animate-in slide-in-from-bottom-10">
            <p className="text-white font-bold mb-2 border-b border-white/20 pb-1">Diagnostics</p>
            <div className="space-y-1">
              <p>ENV: Production</p>
              <p>ClubID: 1 (Moscow City)</p>
              <p>API: https://api.atletika.plus</p>
              <p>Timezone: Europe/Moscow</p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/20 flex justify-between">
              <button onClick={() => setStatus('error')} className="text-red-400 hover:text-red-300">Force Error</button>
              <button onClick={() => setShowDebug(false)} className="text-white underline">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;


import React, { useState } from 'react';
import { ScreenName } from '../types';
import { useTheme } from './ThemeContext';
import { ArrowLeft, Phone, ArrowRight, Loader2, Lock, ShieldCheck } from 'lucide-react';

interface AuthScreenProps {
  onNavigate: (screen: ScreenName) => void;
  initialStep?: 'phone' | 'otp';
  mode?: 'login' | 'register';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, initialStep = 'phone', mode = 'login' }) => {
  const [step, setStep] = useState<'phone' | 'otp'>(initialStep);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    // Simulate API
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length < 4) return;

    setIsLoading(true);
    // Simulate API
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'register') {
        onNavigate('offer_accept');
      } else {
        onNavigate('home'); // or club_select
      }
    }, 1000);
  };

  const handleSocialLogin = (provider: 'google' | 'apple') => {
    setIsLoading(true);
    // Simulate Social Auth API
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('home');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 safe-area-top">
        <button
          onClick={() => step === 'otp' ? setStep('phone') : onNavigate('intro')}
          className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 flex items-center justify-center shadow-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-zinc-300" />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6">
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">

          <div className="mb-8">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg border outline outline-4 outline-offset-4 ${step === 'phone'
                ? 'bg-cyan-600 dark:bg-cyan-600 text-white border-cyan-500/30 outline-cyan-100 dark:outline-cyan-900/30'
                : 'bg-green-500 dark:bg-green-600 text-white border-green-500/30 outline-green-100 dark:outline-green-900/30'
              }`}>
              {step === 'phone' ? <Phone className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
            </div>

            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
              {step === 'phone' ? (mode === 'register' ? 'Регистрация' : 'Вход') : 'Код из СМС'}
            </h1>
            <p className="text-gray-500 dark:text-zinc-500 text-sm leading-relaxed font-medium">
              {step === 'phone'
                ? 'Введите ваш номер телефона для доступа к аккаунту.'
                : `Мы отправили код на номер ${phone}.`
              }
            </p>
          </div>

          <form onSubmit={step === 'phone' ? handleSendCode : handleVerify} className="space-y-6">

            {step === 'phone' ? (
              <div className="space-y-4">
                <input
                  type="tel"
                  placeholder="+7 (999) 000-00-00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl p-4 text-xl font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-zinc-700 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-600 focus:ring-4 focus:ring-cyan-500/10 transition-all text-center tracking-widest"
                  autoFocus
                />
              </div>
            ) : (
              <div className="flex gap-3 justify-center">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[i] = e.target.value;
                      setOtp(newOtp);
                      if (e.target.value && i < 3) {
                        const nextInput = document.getElementById(`otp-${i + 1}`);
                        nextInput?.focus();
                      }
                    }}
                    id={`otp-${i}`}
                    className="w-14 h-16 bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl text-2xl font-bold text-center text-gray-900 dark:text-white focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-600 focus:scale-110 transition-all caret-cyan-500"
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (step === 'phone' ? phone.length < 5 : otp.join('').length < 4)}
              className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:shadow-none hover:bg-cyan-500 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {step === 'phone' ? 'Получить код' : 'Продолжить'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Social Logins */}
          {step === 'phone' && (
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-zinc-500 font-medium">Или войдите через</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      className="text-[#4285F4]"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      className="text-[#34A853]"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                      className="text-[#FBBC05]"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      className="text-[#EA4335]"
                    />
                  </svg>
                  <span className="ml-2 font-bold text-gray-700 dark:text-white">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('apple')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-3 bg-black dark:bg-white border border-transparent dark:border-zinc-200 rounded-xl hover:opacity-80 transition-opacity shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  <svg className="w-5 h-5 text-white dark:text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.69-.93.95 0 1.95.4 2.52 1.04-.63.45-1.57 1.07-1.6 2.62-.02 2.07 1.76 3.03 1.83 3.09-.01.03-.45 1.5-1.52 3.41zM14.51 5.08c-.28-1.5-1.58-2.9-3.03-3.08-.34 1.54.91 3.05 3.03 3.08z" />
                  </svg>
                  <span className="ml-2 font-bold text-white dark:text-black">Apple</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Text */}
        <div className="p-6 text-center">
          <p className="text-xs text-gray-400 dark:text-zinc-600 font-medium">
            Продолжая, вы соглашаетесь с <button className="text-cyan-600 dark:text-cyan-500 hover:underline">Правилами клуба</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

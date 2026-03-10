
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Camera, Mail, Phone, User, Save, CheckCircle2, Loader2, Calendar, Heart, Shield, WifiOff, Edit3 } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ProfileEditScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // Mock offline state

  const [form, setForm] = useState({
    name: 'Alexander Ivanov',
    phone: '+7 (999) 123-45-67',
    email: 'alex.ivanov@example.com',
    dob: '1990-05-12',
    emergencyContact: '+7 (999) 000-00-00'
  });

  const handleSave = () => {
    if (isOffline) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onNavigate('profile');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-950 min-h-screen flex flex-col transition-colors duration-300">
      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-red-500/20 text-red-700 dark:text-red-200 px-4 py-3 flex items-center gap-3 text-sm font-bold sticky top-0 z-20 border-b border-red-500/20 backdrop-blur-md">
          <WifiOff className="w-4 h-4" />
          <span className="opacity-90">Нет соединения. Сохранение недоступно.</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 shadow-sm dark:shadow- lg border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-zinc-300" />
          </button>
          <h1 className="text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter">Редактировать</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || isOffline}
          className="text-cyan-600 dark:text-cyan-500 font-bold text-sm flex items-center gap-1 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Сохранение...' : 'Готово'}
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-8 mt-4">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden ring-2 ring-gray-100 dark:ring-zinc-800">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <button className="absolute bottom-0 right-0 p-2.5 bg-cyan-600 rounded-full text-white shadow-md active:scale-90 transition-transform border-4 border-white dark:border-zinc-950 hover:bg-cyan-500">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-cyan-600 dark:text-cyan-500 font-bold mt-3 uppercase tracking-wide">Изменить фото</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Personal Info */}
          <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase ml-2 tracking-wider">Личные данные</h2>

          <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm focus-within:border-cyan-500/50 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase ml-3 mt-1 block">ФИО</label>
            <div className="flex items-center gap-3 px-3 pb-2">
              <User className="w-5 h-5 text-gray-400 dark:text-zinc-600" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="flex-1 font-bold text-gray-900 dark:text-white text-base focus:outline-none placeholder-gray-400 dark:placeholder-zinc-700 bg-transparent"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm focus-within:border-cyan-500/50 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase ml-3 mt-1 block">Дата рождения</label>
            <div className="flex items-center gap-3 px-3 pb-2">
              <Calendar className="w-5 h-5 text-gray-400 dark:text-zinc-600" />
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="flex-1 font-bold text-gray-900 dark:text-white text-base focus:outline-none placeholder-gray-400 dark:placeholder-zinc-700 bg-transparent [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {/* Contact Info */}
          <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase ml-2 mt-6 tracking-wider">Контакты</h2>

          <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase ml-3 mt-1 block">Телефон</label>
            <div className="flex items-center gap-3 px-3 pb-2">
              <Phone className="w-5 h-5 text-gray-400 dark:text-zinc-600" />
              <input
                type="tel"
                value={form.phone}
                readOnly
                className="flex-1 font-bold text-gray-500 dark:text-zinc-500 text-base focus:outline-none bg-transparent cursor-not-allowed"
              />
              <button
                onClick={() => alert('Смена телефона доступна через SMS-подтверждение (MVP2)')}
                className="text-cyan-600 dark:text-cyan-500 font-bold text-xs bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/30 px-2 py-1 rounded-md hover:bg-cyan-100 dark:hover:bg-cyan-900/50"
              >
                Изменить
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm focus-within:border-cyan-500/50 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase ml-3 mt-1 block">Эл. почта</label>
            <div className="flex items-center gap-3 px-3 pb-2">
              <Mail className="w-5 h-5 text-gray-400 dark:text-zinc-600" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="flex-1 font-bold text-gray-900 dark:text-white text-base focus:outline-none placeholder-gray-400 dark:placeholder-zinc-700 bg-transparent"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase ml-2 mt-6 tracking-wider">Безопасность</h2>

          <div className="bg-red-50 dark:bg-red-950/10 p-2 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm focus-within:border-red-500/50 transition-colors">
            <label className="text-[10px] font-bold text-red-600/70 dark:text-red-400/70 uppercase ml-3 mt-1 block">Экстренный контакт</label>
            <div className="flex items-center gap-3 px-3 pb-2">
              <Heart className="w-5 h-5 text-red-500/70" />
              <input
                type="tel"
                value={form.emergencyContact}
                onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                placeholder="+7 (000) 000-00-00"
                className="flex-1 font-bold text-gray-900 dark:text-white text-base focus:outline-none placeholder-red-900/30 dark:placeholder-red-900/50 bg-transparent"
              />
            </div>
          </div>

          {/* Privacy & Consents Link */}
          <h2 className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase ml-2 mt-6 tracking-wider">Конфиденциальность</h2>

          <button
            onClick={() => onNavigate('privacy_settings')}
            className="w-full bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between active:bg-gray-50 dark:active:bg-zinc-800 transition-colors hover:border-gray-300 dark:hover:border-zinc-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Управление данными</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-0.5">Согласия, рассылки и удаление</p>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-medium text-gray-500 dark:text-zinc-400 border border-gray-200 dark:border-zinc-700">
              Настроить
            </div>
          </button>
        </div>

        <p className="text-xs text-gray-500 dark:text-zinc-600 text-center mt-8 px-8 leading-relaxed mb-4">
          Нажимая «Готово», вы соглашаетесь на обработку обновлённых персональных данных.
        </p>
      </div>

      {/* Success Overlay */}
      {isSaved && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-2xl flex flex-col items-center scale-110 border border-gray-100 dark:border-zinc-800">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 text-green-500 border border-green-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Сохранено!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditScreen;

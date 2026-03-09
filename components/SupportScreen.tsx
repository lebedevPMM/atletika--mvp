import React, { useState } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  MessageSquare,
  Phone,
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
  Send,
  Paperclip,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SupportScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onNavigate }) => {
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Ticket Form State
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const faqs = [
    { id: 1, cat: 'finance', q: 'Как заморозить абонемент?', a: 'Вы можете заморозить абонемент в разделе "Мой тариф" или обратившись на ресепшн. Минимальный срок заморозки — 7 дней.' },
    { id: 2, cat: 'train', q: 'Как записаться на персональную тренировку?', a: 'Перейдите в раздел "Запись", выберите "Персональные", найдите нужного тренера и свободный слот.' },
    { id: 3, cat: 'club', q: 'Забыл вещи в шкафчике, что делать?', a: 'Все забытые вещи хранятся на ресепшн в течение 30 дней. Позвоните нам или напишите в чат.' },
    { id: 4, cat: 'club', q: 'Можно ли привести гостя?', a: 'Да, если ваш тариф включает гостевые визиты. Оформить пропуск можно в разделе "Профиль" -> "Гостевой визит".' },
  ];

  const filteredFaqs = faqs.filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    // Mock API call
    setTimeout(() => {
      setIsSending(false);
      setShowSuccess(true);
      setMessage('');
      setTopic('general');
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Search Header */}
      <div className="bg-blue-600 pt-12 pb-8 px-6 text-white relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-xl font-bold">Помощь</h1>
          </div>

          <h2 className="text-2xl font-extrabold mb-4">Чем мы можем<br />вам помочь?</h2>

          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по вопросам..."
              className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-100 focus:outline-none focus:bg-white/30 transition-all font-medium"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-blue-100" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 -mt-4 relative z-10 overflow-y-auto pb-24 space-y-6">

        {/* Contact Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Связаться с нами</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('chat_list')}
              className="flex flex-col items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-xl active:bg-blue-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-[10px] font-bold">Чат</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl active:bg-green-100 transition-colors">
              <Phone className="w-5 h-5" />
              <span className="text-[10px] font-bold">Звонок</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl active:bg-purple-100 transition-colors">
              <Mail className="w-5 h-5" />
              <span className="text-[10px] font-bold">Email</span>
            </button>
          </div>
        </div>

        {/* Ticket Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative overflow-hidden">
          {showSuccess && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6 animate-in fade-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Сообщение отправлено</h3>
              <p className="text-sm text-gray-500">Мы ответим вам в течение 24 часов.</p>
            </div>
          )}

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Написать обращение</h3>
          <form onSubmit={handleSendTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Тема обращения</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
              >
                <option value="general">Общий вопрос</option>
                <option value="booking">Запись на тренировку</option>
                <option value="payment">Оплата и счета</option>
                <option value="tech">Техническая проблема</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Сообщение</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Опишите вашу проблему..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors p-2 -ml-2">
                <Paperclip className="w-5 h-5" />
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isSending}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-lg"
              >
                {isSending ? 'Отправка...' : 'Отправить'}
                {!isSending && <Send className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        {/* FAQ List */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Частые вопросы</h2>
          <div className="space-y-3">
            {filteredFaqs.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all">
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full flex justify-between items-center p-4 text-left active:bg-gray-50"
                >
                  <span className="font-bold text-sm text-gray-800 pr-4">{item.q}</span>
                  {openFaqId === item.id ? (
                    <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                  )}
                </button>
                {openFaqId === item.id && (
                  <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50/50 leading-relaxed animate-in slide-in-from-top-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Ничего не найдено. Попробуйте другой запрос или напишите в чат.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SupportScreen;
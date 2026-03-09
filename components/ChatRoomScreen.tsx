
import React, { useState, useEffect, useRef } from 'react';
import { ScreenName } from '../types';
import {
  ArrowLeft,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Check,
  CheckCheck,
  Smile,
  Calendar,
  AlertCircle,
  UserPlus,
  Clock
} from 'lucide-react';

interface ChatRoomScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

interface Message {
  id: number;
  text: string;
  type: 'text' | 'system';
  sender?: 'me' | 'other';
  time?: string;
  status?: 'sending' | 'sent' | 'read' | 'error';
  date?: string;
  systemType?: 'reschedule' | 'checkpoint' | 'info';
}

const ChatRoomScreen: React.FC<ChatRoomScreenProps> = ({ onNavigate }) => {
  // DEV STATE: Toggle to test "No Trainer" state
  const [hasTrainer, setHasTrainer] = useState(true);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'system',
      text: 'Тренировка «Силовая» перенесена на 14.09 18:00',
      date: 'Вчера',
      systemType: 'reschedule'
    },
    {
      id: 2,
      type: 'text',
      text: 'Алексей, привет! Я увидела перенос. А почему перенесли?',
      sender: 'me',
      time: '10:00',
      status: 'read',
      date: 'Вчера'
    },
    {
      id: 3,
      type: 'text',
      text: 'Привет, Мария! Зал занят под мероприятие. 14-го числа будет свободнее, сможем лучше поработать с весами.',
      sender: 'other',
      time: '10:15',
      status: 'read',
      date: 'Вчера'
    },
    {
      id: 4,
      type: 'system',
      text: 'Назначена контрольная точка: Замеры',
      date: 'Сегодня',
      systemType: 'checkpoint'
    },
    {
      id: 5,
      type: 'text',
      text: 'Поняла, спасибо. Замеры сделаю утром натощак.',
      sender: 'me',
      time: '09:30',
      status: 'read',
      date: 'Сегодня'
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickTopics = ['Болит мышца 🤕', 'Перенос занятия 📅', 'Питание 🥗', 'Опоздаю ⏰'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, hasTrainer]);

  const handleSend = (text: string = inputText) => {
    if (text.trim() === '') return;

    const newMessage: Message = {
      id: Date.now(),
      type: 'text',
      text: text,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sending',
      date: 'Сегодня'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate sending delay
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'sent' } : m));
    }, 1000);

    // Simulate Trainer Response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply: Message = {
          id: Date.now() + 1,
          type: 'text',
          text: 'Принято, спасибо за информацию! 👍',
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
          date: 'Сегодня'
        };
        setMessages(prev => prev.map(m => m.id === newMessage.id ? { ...m, status: 'read' as const } : m).concat(reply));
      }, 2000);
    }, 1500);
  };

  // Helper to determine border radius
  const getBubbleClass = (msg: Message, index: number) => {
    const isMe = msg.sender === 'me';
    // Simplified logic: rounded corners
    return isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm';
  };

  const renderSystemMessage = (msg: Message) => (
    <div className="flex justify-center my-4 w-full px-4">
      <div className="bg-gray-200/60 text-gray-600 text-[11px] font-medium px-4 py-1.5 rounded-full flex items-center gap-2 max-w-full text-center shadow-sm border border-white/50">
        {msg.systemType === 'reschedule' && <Calendar className="w-3 h-3 shrink-0 text-blue-600" />}
        {msg.systemType === 'checkpoint' && <AlertCircle className="w-3 h-3 shrink-0 text-orange-600" />}
        <span>{msg.text}</span>
      </div>
    </div>
  );

  // --- NO TRAINER STATE ---
  if (!hasTrainer) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Чат с тренером</h1>

          {/* DEV TOGGLE */}
          <button onClick={() => setHasTrainer(true)} className="ml-auto text-[10px] bg-gray-200 px-2 py-1 rounded">Dev: Link</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
            <UserPlus className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Тренер не назначен</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
            Чтобы начать общение и получать персональные рекомендации, выберите тренера или обратитесь к менеджеру.
          </p>
          <div className="w-full space-y-3 max-w-xs">
            <button
              onClick={() => onNavigate('club_team')}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform"
            >
              Выбрать тренера
            </button>
            <button
              onClick={() => onNavigate('support')}
              className="w-full bg-white border border-gray-200 text-gray-900 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Написать в поддержку
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 flex flex-col h-screen relative">

      {/* Header */}
      <div className="bg-white p-3 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Profile Click Area */}
          <div
            onClick={() => onNavigate('trainer_about')}
            className="flex items-center gap-3 cursor-pointer active:opacity-70 transition-opacity"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">Алексей Смирнов</h2>
              <p className="text-[10px] text-gray-500 font-medium">
                {isTyping ? <span className="text-blue-600 animate-pulse">печатает...</span> : 'Отвечает в рабочие часы'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>

          {/* DEV TOGGLE */}
          <button onClick={() => setHasTrainer(false)} className="p-2 text-gray-300 hover:text-red-500">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] pb-4">
        {messages.map((msg, index) => (
          <React.Fragment key={msg.id}>
            {/* Date Separator */}
            {(index === 0 || messages[index - 1].date !== msg.date) && (
              <div className="flex justify-center my-4 sticky top-0 z-10">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-200/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-white/50">
                  {msg.date}
                </span>
              </div>
            )}

            {/* System Message */}
            {msg.type === 'system' ? (
              renderSystemMessage(msg)
            ) : (
              /* Text Message */
              <div className={`flex w-full mb-2 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2.5 text-sm shadow-sm relative leading-relaxed ${getBubbleClass(msg, index)} ${msg.sender === 'me'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-100'
                    }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-medium opacity-70 ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {msg.time}
                    {msg.sender === 'me' && (
                      msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> :
                        msg.status === 'sending' ? <Clock className="w-3 h-3" /> :
                          msg.status === 'error' ? <AlertCircle className="w-3 h-3 text-red-300" /> : <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {isTyping && (
          <div className="flex justify-start mb-2 animate-in slide-in-from-left-2 fade-in">
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex gap-1 border border-gray-100">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white pb-6 pt-2 border-t border-gray-200 safe-area-bottom z-30">
        {/* Quick Topics / Smart Replies */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 px-3">
          {quickTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSend(topic)}
              className="whitespace-nowrap px-3 py-1.5 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl text-xs font-bold border border-gray-200 transition-colors active:scale-95"
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 px-3">
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Paperclip className="w-6 h-6" />
          </button>

          <div className="flex-1 bg-gray-100 rounded-[20px] flex items-center pr-1 border border-transparent focus-within:border-blue-500/50 focus-within:bg-white transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Напишите вопрос тренеру..."
              className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 py-3 px-4 focus:outline-none max-h-32 resize-none text-sm font-medium"
              rows={1}
            />
            {inputText.trim() ? (
              <button
                onClick={() => handleSend()}
                className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 active:scale-90 transition-all animate-in zoom-in duration-200 m-1"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors m-1">
                <Smile className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomScreen;

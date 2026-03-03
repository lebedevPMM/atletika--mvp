import React from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, FileText } from 'lucide-react';

interface AuthPrivacyScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const AuthPrivacyScreen: React.FC<AuthPrivacyScreenProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
        <button onClick={() => onNavigate('auth_phone')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Политика конфиденциальности</h1>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        <div className="prose prose-sm text-gray-600">
          <p className="font-medium text-gray-900">Последнее обновление: 1 Сентября 2024</p>
          
          <h3>1. Общие положения</h3>
          <p>
            Настоящая Политика конфиденциальности описывает, как ООО "Атлетика Плюс" (далее — "Мы", "Клуб") 
            собирает, использует и раскрывает вашу информацию при использовании нашего мобильного приложения.
          </p>

          <h3>2. Сбор данных</h3>
          <p>
            Мы собираем следующие типы данных:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Личные данные (Имя, Телефон, Email)</li>
              <li>Биометрические данные (Рост, Вес, Пол) — только с вашего согласия</li>
              <li>Данные о местоположении — для функций check-in</li>
              <li>Платежные данные — обрабатываются сторонним провайдером</li>
            </ul>
          </p>

          <h3>3. Использование данных</h3>
          <p>
            Ваши данные используются для:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Предоставления доступа в клуб (QR-код)</li>
              <li>Составления персональных планов тренировок</li>
              <li>Обработки записей и платежей</li>
              <li>Улучшения качества обслуживания</li>
            </ul>
          </p>

          <h3>4. Безопасность</h3>
          <p>
            Мы принимаем все необходимые меры для защиты ваших данных от несанкционированного доступа. 
            Все платежи проходят через защищенный шлюз.
          </p>

          <h3>5. Ваши права</h3>
          <p>
            Вы имеете право запросить удаление ваших данных или выгрузку архива с информацией, 
            которую мы храним о вас. Для этого обратитесь в службу поддержки.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 mt-8">
           <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
           <div className="text-xs text-gray-500">
             Полный текст юридического соглашения доступен на нашем сайте <span className="text-blue-600 underline">atletika.plus/legal</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPrivacyScreen;
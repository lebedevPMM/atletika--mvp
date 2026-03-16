import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft } from 'lucide-react';

interface CheckupScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const commonContraindications = [
  'Сердечно-сосудистые заболевания',
  'Сколиоз',
  'Грыжа позвоночника',
  'Астма',
  'Диабет',
  'Гипертония',
  'Варикоз',
  'Беременность',
  'Эпилепсия',
];

const stepTitles = [
  'Противопоказания и травмы',
  'Аллергии и лекарства',
  'Видимость и согласие',
];

const CheckupScreen: React.FC<CheckupScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [injuriesText, setInjuriesText] = useState('');
  const [allergies, setAllergies] = useState('');
  const [meds, setMeds] = useState('');
  const [limits, setLimits] = useState('');
  const [showTrainer, setShowTrainer] = useState(true);
  const [showMethodist, setShowMethodist] = useState(true);
  const [consent, setConsent] = useState(false);

  const toggleContraindication = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const handleSubmit = () => {
    // In real app, this would save to API. For now, just navigate back.
    onNavigate('BACK');
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : onNavigate('BACK'))}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Анкета здоровья</h1>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 px-4 py-3">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full ${
              s <= step ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step label */}
      <div className="px-4 mb-4">
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
          Шаг {step} из 3
        </p>
        <p className="text-sm font-bold text-gray-900">{stepTitles[step - 1]}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-4 pb-28">
        {step === 1 && (
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Противопоказания</h3>
              <p className="text-xs text-gray-500 mb-4">
                Отметьте, если у вас есть что-либо из списка:
              </p>
              <div className="space-y-2">
                {commonContraindications.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(item)}
                      onChange={() => toggleContraindication(item)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-900">{item}</span>
                  </label>
                ))}
              </div>
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Травмы</h3>
              <textarea
                placeholder="Опишите текущие или прошлые травмы..."
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm min-h-[100px] focus:outline-none focus:border-blue-500"
                value={injuriesText}
                onChange={(e) => setInjuriesText(e.target.value)}
              />
            </section>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Аллергии</h3>
              <textarea
                placeholder="Укажите аллергии, если есть..."
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm min-h-[80px] focus:outline-none focus:border-blue-500"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Лекарства</h3>
              <textarea
                placeholder="Какие лекарства вы принимаете регулярно?"
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm min-h-[80px] focus:outline-none focus:border-blue-500"
                value={meds}
                onChange={(e) => setMeds(e.target.value)}
              />
            </section>
            <section>
              <h3 className="font-bold text-gray-900 mb-3">Ограничения</h3>
              <textarea
                placeholder="Дополнительные ограничения для тренировок..."
                className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm min-h-[80px] focus:outline-none focus:border-blue-500"
                value={limits}
                onChange={(e) => setLimits(e.target.value)}
              />
            </section>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <section className="bg-white p-4 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                Кому видны данные о здоровье?
              </h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Мой тренер</span>
                  <input
                    type="checkbox"
                    checked={showTrainer}
                    onChange={(e) => setShowTrainer(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Методист клуба</span>
                  <input
                    type="checkbox"
                    checked={showMethodist}
                    onChange={(e) => setShowMethodist(e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600"
                  />
                </label>
              </div>
            </section>

            <section className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm text-gray-900 font-bold">
                    Согласие на обработку
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Я даю согласие на хранение и обработку моих данных о здоровье
                    клубом Atletika+ в целях персонализации тренировочного процесса.
                  </p>
                </div>
              </label>
            </section>
          </div>
        )}
      </div>

      {/* Bottom button */}
      <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom fixed bottom-0 left-0 right-0 z-10">
        <button
          onClick={step < 3 ? () => setStep(step + 1) : handleSubmit}
          disabled={step === 3 && !consent}
          className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          {step < 3 ? 'Далее' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};

export default CheckupScreen;

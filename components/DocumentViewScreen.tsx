
import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Share2, Printer, FileText, PenTool, CheckCircle2, Loader2 } from 'lucide-react';

interface DocumentViewScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const DocumentViewScreen: React.FC<DocumentViewScreenProps> = ({ onNavigate }) => {
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [code, setCode] = useState('');

  const handleSignRequest = () => {
    setIsSigning(true);
  };

  const handleConfirmSign = () => {
    // Simulate API call
    setTimeout(() => {
      setIsSigned(true);
      setIsSigning(false);
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col relative">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('docs')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex flex-col">
             <h1 className="text-sm font-bold text-gray-900 leading-tight">Договор оферты</h1>
             <span className="text-[10px] text-gray-500">от 12.01.2024</span>
          </div>
        </div>
        <div className="flex gap-1">
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
             <Printer className="w-5 h-5" />
           </button>
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
             <Share2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-50 pb-32">
        <div className="bg-white p-8 shadow-sm min-h-[800px] text-justify relative">
           <div className="flex items-center justify-center mb-8 opacity-50">
              <FileText className="w-12 h-12 text-gray-300" />
           </div>
           
           <h2 className="text-center font-bold text-lg mb-6 uppercase">Договор публичной оферты<br/>на оказание физкультурно-оздоровительных услуг</h2>
           
           <div className="prose prose-sm prose-gray max-w-none text-xs leading-relaxed space-y-4">
             <p>
               <strong>1. ОБЩИЕ ПОЛОЖЕНИЯ</strong><br/>
               1.1. Настоящий документ является официальным предложением (публичной офертой) ООО «Атлетика Плюс» (далее — Исполнитель) и содержит все существенные условия предоставления услуг.<br/>
               1.2. В соответствии с пунктом 2 статьи 437 Гражданского Кодекса Российской Федерации (ГК РФ) в случае принятия изложенных ниже условий и оплаты услуг, юридическое или физическое лицо, производящее акцепт этой оферты, становится Заказчиком.
             </p>
             <p>
               <strong>2. ПРЕДМЕТ ДОГОВОРА</strong><br/>
               2.1. Исполнитель обязуется оказывать Заказчику физкультурно-оздоровительные услуги в соответствии с условиями настоящего Договора и Правилами Клуба, а Заказчик обязуется оплачивать эти услуги.<br/>
               2.2. Перечень услуг, входящих в клубную карту, определяется видом карты, выбранным Заказчиком.
             </p>
             <p>
               <strong>3. ПРАВА И ОБЯЗАННОСТИ СТОРОН</strong><br/>
               3.1. Исполнитель обязуется:<br/>
               — Предоставлять качественные услуги.<br/>
               — Обеспечивать функционирование спортивного оборудования.<br/>
               3.2. Заказчик обязуется:<br/>
               — Соблюдать Правила посещения клуба.<br/>
               — Не передавать клубную карту третьим лицам.
             </p>
             <p>
               <strong>4. ОТВЕТСТВЕННОСТЬ СТОРОН</strong><br/>
               4.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему договору стороны несут ответственность в соответствии с действующим законодательством РФ.
             </p>
             <p>
                ... (Текст документа сокращен для демонстрации) ...
             </p>
           </div>

           <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-end">
                 <div>
                    <p className="text-xs font-bold text-gray-900">ИСПОЛНИТЕЛЬ:</p>
                    <p className="text-[10px] text-gray-500">ООО «Атлетика Плюс»</p>
                    <p className="text-[10px] text-gray-500">ИНН 7700000000</p>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">ЗАКАЗЧИК:</p>
                    <p className="text-[10px] text-gray-500">Иванов А.А.</p>
                    <p className="text-[10px] text-gray-500">ID: 1029384</p>
                 </div>
              </div>
           </div>

           {/* Signed Stamp */}
           {isSigned && (
             <div className="absolute bottom-20 right-10 border-4 border-blue-600 p-2 rounded-lg -rotate-12 opacity-80 animate-in zoom-in duration-300">
                <p className="text-blue-600 font-black text-xs uppercase text-center leading-tight">
                  ДОКУМЕНТ<br/>ПОДПИСАН<br/>ЭЦП
                </p>
             </div>
           )}
        </div>
      </div>

      {/* Signature Footer */}
      {!isSigned && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
           {isSigning ? (
             <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <p className="text-xs text-gray-500 text-center">Введите код из СМС, отправленного на номер +7 (999) ***-45-67 для подписания.</p>
                <div className="flex gap-2 justify-center">
                   <input 
                     type="text" 
                     placeholder="0000"
                     value={code}
                     onChange={(e) => setCode(e.target.value)}
                     className="w-32 text-center text-2xl font-bold tracking-widest border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none py-1"
                     maxLength={4}
                   />
                </div>
                <button 
                  onClick={handleConfirmSign}
                  disabled={code.length < 4}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <PenTool className="w-4 h-4" /> Подтвердить подпись
                </button>
             </div>
           ) : (
             <button 
               onClick={handleSignRequest}
               className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
             >
               <PenTool className="w-5 h-5" />
               Подписать документ
             </button>
           )}
        </div>
      )}
      
      {isSigned && (
        <div className="fixed bottom-0 left-0 right-0 bg-green-50 border-t border-green-100 p-4 safe-area-bottom flex items-center justify-center gap-2 text-green-700 font-bold">
           <CheckCircle2 className="w-5 h-5" /> Документ подписан
        </div>
      )}
    </div>
  );
};

export default DocumentViewScreen;

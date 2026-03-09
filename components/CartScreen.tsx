import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, Trash2, Plus, Minus, CreditCard, ChevronRight, ShoppingBag } from 'lucide-react';

interface CartScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const CartScreen: React.FC<CartScreenProps> = ({ onNavigate }) => {
  const [items, setItems] = useState([
    { id: 1, title: 'Whey Protein Gold Standard', variant: 'Двойной шоколад', price: 3200, qty: 1, img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=200&auto=format&fit=crop' },
    { id: 2, title: 'Блок 5 тренировок', variant: 'Тренажерный зал', price: 11500, qty: 1, img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200&auto=format&fit=crop' },
  ]);

  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col">
        <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
          <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Корзина</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
           <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
             <ShoppingBag className="w-10 h-10" />
           </div>
           <h2 className="text-xl font-bold text-gray-900 mb-2">Корзина пуста</h2>
           <p className="text-gray-500 text-sm mb-8">Посмотрите наши услуги и товары, чтобы найти что-то полезное.</p>
           <button 
             onClick={() => onNavigate('service_catalog')}
             className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg"
           >
             Перейти в каталог
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => onNavigate('BACK')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Корзина ({items.length})</h1>
      </div>

      <div className="p-4 flex-1 overflow-y-auto pb-32">
        <div className="space-y-4">
           {items.map((item) => (
             <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 relative overflow-hidden">
                <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0 overflow-hidden">
                   <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-0.5">
                   <div>
                     <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{item.title}</h3>
                     <p className="text-xs text-gray-500">{item.variant}</p>
                   </div>
                   
                   <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-gray-900">{(item.price * item.qty).toLocaleString()} ₽</span>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                         <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 active:scale-90">
                           <Minus className="w-3 h-3" />
                         </button>
                         <span className="text-xs font-bold w-3 text-center">{item.qty}</span>
                         <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 active:scale-90">
                           <Plus className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
           ))}
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-gray-500">Итого к оплате:</span>
            <span className="text-2xl font-extrabold text-gray-900">{total.toLocaleString()} ₽</span>
         </div>
         <button 
           onClick={() => onNavigate('payment_methods')}
           className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
         >
           <CreditCard className="w-5 h-5" />
           Оформить заказ
         </button>
      </div>
    </div>
  );
};

export default CartScreen;
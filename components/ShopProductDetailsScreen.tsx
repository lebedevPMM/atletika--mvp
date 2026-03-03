import React, { useState } from 'react';
import { ScreenName } from '../types';
import { ArrowLeft, ShoppingBag, Plus, Minus, Star, Info, Check, Share2, Heart } from 'lucide-react';

interface ShopProductDetailsScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ShopProductDetailsScreen: React.FC<ShopProductDetailsScreenProps> = ({ onNavigate }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState('chocolate');

  const product = {
    title: 'Whey Protein Gold Standard',
    brand: 'Optimum Nutrition',
    price: 3200,
    rating: 4.9,
    reviews: 124,
    description: 'Изолят сывороточного протеина высокого качества. Идеально подходит для восстановления после тренировок и набора сухой мышечной массы.',
    weight: '900 г',
    flavors: [
      { id: 'chocolate', name: 'Двойной шоколад' },
      { id: 'vanilla', name: 'Ванильное мороженое' },
      { id: 'strawberry', name: 'Клубника' },
    ],
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop'
  };

  const handleAddToCart = () => {
    onNavigate('cart');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 relative">
      {/* Header Image */}
      <div className="h-[400px] relative bg-white">
         <img 
           src={product.image} 
           alt={product.title} 
           className="w-full h-full object-cover"
         />
         <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <button onClick={() => onNavigate('service_catalog')} className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors text-gray-900 shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-3">
               <button className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors text-gray-900 shadow-sm">
                 <Heart className="w-5 h-5" />
               </button>
               <button className="w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white transition-colors text-gray-900 shadow-sm">
                 <Share2 className="w-5 h-5" />
               </button>
            </div>
         </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 relative z-10">
         <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            {/* Title & Brand */}
            <div className="mb-4">
               <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase tracking-wide">
                 {product.brand}
               </span>
               <h1 className="text-2xl font-extrabold text-gray-900 mt-2 leading-tight">{product.title}</h1>
               <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-bold text-sm text-gray-900">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviews} отзыва)</span>
               </div>
            </div>

            {/* Price Row */}
            <div className="flex items-center justify-between py-4 border-t border-gray-100 mb-4">
               <div>
                 <p className="text-3xl font-extrabold text-gray-900">{product.price} ₽</p>
                 <p className="text-xs text-gray-400 font-medium">{product.weight} / Упаковка</p>
               </div>
               
               {/* Quantity Control */}
               <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-1.5 border border-gray-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-lg w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-600 active:scale-90 transition-transform"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
               </div>
            </div>

            {/* Flavors */}
            <div className="mb-6">
               <h3 className="font-bold text-gray-900 text-sm mb-3">Вкус</h3>
               <div className="flex flex-wrap gap-2">
                  {product.flavors.map((flavor) => (
                    <button 
                      key={flavor.id}
                      onClick={() => setSelectedFlavor(flavor.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedFlavor === flavor.id 
                          ? 'bg-gray-900 text-white border-gray-900' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {flavor.name}
                    </button>
                  ))}
               </div>
            </div>

            {/* Description */}
            <div>
               <h3 className="font-bold text-gray-900 text-sm mb-2">Описание</h3>
               <p className="text-sm text-gray-600 leading-relaxed font-medium">
                 {product.description}
               </p>
               <button className="text-blue-600 text-xs font-bold mt-2 flex items-center gap-1">
                 Полный состав <Info className="w-3 h-3" />
               </button>
            </div>
         </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 safe-area-bottom z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <button 
           onClick={handleAddToCart}
           className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
         >
           <ShoppingBag className="w-5 h-5" />
           Добавить за {(product.price * quantity).toLocaleString()} ₽
         </button>
      </div>
    </div>
  );
};

export default ShopProductDetailsScreen;
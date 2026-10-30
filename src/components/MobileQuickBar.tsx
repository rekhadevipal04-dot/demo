import React from 'react';
import { Phone, ShoppingBag, Clock, Navigation } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

interface MobileQuickBarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOrderHistory: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenOrderHistory,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-2 sm:hidden flex items-center justify-between gap-1.5 shadow-2xl">
      <a
        href={`tel:${RESTAURANT_INFO.phone}`}
        className="py-2.5 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-white text-xs font-semibold flex items-center justify-center gap-1 border border-stone-700 shrink-0"
        title="Call Kitchen"
      >
        <Phone className="w-3.5 h-3.5 text-amber-400" />
        <span>Call</span>
      </a>

      <button
        type="button"
        onClick={onOpenOrderHistory}
        className="py-2.5 px-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1 border border-stone-700 shrink-0"
        title="Track Orders & View Past History"
      >
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        <span>My Orders</span>
      </button>

      <a
        href={RESTAURANT_INFO.googleMapsUrl}
        target="_blank"
        rel="noreferrer"
        className="py-2.5 px-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs font-semibold flex items-center justify-center gap-1 border border-stone-700 shrink-0"
        title="Directions"
      >
        <Navigation className="w-3.5 h-3.5 text-amber-400" />
      </a>

      <button
        onClick={onOpenCart}
        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 text-white text-xs font-bold flex items-center justify-between shadow-md min-w-0"
      >
        <div className="flex items-center gap-1 truncate">
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Cart ({cartCount})</span>
        </div>
        {cartCount > 0 && <span className="font-mono text-xs ml-1 shrink-0">₹{cartTotal}</span>}
      </button>
    </div>
  );
};

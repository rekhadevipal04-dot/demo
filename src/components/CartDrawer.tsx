import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types/restaurant';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 300 || items.length === 0 ? 0 : 30;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-red-600 dark:text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Your Food Cart
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-stone-700 dark:text-stone-300">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                  Add some sizzling Triple Schezwan Rice or crispy Paneer Chilly from our menu!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-750 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center w-3 h-3 border border-green-600 bg-white p-0.5 rounded-xs" title="100% Pure Veg">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        </span>
                        <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {item.name}
                        </h4>
                      </div>

                      <div className="mt-1 flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <span className="capitalize font-medium text-amber-600 dark:text-amber-400">
                          {item.portion} Portion
                        </span>
                        <span>·</span>
                        <span className="font-mono">₹{item.price} each</span>
                      </div>

                      {item.specialInstructions && (
                        <p className="mt-1 text-[11px] text-stone-500 italic">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>

                    {/* Stepper & Total */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-mono text-sm font-bold text-stone-900 dark:text-stone-100">
                        ₹{item.price * item.quantity}
                      </span>

                      <div className="flex items-center gap-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-stone-600 dark:text-stone-300 hover:text-red-600 rounded transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs font-semibold px-1.5 min-w-[1.25rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-stone-600 dark:text-stone-300 hover:text-green-600 rounded transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onClearCart}
                    className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Cart</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 space-y-4">
              
              {/* Delivery notice */}
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                <span>Free delivery in Sawarkar Nagar on ₹300+</span>
                <span className="font-semibold">{subtotal >= 300 ? 'Unlocked!' : `Add ₹${300 - subtotal}`}</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium text-stone-900 dark:text-stone-200">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery / Packaging</span>
                  <span className="font-mono font-medium text-stone-900 dark:text-stone-200">
                    {deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100">
                  <span>Total Amount</span>
                  <span className="font-mono text-base text-red-600 dark:text-amber-400">₹{total}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

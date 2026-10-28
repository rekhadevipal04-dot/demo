import React from 'react';
import { Sparkles, Flame, Plus, ArrowRight } from 'lucide-react';
import { MenuItem, Portion } from '../types/restaurant';
import { MENU_ITEMS } from '../data/menuData';

interface SignatureDishesProps {
  onAddToCart: (item: MenuItem, portion: Portion) => void;
  onExploreAll: () => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({ onAddToCart, onExploreAll }) => {
  // Curated list of signature dishes from Vikas Chinese Adda
  const signatureIds = ['rice-7', 'starter-1', 'noodle-2', 'starter-5', 'soup-5', 'rice-11'];
  const signatures = signatureIds
    .map(id => MENU_ITEMS.find(item => item.id === id))
    .filter((item): item is MenuItem => Boolean(item));

  return (
    <section id="signatures" className="py-10 sm:py-16 bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-1.5 sm:mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Chef's Hall of Fame</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Signature Wok Creations
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-stone-600 dark:text-stone-400 max-w-xl">
              Crowd-pleasers loved by local diners across I.C. Colony and New Link Road. Each specialty is prepared using freshly ground spices, premium malai paneer, and sizzling wok hei.
            </p>
          </div>

          <button
            onClick={onExploreAll}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-red-600 dark:text-amber-400 hover:text-red-700 dark:hover:text-amber-300 transition-colors self-start md:self-auto"
          >
            <span>Explore All 40+ Items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Signatures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {signatures.map((dish) => (
            <div
              key={dish.id}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 sm:p-6 flex flex-col justify-between hover:shadow-xl hover:border-amber-500/50 transition-all group"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-amber-500 opacity-80" />

              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center justify-center w-3 h-3 border border-green-600 bg-white p-0.5 rounded-xs" title="100% Pure Veg">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                    </span>
                    <span className="font-medium">{dish.categoryLabel}</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                    House Special
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors">
                  {dish.name}
                </h3>

                <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                  {dish.description}
                </p>

                <div className="mt-4 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                    <span>Spice Level: {dish.spiceLevel === 3 ? 'High' : 'Medium'}</span>
                  </div>
                  <span>·</span>
                  <span>Pure Malai & Greens</span>
                </div>
              </div>

              {/* Bottom Portion Pricing & Add */}
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block font-medium">Half / Full</span>
                  <div className="font-mono text-base font-bold text-stone-900 dark:text-amber-400">
                    ₹{dish.halfPrice} <span className="text-stone-400 text-xs font-normal">/</span> ₹{dish.fullPrice}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onAddToCart(dish, 'half')}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors"
                    title="Add Half Portion to Order"
                  >
                    + Half (₹{dish.halfPrice})
                  </button>
                  <button
                    onClick={() => onAddToCart(dish, 'full')}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-red-700 hover:bg-red-600 text-white shadow-sm transition-colors"
                    title="Add Full Portion to Order"
                  >
                    + Full (₹{dish.fullPrice})
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

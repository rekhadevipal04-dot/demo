import React, { useState, useMemo } from 'react';
import { Search, Flame, Plus, Check, SlidersHorizontal, Sparkles } from 'lucide-react';
import { MenuItem, Portion } from '../types/restaurant';
import { MENU_ITEMS } from '../data/menuData';

interface MenuSectionProps {
  onAddToCart: (item: MenuItem, portion: Portion, instructions?: string) => void;
  cartItemCounts: Record<string, number>; // key: `${itemId}-${portion}`
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onAddToCart, cartItemCounts }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPortions, setSelectedPortions] = useState<Record<string, Portion>>({});
  const [addedItemFeedback, setAddedItemFeedback] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Dishes', count: MENU_ITEMS.length },
    { id: 'rice', label: 'Veg Rice', count: MENU_ITEMS.filter(i => i.category === 'rice').length },
    { id: 'noodles', label: 'Veg Noodles', count: MENU_ITEMS.filter(i => i.category === 'noodles').length },
    { id: 'starter', label: 'Veg Starter', count: MENU_ITEMS.filter(i => i.category === 'starter').length },
    { id: 'soup', label: 'Veg Soup', count: MENU_ITEMS.filter(i => i.category === 'soup').length },
    { id: 'bestseller', label: 'Bestsellers', count: MENU_ITEMS.filter(i => i.isBestseller).length },
  ];

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      // Category filter
      if (selectedCategory === 'bestseller' && !item.isBestseller) return false;
      if (selectedCategory !== 'all' && selectedCategory !== 'bestseller' && item.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchCat = item.categoryLabel.toLowerCase().includes(query);
        return matchName || matchDesc || matchCat;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  const handlePortionChange = (itemId: string, portion: Portion) => {
    setSelectedPortions(prev => ({ ...prev, [itemId]: portion }));
  };

  const handleAddItem = (item: MenuItem) => {
    const portion = selectedPortions[item.id] || 'half';
    onAddToCart(item, portion);

    // Short visual flash feedback
    setAddedItemFeedback(`${item.id}-${portion}`);
    setTimeout(() => {
      setAddedItemFeedback(null);
    }, 1200);
  };

  return (
    <section id="menu" className="py-10 sm:py-20 bg-stone-50 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-red-600 dark:text-red-400 font-bold mb-1.5 sm:mb-2">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 border border-green-600 bg-white p-0.5 rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              </span>
              <span>100% Pure Veg Menu</span>
              <span>·</span>
              <span>Cash on Delivery</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
              Interactive Food Menu
            </h2>
            <p className="mt-1 sm:mt-2 text-xs sm:text-base text-stone-600 dark:text-stone-400 max-w-2xl">
              Authentic taste prepared fresh on order. Select Half or Full portion for any dish and pay cash when it arrives.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paneer, noodles, soup..."
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-4 sm:py-6 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 sm:gap-2 ${
                  isActive
                    ? 'bg-red-700 text-white shadow-md shadow-red-900/20'
                    : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 border border-stone-200/80 dark:border-stone-700/80'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-red-800/80 text-amber-200' : 'bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-800">
            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-base">
              No dishes found matching "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-3 px-4 py-2 text-xs text-red-600 dark:text-red-400 font-semibold underline underline-offset-4"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredItems.map((item) => {
              const currentPortion = selectedPortions[item.id] || 'half';
              const price = currentPortion === 'half' ? item.halfPrice : item.fullPrice;
              const cartKey = `${item.id}-${currentPortion}`;
              const countInCart = cartItemCounts[cartKey] || 0;
              const isJustAdded = addedItemFeedback === cartKey;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-stone-800/70 border border-stone-200/90 dark:border-stone-750 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between hover:shadow-lg hover:border-amber-500/50 transition-all group"
                >
                  <div>
                    {/* Item Top Row: Category & Badges */}
                    <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="inline-flex items-center justify-center w-3 h-3 border border-green-600 bg-white p-0.5 rounded-xs" title="100% Pure Veg">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                        </span>
                        <span>{item.categoryLabel}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {item.isChefSpecial && (
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> Special
                          </span>
                        )}
                        {item.isBestseller && (
                          <span className="text-[11px] font-semibold text-red-600 dark:text-red-400">
                            ★ Bestseller
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dish Name */}
                    <h3 className="font-display text-lg font-bold text-stone-900 dark:text-stone-50 group-hover:text-red-600 dark:group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {/* Spice Level Indicator */}
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                      <span>Spice:</span>
                      <div className="flex items-center gap-0.5">
                        <Flame className={`w-3.5 h-3.5 ${item.spiceLevel && item.spiceLevel >= 1 ? 'text-red-500 fill-red-500' : 'text-stone-300 dark:text-stone-700'}`} />
                        <Flame className={`w-3.5 h-3.5 ${item.spiceLevel && item.spiceLevel >= 2 ? 'text-red-500 fill-red-500' : 'text-stone-300 dark:text-stone-700'}`} />
                        <Flame className={`w-3.5 h-3.5 ${item.spiceLevel && item.spiceLevel >= 3 ? 'text-red-500 fill-red-500' : 'text-stone-300 dark:text-stone-700'}`} />
                      </div>
                      <span className="ml-1 text-stone-400">
                        {item.spiceLevel === 3 ? 'Fiery Hot' : item.spiceLevel === 2 ? 'Medium Schezwan' : 'Mild'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Controls: Portion Selector & Add to Cart */}
                  <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-750 flex flex-col gap-3">
                    
                    {/* Portion Toggle (Half vs Full) */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 dark:text-stone-400 font-medium">Select Portion:</span>
                      <div className="inline-flex p-0.5 bg-stone-100 dark:bg-stone-900 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handlePortionChange(item.id, 'half')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                            currentPortion === 'half'
                              ? 'bg-white dark:bg-stone-800 text-red-600 dark:text-amber-400 shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          Half (₹{item.halfPrice})
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePortionChange(item.id, 'full')}
                          className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                            currentPortion === 'full'
                              ? 'bg-white dark:bg-stone-800 text-red-600 dark:text-amber-400 shadow-xs'
                              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                          }`}
                        >
                          Full (₹{item.fullPrice})
                        </button>
                      </div>
                    </div>

                    {/* Price & Add Action */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-stone-400 block uppercase tracking-wide">
                          {currentPortion.toUpperCase()} Portion
                        </span>
                        <span className="font-mono text-xl font-extrabold text-stone-900 dark:text-amber-400 tabular-nums">
                          ₹{price}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddItem(item)}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isJustAdded
                            ? 'bg-green-600 text-white'
                            : 'bg-red-700 hover:bg-red-600 text-white shadow-sm'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add {countInCart > 0 ? `(${countInCart})` : ''}</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

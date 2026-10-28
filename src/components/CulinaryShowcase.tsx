import React, { useState } from 'react';
import { Flame, Plus, ShieldCheck, Utensils, Check, Sparkles } from 'lucide-react';
import { LiveDishPhoto, DishPhotoType } from './LiveDishPhoto';
import { MenuItem, Portion } from '../types/restaurant';
import { MENU_ITEMS } from '../data/menuData';

interface CulinaryShowcaseProps {
  onAddToCart: (item: MenuItem, portion: Portion) => void;
  onExploreMenu: () => void;
}

interface DishShowcaseItem {
  id: string;
  name: string;
  menuItemId: string;
  category: 'all' | 'rice' | 'noodles' | 'starter' | 'soup';
  categoryLabel: string;
  description: string;
  halfPrice: number;
  fullPrice: number;
  badge: string;
  photoType: DishPhotoType;
  customPhotoUrl?: string;
}

export const CulinaryShowcase: React.FC<CulinaryShowcaseProps> = ({
  onAddToCart,
  onExploreMenu,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'rice' | 'noodles' | 'starter' | 'soup'>('all');
  const [addedFeedbacks, setAddedFeedbacks] = useState<Record<string, boolean>>({});

  const dishes: DishShowcaseItem[] = [
    {
      id: 'showcase-1',
      name: 'Triple Schezwan Rice',
      menuItemId: 'rice-7',
      category: 'rice',
      categoryLabel: 'Pure Veg Rice',
      description: 'Fiery wok-tossed red rice topped with crunchy fried noodles and served with spicy schezwan gravy.',
      halfPrice: 110,
      fullPrice: 200,
      badge: 'Best Seller 🔥',
      photoType: 'rice',
      customPhotoUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-2',
      name: 'Veg Hakka Noodles',
      menuItemId: 'noodle-1',
      category: 'noodles',
      categoryLabel: 'Wok Noodles',
      description: 'Classic Hakka noodles tossed on roaring flame with fresh shredded cabbage, carrots & bell peppers.',
      halfPrice: 60,
      fullPrice: 110,
      badge: 'Chef Special ⭐',
      photoType: 'noodles',
      customPhotoUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-3',
      name: 'Paneer Chilly Dry',
      menuItemId: 'starter-1',
      category: 'starter',
      categoryLabel: 'Veg Starter',
      description: 'Crispy fried fresh malai paneer cubes tossed with green capsicum, chillies & dark garlic soy glaze.',
      halfPrice: 70,
      fullPrice: 130,
      badge: 'Top Starter 🧀',
      photoType: 'paneer',
      customPhotoUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-4',
      name: 'Veg Manchurian Gravy',
      menuItemId: 'starter-7',
      category: 'starter',
      categoryLabel: 'Gravy Special',
      description: 'Crispy vegetable dumplings simmering in a hot, fragrant garlic cilantro Indo-Chinese sauce.',
      halfPrice: 80,
      fullPrice: 150,
      badge: 'Classic Gravy 🥘',
      photoType: 'manchurian',
      customPhotoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-5',
      name: 'Paneer Crispy / 65',
      menuItemId: 'starter-3',
      category: 'starter',
      categoryLabel: 'Veg Starter',
      description: 'Golden crunchy battered paneer strips tossed in house special sweet & spicy red schezwan masala.',
      halfPrice: 80,
      fullPrice: 150,
      badge: 'Extra Crunchy 🌶️',
      photoType: 'crispy',
      customPhotoUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-6',
      name: 'Manchow Soup',
      menuItemId: 'soup-5',
      category: 'soup',
      categoryLabel: 'Hot Soup',
      description: 'Dark spicy and sour garlic cilantro broth topped with a generous mountain of crispy fried noodles.',
      halfPrice: 50,
      fullPrice: 90,
      badge: 'Bestseller Soup 🥣',
      photoType: 'soup',
      customPhotoUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-7',
      name: 'Chinese Bhel',
      menuItemId: 'rice-11',
      category: 'rice',
      categoryLabel: 'Crunchy Snack',
      description: 'Crispy fried noodles tossed in sweet & spicy schezwan sauce, shredded cabbage, and scallions.',
      halfPrice: 60,
      fullPrice: 110,
      badge: 'Adda Special 🥢',
      photoType: 'bhel',
      customPhotoUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 'showcase-8',
      name: 'Mushroom Chilly Dry',
      menuItemId: 'starter-9',
      category: 'starter',
      categoryLabel: 'Veg Starter',
      description: 'Fresh button mushrooms dipped in seasoned batter, crisped and tossed with bell peppers and onions.',
      halfPrice: 70,
      fullPrice: 130,
      badge: 'Mushroom Special 🍄',
      photoType: 'mushroom',
      customPhotoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredDishes = selectedFilter === 'all' 
    ? dishes 
    : dishes.filter(d => d.category === selectedFilter);

  const handleQuickAdd = (menuItemId: string, portion: Portion, cardKey: string) => {
    const dish = MENU_ITEMS.find(m => m.id === menuItemId);
    if (dish) {
      onAddToCart(dish, portion);
      setAddedFeedbacks(prev => ({ ...prev, [cardKey]: true }));
      setTimeout(() => {
        setAddedFeedbacks(prev => ({ ...prev, [cardKey]: false }));
      }, 1200);
    }
  };

  return (
    <section className="py-8 sm:py-16 bg-stone-900 text-stone-100 relative overflow-hidden border-b border-stone-800">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-60 sm:w-80 h-60 sm:h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-[11px] sm:text-xs font-bold text-amber-300 mb-2">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            <span>Fresh From Our Kitchen Wok</span>
            <span className="text-red-500">·</span>
            <span className="text-stone-300">100% Pure Veg</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Delicious Wok Creations
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
            Live high-flame wok cooking with authentic Indo-Chinese flavors, fresh vegetables, and soft malai paneer. Choose Half or Full portion for any creation!
          </p>

          {/* Quick Filter Tabs */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All Specials' },
              { id: 'rice', label: 'Wok Rice' },
              { id: 'noodles', label: 'Noodles' },
              { id: 'starter', label: 'Starters' },
              { id: 'soup', label: 'Soups' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  selectedFilter === tab.id
                    ? 'bg-red-700 text-white shadow-md'
                    : 'bg-stone-800/80 text-stone-300 hover:bg-stone-750 hover:text-white border border-stone-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Dish Showcase Cards: 1 Col on Mobile (Full Size!), 2 Col on Tablet, 4 Col on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {filteredDishes.map((dish) => {
            const addedHalfKey = `${dish.id}-half`;
            const addedFullKey = `${dish.id}-full`;

            return (
              <div
                key={dish.id}
                className="group bg-stone-950 rounded-2xl border border-stone-800 hover:border-amber-500/60 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg"
              >
                <div>
                  {/* Photo Container - Taller on mobile for full-size visual impact */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-900 border-b border-stone-800">
                    <LiveDishPhoto
                      dish={dish.photoType}
                      customUrl={dish.customPhotoUrl}
                      alt={dish.name}
                      className="w-full h-full"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-sm">
                        {dish.badge}
                      </span>
                    </div>

                    {/* Pure veg mark */}
                    <div className="absolute top-2.5 right-2.5 z-10">
                      <span className="inline-flex items-center justify-center w-5 h-5 border border-green-500 bg-white p-0.5 rounded-xs shadow-md" title="100% Pure Veg">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 sm:p-4">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-amber-400 block uppercase tracking-wider mb-1">
                      {dish.categoryLabel}
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {dish.name}
                    </h3>
                    <p className="mt-1 text-xs text-stone-300 leading-relaxed line-clamp-2">
                      {dish.description}
                    </p>
                  </div>
                </div>

                {/* Pricing & Add Actions */}
                <div className="p-3.5 sm:p-4 pt-0">
                  <div className="pt-2.5 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">Half / Full</span>
                      <span className="font-mono text-base font-extrabold text-amber-400">
                        ₹{dish.halfPrice} <span className="text-stone-500 text-xs font-normal">/</span> ₹{dish.fullPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleQuickAdd(dish.menuItemId, 'half', addedHalfKey)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          addedFeedbacks[addedHalfKey]
                            ? 'bg-green-600 text-white'
                            : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                        }`}
                        title="Add Half Portion"
                      >
                        {addedFeedbacks[addedHalfKey] ? <Check className="w-3.5 h-3.5" /> : `+Half (₹${dish.halfPrice})`}
                      </button>

                      <button
                        onClick={() => handleQuickAdd(dish.menuItemId, 'full', addedFullKey)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          addedFeedbacks[addedFullKey]
                            ? 'bg-green-600 text-white'
                            : 'bg-red-700 hover:bg-red-600 text-white'
                        }`}
                        title="Add Full Portion"
                      >
                        {addedFeedbacks[addedFullKey] ? <Check className="w-3.5 h-3.5" /> : `+Full (₹${dish.fullPrice})`}
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Menu CTA */}
        <div className="mt-8 text-center">
          <button
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-750 text-white text-xs sm:text-sm font-semibold border border-stone-700 transition-colors"
          >
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>Explore Complete 40+ Pure Veg Menu</span>
          </button>
        </div>

        {/* Chef Commitment Highlights */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">100% Pure Vegetarian</h4>
              <p className="text-[11px] text-stone-400">Strict vegetarian kitchen cookware</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Live High-Flame Wok</h4>
              <p className="text-[11px] text-stone-400">Tossed steaming hot on order</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Cash on Delivery</h4>
              <p className="text-[11px] text-stone-400">Pay cash upon home delivery</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

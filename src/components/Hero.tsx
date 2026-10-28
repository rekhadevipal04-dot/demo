import React from 'react';
import { Phone, MapPin, Clock, Flame, ShieldCheck, UtensilsCrossed, ArrowRight, ShieldAlert } from 'lucide-react';
import { ChefLogo } from './ChefLogo';
import { RESTAURANT_INFO } from '../data/menuData';

interface HeroProps {
  onExploreMenu: () => void;
  onOpenAdmin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, onOpenAdmin }) => {
  return (
    <section className="relative w-full max-w-full overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-6 pb-10 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20 border-b border-stone-800">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-red-700/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-4 sm:right-10 w-52 sm:w-80 h-52 sm:h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Story & CTAs */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-6">
            {/* Pure Veg Trust Kicker - Responsive wrapping */}
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-full bg-stone-800/85 border border-stone-700 text-[11px] sm:text-xs font-medium text-amber-300 max-w-full">
              <span className="inline-flex items-center gap-1.5 shrink-0">
                <span className="inline-flex items-center justify-center w-3 h-3 sm:w-3.5 sm:h-3.5 border border-green-500 bg-white p-0.5 rounded-xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                </span>
                <span className="font-semibold">100% Pure Veg Indo-Chinese</span>
              </span>
              <span className="text-stone-500 hidden sm:inline">·</span>
              <span className="text-stone-300">I.C. Colony (Pin 400103)</span>
            </div>

            {/* Headline */}
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight break-words">
              Authentic Wok Sizzle.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
                Pure Veg Chinese
              </span>{' '}
              Delicacies.
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-base text-stone-300 max-w-2xl leading-relaxed">
              Welcome to <strong className="text-white font-semibold">Vikas Chinese Adda</strong>, located at Shop No. 5, Gali No. 3, Ganpati Nagar, New Link Road, I.C. Colony (PIN: 400103). Relish our famous Triple Schezwan Rice, sizzling Paneer Chilly Dry, crispy Hakka noodles, and hearty Manchow soups—prepared fresh in high-flame woks with 100% pure vegetarian cookware.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-1">
              <button
                onClick={onExploreMenu}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Explore Full Menu & Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="px-3 sm:px-5 py-3 bg-stone-800/90 hover:bg-stone-750 text-stone-100 hover:text-white rounded-xl font-medium text-xs sm:text-sm border border-stone-700 flex items-center justify-center gap-1.5 transition-all truncate"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate">Call {RESTAURANT_INFO.phone}</span>
                </a>

                <button
                  onClick={onOpenAdmin}
                  className="px-3.5 py-3 bg-stone-850 hover:bg-stone-800 rounded-xl border border-stone-700 text-xs text-stone-300 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Quick Metadata Row */}
            <div className="pt-3 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-stone-200 font-medium">12-4 PM & 7-12 AM</div>
                  <div className="text-[11px]">Open 7 Days a Week</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-stone-200 font-medium">I.C. Colony · Pin 400103</div>
                  <div className="text-[11px]">Gali 3, Ganpati Nagar</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <div>
                  <div className="text-stone-200 font-medium">100% Pure Vegetarian</div>
                  <div className="text-[11px]">Live High-Flame Wok</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Culinary Card & Menu Snapshot */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-2xl p-1 bg-gradient-to-br from-red-600/40 via-amber-500/20 to-stone-800 shadow-2xl">
              <div className="bg-stone-900 rounded-xl p-3.5 sm:p-6 space-y-3.5 sm:space-y-5">
                
                {/* Brand Badge Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <ChefLogo size="md" className="shrink-0" />
                    <div className="truncate">
                      <h3 className="font-display font-bold text-sm sm:text-lg text-white truncate">
                        Vikas Chinese Adda
                      </h3>
                      <p className="text-[10px] sm:text-[11px] text-amber-400 font-medium truncate">
                        Pure Veg · Famous Fast Food Adda
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-[10px] text-stone-400 block">Kitchen</span>
                    <span className="font-mono text-xs sm:text-sm text-green-400 font-bold">Live Wok</span>
                  </div>
                </div>

                {/* Popular Signature Highlights with exact menu prices */}
                <div className="space-y-2 sm:space-y-2.5">
                  <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 font-semibold flex items-center justify-between">
                    <span>Chef Highlights</span>
                    <span className="text-[10px] sm:text-[11px] text-amber-400 font-medium">Half / Full</span>
                  </div>

                  <div className="p-2 sm:p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 flex items-center justify-between hover:border-stone-700 transition-colors">
                    <div className="min-w-0 mr-2">
                      <div className="text-xs sm:text-sm font-semibold text-stone-100 flex items-center gap-1 truncate">
                        <span className="truncate">Triple Schezwan Rice</span>
                        <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 shrink-0" />
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-stone-400 truncate">Fried rice + crisp noodles + gravy</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-amber-400">₹110 / ₹200</span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 flex items-center justify-between hover:border-stone-700 transition-colors">
                    <div className="min-w-0 mr-2">
                      <div className="text-xs sm:text-sm font-semibold text-stone-100 truncate">Paneer Chilly Dry</div>
                      <p className="text-[10px] sm:text-[11px] text-stone-400 truncate">Fresh malai paneer wok tossed</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-amber-400">₹70 / ₹130</span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 flex items-center justify-between hover:border-stone-700 transition-colors">
                    <div className="min-w-0 mr-2">
                      <div className="text-xs sm:text-sm font-semibold text-stone-100 truncate">Manchow Soup</div>
                      <p className="text-[10px] sm:text-[11px] text-stone-400 truncate">Spicy garlic broth & fried noodles</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-amber-400">₹50 / ₹90</span>
                    </div>
                  </div>
                </div>

                {/* Instant Order Action */}
                <div className="pt-1">
                  <button
                    onClick={onExploreMenu}
                    className="w-full py-2.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 hover:text-white border border-stone-700 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <UtensilsCrossed className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Browse All 40+ Pure Veg Items</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

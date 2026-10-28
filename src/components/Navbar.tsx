import React, { useState } from 'react';
import { ShoppingBag, Sun, Moon, Phone, Menu, X, ShieldAlert } from 'lucide-react';
import { ChefLogo } from './ChefLogo';
import { RESTAURANT_INFO } from '../data/menuData';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  newOrdersCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  newOrdersCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Menu', href: '#menu' },
    { label: 'Signatures', href: '#signatures' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Location & Map', href: '#location' },
    { label: 'Social', href: '#social' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full backdrop-blur-md bg-stone-900/95 dark:bg-stone-950/95 border-b border-stone-800 text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-15 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        
        {/* Zone 1: Brand Wordmark & Chef Logo */}
        <a href="#" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial group">
          <ChefLogo size="sm" className="shrink-0" />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display font-extrabold text-sm sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors truncate">
                Vikas Chinese Adda
              </span>
              <span
                className="inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 border border-green-500 bg-white p-0.5 rounded-xs shrink-0"
                title="100% Pure Vegetarian"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-600"></span>
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-amber-400/90 font-medium tracking-wide truncate">
              Pure Veg · I.C. Colony (400103)
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links (Laptop and Desktop) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium text-stone-300 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
          {/* Admin Trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-stone-400 hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-xs py-1 px-2.5 rounded-md border border-stone-700/60 hover:border-amber-400/60 bg-stone-850"
            title="Open Admin"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
            {newOrdersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            )}
          </button>
        </nav>

        {/* Zone 3: Actions (Call, Dark Mode & Cart CTA) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <a
            href={`tel:${RESTAURANT_INFO.phone}`}
            className="hidden xl:flex items-center gap-1.5 text-xs text-stone-300 hover:text-amber-400 transition-colors px-2.5 py-1.5 rounded-lg border border-stone-800 shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-xs">{RESTAURANT_INFO.phone}</span>
          </a>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle theme mode"
            className="p-1.5 sm:p-2.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors border border-stone-800 shrink-0"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-stone-300" />}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-lg font-medium text-xs sm:text-sm shadow-md transition-all whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Order Online</span>
            <span className="sm:hidden font-semibold text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] sm:text-xs font-bold bg-white text-red-700 rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile & Tablet hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-stone-300 hover:text-white hover:bg-stone-800 transition-colors shrink-0"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 sm:px-6 py-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-stone-300 hover:text-amber-400 py-1.5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-2 text-xs text-amber-400 py-2 font-semibold"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-2 text-xs text-stone-300 py-1"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call Us: +91 {RESTAURANT_INFO.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

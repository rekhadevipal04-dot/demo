/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MenuItem, Portion, CartItem, OrderBooking, OrderStatus } from './types/restaurant';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CulinaryShowcase } from './components/CulinaryShowcase';
import { SignatureDishes } from './components/SignatureDishes';
import { MenuSection } from './components/MenuSection';
import { ReviewsSection } from './components/ReviewsSection';
import { LocationSection } from './components/LocationSection';
import { SocialFeedSection } from './components/SocialFeedSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { INITIAL_ORDERS } from './data/initialOrders';

export default function App() {
  // Dark mode state with default true
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vca_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  // Cart state with persistence
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('vca_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Orders State - cleans out any old fake/demo orders automatically
  const [orders, setOrders] = useState<OrderBooking[]>(() => {
    try {
      const saved = localStorage.getItem('vca_all_orders');
      if (saved) {
        const parsed: OrderBooking[] = JSON.parse(saved);
        // Filter out legacy fake demo orders by ID and demo names
        const cleanOrders = parsed.filter(o => 
          !['VCA-1048', 'VCA-1047', 'VCA-1046', 'VCA-1045', 'VCA-1044'].includes(o.orderId) &&
          !o.customerName?.toLowerCase().includes('amit sharma') &&
          !o.customerName?.toLowerCase().includes('neha patil') &&
          !o.customerName?.toLowerCase().includes('rohan gokhale') &&
          !o.customerName?.toLowerCase().includes('sunita verma')
        );
        return cleanOrders;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Modals & Navigation state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('vca_admin_authenticated') === 'true';
  });
  const [confirmedOrder, setConfirmedOrder] = useState<OrderBooking | null>(null);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);

  // Sync dark mode to document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('vca_dark_mode', String(darkMode));
  }, [darkMode]);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('vca_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync orders to local storage
  useEffect(() => {
    localStorage.setItem('vca_all_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleAddToCart = (item: MenuItem, portion: Portion, instructions?: string) => {
    const price = portion === 'half' ? item.halfPrice : item.fullPrice;
    const cartItemId = `${item.id}-${portion}`;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(ci => ci.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          specialInstructions: instructions || updated[existingIndex].specialInstructions,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItemId: item.id,
          name: item.name,
          portion,
          price,
          quantity: 1,
          specialInstructions: instructions,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: OrderBooking) => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(newOrder);
    // Add to Admin live orders list immediately
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]); // Clear cart after successful booking
  };

  // Reorder dishes from past orders directly into cart
  const handleReorder = (itemsToReorder: CartItem[]) => {
    setCartItems(prev => {
      const updated = [...prev];
      itemsToReorder.forEach(newItem => {
        const existingIndex = updated.findIndex(ci => ci.id === newItem.id);
        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + newItem.quantity,
          };
        } else {
          updated.push({ ...newItem });
        }
      });
      return updated;
    });
    setIsCartOpen(true);
  };

  // Admin updates order status
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.orderId === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      })
    );
  };

  // Admin punches manual phone order
  const handleAddNewManualOrder = (manualOrder: OrderBooking) => {
    setOrders(prev => [manualOrder, ...prev]);
  };

  // Admin clears all orders
  const handleClearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem('vca_all_orders');
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrdersCount = orders.filter(o => o.status === 'new').length;

  // Map of item-portion counts for menu buttons
  const cartItemCounts = cartItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.id] = item.quantity;
    return acc;
  }, {});

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Open Admin with password challenge
  const handleOpenAdmin = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('vca_admin_authenticated', 'true');
    setIsAdminAuthModalOpen(false);
    setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('vca_admin_authenticated');
    setIsAdminOpen(false);
  };

  // If Admin panel is open, render Admin view
  if (isAdminOpen) {
    return (
      <AdminDashboard
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddNewOrder={handleAddNewManualOrder}
        onClearAllOrders={handleClearAllOrders}
        onClose={() => setIsAdminOpen(false)}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className={`min-h-screen w-full max-w-full overflow-x-hidden font-sans ${darkMode ? 'dark bg-stone-950 text-stone-100' : 'bg-stone-50 text-stone-900'} transition-colors duration-200 pb-16 sm:pb-0`}>
      {/* Top Navbar */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        newOrdersCount={newOrdersCount}
      />

      {/* Main Content */}
      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <Hero
          onExploreMenu={scrollToMenu}
          onOpenAdmin={handleOpenAdmin}
        />

        {/* Live Chinese Wok & Dish Showcase with Real Photos */}
        <CulinaryShowcase
          onAddToCart={handleAddToCart}
          onExploreMenu={scrollToMenu}
        />

        {/* Featured Signature Dishes Section */}
        <SignatureDishes
          onAddToCart={handleAddToCart}
          onExploreAll={scrollToMenu}
        />

        {/* Interactive Full Menu Section */}
        <MenuSection
          onAddToCart={handleAddToCart}
          cartItemCounts={cartItemCounts}
        />

        {/* Customer Reviews & Testimonials Section */}
        <ReviewsSection />

        {/* Location, Interactive Map & Contact Details */}
        <LocationSection />

        {/* Social Media Feed & Direct Connect */}
        <SocialFeedSection />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={handleOpenAdmin} />

      {/* Mobile Sticky Quick Bar */}
      <MobileQuickBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Secure Checkout & Booking Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Automated Order Confirmation Email & Status Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
      />

      {/* Customer Order History & Live Status Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        allOrders={orders}
        onReorder={handleReorder}
        onExploreMenu={scrollToMenu}
      />

      {/* Admin Password Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminAuthModalOpen}
        onSuccess={handleAdminAuthSuccess}
        onClose={() => setIsAdminAuthModalOpen(false)}
      />
    </div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Search, 
  Phone, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Flame, 
  Truck, 
  XCircle, 
  RotateCcw, 
  MessageSquare, 
  ExternalLink, 
  Receipt, 
  Tag, 
  ChefHat, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { OrderBooking, OrderStatus, CartItem } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/menuData';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  allOrders: OrderBooking[];
  onReorder: (items: CartItem[]) => void;
  onExploreMenu: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  allOrders,
  onReorder,
  onExploreMenu,
}) => {
  // Initialize with last used phone number from localStorage
  const [phoneNumber, setPhoneNumber] = useState<string>(() => {
    try {
      return localStorage.getItem('vca_customer_phone') || '';
    } catch {
      return '';
    }
  });

  const [searchInput, setSearchInput] = useState<string>(phoneNumber);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Sync phone search to localStorage whenever searched
  const cleanSearchPhone = searchInput.replace(/\D/g, '').slice(-10);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cleanSearchPhone.length === 10) {
      setPhoneNumber(cleanSearchPhone);
      try {
        localStorage.setItem('vca_customer_phone', cleanSearchPhone);
      } catch {
        // storage disabled or full
      }
    }
  };

  const handleQuickPhoneSelect = (phone: string) => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    setSearchInput(clean);
    setPhoneNumber(clean);
    try {
      localStorage.setItem('vca_customer_phone', clean);
    } catch {
      // storage disabled
    }
  };

  // Find all past orders matching the phone number
  const matchedOrders = useMemo(() => {
    if (!phoneNumber || phoneNumber.length < 10) return [];
    
    return allOrders.filter(order => {
      const orderPhoneClean = (order.phone || '').replace(/\D/g, '').slice(-10);
      return orderPhoneClean === phoneNumber;
    }).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [allOrders, phoneNumber]);

  // Extract recent phone numbers from allOrders in case user ordered before
  const recentPhoneNumbers = useMemo(() => {
    const phones = new Set<string>();
    allOrders.forEach(o => {
      const p = (o.phone || '').replace(/\D/g, '').slice(-10);
      if (p.length === 10) phones.add(p);
    });
    return Array.from(phones).slice(0, 3);
  }, [allOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (activeFilter === 'active') {
      return matchedOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
    }
    if (activeFilter === 'completed') {
      return matchedOrders.filter(o => o.status === 'completed');
    }
    return matchedOrders;
  }, [matchedOrders, activeFilter]);

  if (!isOpen) return null;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Order Received
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
            Tossing in Wok
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <Truck className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            Out for Delivery
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            Delivered / Ready
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
    }
  };

  const formatOrderTime = (order: OrderBooking) => {
    if (order.createdAt) {
      const date = new Date(order.createdAt);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return order.timestamp || 'Recently';
  };

  const getStepStatus = (currentStatus: OrderStatus, step: 'received' | 'cooking' | 'dispatched' | 'done') => {
    if (currentStatus === 'cancelled') return 'cancelled';
    
    const sequence = ['new', 'preparing', 'out_for_delivery', 'completed'];
    const currentIndex = sequence.indexOf(currentStatus);

    const stepMap = {
      received: 0,
      cooking: 1,
      dispatched: 2,
      done: 3,
    };

    const targetIndex = stepMap[step];

    if (currentIndex > targetIndex) return 'completed';
    if (currentIndex === targetIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-3 sm:my-6 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Order History & Live Status</span>
                {matchedOrders.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono font-bold">
                    {matchedOrders.length} {matchedOrders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Track live preparation and past receipts via your mobile number
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Phone Lookup Search Section */}
        <div className="p-4 sm:px-6 bg-stone-100/60 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 shrink-0">
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
              Customer Mobile Number (10 digits)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit phone number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-16 pr-3 py-2 text-xs sm:text-sm font-mono tracking-wider rounded-xl bg-white dark:bg-stone-850 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <button
                type="submit"
                disabled={cleanSearchPhone.length !== 10}
                className="px-4 py-2 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>Find Orders</span>
              </button>
            </div>

            {/* Quick Switch chips if recent phone numbers exist */}
            {recentPhoneNumbers.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-stone-500 dark:text-stone-400">
                <span>Recent numbers:</span>
                {recentPhoneNumbers.map((phone) => (
                  <button
                    key={phone}
                    type="button"
                    onClick={() => handleQuickPhoneSelect(phone)}
                    className={`font-mono px-2 py-0.5 rounded-md border transition-colors ${
                      phoneNumber === phone
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                        : 'bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400'
                    }`}
                  >
                    +91 {phone}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Status Filter Tabs */}
          {matchedOrders.length > 0 && (
            <div className="flex gap-2 pt-3">
              {[
                { id: 'all', label: 'All Orders', count: matchedOrders.length },
                { id: 'active', label: 'Live / In Kitchen', count: matchedOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length },
                { id: 'completed', label: 'Delivered', count: matchedOrders.filter(o => o.status === 'completed').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    activeFilter === tab.id
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                      : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    activeFilter === tab.id
                      ? 'bg-white/20 dark:bg-stone-900/20 text-white dark:text-stone-900'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* State 1: No phone entered or incomplete */}
          {(!phoneNumber || phoneNumber.length < 10) && (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                Track Your Orders in Real-Time
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                Enter your 10-digit mobile number above to see all orders you have placed with Vikas Chinese Adda, view live kitchen status, and reorder with one click.
              </p>
            </div>
          )}

          {/* State 2: Phone entered, but no orders found */}
          {phoneNumber && phoneNumber.length === 10 && matchedOrders.length === 0 && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-400 flex items-center justify-center">
                <Receipt className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                  No Past Orders Found
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
                  No orders have been placed from <strong className="font-mono text-stone-700 dark:text-stone-300">+91 {phoneNumber}</strong> on this browser yet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onExploreMenu();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <ChefHat className="w-4 h-4" />
                <span>Explore Full Menu & Order Now</span>
              </button>
            </div>
          )}

          {/* State 3: Filter returned zero results */}
          {phoneNumber && matchedOrders.length > 0 && filteredOrders.length === 0 && (
            <div className="py-8 text-center text-xs text-stone-500 dark:text-stone-400">
              No orders matching the "{activeFilter}" filter.
            </div>
          )}

          {/* State 4: List of Orders */}
          {filteredOrders.map((order) => {
            const isLive = order.status !== 'completed' && order.status !== 'cancelled';
            const orderWaText = encodeURIComponent(
              `Hello Vikas Chinese Adda! I have a question regarding my order #${order.orderId} (Customer: ${order.customerName}).`
            );
            const waLink = `https://wa.me/91${RESTAURANT_INFO.phone}?text=${orderWaText}`;

            return (
              <div
                key={order.orderId}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isLive
                    ? 'bg-white dark:bg-stone-850 border-amber-500/60 shadow-md ring-1 ring-amber-500/20'
                    : 'bg-white dark:bg-stone-850/70 border-stone-200 dark:border-stone-800'
                }`}
              >
                {/* Order Top Banner */}
                <div className="p-4 bg-stone-50/80 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-stone-900 dark:text-amber-400">
                      {order.orderId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-stone-200 dark:bg-stone-750 text-stone-700 dark:text-stone-300">
                      {order.orderType}
                    </span>
                    {order.couponCode && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <Tag className="w-2.5 h-2.5" />
                        {order.couponCode}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {formatOrderTime(order)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Live Progress Timeline for Active Orders */}
                  {order.status !== 'cancelled' && (
                    <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200/80 dark:border-stone-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {isLive ? '🔥 Live Kitchen Status' : '✓ Order Fulfillment'}
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                          {order.status === 'completed'
                            ? 'Delivered'
                            : order.status === 'out_for_delivery'
                            ? 'Out for Delivery (10-15m)'
                            : order.status === 'preparing'
                            ? 'In Wok (15-20m)'
                            : 'Confirmed (25-30m)'}
                        </span>
                      </div>

                      {/* 4-Step Tracker */}
                      <div className="grid grid-cols-4 gap-1 pt-1 text-center">
                        {[
                          { key: 'received', label: 'Received', icon: '1' },
                          { key: 'cooking', label: 'Cooking', icon: '2' },
                          { key: 'dispatched', label: order.orderType === 'delivery' ? 'On Way' : 'Ready', icon: '3' },
                          { key: 'done', label: 'Delivered', icon: '✓' },
                        ].map((step, idx) => {
                          const state = getStepStatus(order.status, step.key as any);
                          let colorClass = 'bg-stone-200 dark:bg-stone-800 text-stone-500 dark:text-stone-400';
                          let labelClass = 'text-stone-400 dark:text-stone-500';

                          if (state === 'completed') {
                            colorClass = 'bg-green-600 text-white';
                            labelClass = 'text-green-600 dark:text-green-400 font-bold';
                          } else if (state === 'current') {
                            colorClass = 'bg-amber-500 text-stone-950 ring-2 ring-amber-400 ring-offset-1 dark:ring-offset-stone-900 font-bold animate-pulse';
                            labelClass = 'text-amber-600 dark:text-amber-400 font-bold';
                          }

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${colorClass}`}>
                                {state === 'completed' ? '✓' : step.icon}
                              </div>
                              <span className={`text-[10px] mt-1 transition-all ${labelClass}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Delivery Address (if Delivery) */}
                  {order.deliveryAddress && (
                    <div className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-900/30 p-2.5 rounded-lg border border-stone-200/60 dark:border-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800 dark:text-stone-200">Delivery Address: </span>
                        <span>{order.deliveryAddress} {order.landmark ? `(Landmark: ${order.landmark})` : ''}</span>
                      </div>
                    </div>
                  )}

                  {/* Ordered Items List */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 tracking-wider block">
                      Ordered Dishes ({order.items.length})
                    </span>
                    <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden text-xs">
                      {order.items.map((item) => (
                        <div key={item.id} className="p-2.5 bg-stone-50/40 dark:bg-stone-900/40 flex justify-between items-center">
                          <div>
                            <div className="font-semibold text-stone-900 dark:text-stone-100">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-stone-500 dark:text-stone-400 capitalize">
                              {item.portion} Portion · Qty: {item.quantity}
                            </div>
                          </div>
                          <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                            ₹{item.price * item.quantity}
                          </div>
                        </div>
                      ))}

                      {/* Pricing summary rows */}
                      {order.discount && order.discount > 0 && (
                        <div className="p-2 bg-emerald-50/60 dark:bg-emerald-950/20 flex justify-between items-center text-xs text-emerald-700 dark:text-emerald-400 font-semibold">
                          <span>Coupon Discount ({order.couponCode || 'PROMO'})</span>
                          <span className="font-mono font-bold">-₹{order.discount}</span>
                        </div>
                      )}

                      <div className="p-2.5 bg-stone-100/70 dark:bg-stone-900 flex justify-between items-center text-xs font-bold text-stone-900 dark:text-stone-100">
                        <span>Total Payable (COD)</span>
                        <span className="font-mono text-sm text-red-600 dark:text-amber-400">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions: Reorder, WhatsApp Chat, Print */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {/* Reorder Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onReorder(order.items);
                        onClose();
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      title="Reorder these items"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Dishes</span>
                    </button>

                    {/* WhatsApp Query */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      title="Contact kitchen on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Support</span>
                    </a>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 shrink-0">
          <span>Pure Veg Kitchen · I.C. Colony (400103)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

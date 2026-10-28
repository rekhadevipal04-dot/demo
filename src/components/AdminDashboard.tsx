import React, { useState, useMemo } from 'react';
import { 
  ChefHat, 
  ShoppingBag, 
  Phone, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle, 
  Flame, 
  Truck, 
  XCircle, 
  Plus, 
  ArrowLeft, 
  DollarSign, 
  Printer, 
  RefreshCw,
  Bell,
  Trash2,
  LogOut
} from 'lucide-react';
import { OrderBooking, OrderStatus, MenuItem, Portion, CartItem } from '../types/restaurant';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/menuData';

interface AdminDashboardProps {
  orders: OrderBooking[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddNewOrder: (newOrder: OrderBooking) => void;
  onClearAllOrders: () => void;
  onClose: () => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onAddNewOrder,
  onClearAllOrders,
  onClose,
  onLogout,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderBooking | null>(orders[0] || null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState<'list' | 'details'>('list');

  // New Phone / Counter Order Form State
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newOrderType, setNewOrderType] = useState<'delivery' | 'takeaway' | 'dinein'>('delivery');
  const [newOrderNotes, setNewOrderNotes] = useState('');
  const [newOrderItems, setNewOrderItems] = useState<CartItem[]>([]);
  const [selectedDishId, setSelectedDishId] = useState<string>(MENU_ITEMS[0]?.id || '');
  const [selectedDishPortion, setSelectedDishPortion] = useState<Portion>('full');

  // Stats for Admin
  const stats = useMemo(() => {
    const totalSales = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const newOrdersCount = orders.filter(o => o.status === 'new').length;
    const preparingCount = orders.filter(o => o.status === 'preparing').length;
    const outCount = orders.filter(o => o.status === 'out_for_delivery').length;
    const completedCount = orders.filter(o => o.status === 'completed').length;

    return {
      totalOrders: orders.length,
      totalSales,
      newOrdersCount,
      preparingCount,
      outCount,
      completedCount,
    };
  }, [orders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
      if (selectedType !== 'all' && o.orderType !== selectedType) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchId = o.orderId.toLowerCase().includes(query);
        const matchName = o.customerName.toLowerCase().includes(query);
        const matchPhone = o.phone.includes(query);
        return matchId || matchName || matchPhone;
      }
      return true;
    });
  }, [orders, selectedStatus, selectedType, searchQuery]);

  // Handle adding an item to the manual phone order
  const handleAddItemToManualOrder = () => {
    const dish = MENU_ITEMS.find(m => m.id === selectedDishId);
    if (!dish) return;

    const price = selectedDishPortion === 'half' ? dish.halfPrice : dish.fullPrice;
    const cartItemId = `${dish.id}-${selectedDishPortion}`;

    setNewOrderItems(prev => {
      const existing = prev.find(i => i.id === cartItemId);
      if (existing) {
        return prev.map(i => i.id === cartItemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev,
        {
          id: cartItemId,
          menuItemId: dish.id,
          name: dish.name,
          portion: selectedDishPortion,
          price,
          quantity: 1,
        },
      ];
    });
  };

  const handleManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim() || newOrderItems.length === 0) return;

    const subtotal = newOrderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const deliveryFee = newOrderType === 'delivery' && subtotal < 300 ? 30 : 0;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const createdOrder: OrderBooking = {
      orderId: `VCA-${randomSuffix}`,
      customerName: newCustName.trim(),
      phone: newCustPhone.trim(),
      email: '',
      orderType: newOrderType,
      deliveryAddress: newOrderType === 'delivery' ? newCustAddress.trim() : undefined,
      paymentMethod: 'cod',
      items: newOrderItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      status: 'new',
      timestamp: 'Just now',
      createdAt: Date.now(),
      notes: newOrderNotes.trim() ? newOrderNotes.trim() : undefined,
    };

    onAddNewOrder(createdOrder);
    setSelectedOrder(createdOrder);
    setIsNewOrderModalOpen(false);
    // Reset form
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewOrderItems([]);
    setNewOrderNotes('');
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
            NEW ORDER
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
            IN WOK (COOKING)
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Truck className="w-3 h-3" />
            OUT / READY
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/30">
            <CheckCircle className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-500/15 text-stone-500 border border-stone-500/30">
            <XCircle className="w-3 h-3" />
            CANCELLED
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-stone-900 border-b border-stone-800 px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
            title="Back to Customer Storefront"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-700 to-amber-600 flex items-center justify-center text-white shadow-md shrink-0">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Admin
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-stone-400 truncate">
                Vikas Chinese Adda · I.C. Colony · Pin 400103
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {orders.length > 0 && (
            <button
              onClick={onClearAllOrders}
              className="px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-red-950/60 text-stone-400 hover:text-red-400 text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1"
              title="Clear all stored orders"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Clear</span>
            </button>
          )}

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Order</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-amber-400 text-xs font-medium border border-stone-700 transition-colors flex items-center gap-1 shrink-0"
              title="Logout & Lock Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* KPI Ribbon */}
      <section className="bg-stone-900/60 border-b border-stone-800 px-3 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                Total Revenue
              </span>
              <span className="font-mono text-lg sm:text-2xl font-black text-amber-400 tabular-nums">
                ₹{stats.totalSales}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                New Orders
              </span>
              <span className="font-mono text-lg sm:text-2xl font-black text-red-500 tabular-nums">
                {stats.newOrdersCount}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
              <Bell className={`w-4 h-4 ${stats.newOrdersCount > 0 ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                In Wok (Cooking)
              </span>
              <span className="font-mono text-lg sm:text-2xl font-black text-amber-300 tabular-nums">
                {stats.preparingCount}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-300 shrink-0">
              <Flame className="w-4 h-4 fill-amber-300" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                Total Orders
              </span>
              <span className="font-mono text-lg sm:text-2xl font-black text-stone-200 tabular-nums">
                {stats.totalOrders}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-stone-300 shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Mobile View Switcher */}
        <div className="lg:hidden col-span-1 flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
          <button
            onClick={() => setMobileViewTab('list')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
              mobileViewTab === 'list'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Order List ({filteredOrders.length})
          </button>
          <button
            onClick={() => setMobileViewTab('details')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all text-center ${
              mobileViewTab === 'details'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            {selectedOrder ? `Details (${selectedOrder.orderId})` : 'Order Details'}
          </button>
        </div>

        {/* Left Column: Order Filters & Cards List (7 Cols) */}
        <div className={`${mobileViewTab === 'list' ? 'flex' : 'hidden'} lg:flex lg:col-span-7 flex-col space-y-3.5`}>
          
          {/* Search & Filter Header */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search by customer name, phone, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-semibold text-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Types</option>
              <option value="delivery">Delivery</option>
              <option value="takeaway">Takeaway</option>
              <option value="dinein">Dine-In</option>
            </select>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: 'All', count: orders.length },
              { id: 'new', label: 'New', count: stats.newOrdersCount },
              { id: 'preparing', label: 'In Wok', count: stats.preparingCount },
              { id: 'out_for_delivery', label: 'Out / Ready', count: stats.outCount },
              { id: 'completed', label: 'Completed', count: stats.completedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedStatus === tab.id
                    ? 'bg-red-700 text-white shadow-sm'
                    : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  selectedStatus === tab.id ? 'bg-red-800 text-amber-200' : 'bg-stone-800 text-stone-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Orders Cards List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[500px] lg:max-h-[calc(100vh-270px)] pr-1">
            {filteredOrders.length === 0 ? (
              <div className="p-8 sm:p-12 rounded-2xl bg-stone-900 border border-stone-800 text-center text-stone-400 text-xs space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-stone-500" />
                <p className="font-semibold text-stone-300">No customer orders placed yet</p>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  New orders submitted by customers via website checkout or recorded via "+ Order" will appear here automatically in real time.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isSelected = selectedOrder?.orderId === order.orderId;
                return (
                  <div
                    key={order.orderId}
                    onClick={() => {
                      setSelectedOrder(order);
                      setMobileViewTab('details');
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-amber-400">
                          {order.orderId}
                        </span>
                        <span className="text-[10px] capitalize text-stone-400 px-1.5 py-0.2 rounded bg-stone-800">
                          {order.orderType}
                        </span>
                      </div>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">
                          {order.customerName}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                          <Phone className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="font-mono">{order.phone}</span>
                          <span>·</span>
                          <span className="text-[11px]">{order.timestamp}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm sm:text-base font-extrabold text-white block">
                          ₹{order.total}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {/* Summary of items in order */}
                    <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
                      <div className="truncate max-w-[240px] sm:max-w-[320px] text-[11px]">
                        {order.items.map(i => `${i.name} (${i.portion}) x${i.quantity}`).join(', ')}
                      </div>
                      <span className="text-[11px] text-amber-400 font-semibold shrink-0 ml-2">
                        View Details →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Order Inspector & Actions (5 Cols) */}
        <div className={`${mobileViewTab === 'details' ? 'block' : 'hidden'} lg:block lg:col-span-5`}>
          {/* Mobile Back Button to Orders List */}
          <div className="lg:hidden mb-3">
            <button
              onClick={() => setMobileViewTab('list')}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-amber-400 text-xs font-semibold flex items-center gap-1.5 border border-stone-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Orders List</span>
            </button>
          </div>

          {selectedOrder ? (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
              
              {/* Order Header */}
              <div className="flex items-start justify-between border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-base sm:text-lg font-black text-amber-400">
                      {selectedOrder.orderId}
                    </h3>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 rounded font-bold bg-stone-800 text-stone-300">
                      {selectedOrder.orderType}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Order Time: <strong className="text-stone-200">{selectedOrder.timestamp}</strong>
                  </p>
                </div>

                <div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* Status Change Action Strip */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-1.5">
                  Update Order Status
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'preparing')}
                    className={`py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedOrder.status === 'preparing'
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-800 hover:bg-amber-950/60 text-stone-300 hover:text-amber-400 border border-stone-700'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>In Wok (Cooking)</span>
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'out_for_delivery')}
                    className={`py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedOrder.status === 'out_for_delivery'
                        ? 'bg-blue-600 text-white'
                        : 'bg-stone-800 hover:bg-blue-950/60 text-stone-300 hover:text-blue-400 border border-stone-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Out / Ready</span>
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'completed')}
                    className={`py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedOrder.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-stone-800 hover:bg-green-950/60 text-stone-300 hover:text-green-400 border border-stone-700'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Completed</span>
                  </button>

                  <button
                    onClick={() => onUpdateOrderStatus(selectedOrder.orderId, 'cancelled')}
                    className={`py-2 px-2.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      selectedOrder.status === 'cancelled'
                        ? 'bg-red-700 text-white'
                        : 'bg-stone-800 hover:bg-red-950/60 text-stone-400 hover:text-red-400 border border-stone-700'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-200">{selectedOrder.customerName}</span>
                  <span className="font-mono text-amber-400">{selectedOrder.phone}</span>
                </div>

                {selectedOrder.deliveryAddress && (
                  <div className="flex items-start gap-1.5 text-stone-400 text-[11px]">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{selectedOrder.deliveryAddress}</span>
                  </div>
                )}

                {selectedOrder.notes && (
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                    <strong>Note:</strong> "{selectedOrder.notes}"
                  </div>
                )}

                {/* Direct Actions: Call & WhatsApp */}
                <div className="pt-1.5 flex items-center gap-2">
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Customer</span>
                  </a>

                  <a
                    href={`https://wa.me/91${selectedOrder.phone}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.customerName}! Your order #${selectedOrder.orderId} from Vikas Chinese Adda is ${selectedOrder.status.toUpperCase()}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Itemized Order Breakdown */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400 block">
                  Ordered Dishes
                </span>
                <div className="divide-y divide-stone-800 border border-stone-800 rounded-xl overflow-hidden text-xs">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-2.5 bg-stone-950/40 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-stone-100">{item.name}</div>
                        <div className="text-[11px] text-stone-400 capitalize">
                          {item.portion} Portion · Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-200">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="p-2.5 bg-stone-950 flex justify-between font-bold text-sm">
                    <span>Total ({selectedOrder.paymentMethod.toUpperCase()})</span>
                    <span className="font-mono text-amber-400">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Print Receipt / KOT Button */}
              <button
                onClick={() => window.print()}
                className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-stone-700 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print KOT Ticket</span>
              </button>

            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-stone-900 border border-stone-800 text-stone-400 text-xs">
              Select an order from the list to view complete details and kitchen status.
            </div>
          )}
        </div>

      </div>

      {/* Manual Phone Order Entry Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-5 text-stone-100">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Punch New Order (Phone / Counter)
                </h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualOrderSubmit} className="mt-3.5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Phone"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-400 mb-1">Order Type</label>
                  <select
                    value={newOrderType}
                    onChange={(e) => setNewOrderType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white"
                  >
                    <option value="delivery">Delivery</option>
                    <option value="takeaway">Takeaway Counter</option>
                    <option value="dinein">Dine-In Table</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Payment Method</label>
                  <div className="w-full px-3 py-2 bg-stone-800/80 border border-stone-700 rounded-lg text-emerald-400 font-medium">
                    Cash on Delivery (COD)
                  </div>
                </div>
              </div>

              {newOrderType === 'delivery' && (
                <div>
                  <label className="block text-stone-400 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    placeholder="Address in I.C. Colony / Ganpati Nagar / New Link Rd"
                    value={newCustAddress}
                    onChange={(e) => setNewCustAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white"
                  />
                </div>
              )}

              {/* Add Dishes from Menu */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="font-bold text-amber-400 block">Select Dishes to Add</span>
                <div className="flex gap-2">
                  <select
                    value={selectedDishId}
                    onChange={(e) => setSelectedDishId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white text-xs truncate"
                  >
                    {MENU_ITEMS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (H: ₹{m.halfPrice} / F: ₹{m.fullPrice})
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedDishPortion}
                    onChange={(e) => setSelectedDishPortion(e.target.value as Portion)}
                    className="px-2 py-1.5 bg-stone-800 border border-stone-700 rounded-lg text-white text-xs"
                  >
                    <option value="full">Full</option>
                    <option value="half">Half</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleAddItemToManualOrder}
                    className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold"
                  >
                    + Add
                  </button>
                </div>

                {/* Selected Items */}
                {newOrderItems.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newOrderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-stone-300">
                        <span>{item.name} ({item.portion}) x{item.quantity}</span>
                        <span className="font-mono text-amber-300">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-stone-400 mb-1">Cooking Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Extra spicy / extra schezwan dip"
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-800 border border-stone-700 rounded-lg text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-3 py-1.5 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newOrderItems.length === 0}
                  className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-bold disabled:opacity-50"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

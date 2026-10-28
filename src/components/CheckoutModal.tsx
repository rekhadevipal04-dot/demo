import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Phone, Mail, User, Clock, Banknote, ArrowRight } from 'lucide-react';
import { CartItem, OrderBooking } from '../types/restaurant';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: (order: OrderBooking) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderPlaced,
}) => {
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway' | 'dinein'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = orderType === 'delivery' ? (subtotal >= 300 ? 0 : 30) : 0;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'Please enter your full name';
    if (!phone.trim()) {
      newErrors.phone = 'Please enter your mobile phone number';
    } else if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your email for automated receipt';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Please enter your delivery street address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `VCA-${randomSuffix}`;

    setTimeout(() => {
      const order: OrderBooking = {
        orderId,
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        landmark: orderType === 'delivery' && landmark.trim() ? landmark.trim() : undefined,
        scheduledTime: orderType !== 'delivery' ? (scheduledTime.trim() || 'Within 20-30 mins') : undefined,
        paymentMethod: 'cod', // Strictly Cash on Delivery only
        items,
        subtotal,
        deliveryFee,
        total,
        status: 'new',
        timestamp: 'Just now',
        createdAt: Date.now(),
        notes: notes.trim() ? notes.trim() : undefined,
      };

      setIsSubmitting(false);
      onOrderPlaced(order);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                Order Booking & Details
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Vikas Chinese Adda (Pure Veg)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          
          {/* Order Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
              Select Order Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'delivery', label: 'Delivery', desc: 'Thane West' },
                { id: 'takeaway', label: 'Takeaway', desc: 'Counter' },
                { id: 'dinein', label: 'Dine-In', desc: 'Table' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setOrderType(type.id as any)}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    orderType === type.id
                      ? 'border-red-600 dark:border-amber-400 bg-red-50/60 dark:bg-stone-800 ring-1 ring-red-600 dark:ring-amber-400 font-bold'
                      : 'border-stone-200 dark:border-stone-750 bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm block">
                    {type.label}
                  </span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 block mt-0.5">
                    {type.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
              Customer Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {errors.customerName && <p className="text-[11px] text-red-500 mt-0.5">{errors.customerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="10-digit Mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-500 mt-0.5">{errors.phone}</p>}
              </div>
            </div>

            {/* Email for automated confirmation */}
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Email Address (For Order Receipt) *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 mt-0.5">{errors.email}</p>}
            </div>
          </div>

          {/* Location / Timing */}
          {orderType === 'delivery' ? (
            <div className="space-y-2.5">
              <h3 className="text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide">
                Delivery Address (I.C. Colony / Ganpati Nagar / Pin 400103)
              </h3>
              <div>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <textarea
                    rows={2}
                    required
                    placeholder="Room/Flat No, Building Name, Ganpati Nagar, I.C. Colony, New Link Road"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                {errors.deliveryAddress && <p className="text-[11px] text-red-500 mt-0.5">{errors.deliveryAddress}</p>}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Landmark (e.g. Near Aai Mata Mandir)"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                Estimated Pickup / Table Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="e.g. In 20 minutes"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Payment Method: Strictly Cash on Delivery Only */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
              Payment Method
            </label>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 block">
                  Cash on Delivery (COD)
                </span>
                <span className="text-[11px] text-stone-600 dark:text-stone-400 block">
                  Pay cash directly when your food arrives at your doorstep or counter.
                </span>
              </div>
            </div>
          </div>

          {/* Cooking notes */}
          <div>
            <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
              Cooking Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Extra spicy / extra schezwan dip / less oil"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Order Summary Box */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Items Total ({items.length} items)</span>
              <span className="font-mono font-medium text-stone-900 dark:text-stone-200">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Delivery Fee ({orderType})</span>
              <span className="font-mono font-medium text-stone-900 dark:text-stone-200">
                {deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100">
              <span>Payable Cash on Delivery</span>
              <span className="font-mono text-base text-red-600 dark:text-amber-400">₹{total}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Order...</span>
            ) : (
              <>
                <span>Confirm Order · Pay ₹{total} Cash on Delivery</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};

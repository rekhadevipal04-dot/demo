import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Clock, 
  Banknote, 
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { CartItem, OrderBooking } from '../types/restaurant';
import { AVAILABLE_COUPONS, Coupon, validateCoupon, calculateCouponDiscount } from '../data/coupons';

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
  const [customerName, setCustomerName] = useState(() => {
    try { return localStorage.getItem('vca_customer_name') || ''; } catch { return ''; }
  });
  const [phone, setPhone] = useState(() => {
    try { return localStorage.getItem('vca_customer_phone') || ''; } catch { return ''; }
  });
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('vca_customer_email') || ''; } catch { return ''; }
  });
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    try { return localStorage.getItem('vca_customer_address') || ''; } catch { return ''; }
  });
  const [landmark, setLandmark] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // Calculate discount dynamically based on current subtotal
  const discount = appliedCoupon ? calculateCouponDiscount(appliedCoupon, subtotal) : 0;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const deliveryFee = orderType === 'delivery' ? (discountedSubtotal >= 300 ? 0 : 30) : 0;
  const total = discountedSubtotal + deliveryFee;

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply !== undefined ? codeToApply : couponCodeInput).trim().toUpperCase();
    setCouponError(null);
    setCouponSuccess(null);

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    const result = validateCoupon(code, subtotal);
    if (!result.isValid || !result.coupon) {
      setCouponError(result.error || 'Invalid coupon code.');
      return;
    }

    setAppliedCoupon(result.coupon);
    setCouponCodeInput(result.coupon.code);
    setCouponSuccess(`Coupon "${result.coupon.code}" applied! You saved ₹${result.discount}.`);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError(null);
    setCouponSuccess(null);
  };

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
        discount: discount > 0 ? discount : undefined,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        total,
        status: 'new',
        timestamp: 'Just now',
        createdAt: Date.now(),
        notes: notes.trim() ? notes.trim() : undefined,
      };

      try {
        localStorage.setItem('vca_customer_name', customerName.trim());
        localStorage.setItem('vca_customer_phone', phone.trim());
        localStorage.setItem('vca_customer_email', email.trim());
        if (deliveryAddress.trim()) {
          localStorage.setItem('vca_customer_address', deliveryAddress.trim());
        }
      } catch {
        // storage disabled or full
      }

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

          {/* Offers & Coupon Codes Section */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 uppercase tracking-wide">
                <Tag className="w-3.5 h-3.5 text-amber-500" />
                <span>Offers & Promo Coupons</span>
              </div>
              {appliedCoupon && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="w-2.5 h-2.5" />
                  Code Applied
                </span>
              )}
            </div>

            {appliedCoupon ? (
              /* Applied Coupon Success Box */
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 bg-emerald-500/20 rounded">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {appliedCoupon.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                      You are saving <strong>₹{discount}</strong> on this order!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="px-2.5 py-1 text-xs font-semibold text-stone-600 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 bg-white/80 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md transition-colors shrink-0"
                  title="Remove coupon"
                >
                  Remove
                </button>
              </div>
            ) : (
              /* Coupon Input Box & Available Offers */
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code (e.g. VIKAS50)"
                    value={couponCodeInput}
                    onChange={(e) => {
                      setCouponCodeInput(e.target.value.toUpperCase());
                      if (couponError) setCouponError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyCoupon();
                      }
                    }}
                    className="flex-1 px-3 py-2 text-xs sm:text-sm font-mono tracking-wider uppercase rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:normal-case placeholder:tracking-normal placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCodeInput.trim()}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-stone-950 text-xs font-bold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{couponError}</span>
                  </div>
                )}

                {/* Available Offers / Tap to Apply */}
                <div>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-semibold block mb-1.5">
                    Available Coupons (Tap to apply):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {AVAILABLE_COUPONS.map((cp) => {
                      const isEligible = subtotal >= cp.minOrderAmount;
                      const shortDiff = cp.minOrderAmount - subtotal;
                      return (
                        <button
                          key={cp.code}
                          type="button"
                          onClick={() => handleApplyCoupon(cp.code)}
                          className={`p-2 rounded-lg text-left border transition-all flex items-center justify-between gap-1.5 ${
                            isEligible
                              ? 'bg-white dark:bg-stone-800 border-amber-500/30 hover:border-amber-500 hover:bg-amber-50/40 dark:hover:bg-stone-750'
                              : 'bg-stone-100/70 dark:bg-stone-850/50 border-stone-200 dark:border-stone-800 opacity-75'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] font-extrabold text-amber-600 dark:text-amber-400">
                                {cp.code}
                              </span>
                              <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 truncate">
                                {cp.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate">
                              {isEligible ? cp.description : `Add ₹${shortDiff} more to unlock`}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                              isEligible
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-200 dark:bg-stone-700 text-stone-500 dark:text-stone-400'
                            }`}
                          >
                            {isEligible ? 'Apply' : `₹${cp.minOrderAmount}+`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Box */}
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Items Total ({items.length} items)</span>
              <span className="font-mono font-medium text-stone-900 dark:text-stone-200">₹{subtotal}</span>
            </div>

            {discount > 0 && appliedCoupon && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                </span>
                <span className="font-mono font-bold">-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600 dark:text-stone-400">
              <span>Delivery Fee ({orderType})</span>
              <span className="font-mono font-medium text-stone-900 dark:text-stone-200">
                {deliveryFee === 0 ? <strong className="text-green-600">FREE</strong> : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100">
              <div>
                <span>Payable Cash on Delivery</span>
                {discount > 0 && (
                  <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">
                    🎉 You saved ₹{discount} with {appliedCoupon?.code}
                  </span>
                )}
              </div>
              <div className="text-right">
                {discount > 0 && (
                  <span className="line-through text-xs font-mono text-stone-400 block -mb-0.5">
                    ₹{subtotal + deliveryFee}
                  </span>
                )}
                <span className="font-mono text-base text-red-600 dark:text-amber-400">₹{total}</span>
              </div>
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

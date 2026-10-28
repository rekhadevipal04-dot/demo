import React, { useState } from 'react';
import { CheckCircle2, Mail, MessageSquare, Printer, Clock, MapPin, Phone, ExternalLink, X, ChefHat } from 'lucide-react';
import { OrderBooking } from '../types/restaurant';
import { RESTAURANT_INFO } from '../data/menuData';

interface OrderConfirmationModalProps {
  order: OrderBooking | null;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'email'>('status');
  const [emailResent, setEmailResent] = useState(false);

  if (!order) return null;

  // Build pre-formatted WhatsApp text
  const itemsText = order.items
    .map(i => `• ${i.name} (${i.portion.toUpperCase()}) x${i.quantity} = ₹${i.price * i.quantity}`)
    .join('\n');

  const waMessage = encodeURIComponent(
    `*NEW ORDER - VIKAS CHINESE ADDA*\n` +
    `*Order ID:* ${order.orderId}\n` +
    `*Customer:* ${order.customerName}\n` +
    `*Phone:* ${order.phone}\n` +
    `*Type:* ${order.orderType.toUpperCase()}\n` +
    (order.deliveryAddress ? `*Address:* ${order.deliveryAddress}\n` : '') +
    `\n*ITEMS:*\n${itemsText}\n\n` +
    `*Total Amount:* ₹${order.total}\n` +
    `*Payment Mode:* CASH ON DELIVERY (COD)\n` +
    (order.notes ? `*Special Notes:* ${order.notes}\n` : '') +
    `Please confirm preparation!`
  );

  const waLink = `https://wa.me/91${RESTAURANT_INFO.phone}?text=${waMessage}`;

  const handleResendEmail = () => {
    setEmailResent(true);
    setTimeout(() => setEmailResent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-3 sm:my-6">
        
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 p-4 sm:p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xs mb-3">
            <CheckCircle2 className="w-7 h-7 text-amber-300" />
          </div>

          <h2 className="font-display text-2xl font-black">
            Order Successfully Placed!
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            Order Reference: <strong className="font-mono text-white tracking-wider">{order.orderId}</strong>
          </p>
        </div>

        {/* Tab Toggle: Order Status vs Email Confirmation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'status'
                ? 'border-red-600 text-red-600 dark:text-amber-400 dark:border-amber-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Kitchen & Delivery Status</span>
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 border-b-2 ${
              activeTab === 'email'
                ? 'border-red-600 text-red-600 dark:text-amber-400 dark:border-amber-400 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Automated Confirmation Email</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[65vh] overflow-y-auto">
          {activeTab === 'status' ? (
            <div className="space-y-6">
              
              {/* Preparation Timeline */}
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold mb-3">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Estimated Ready / Delivery:</span>
                  </span>
                  <span className="font-mono text-sm font-bold">25 - 35 Mins</span>
                </div>

                {/* Progress Bar */}
                <div className="relative flex items-center justify-between text-[11px] text-stone-500 pt-2">
                  <div className="flex flex-col items-center z-10">
                    <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                    <span className="mt-1 font-semibold text-stone-800 dark:text-stone-200">Received</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-green-500 mx-2"></div>
                  <div className="flex flex-col items-center z-10">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">●</span>
                    <span className="mt-1 font-semibold text-amber-600 dark:text-amber-400">Tossing in Wok</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-stone-300 dark:bg-stone-700 mx-2"></div>
                  <div className="flex flex-col items-center z-10">
                    <span className="w-5 h-5 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-600 dark:text-stone-400 flex items-center justify-center text-[10px] font-bold">3</span>
                    <span className="mt-1">Dispatched</span>
                  </div>
                </div>
              </div>

              {/* Order Items Itemization */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400 mb-2">
                  Ordered Pure Veg Dishes
                </h4>
                <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-3 bg-stone-50/50 dark:bg-stone-850/50 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {item.name}
                        </div>
                        <div className="text-stone-500 text-[11px] capitalize">
                          {item.portion} Portion · Qty: {item.quantity}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-stone-100 dark:bg-stone-800 flex justify-between items-center font-bold text-sm">
                    <span>Total Amount (Cash on Delivery)</span>
                    <span className="font-mono text-red-600 dark:text-amber-400">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info & Quick WhatsApp Push */}
              <div className="space-y-3">
                {order.deliveryAddress && (
                  <div className="text-xs text-stone-600 dark:text-stone-400 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Delivery to:</strong> {order.deliveryAddress} {order.landmark ? `(Landmark: ${order.landmark})` : ''}</span>
                  </div>
                )}

                {/* Direct WhatsApp sync button */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Order Copy Directly to Vikas Chinese WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          ) : (
            /* Automated Confirmation Email Preview Tab */
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-stone-100 dark:bg-stone-800 text-xs flex items-center justify-between text-stone-600 dark:text-stone-300">
                <div className="truncate">
                  <span>To: </span>
                  <strong className="text-stone-900 dark:text-stone-100">{order.email}</strong>
                </div>
                <button
                  onClick={handleResendEmail}
                  className="text-xs font-semibold text-red-600 dark:text-amber-400 hover:underline shrink-0"
                >
                  {emailResent ? '✓ Email Sent!' : 'Resend Email'}
                </button>
              </div>

              {/* Realistic Email Box Rendering */}
              <div className="border border-stone-200 dark:border-stone-750 rounded-xl overflow-hidden bg-white text-stone-900 shadow-sm font-sans text-xs">
                {/* Email Client Header */}
                <div className="bg-stone-900 text-stone-200 px-4 py-3 border-b border-stone-800">
                  <div className="text-[11px] text-stone-400">From: Vikas Chinese Adda (Pure Veg)</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    Order Confirmation #{order.orderId} - Vikas Chinese Adda
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-5 space-y-4 bg-stone-50/50">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <h5 className="font-bold text-base text-red-900">Vikas Chinese Adda</h5>
                      <p className="text-[11px] text-stone-500">Koras Road, Sawarkar Nagar, Thane West</p>
                    </div>
                    <span className="inline-flex items-center justify-center w-5 h-5 border border-green-600 bg-white p-0.5 rounded-xs" title="100% Pure Veg">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-600"></span>
                    </span>
                  </div>

                  <p className="text-stone-700">
                    Dear <strong>{order.customerName}</strong>, thank you for your order! Your delicious Indo-Chinese meal is now being prepared in our pure vegetarian kitchen.
                  </p>

                  <div className="bg-white rounded-lg border border-stone-200 p-3 space-y-2">
                    <div className="font-semibold text-stone-800">Order Details:</div>
                    <ul className="space-y-1">
                      {order.items.map((i) => (
                        <li key={i.id} className="flex justify-between text-stone-600">
                          <span>{i.name} ({i.portion}) x{i.quantity}</span>
                          <span className="font-mono">₹{i.price * i.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                      <span>Total (incl. delivery):</span>
                      <span className="font-mono text-red-700">₹{order.total}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 space-y-1">
                    <div><strong>Delivery Location:</strong> {order.deliveryAddress || 'Counter Pickup'}</div>
                    <div><strong>Estimated Delivery:</strong> 25-35 minutes</div>
                    <div><strong>Kitchen Contact:</strong> +91 8108939791</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs">
          <span className="text-stone-500">Need help? Call <strong className="text-stone-800 dark:text-stone-200">8108939791</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

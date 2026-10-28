import React from 'react';
import { MessageSquare, Phone, MapPin, ExternalLink, Instagram } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const SocialFeedSection: React.FC = () => {
  return (
    <section id="social" className="py-16 sm:py-20 bg-stone-50 dark:bg-stone-900/60 text-stone-900 dark:text-stone-100 transition-colors border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-red-600 dark:text-amber-400 font-bold mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Connect With Us</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            Follow Our Pages
          </h2>
          <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-400">
            Stay connected with Vikas Chinese Adda for special offers, new dish updates, and direct orders in I.C. Colony & New Link Road (Pin: 400103).
          </p>
        </div>

        {/* Real Social Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          
          {/* WhatsApp Direct Connect */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                WhatsApp Orders
              </h3>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Send your food order, table inquiry, or delivery address directly to our WhatsApp number.
              </p>
              <div className="mt-3 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                +91 {RESTAURANT_INFO.phone}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-750">
              <a
                href={RESTAURANT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Google Maps Page */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                Google Maps Page
              </h3>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Check our live location, get driving directions, and view authentic photos at Shop No. 5, Gali No. 3, Ganpati Nagar, New Link Road, I.C. Colony (400103).
              </p>
              <div className="mt-3 text-xs text-stone-500 font-medium truncate">
                Shop No. 5, Gali No. 3, Ganpati Nagar, I.C. Colony (400103)
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-750">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Phone Hotline */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
            <div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-stone-900 dark:text-stone-100">
                Call Restaurant Directly
              </h3>
              <p className="mt-1 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Speak directly with our team to inquire about pure veg dishes or schedule your takeaway order.
              </p>
              <div className="mt-3 font-mono text-sm font-bold text-red-600 dark:text-amber-400">
                {RESTAURANT_INFO.phoneFormatted}
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-stone-100 dark:border-stone-750">
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {RESTAURANT_INFO.phone}</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

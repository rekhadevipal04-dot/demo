import React, { useState } from 'react';
import { MapPin, Phone, Clock, Navigation, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const LocationSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(RESTAURANT_INFO.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="location" className="py-16 sm:py-24 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-red-600 dark:text-red-400 font-bold mb-2">
            <MapPin className="w-4 h-4" />
            <span>Visit Us or Order In</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight">
            Location & Contact Details
          </h2>
          <p className="mt-2 text-xs sm:text-base text-stone-600 dark:text-stone-400">
            Conveniently situated at Shop No. 5, Gali No. 3, Ganpati Nagar, New Link Road, I.C. Colony (PIN: 400103). Drop by for sizzling pure veg Chinese wok bowls or call for home delivery.
          </p>
        </div>

        {/* Content Split: Details Cards + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Address Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-bold text-stone-400">
                  Restaurant Address
                </span>
                <span className="inline-flex items-center justify-center w-4 h-4 border border-green-600 bg-white p-0.5 rounded-xs" title="100% Pure Veg">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    Vikas Chinese Adda (Pure Veg)
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {RESTAURANT_INFO.address}
                  </p>
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Landmark: {RESTAURANT_INFO.landmark}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleCopyAddress}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-750 text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Address Copied!' : 'Copy Address'}</span>
                </button>

                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
              <span className="text-xs uppercase tracking-wider font-bold text-stone-400 block">
                Operating Hours
              </span>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="flex justify-between gap-6">
                    <span className="text-stone-600 dark:text-stone-400">Afternoon Shift:</span>
                    <strong className="font-mono text-stone-900 dark:text-stone-100">{RESTAURANT_INFO.hoursLunch}</strong>
                  </div>
                  <div className="flex justify-between gap-6">
                    <span className="text-stone-600 dark:text-stone-400">Evening / Dinner:</span>
                    <strong className="font-mono text-stone-900 dark:text-stone-100">{RESTAURANT_INFO.hoursDinner}</strong>
                  </div>
                  <p className="text-[11px] text-green-600 dark:text-green-400 pt-1 font-medium">
                    ✓ Open 7 Days a Week (including Holidays)
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Contact Hotline */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-800 to-amber-900 text-white shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-200 font-semibold block">Order & Table Booking</span>
                <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight">
                  {RESTAURANT_INFO.phoneFormatted}
                </span>
                <span className="text-xs text-stone-300 block mt-0.5">Mob: {RESTAURANT_INFO.phone}</span>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${RESTAURANT_INFO.phone}`}
                  className="px-4 py-2 rounded-xl bg-white text-stone-900 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                  <span>Call Now</span>
                </a>
                <a
                  href={RESTAURANT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Map Embed */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md bg-stone-200 dark:bg-stone-900 relative min-h-[340px] flex flex-col">
            <iframe
              title="Vikas Chinese Adda Google Maps Location"
              src="https://maps.google.com/maps?q=Shop+No+5+Gali+No+3+Ganpati+Nagar+New+Link+Road+IC+Colony+400103+Mumbai&t=&z=16&ie=UTF8&iwloc=&output=embed"
              className="w-full flex-1 min-h-[320px] sm:min-h-[340px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Overlay banner with direct link to Google Maps app link */}
            <div className="p-3 sm:p-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0"></span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 text-xs sm:text-sm">
                  Shop No. 5, Gali No. 3, Ganpati Nagar, New Link Rd, I.C. Colony (400103)
                </span>
              </div>

              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-red-700 dark:text-amber-400 font-bold hover:underline ml-auto"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

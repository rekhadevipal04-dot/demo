import React from 'react';
import { ChefLogo } from './ChefLogo';
import { RESTAURANT_INFO } from '../data/menuData';
import { Phone, MapPin, Clock, ExternalLink, ShieldAlert } from 'lucide-react';

export interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <ChefLogo size="md" showText={true} />
            <p className="text-stone-400 leading-relaxed text-xs">
              Trusted destination in I.C. Colony, New Link Road for 100% pure vegetarian Indo-Chinese delicacies. Fast wok tossing, signature triple schezwan dishes, and unforgettable flavors.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 underline underline-offset-4 text-xs font-semibold"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#menu" className="hover:text-amber-400 transition-colors">Full Food Menu (40+ Items)</a></li>
              <li><a href="#signatures" className="hover:text-amber-400 transition-colors">Chef's Signature Dishes</a></li>
              <li><a href="#reviews" className="hover:text-amber-400 transition-colors">Google Customer Reviews</a></li>
              <li><a href="#location" className="hover:text-amber-400 transition-colors">Google Map & Location</a></li>
              <li><a href="#social" className="hover:text-amber-400 transition-colors">Instagram & Special Offers</a></li>
            </ul>
          </div>

          {/* Col 3: Hours & Timing */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Service Hours
            </h4>
            <div className="space-y-2 text-stone-400">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Lunch Service</div>
                  <div>12:00 PM – 04:00 PM</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-medium">Dinner & Late Night</div>
                  <div>07:00 PM – 12:00 Midnight</div>
                </div>
              </div>
              <p className="text-green-400 text-[11px] font-medium pt-1">
                Open All 7 Days
              </p>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Contact & Directions
            </h4>
            <div className="space-y-2.5 text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>Shop No. 5, Gali No. 3, Ganpati Nagar, New Link Road, I.C. Colony, Mumbai - 400103</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-white font-mono text-amber-300">
                  +91 {RESTAURANT_INFO.phone}
                </a>
              </div>
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Vikas Chinese Adda. All rights reserved. 100% Pure Vegetarian.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="text-stone-400 hover:text-amber-400 transition-colors"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

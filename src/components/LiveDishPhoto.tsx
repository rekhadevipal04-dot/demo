import React, { useState } from 'react';

export type DishPhotoType = 
  | 'rice' 
  | 'noodles' 
  | 'paneer' 
  | 'manchurian' 
  | 'soup' 
  | 'crispy' 
  | 'bhel' 
  | 'mushroom';

interface LiveDishPhotoProps {
  dish: DishPhotoType;
  className?: string;
  alt?: string;
  customUrl?: string;
}

export const LiveDishPhoto: React.FC<LiveDishPhotoProps> = ({
  dish,
  className = '',
  alt = 'Delicious Wok Dish',
  customUrl,
}) => {
  const [imgError, setImgError] = useState(false);

  // High-definition curated photography matching exact Indo-Chinese dishes
  const primaryPhotos: Record<DishPhotoType, string> = {
    rice: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    noodles: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    paneer: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    manchurian: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    soup: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    crispy: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    bhel: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    mushroom: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  };

  // The 4 authentic bottom photos from physical menu card:
  // /assets/aistudio/WhatsApp_Image_2026-10-27_at_10.22.34_AM_8502d632.jpeg
  const menuCardSprites: Record<string, React.CSSProperties> = {
    rice: {
      backgroundImage: `url('/assets/aistudio/WhatsApp_Image_2026-10-27_at_10.22.34_AM_8502d632.jpeg')`,
      backgroundSize: '400% auto',
      backgroundPosition: '0% 98%',
      backgroundRepeat: 'no-repeat',
    },
    noodles: {
      backgroundImage: `url('/assets/aistudio/WhatsApp_Image_2026-10-27_at_10.22.34_AM_8502d632.jpeg')`,
      backgroundSize: '400% auto',
      backgroundPosition: '33.33% 98%',
      backgroundRepeat: 'no-repeat',
    },
    paneer: {
      backgroundImage: `url('/assets/aistudio/WhatsApp_Image_2026-10-27_at_10.22.34_AM_8502d632.jpeg')`,
      backgroundSize: '400% auto',
      backgroundPosition: '66.66% 98%',
      backgroundRepeat: 'no-repeat',
    },
    manchurian: {
      backgroundImage: `url('/assets/aistudio/WhatsApp_Image_2026-10-27_at_10.22.34_AM_8502d632.jpeg')`,
      backgroundSize: '400% auto',
      backgroundPosition: '100% 98%',
      backgroundRepeat: 'no-repeat',
    },
  };

  const fallbacks: Record<DishPhotoType, { emoji: string; bg: string; title: string }> = {
    rice: { emoji: '🍚', bg: 'from-red-900 to-amber-900', title: 'Triple Schezwan Rice' },
    noodles: { emoji: '🥢', bg: 'from-amber-950 to-red-950', title: 'Veg Hakka Noodles' },
    paneer: { emoji: '🧀', bg: 'from-red-950 to-orange-950', title: 'Paneer Chilly Dry' },
    manchurian: { emoji: '🥘', bg: 'from-stone-900 to-red-950', title: 'Veg Manchurian Gravy' },
    soup: { emoji: '🥣', bg: 'from-stone-900 to-amber-950', title: 'Manchow Soup' },
    crispy: { emoji: '🔥', bg: 'from-orange-950 to-red-950', title: 'Paneer Crispy' },
    bhel: { emoji: '🥢', bg: 'from-red-900 to-amber-900', title: 'Chinese Bhel' },
    mushroom: { emoji: '🍄', bg: 'from-stone-900 to-stone-850', title: 'Mushroom Chilly Dry' },
  };

  const targetUrl = customUrl || primaryPhotos[dish];

  if (!imgError && targetUrl) {
    return (
      <div className={`relative overflow-hidden bg-stone-950 select-none ${className}`}>
        <img
          src={targetUrl}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // If online image fails, use the physical menu card crop if available (rice, noodles, paneer, manchurian)
  if (menuCardSprites[dish]) {
    return (
      <div
        className={`relative overflow-hidden bg-stone-950 select-none group-hover:scale-105 transition-transform duration-500 ${className}`}
        style={menuCardSprites[dish]}
        title={alt}
      />
    );
  }

  // Graceful artistic food badge fallback
  const fb = fallbacks[dish] || fallbacks.rice;
  return (
    <div className={`w-full h-full bg-gradient-to-br ${fb.bg} flex flex-col items-center justify-center p-3 text-center select-none ${className}`}>
      <span className="text-3xl mb-1">{fb.emoji}</span>
      <span className="text-xs font-bold text-amber-200">{fb.title}</span>
    </div>
  );
};

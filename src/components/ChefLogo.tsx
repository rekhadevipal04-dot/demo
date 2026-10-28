import React, { useState } from 'react';

interface ChefLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export const ChefLogo: React.FC<ChefLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const dimensionMap = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Authentic Chef Logo from the menu image */}
      <div
        className={`relative ${dimensionMap[size]} rounded-full overflow-hidden border-2 border-amber-400 bg-red-950 shadow-md shrink-0 flex items-center justify-center`}
      >
        {!imageError ? (
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-27_at_10.22.34_AM_8502d632.jpeg"
            alt="Vikas Chinese Adda Chef Logo"
            className="absolute max-w-none pointer-events-none select-none"
            style={{
              width: '380%',
              height: 'auto',
              top: '-10%',
              left: '-44%',
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-res SVG chef fallback */
          <div className="w-full h-full bg-gradient-to-br from-red-800 to-amber-900 flex items-center justify-center text-amber-200">
            <svg
              className="w-3/5 h-3/5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a4 4 0 0 0-4 4c0 .4.06.78.16 1.15A3.5 3.5 0 0 0 5 10.5a3.5 3.5 0 0 0 3.5 3.5H15.5A3.5 3.5 0 0 0 19 10.5a3.5 3.5 0 0 0-3.16-3.35A4 4 0 0 0 12 2zm-4.5 14h9a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18.5v-1A1.5 1.5 0 0 1 7.5 16z" />
            </svg>
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-display font-extrabold text-xl tracking-tight text-white">
              Vikas Chinese Adda
            </span>
            <span className="inline-flex items-center justify-center w-4 h-4 border border-green-600 bg-white p-0.5 rounded-xs" title="100% Pure Veg">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
            </span>
          </div>
          <span className="text-xs text-amber-300 font-medium tracking-wide">
            Pure Veg Indo-Chinese · I.C. Colony · Pin 400103
          </span>
        </div>
      )}
    </div>
  );
};

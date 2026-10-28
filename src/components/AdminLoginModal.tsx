import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const ADMIN_PASSWORD = 'vikas2813';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Galat password! Kripya sahi password (vikas2813) darj karein.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-sm sm:max-w-md bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl p-5 sm:p-6 text-stone-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Admin Panel Login
              </h3>
              <p className="text-[11px] text-stone-400">
                Vikas Chinese Adda · Secure Access
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">
              Enter Admin Password:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Password darj karein..."
                className="w-full pl-9 pr-10 py-2.5 bg-stone-950 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white shadow-md transition-all"
            >
              Unlock Admin
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

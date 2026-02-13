import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { LogIn, LogOut, Crown } from 'lucide-react';

export function AuthButton() {
  const { user, isPremium, signInWithGoogle, signOut } = useAuthStore();
  const lang = useSettingsStore((s) => s.settings.language);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (user) {
    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={t(lang, 'auth.account')}
          className="focus:outline-none"
        >
          <img
            src={user.photoURL || ''}
            alt={user.displayName || ''}
            className="w-8 h-8 rounded-full ring-2 ring-amber-500/50 hover:ring-amber-500 transition-all"
            referrerPolicy="no-referrer"
          />
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {isPremium && (
                <span className="inline-flex items-center gap-1 mt-1 text-xs text-amber-600 font-semibold">
                  <Crown className="w-3 h-3" /> {t(lang, 'premium.badge')}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t(lang, 'auth.signOut')}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline">{t(lang, 'auth.signIn')}</span>
    </button>
  );
}

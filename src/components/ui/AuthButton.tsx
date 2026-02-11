import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { LogIn } from 'lucide-react';

export function AuthButton() {
  const { user, signInWithGoogle } = useAuthStore();
  const lang = useSettingsStore((s) => s.settings.language);

  if (user) {
    return (
      <img
        src={user.photoURL || ''}
        alt={user.displayName || ''}
        className="w-8 h-8 rounded-full ring-2 ring-amber-500/50"
        referrerPolicy="no-referrer"
      />
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

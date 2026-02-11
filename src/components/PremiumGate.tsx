import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { t } from '../utils/i18n';

interface PremiumGateProps {
  feature: string;
  children: React.ReactNode;
}

export function PremiumGate({ feature, children }: PremiumGateProps) {
  const isPremium = useAuthStore((s) => s.isPremium);
  const lang = useSettingsStore((s) => s.settings.language);

  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-30 blur-[2px] select-none">
        {children}
      </div>
      <Link
        to="/premium"
        className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl gap-3 group"
      >
        <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
          <Lock className="w-7 h-7 text-amber-500" />
        </div>
        <span className="text-white font-bold text-sm">
          {t(lang, 'premium.unlock')} — {feature}
        </span>
        <span className="text-amber-400 text-xs font-semibold">
          {t(lang, 'premium.support')}
        </span>
      </Link>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { initializePayment, CURRENCY_OPTIONS } from '../../lib/cinetpay';
import {
  Crown,
  Palette,
  Monitor,
  LayoutDashboard,
  Moon,
  Award,
  Download,
  Sparkles,
  Check,
  LogIn,
  PartyPopper,
} from 'lucide-react';

const PREMIUM_FEATURES = [
  { icon: Palette, key: 'premium.features.themes' },
  { icon: Monitor, key: 'premium.features.amoled' },
  { icon: LayoutDashboard, key: 'premium.features.dashboard' },
  { icon: Moon, key: 'premium.features.screensaver' },
  { icon: Award, key: 'premium.features.badge' },
  { icon: Download, key: 'premium.features.exportHD' },
  { icon: Sparkles, key: 'premium.features.earlyAccess' },
];

function PremiumScreen() {
  const { user, isPremium, premiumSince, signInWithGoogle } = useAuthStore();
  const lang = useSettingsStore((s) => s.settings.language);
  const [selectedCurrency, setSelectedCurrency] = useState(0);
  const [selectedAmountIdx, setSelectedAmountIdx] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [justActivated, setJustActivated] = useState(false);

  const currOpt = CURRENCY_OPTIONS[selectedCurrency];
  const amount = currOpt.amounts[selectedAmountIdx] ?? currOpt.amounts[1];

  const handlePayment = () => {
    if (!user) return;
    setIsProcessing(true);
    initializePayment(
      user,
      amount,
      currOpt.code,
      () => {
        setIsProcessing(false);
        setJustActivated(true);
      },
      () => setIsProcessing(false)
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            {t(lang, 'premium.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {t(lang, 'premium.desc')}
          </p>
        </div>

        {/* Success animation after payment */}
        <AnimatePresence>
          {justActivated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-none text-center py-8">
                <PartyPopper className="w-12 h-12 mx-auto mb-3" />
                <h2 className="text-2xl font-black mb-2">{t(lang, 'premium.badge')}</h2>
                <p className="text-lg opacity-90">{t(lang, 'premium.thanks')}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium badge if already premium */}
        {isPremium && !justActivated && (
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none">
            <div className="flex items-center gap-4 p-2">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-lg">{t(lang, 'premium.badge')}</p>
                <p className="text-sm opacity-90">
                  {t(lang, 'premium.thanks')}
                  {premiumSince && (
                    <span className="ml-2">
                      — {premiumSince.toLocaleDateString()}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Features list */}
        <Card>
          <h2 className="text-xl font-bold mb-4">{t(lang, 'premium.featuresTitle')}</h2>
          <div className="space-y-3">
            {PREMIUM_FEATURES.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-medium">{t(lang, key)}</span>
                {isPremium && <Check className="w-5 h-5 text-green-500 ml-auto" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Action area */}
        {!user ? (
          <Card className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              {t(lang, 'premium.loginFirst')}
            </p>
            <Button variant="primary" onClick={signInWithGoogle} className="mx-auto">
              <LogIn className="w-5 h-5 mr-2" />
              {t(lang, 'auth.signInGoogle')}
            </Button>
          </Card>
        ) : !isPremium ? (
          <Card className="space-y-6">
            <h2 className="text-xl font-bold text-center">
              {t(lang, 'premium.chooseAmount')}
            </h2>

            {/* Currency selector */}
            <div>
              <select
                value={selectedCurrency}
                onChange={(e) => {
                  setSelectedCurrency(Number(e.target.value));
                  setSelectedAmountIdx(1);
                }}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 font-semibold"
              >
                {CURRENCY_OPTIONS.map((opt, i) => (
                  <option key={opt.code} value={i}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount selector */}
            <div className="grid grid-cols-3 gap-3">
              {currOpt.amounts.map((amt, i) => (
                <button
                  key={amt}
                  onClick={() => setSelectedAmountIdx(i)}
                  className={`p-4 rounded-xl border-2 font-bold text-center transition-all ${
                    selectedAmountIdx === i
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                  }`}
                >
                  {amt.toLocaleString()} {currOpt.code}
                </button>
              ))}
            </div>

            <Button
              variant="primary"
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full text-lg py-3"
            >
              <Crown className="w-5 h-5 mr-2" />
              {isProcessing
                ? t(lang, 'premium.processing')
                : t(lang, 'premium.support')}
            </Button>
            <p className="text-xs text-center text-gray-500">
              {t(lang, 'premium.paymentNote')}
            </p>
          </Card>
        ) : null}
      </motion.div>
    </div>
  );
}

export default PremiumScreen;

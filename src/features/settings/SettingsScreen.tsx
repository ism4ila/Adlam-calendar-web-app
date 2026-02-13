import { motion } from 'framer-motion';
import { useSettingsStore, type CulturalTheme, type SupportedLanguage, type ColorMode } from '../../store/useSettingsStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { t, languageLabels } from '../../utils/i18n';
import { themesMeta } from '../../utils/themes';
import { clockSkins } from '../../utils/clockSkins';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, Palette, Clock, Languages, Moon, Sun, Monitor, Type, RotateCcw, User, LogOut, Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

function SettingsScreen() {
    const { settings, updateSettings, resetSettings } = useSettingsStore();
    const { user, isPremium, signInWithGoogle, signOut } = useAuthStore();
    const lang = settings.language;

    const colorModes: { id: ColorMode; labelKey: string; icon: typeof Sun }[] = [
        { id: 'light', labelKey: 'settings.light', icon: Sun },
        { id: 'dark', labelKey: 'settings.dark', icon: Moon },
        { id: 'auto', labelKey: 'settings.system', icon: Monitor },
    ];

    const handleThemeSelect = (themeId: string, isThemePremium: boolean) => {
        if (isThemePremium && !isPremium) return;
        updateSettings({ culturalTheme: themeId as CulturalTheme });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                        {t(lang, 'settings.title')}
                    </h1>
                    <Button variant="outline" size="sm" onClick={resetSettings}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {t(lang, 'settings.reset')}
                    </Button>
                </div>

                <div className="grid gap-6">
                    {/* Account Section */}
                    <Card>
                        <div className="flex items-center gap-3 mb-6">
                            <User className="w-6 h-6 text-amber-600" />
                            <h2 className="text-xl font-bold">{t(lang, 'auth.account')}</h2>
                        </div>
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    {user.photoURL && (
                                        <img
                                            src={user.photoURL}
                                            alt=""
                                            className="w-12 h-12 rounded-full ring-2 ring-amber-500/50"
                                            referrerPolicy="no-referrer"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold truncate">{user.displayName}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    {isPremium && (
                                        <Link to="/premium" className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                                            <Crown className="w-3 h-3" />
                                            Premium
                                        </Link>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    {!isPremium && (
                                        <Link to="/premium">
                                            <Button variant="primary" size="sm">
                                                <Crown className="w-4 h-4 mr-2" />
                                                {t(lang, 'premium.support')}
                                            </Button>
                                        </Link>
                                    )}
                                    <Button variant="secondary" size="sm" onClick={signOut}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {t(lang, 'auth.signOut')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <Button variant="primary" onClick={signInWithGoogle}>
                                {t(lang, 'auth.signInGoogle')}
                            </Button>
                        )}
                    </Card>

                    {/* Language & Script */}
                    <Card>
                        <div className="flex items-center gap-3 mb-6">
                            <Languages className="w-6 h-6 text-amber-600" />
                            <h2 className="text-xl font-bold">{t(lang, 'settings.language')}</h2>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Object.entries(languageLabels).map(([code, label]) => (
                                <Button
                                    key={code}
                                    variant={settings.language === code ? 'primary' : 'secondary'}
                                    onClick={() => updateSettings({ language: code as SupportedLanguage })}
                                    className="justify-start"
                                >
                                    <Globe className="w-4 h-4 mr-2 opacity-50" />
                                    {label}
                                </Button>
                            ))}
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Type className="w-6 h-6 text-amber-600" />
                                <h3 className="font-bold text-lg">{t(lang, 'settings.script')}</h3>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant={settings.script === 'adlam' ? 'primary' : 'secondary'}
                                    onClick={() => updateSettings({ script: 'adlam' })}
                                    className="flex-1"
                                >
                                    𞤀𞤣𞤤𞤢𞤥 (Adlam)
                                </Button>
                                <Button
                                    variant={settings.script === 'latin' ? 'primary' : 'secondary'}
                                    onClick={() => updateSettings({ script: 'latin' })}
                                    className="flex-1"
                                >
                                    Latin
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Cultural Theme - 20 themes with gradient preview + premium gate */}
                    <Card>
                        <div className="flex items-center gap-3 mb-6">
                            <Palette className="w-6 h-6 text-amber-600" />
                            <h2 className="text-xl font-bold">{t(lang, 'settings.culturalTheme')}</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {themesMeta.map((theme) => {
                                const locked = theme.isPremium && !isPremium;
                                return (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeSelect(theme.id, theme.isPremium)}
                                        className={`group relative p-3 rounded-2xl border-2 transition-all ${
                                            locked
                                                ? 'border-transparent bg-gray-50 dark:bg-gray-800 opacity-60 cursor-not-allowed'
                                                : settings.culturalTheme === theme.id
                                                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 shadow-md'
                                                    : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                        }`}
                                    >
                                        <div
                                            className="w-full aspect-square rounded-xl mb-2 shadow-inner"
                                            style={{
                                                background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
                                            }}
                                        />
                                        <span className="font-bold text-xs block">{theme.name}</span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 block truncate">{theme.meaning}</span>
                                        {locked && (
                                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                <Lock className="w-2.5 h-2.5 text-white" />
                                            </div>
                                        )}
                                        {!locked && settings.culturalTheme === theme.id && (
                                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {!isPremium && (
                            <Link
                                to="/premium"
                                className="mt-4 flex items-center justify-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold"
                            >
                                <Crown className="w-4 h-4" />
                                {t(lang, 'premium.support')} — {t(lang, 'premium.features.themes')}
                            </Link>
                        )}
                    </Card>

                    {/* Clock Skin */}
                    <Card>
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="w-6 h-6 text-amber-600" />
                            <h2 className="text-xl font-bold">{t(lang, 'settings.clockSkin')}</h2>
                        </div>
                        <div className="flex gap-4 flex-wrap justify-center">
                            {clockSkins.map((skin) => (
                                <button
                                    key={skin.id}
                                    onClick={() => updateSettings({ clockSkin: skin.id })}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                                        settings.clockSkin === skin.id
                                            ? 'bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <div
                                        className="w-16 h-16 rounded-full border-4 shadow-lg"
                                        style={{
                                            borderColor: skin.colors.hourHand,
                                            background: `linear-gradient(135deg, ${skin.colors.minuteHand}, ${skin.colors.hourHand})`,
                                        }}
                                    />
                                    <span className="text-xs font-semibold">{skin.name}</span>
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Display & Time */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <div className="flex items-center gap-3 mb-6">
                                <Moon className="w-6 h-6 text-amber-600" />
                                <h2 className="text-xl font-bold">{t(lang, 'settings.darkMode')}</h2>
                            </div>
                            <div className="flex flex-col gap-2">
                                {colorModes.map((mode) => (
                                    <Button
                                        key={mode.id}
                                        variant={settings.colorMode === mode.id ? 'primary' : 'secondary'}
                                        onClick={() => updateSettings({ colorMode: mode.id })}
                                        className="justify-start"
                                    >
                                        <mode.icon className="w-4 h-4 mr-2" />
                                        {t(lang, mode.labelKey)}
                                    </Button>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center gap-3 mb-6">
                                <Clock className="w-6 h-6 text-amber-600" />
                                <h2 className="text-xl font-bold">{t(lang, 'settings.hourFormat')}</h2>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant={settings.hourFormat === 12 ? 'primary' : 'secondary'}
                                    onClick={() => updateSettings({ hourFormat: 12 })}
                                    className="flex-1"
                                >
                                    12h
                                </Button>
                                <Button
                                    variant={settings.hourFormat === 24 ? 'primary' : 'secondary'}
                                    onClick={() => updateSettings({ hourFormat: 24 })}
                                    className="flex-1"
                                >
                                    24h
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Info */}
                <div className="pt-8 text-center text-gray-500 text-sm">
                    <p>Adlam Tech Space Web v0.3.0</p>
                    <p>{t(lang, 'about.credits')}</p>
                </div>
            </motion.div>
        </div>
    );
}

export default SettingsScreen;

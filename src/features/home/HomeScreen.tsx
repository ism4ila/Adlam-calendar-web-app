import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Clock, Calendar, Compass, Keyboard, Grid3x3, GraduationCap,
    PenTool, FileText, ArrowLeftRight, Download, Smartphone, Share2,
    FileEdit, Gamepad2, Calculator, Palette, Type, Languages, Banana
} from 'lucide-react';
import { AnalogClock } from '../clock/components/AnalogClock';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t, getGreetingKey } from '../../utils/i18n';
import { toAdlamDigits } from '../../utils/adlamDigits';
import { useShare } from '../../hooks/useShare';
import type { LucideIcon } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface Feature {
    name: string;
    icon: LucideIcon;
    path: string;
    color: string;
    description: string;
}


function HomeScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;
    const [time, setTime] = useState(new Date());
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const { share } = useShare();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const installPWA = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    };

    const greeting = t(language, getGreetingKey(time.getHours()));
    const timeStr = time.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', { hour: '2-digit', minute: '2-digit' });
    const displayTime = settings.script === 'adlam' ? toAdlamDigits(timeStr) : timeStr;

    const categoryData: { labelKey: string; color: string; iconColor: string; features: Feature[] }[] = useMemo(() => [
        {
            labelKey: 'home.category.time',
            color: 'from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800',
            iconColor: 'text-amber-600',
            features: [
                { name: t(language, 'feature.clock.name'), icon: Clock, path: '/clock', color: 'from-amber-500 to-orange-600', description: t(language, 'feature.clock.desc') },
                { name: t(language, 'feature.calendar.name'), icon: Calendar, path: '/calendar', color: 'from-blue-500 to-cyan-600', description: t(language, 'feature.calendar.desc') },
                { name: t(language, 'feature.prayer.name'), icon: Compass, path: '/prayer', color: 'from-green-500 to-emerald-600', description: t(language, 'feature.prayer.desc') },
                { name: t(language, 'feature.converter.name'), icon: ArrowLeftRight, path: '/converter', color: 'from-blue-500 to-indigo-600', description: t(language, 'feature.converter.desc') },
            ],
        },
        {
            labelKey: 'home.category.writing',
            color: 'from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border-violet-200 dark:border-violet-800',
            iconColor: 'text-violet-600',
            features: [
                { name: t(language, 'feature.editor.name'), icon: PenTool, path: '/editor', color: 'from-violet-500 to-purple-600', description: t(language, 'feature.editor.desc') },
                { name: t(language, 'feature.keyboard.name'), icon: Keyboard, path: '/keyboard', color: 'from-indigo-500 to-blue-600', description: t(language, 'feature.keyboard.desc') },
                { name: t(language, 'feature.word.name'), icon: FileEdit, path: '/word', color: 'from-orange-500 to-red-600', description: t(language, 'feature.word.desc') },
                { name: t(language, 'feature.translator.name'), icon: Languages, path: '/translator', color: 'from-cyan-500 to-blue-600', description: t(language, 'feature.translator.desc') },
            ],
        },
        {
            labelKey: 'home.category.learning',
            color: 'from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 border-teal-200 dark:border-teal-800',
            iconColor: 'text-teal-600',
            features: [
                { name: t(language, 'feature.learning.name'), icon: GraduationCap, path: '/learning', color: 'from-teal-500 to-cyan-600', description: t(language, 'feature.learning.desc') },
                { name: t(language, 'feature.games.name'), icon: Gamepad2, path: '/games', color: 'from-lime-500 to-green-600', description: t(language, 'feature.games.desc') },
                { name: t(language, 'feature.nanobanana.name'), icon: Banana, path: '/nanobanana', color: 'from-yellow-400 to-amber-500', description: t(language, 'feature.nanobanana.desc') },
            ],
        },
        {
            labelKey: 'home.category.tools',
            color: 'from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-800',
            iconColor: 'text-yellow-600',
            features: [
                { name: t(language, 'feature.dashboard.name'), icon: Grid3x3, path: '/dashboard', color: 'from-yellow-500 to-amber-600', description: t(language, 'feature.dashboard.desc') },
                { name: t(language, 'feature.prayerpdf.name'), icon: FileText, path: '/prayer-pdf', color: 'from-emerald-500 to-green-600', description: t(language, 'feature.prayerpdf.desc') },
                { name: t(language, 'feature.calculator.name'), icon: Calculator, path: '/calculator', color: 'from-sky-500 to-blue-600', description: t(language, 'feature.calculator.desc') },
                { name: t(language, 'feature.design.name'), icon: Palette, path: '/design', color: 'from-pink-500 to-rose-600', description: t(language, 'feature.design.desc') },
                { name: t(language, 'feature.socialcards.name'), icon: Share2, path: '/social-cards', color: 'from-fuchsia-500 to-purple-600', description: t(language, 'feature.socialcards.desc') },
                { name: t(language, 'feature.fonts.name'), icon: Type, path: '/fonts', color: 'from-slate-500 to-gray-600', description: t(language, 'feature.fonts.desc') },
            ],
        },
    ], [language]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-12"
                >
                    {/* Hero Section with Analog Clock */}
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        {/* Left: Text */}
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-lg text-amber-700 dark:text-amber-400 font-semibold"
                            >
                                {greeting}
                            </motion.p>
                            <motion.h1
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="text-5xl md:text-7xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent leading-tight"
                            >
                                {t(language, 'home.hero.title')}
                            </motion.h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium max-w-md mx-auto lg:mx-0">
                                {t(language, 'home.hero.tagline')}
                            </p>
                            <div
                                className="text-4xl md:text-5xl font-black text-amber-600 dark:text-amber-400"
                                style={{ fontFamily: settings.script === 'adlam' ? 'Noto Sans Adlam' : 'inherit' }}
                            >
                                {displayTime}
                            </div>

                            {/* PWA Install Banner */}
                            {deferredPrompt && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Button variant="primary" size="lg" onClick={installPWA}>
                                        <Download className="w-5 h-5 mr-2" />
                                        {t(language, 'home.install')}
                                    </Button>
                                </motion.div>
                            )}

                            <div className="flex gap-3 justify-center lg:justify-start pt-2 flex-wrap">
                                <Link to="/editor">
                                    <Button variant="primary" size="lg">
                                        <PenTool className="w-5 h-5 mr-2" /> {t(language, 'home.cta.editor')}
                                    </Button>
                                </Link>
                                <Link to="/learning">
                                    <Button variant="outline" size="lg">
                                        <GraduationCap className="w-5 h-5 mr-2" /> {t(language, 'home.cta.learning')}
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={() => share({
                                        title: 'Adlam Tech Space',
                                        text: t(language, 'share.text'),
                                    })}
                                    aria-label={t(language, 'share.title')}
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Right: Analog Clock */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-full max-w-xs md:max-w-sm lg:max-w-md"
                        >
                            <AnalogClock />
                        </motion.div>
                    </div>

                    {/* Categorized Features */}
                    {categoryData.map((cat, catIndex) => (
                        <motion.div
                            key={cat.labelKey}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIndex * 0.1 }}
                        >
                            <Card className={`bg-gradient-to-br ${cat.color} border`}>
                                <h2 className={`text-2xl font-black mb-4 ${cat.iconColor}`}>
                                    {t(language, cat.labelKey)}
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {cat.features.map((feature, index) => (
                                        <motion.div
                                            key={feature.path}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                                        >
                                            <Link to={feature.path}>
                                                <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 text-center group hover:shadow-md transition-all h-full">
                                                    <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                                        <feature.icon className="w-6 h-6 text-white" />
                                                    </div>
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                                        {feature.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Play Store Banner */}
                    <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white max-w-2xl mx-auto">
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 items-center justify-center shrink-0">
                                <Smartphone className="w-8 h-8 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold">{t(language, 'home.mobileApp')}</h3>
                                <p className="text-sm text-gray-300">{t(language, 'home.mobileAppDesc')}</p>
                            </div>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.adlam.fulfulde.calendarclock"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0"
                            >
                                <img
                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                    alt="Get it on Google Play"
                                    className="h-12"
                                />
                            </a>
                        </div>
                    </Card>

                    {/* Footer Info */}
                    <div className="text-center text-gray-600 dark:text-gray-400">
                        <p className="text-sm">
                            {t(language, 'home.footer.pwa')} | {t(language, 'home.footer.offline')} | {t(language, 'home.footer.themes')}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default HomeScreen;

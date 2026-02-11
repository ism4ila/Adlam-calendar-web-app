import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
    Clock, Calendar, Compass, Keyboard, Grid3x3, GraduationCap,
    PenTool, FileText, ArrowLeftRight, Download, Smartphone, Share2
} from 'lucide-react';
import { AnalogClock } from '../clock/components/AnalogClock';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t, getGreetingKey } from '../../utils/i18n';
import { toAdlamDigits } from '../../utils/adlamDigits';
import { useShare } from '../../hooks/useShare';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
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

    const coreFeatures = [
        { name: t(language, 'feature.clock.name'), icon: Clock, path: '/clock', color: 'from-amber-500 to-orange-600', description: t(language, 'feature.clock.desc') },
        { name: t(language, 'feature.calendar.name'), icon: Calendar, path: '/calendar', color: 'from-blue-500 to-cyan-600', description: t(language, 'feature.calendar.desc') },
        { name: t(language, 'feature.prayer.name'), icon: Compass, path: '/prayer', color: 'from-green-500 to-emerald-600', description: t(language, 'feature.prayer.desc') },
        { name: t(language, 'feature.learning.name'), icon: GraduationCap, path: '/learning', color: 'from-teal-500 to-cyan-600', description: t(language, 'feature.learning.desc') },
    ];

    const webFeatures = [
        { name: t(language, 'feature.editor.name'), icon: PenTool, path: '/editor', color: 'from-violet-500 to-purple-600', description: t(language, 'feature.editor.desc') },
        { name: t(language, 'feature.prayerpdf.name'), icon: FileText, path: '/prayer-pdf', color: 'from-emerald-500 to-green-600', description: t(language, 'feature.prayerpdf.desc') },
        { name: t(language, 'feature.converter.name'), icon: ArrowLeftRight, path: '/converter', color: 'from-blue-500 to-indigo-600', description: t(language, 'feature.converter.desc') },
        { name: t(language, 'feature.keyboard.name'), icon: Keyboard, path: '/keyboard', color: 'from-indigo-500 to-blue-600', description: t(language, 'feature.keyboard.desc') },
        { name: t(language, 'feature.dashboard.name'), icon: Grid3x3, path: '/dashboard', color: 'from-yellow-500 to-amber-600', description: t(language, 'feature.dashboard.desc') },
    ];

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
                                ADLAM<br />CLOCK
                            </motion.h1>
                            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium max-w-md mx-auto lg:mx-0">
                                {t(language, 'home.tagline')}
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
                                        title: 'Adlam Calendar Clock',
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

                    {/* Core Features */}
                    <div>
                        <h2 className="text-3xl font-black text-center mb-8 text-gray-900 dark:text-white">
                            {t(language, 'home.features.title')}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {coreFeatures.map((feature, index) => (
                                <FeatureCard key={feature.path} feature={feature} index={index} />
                            ))}
                        </div>
                    </div>

                    {/* Web-Exclusive Tools */}
                    <div>
                        <h2 className="text-3xl font-black text-center mb-3 text-gray-900 dark:text-white">
                            {t(language, 'home.webtools.title')}
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                            {t(language, 'home.webtools.desc')}
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                            {webFeatures.map((feature, index) => (
                                <FeatureCard key={feature.path} feature={feature} index={index + coreFeatures.length} />
                            ))}
                        </div>
                    </div>

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

function FeatureCard({ feature, index }: { feature: { name: string; icon: any; path: string; color: string; description: string }; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
        >
            <Link to={feature.path}>
                <Card hover className="h-full text-center group">
                    <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                    </p>
                </Card>
            </Link>
        </motion.div>
    );
}

export default HomeScreen;

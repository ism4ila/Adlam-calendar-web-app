import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalogClock } from './components/AnalogClock';
import { DigitalClock } from './components/DigitalClock';
import { Volume2, VolumeX, Maximize, Clock, Monitor, Layers, Paintbrush } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { clockSkins } from '../../utils/clockSkins';

type ViewMode = 'analog' | 'digital' | 'both';

function ClockScreen() {
    const [viewMode, setViewMode] = useState<ViewMode>('both');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [showSkins, setShowSkins] = useState(false);
    const { settings, updateSettings } = useSettingsStore();
    const lang = settings.language;

    const speakTime = useCallback(() => {
        if (!('speechSynthesis' in window)) return;
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        let text: string;
        let speechLang: string;
        if (lang === 'ar') {
            text = `الساعة ${hours} و ${minutes} دقيقة`;
            speechLang = 'ar-SA';
        } else if (lang === 'fr') {
            text = `Il est ${hours} heures${minutes > 0 ? ` et ${minutes} minutes` : ''}`;
            speechLang = 'fr-FR';
        } else {
            text = `It is ${hours > 12 ? hours - 12 : hours} ${minutes > 0 ? `and ${minutes} minutes` : ''} ${hours >= 12 ? 'PM' : 'AM'}`;
            speechLang = 'en-US';
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechLang;
        speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
    }, [lang]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    }, []);

    const viewModes: { key: ViewMode; icon: typeof Clock; label: string }[] = [
        { key: 'analog', icon: Clock, label: t(lang, 'clock.analog') },
        { key: 'digital', icon: Monitor, label: t(lang, 'clock.digital') },
        { key: 'both', icon: Layers, label: t(lang, 'clock.both') },
    ];

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col">
            {/* Background gradient */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-b from-amber-50/50 via-white to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center pt-6 pb-4 px-4"
            >
                <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {t(lang, 'clock.title')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t(lang, 'clock.subtitle')}
                </p>
            </motion.div>

            {/* View Mode Selector */}
            <div className="flex justify-center px-4 pb-4">
                <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1.5 gap-1">
                    {viewModes.map(({ key, icon: Icon, label }) => (
                        <button
                            key={key}
                            onClick={() => setViewMode(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                viewMode === key
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Clock Display - Main Content */}
            <div className="flex-1 flex items-center justify-center px-4 pb-6">
                <motion.div
                    layout
                    className="w-full max-w-5xl"
                >
                    <AnimatePresence mode="wait">
                        {viewMode === 'both' ? (
                            <motion.div
                                key="both"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                            >
                                <div className="flex justify-center">
                                    <div className="w-full max-w-sm md:max-w-md">
                                        <AnalogClock />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center">
                                    <DigitalClock />
                                </div>
                            </motion.div>
                        ) : viewMode === 'analog' ? (
                            <motion.div
                                key="analog"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="flex justify-center"
                            >
                                <div className="w-full max-w-lg">
                                    <AnalogClock />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="digital"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center justify-center py-12"
                            >
                                <DigitalClock size="large" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center gap-3 px-4 pb-4 flex-wrap"
            >
                <button
                    onClick={speakTime}
                    disabled={isSpeaking}
                    aria-label={t(lang, 'clock.speakTime')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-sm transition-all font-semibold text-sm disabled:opacity-50"
                >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {t(lang, 'clock.speakTime')}
                </button>
                <button
                    onClick={() => setShowSkins(!showSkins)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border shadow-sm transition-all font-semibold text-sm ${
                        showSkins
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-transparent'
                            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750'
                    }`}
                >
                    <Paintbrush className="w-4 h-4" />
                    Skins
                </button>
                <button
                    onClick={toggleFullscreen}
                    aria-label={t(lang, 'clock.fullscreen')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-sm transition-all font-semibold text-sm"
                >
                    <Maximize className="w-4 h-4" />
                    {t(lang, 'clock.fullscreen')}
                </button>
            </motion.div>

            {/* Clock Skin Selector */}
            <AnimatePresence>
                {showSkins && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden px-4 pb-4"
                    >
                        <div className="flex gap-3 justify-center flex-wrap max-w-3xl mx-auto">
                            {clockSkins.map((skin) => (
                                <button
                                    key={skin.id}
                                    onClick={() => updateSettings({ clockSkin: skin.id })}
                                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                                        settings.clockSkin === skin.id
                                            ? 'bg-amber-100 dark:bg-amber-900/30 ring-2 ring-amber-500'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full border-2 shadow-inner"
                                        style={{
                                            borderColor: skin.colors.hourHand,
                                            background: `linear-gradient(135deg, ${skin.colors.minuteHand}, ${skin.colors.hourHand})`,
                                        }}
                                    />
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                        {skin.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cultural Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-xs text-gray-400 dark:text-gray-500 max-w-xl mx-auto px-6 pb-6"
            >
                {t(lang, 'clock.info')}
            </motion.div>
        </div>
    );
}

export default ClockScreen;

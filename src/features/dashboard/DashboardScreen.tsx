import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { DigitalClock } from '../clock/components/DigitalClock';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { fetchPrayerTimesByCity, type PrayerTimesResponse } from '../prayer/services/prayerApi';
import { DIASPORA_CITIES } from '../../data/diasporaCities';
import { toAdlamDigits } from '../../utils/adlamDigits';
import { getMoonPhase, getMoonPhaseName, getMoonEmoji } from '../../utils/moonPhase';
import { MapPin, Maximize, Minimize } from 'lucide-react';
import { PremiumGate } from '../../components/PremiumGate';

const getPrayerNames = (language: string) => [
    { key: 'Fajr', icon: '🌅', label: t(language as any, 'prayer.fajr') },
    { key: 'Sunrise', icon: '☀️', label: t(language as any, 'prayer.sunrise') },
    { key: 'Dhuhr', icon: '🌞', label: t(language as any, 'prayer.dhuhr') },
    { key: 'Asr', icon: '🌤️', label: t(language as any, 'prayer.asr') },
    { key: 'Maghrib', icon: '🌆', label: t(language as any, 'prayer.maghrib') },
    { key: 'Isha', icon: '🌙', label: t(language as any, 'prayer.isha') },
];

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
}

function generateStars(count: number): Star[] {
    return Array.from({ length: count }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 3 + 2,
    }));
}

function DashboardScreen() {
    const { settings } = useSettingsStore();
    const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
    const [currentCity, setCurrentCity] = useState(DIASPORA_CITIES[0]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [screensaverMode, setScreensaverMode] = useState(false);
    const [cursorHidden, setCursorHidden] = useState(false);
    const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [stars] = useState(() => generateStars(80));

    const moonPhase = getMoonPhase(new Date());
    const moonName = getMoonPhaseName(moonPhase, settings.language);
    const moonEmoji = getMoonEmoji(moonPhase);

    useEffect(() => {
        const loadPrayerTimes = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await fetchPrayerTimesByCity(currentCity.name, currentCity.country, 3);
                setPrayerData(data);
            } catch (err) {
                setError("Unable to load prayer times.");
                console.error('Failed to load prayer times', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadPrayerTimes();
        const interval = setInterval(loadPrayerTimes, 3600000);
        return () => clearInterval(interval);
    }, [currentCity]);

    // F11 fullscreen handler
    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F11') {
                e.preventDefault();
                toggleFullscreen();
            }
            if (e.key === 'Escape' && screensaverMode) {
                setScreensaverMode(false);
            }
        };
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, [toggleFullscreen, screensaverMode]);

    // Hide cursor after inactivity
    useEffect(() => {
        const resetIdle = () => {
            setCursorHidden(false);
            if (idleTimer.current) clearTimeout(idleTimer.current);
            idleTimer.current = setTimeout(() => setCursorHidden(true), 5000);
        };
        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('mousedown', resetIdle);
        resetIdle();
        return () => {
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('mousedown', resetIdle);
            if (idleTimer.current) clearTimeout(idleTimer.current);
        };
    }, []);

    const formatTime = (time: string) => {
        if (!time) return "--:--";
        const [hours, minutes] = time.split(':');
        const timeStr = `${hours}:${minutes}`;
        return settings.script === 'adlam' ? toAdlamDigits(timeStr) : timeStr;
    };

    const getNextPrayer = () => {
        if (!prayerData) return null;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const prayers = getPrayerNames(settings.language);
        for (const prayer of prayers) {
            if (prayer.key === 'Sunrise') continue;
            const [hours, minutes] = prayerData.times[prayer.key as keyof typeof prayerData.times].split(':');
            const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
            if (prayerTime > currentTime) {
                return { ...prayer, time: prayerData.times[prayer.key as keyof typeof prayerData.times], isTomorrow: false };
            }
        }
        return { ...prayers[0], time: prayerData.times.Fajr, isTomorrow: true };
    };

    const nextPrayer = getNextPrayer();

    // Screensaver mode - just the clock with animated stars
    if (screensaverMode) {
        return (
            <div
                className="fixed inset-0 z-50 bg-gray-950 flex items-center justify-center overflow-hidden"
                style={{ cursor: cursorHidden ? 'none' : 'auto' }}
                role="button"
                tabIndex={0}
                aria-label="Exit screensaver"
                onClick={() => setScreensaverMode(false)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setScreensaverMode(false); }}
            >
                {/* Stars */}
                {stars.map((star, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={{ opacity: [star.opacity, star.opacity * 0.3, star.opacity] }}
                        transition={{ duration: star.speed, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}
                <div className="text-center z-10">
                    <DigitalClock size="large" />
                    <div className="mt-6 text-2xl text-gray-500">
                        {moonEmoji} {moonName}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <PremiumGate feature="Dashboard / Kiosk">
        <div
            className="min-h-[calc(100vh-4rem)] flex flex-col p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500"
            style={{ cursor: cursorHidden ? 'none' : 'auto' }}
        >
            {/* Controls - top right */}
            <div className="absolute top-20 right-4 z-10 flex gap-2 opacity-30 hover:opacity-100 transition-opacity">
                <select
                    value={currentCity.name}
                    onChange={(e) => {
                        const city = DIASPORA_CITIES.find(c => c.name === e.target.value);
                        if (city) setCurrentCity(city);
                    }}
                    className="text-xs bg-transparent border-none dark:text-gray-500 focus:ring-0 cursor-pointer"
                    aria-label={t(settings.language, 'prayer.city')}
                >
                    {DIASPORA_CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <button
                    onClick={() => setScreensaverMode(true)}
                    className="text-xs text-gray-500 hover:text-amber-500 transition-colors"
                    aria-label="Screensaver"
                    title="Screensaver"
                >
                    🌙
                </button>
                <button
                    onClick={toggleFullscreen}
                    className="text-gray-500 hover:text-amber-500 transition-colors"
                    aria-label={t(settings.language, 'clock.fullscreen')}
                >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col items-center justify-around gap-8 max-w-7xl mx-auto w-full"
            >
                {/* Main Clock */}
                <div className="w-full text-center">
                    <DigitalClock />
                </div>

                <div className="w-full grid md:grid-cols-3 gap-6 items-stretch">
                    {/* Moon Phase */}
                    <Card className="flex flex-col justify-center items-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-gray-200 dark:border-gray-700">
                        <div className="text-6xl mb-3">{moonEmoji}</div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{moonName}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {t(settings.language, 'dashboard.moonPhase')}
                        </p>
                    </Card>

                    {/* Hijri Date */}
                    <Card className="flex flex-col justify-center items-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl border-gray-200 dark:border-gray-700">
                        {prayerData ? (
                            <div className="text-center space-y-2">
                                <p className="text-3xl font-black text-amber-600 dark:text-amber-500">
                                    {prayerData.date.hijri.day} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year}
                                </p>
                                <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">
                                    {t(settings.language, 'prayer.dateHijri')}
                                </p>
                            </div>
                        ) : (
                            <div className="animate-pulse text-gray-400">...</div>
                        )}
                    </Card>

                    {/* Next Prayer Card */}
                    <Card className="relative overflow-hidden p-6 flex flex-col justify-center items-center bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none shadow-2xl shadow-amber-500/20">
                        {isLoading ? (
                            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full" />
                        ) : error ? (
                            <p className="text-sm text-center opacity-90">{error}</p>
                        ) : nextPrayer ? (
                            <div className="text-center">
                                <p className="text-sm opacity-90 font-bold mb-1 uppercase tracking-tighter">
                                    {t(settings.language, 'prayer.next')} {nextPrayer.isTomorrow && "(+1)"}
                                </p>
                                <div className="text-4xl mb-1">{nextPrayer.icon}</div>
                                <h3 className="text-2xl font-black mb-1">{nextPrayer.label}</h3>
                                <p className="text-5xl font-mono font-black tracking-tighter">
                                    {formatTime(nextPrayer.time)}
                                </p>
                                <div className="mt-3 flex items-center justify-center gap-2 opacity-80 text-xs font-bold">
                                    <MapPin className="w-3 h-3" />
                                    <span>{currentCity.name.toUpperCase()}</span>
                                </div>
                            </div>
                        ) : null}
                    </Card>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm">
                    Adlam Calendar & Clock - Web Kiosk Mode
                    <span className="mx-2">|</span>
                    <button
                        onClick={() => setScreensaverMode(true)}
                        className="underline hover:text-amber-500 transition-colors"
                    >
                        {t(settings.language, 'dashboard.screensaver')}
                    </button>
                </div>
            </motion.div>
        </div>
        </PremiumGate>
    );
}

export default DashboardScreen;

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { MapPin, Calendar, RefreshCw } from 'lucide-react';
import { fetchPrayerTimesByCity, type PrayerTimesResponse, PRAYER_METHODS } from './services/prayerApi';
import { DIASPORA_CITIES } from '../../data/diasporaCities';
import { toAdlamDigits } from '../../utils/adlamDigits';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

const getPrayerNames = (language: string) => [
    { key: 'Fajr', name: 'Fajr', icon: '🌅', label: t(language as any, 'prayer.fajr') },
    { key: 'Sunrise', name: 'Sunrise', icon: '☀️', label: t(language as any, 'prayer.sunrise') },
    { key: 'Dhuhr', name: 'Dhuhr', icon: '🌞', label: t(language as any, 'prayer.dhuhr') },
    { key: 'Asr', name: 'Asr', icon: '🌤️', label: t(language as any, 'prayer.asr') },
    { key: 'Maghrib', name: 'Maghrib', icon: '🌆', label: t(language as any, 'prayer.maghrib') },
    { key: 'Isha', name: 'Isha', icon: '🌙', label: t(language as any, 'prayer.isha') },
];

function PrayerScreen() {
    const { settings } = useSettingsStore();
    const PRAYER_NAMES = getPrayerNames(settings.language);
    const [selectedCity, setSelectedCity] = useState(DIASPORA_CITIES[0]);
    const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState(3); // MWL by default

    useEffect(() => {
        loadPrayerTimes();
    }, [selectedCity, selectedMethod]);

    const loadPrayerTimes = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchPrayerTimesByCity(
                selectedCity.name,
                selectedCity.country,
                selectedMethod
            );
            setPrayerData(data);
        } catch (err) {
            console.error('Failed to load prayer times:', err);
            setError(t(settings.language, 'prayer.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        const timeStr = `${hours}:${minutes}`;
        return settings.script === 'adlam' ? toAdlamDigits(timeStr) : timeStr;
    };

    const getNextPrayer = () => {
        if (!prayerData) return null;
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        for (const prayer of PRAYER_NAMES) {
            const [hours, minutes] = prayerData.times[prayer.key as keyof typeof prayerData.times].split(':');
            const prayerTime = parseInt(hours) * 60 + parseInt(minutes);
            if (prayerTime > currentTime) {
                return { ...prayer, time: prayerData.times[prayer.key as keyof typeof prayerData.times] };
            }
        }
        return { ...PRAYER_NAMES[0], time: prayerData.times.Fajr };
    };

    const nextPrayer = getNextPrayer();

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        🕌 {t(settings.language, 'prayer.title')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t(settings.language, 'prayer.desc')}
                    </p>
                </div>

                {/* City & Method Selector */}
                <Card className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                <MapPin className="inline w-4 h-4 mr-1" />
                                {t(settings.language, 'prayer.city')}
                            </label>
                            <select
                                value={selectedCity.name}
                                onChange={(e) => {
                                    const city = DIASPORA_CITIES.find((c) => c.name === e.target.value);
                                    if (city) setSelectedCity(city);
                                }}
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500"
                            >
                                {DIASPORA_CITIES.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}, {city.country}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                {t(settings.language, 'prayer.method')}
                            </label>
                            <select
                                value={selectedMethod}
                                onChange={(e) => setSelectedMethod(Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500"
                            >
                                {PRAYER_METHODS.map((method) => (
                                    <option key={method.id} value={method.id}>
                                        {method.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Next Prayer */}
                {nextPrayer && prayerData && (
                    <Card className="max-w-md mx-auto bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                        <div className="text-center">
                            <p className="text-sm font-semibold opacity-90 mb-2">{t(settings.language, 'prayer.next')}</p>
                            <div className="text-6xl mb-2">{nextPrayer.icon}</div>
                            <h3 className="text-3xl font-black mb-2">{nextPrayer.label}</h3>
                            <p className="text-5xl font-black font-mono">{formatTime(nextPrayer.time)}</p>
                        </div>
                    </Card>
                )}

                {/* Error */}
                {error && !isLoading && (
                    <Card className="max-w-md mx-auto text-center">
                        <div className="text-4xl mb-3">⚠️</div>
                        <p className="text-red-600 dark:text-red-400 font-semibold mb-4">{error}</p>
                        <button
                            onClick={loadPrayerTimes}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            {t(settings.language, 'prayer.retry')}
                        </button>
                    </Card>
                )}

                {/* All Prayers */}
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-12 w-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto" />
                    </div>
                ) : prayerData ? (
                    <div className="max-w-4xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PRAYER_NAMES.map((prayer) => (
                            <Card key={prayer.key} hover>
                                <div className="text-center">
                                    <div className="text-4xl mb-2">{prayer.icon}</div>
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {prayer.label}
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {prayer.name}
                                    </p>
                                    <p className="text-3xl font-black text-amber-600 dark:text-amber-500 font-mono">
                                        {formatTime(prayerData.times[prayer.key as keyof typeof prayerData.times])}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : null}

                {/* Date Info */}
                {prayerData && (
                    <Card className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    <Calendar className="inline w-4 h-4 mr-1" />
                                    {t(settings.language, 'prayer.dateGregorian')}
                                </p>
                                <p className="font-semibold">{settings.script === 'adlam' ? toAdlamDigits(prayerData.date.readable) : prayerData.date.readable}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t(settings.language, 'prayer.dateHijri')}</p>
                                <p className="font-semibold">
                                    {settings.script === 'adlam'
                                        ? `${toAdlamDigits(prayerData.date.hijri.date)} ${prayerData.date.hijri.month.en} ${toAdlamDigits(prayerData.date.hijri.year)}`
                                        : `${prayerData.date.hijri.date} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}`}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}
            </motion.div>
        </div>
    );
}

export default PrayerScreen;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Printer, Download, Loader2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { DIASPORA_CITIES } from '../../data/diasporaCities';
import { PRAYER_METHODS } from '../prayer/services/prayerApi';
import { toAdlamDigits } from '../../utils/adlamDigits';

const ALADHAN_API = 'https://api.aladhan.com/v1';

interface DayPrayerData {
    date: { gregorian: string; hijri: string; day: string };
    times: { Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string };
}

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTHS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function PrayerPdfScreen() {
    const { settings } = useSettingsStore();
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [cityIndex, setCityIndex] = useState(0);
    const [methodId, setMethodId] = useState(3);
    const [useAdlamDigits, setUseAdlamDigits] = useState(settings.script === 'adlam');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DayPrayerData[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    const city = DIASPORA_CITIES[cityIndex];

    const fetchMonthData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${ALADHAN_API}/calendarByCity/${year}/${month}?city=${city.name}&country=${city.country}&method=${methodId}`
            );
            if (!response.ok) throw new Error('API error');
            const json = await response.json();

            const days: DayPrayerData[] = json.data.map((day: Record<string, unknown>) => {
                const timings = day.timings as Record<string, string>;
                const date = day.date as { readable: string; hijri: { date: string; day: string; month: { en: string }; year: string } };
                return {
                    date: {
                        gregorian: date.readable,
                        hijri: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`,
                        day: date.hijri.day,
                    },
                    times: {
                        Fajr: timings.Fajr?.split(' ')[0] || '',
                        Sunrise: timings.Sunrise?.split(' ')[0] || '',
                        Dhuhr: timings.Dhuhr?.split(' ')[0] || '',
                        Asr: timings.Asr?.split(' ')[0] || '',
                        Maghrib: timings.Maghrib?.split(' ')[0] || '',
                        Isha: timings.Isha?.split(' ')[0] || '',
                    },
                };
            });
            setData(days);
        } catch {
            setError(t(settings.language, 'prayerpdf.error'));
        } finally {
            setLoading(false);
        }
    };

    const fmt = (val: string) => useAdlamDigits ? toAdlamDigits(val) : val;

    const monthLabel = settings.language === 'fr' ? MONTHS_FR[month - 1] : MONTHS[month - 1];

    const handlePrint = () => {
        window.print();
    };

    const prayerLabels = {
        Fajr: t(settings.language, 'prayer.fajr'),
        Sunrise: t(settings.language, 'prayer.sunrise'),
        Dhuhr: t(settings.language, 'prayer.dhuhr'),
        Asr: t(settings.language, 'prayer.asr'),
        Maghrib: t(settings.language, 'prayer.maghrib'),
        Isha: t(settings.language, 'prayer.isha'),
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center print:hidden">
                    <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                        {t(settings.language, 'prayerpdf.title')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t(settings.language, 'prayerpdf.desc')}
                    </p>
                </div>

                {/* Controls */}
                <Card className="print:hidden">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(settings.language, 'prayer.city')}
                            </label>
                            <select
                                value={cityIndex}
                                onChange={(e) => setCityIndex(Number(e.target.value))}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm"
                            >
                                {DIASPORA_CITIES.map((c, i) => (
                                    <option key={i} value={i}>{c.name}, {c.country}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(settings.language, 'prayerpdf.month')}
                            </label>
                            <select
                                value={month}
                                onChange={(e) => setMonth(Number(e.target.value))}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm"
                            >
                                {MONTHS.map((m, i) => (
                                    <option key={i} value={i + 1}>
                                        {settings.language === 'fr' ? MONTHS_FR[i] : m}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(settings.language, 'prayerpdf.year')}
                            </label>
                            <select
                                value={year}
                                onChange={(e) => setYear(Number(e.target.value))}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm"
                            >
                                {[2025, 2026, 2027].map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Method */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                {t(settings.language, 'prayer.method')}
                            </label>
                            <select
                                value={methodId}
                                onChange={(e) => setMethodId(Number(e.target.value))}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm"
                            >
                                {PRAYER_METHODS.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Options + Generate */}
                        <div className="flex flex-col justify-end gap-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={useAdlamDigits}
                                    onChange={(e) => setUseAdlamDigits(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {t(settings.language, 'prayerpdf.adlamDigits')}
                                </span>
                            </label>
                            <Button onClick={fetchMonthData} disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                {t(settings.language, 'prayerpdf.generate')}
                            </Button>
                        </div>
                    </div>
                </Card>

                {error && (
                    <Card className="text-center text-red-600 print:hidden">
                        {error}
                    </Card>
                )}

                {/* Table Result */}
                {data && (
                    <>
                        {/* Print actions */}
                        <div className="flex justify-end gap-3 print:hidden">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" /> {t(settings.language, 'prayerpdf.print')}
                            </Button>
                            <Button onClick={handlePrint}>
                                <Download className="w-4 h-4 mr-2" /> {t(settings.language, 'prayerpdf.download')}
                            </Button>
                        </div>

                        {/* Printable Table */}
                        <div className="print:block">
                            <Card className="p-0 overflow-hidden print:shadow-none print:border-none">
                                {/* Table Header */}
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 text-center print:bg-green-700">
                                    <h2 className="text-3xl font-black">
                                        {t(settings.language, 'prayerpdf.tableTitle')}
                                    </h2>
                                    <p className="text-lg mt-1 opacity-90">
                                        {city.name}, {city.country} — {monthLabel} {fmt(String(year))}
                                    </p>
                                </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900/50 print:bg-gray-100">
                                                <th className="px-3 py-3 text-left font-bold text-gray-700 dark:text-gray-300 border-b">#</th>
                                                <th className="px-3 py-3 text-left font-bold text-gray-700 dark:text-gray-300 border-b">{t(settings.language, 'prayerpdf.dateCol')}</th>
                                                <th className="px-3 py-3 text-left font-bold text-gray-700 dark:text-gray-300 border-b">{t(settings.language, 'prayer.dateHijri')}</th>
                                                <th className="px-3 py-3 text-center font-bold text-gray-700 dark:text-gray-300 border-b">{prayerLabels.Fajr}</th>
                                                <th className="px-3 py-3 text-center font-bold text-gray-700 dark:text-gray-300 border-b">{prayerLabels.Sunrise}</th>
                                                <th className="px-3 py-3 text-center font-bold text-gray-700 dark:text-gray-300 border-b">{prayerLabels.Dhuhr}</th>
                                                <th className="px-3 py-3 text-center font-bold text-gray-700 dark:text-gray-300 border-b">{prayerLabels.Asr}</th>
                                                <th className="px-3 py-3 text-center font-bold text-gray-700 dark:text-gray-300 border-b">{prayerLabels.Maghrib}</th>
                                                <th className="px-3 py-3 text-center font-bold text-gray-700 dark:text-gray-300 border-b">{prayerLabels.Isha}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.map((day, i) => (
                                                <tr key={i} className={`${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-900/30'} hover:bg-green-50 dark:hover:bg-green-900/10 print:hover:bg-transparent`}>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 font-mono text-gray-500">{fmt(String(i + 1))}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 font-semibold text-gray-800 dark:text-gray-200">{fmt(day.date.gregorian)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs">{fmt(day.date.hijri)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-center font-mono">{fmt(day.times.Fajr)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-center font-mono text-gray-400">{fmt(day.times.Sunrise)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-center font-mono">{fmt(day.times.Dhuhr)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-center font-mono">{fmt(day.times.Asr)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-center font-mono">{fmt(day.times.Maghrib)}</td>
                                                    <td className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 text-center font-mono">{fmt(day.times.Isha)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800">
                                    {t(settings.language, 'prayerpdf.footer')} — {PRAYER_METHODS.find(m => m.id === methodId)?.name}
                                </div>
                            </Card>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default PrayerPdfScreen;

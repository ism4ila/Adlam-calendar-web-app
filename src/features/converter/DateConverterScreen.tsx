import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeftRight, Copy, Calendar } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import { toAdlamDigits } from '../../utils/adlamDigits';
import { toHijri, toGregorian } from 'hijri-converter';

const HIJRI_MONTHS_EN = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
    'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah'
];

const HIJRI_MONTHS_AR = [
    'محرّم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
    'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
    'رمضان', 'شوّال', 'ذو القعدة', 'ذو الحجّة'
];

const WEEKDAYS_PULAAR = [
    'Dewo', 'Teneŋ', 'Talaata', 'Alarba', 'Alkamiisa', 'Aljumaa', 'Asee'
];

const WEEKDAYS_FR = [
    'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
];

const WEEKDAYS_EN = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const WEEKDAYS_AR = [
    'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'
];

function DateConverterScreen() {
    const { settings } = useSettingsStore();
    const today = new Date();

    const [gregorianDate, setGregorianDate] = useState(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    );
    const [hijriYear, setHijriYear] = useState(0);
    const [hijriMonth, setHijriMonth] = useState(0);
    const [hijriDay, setHijriDay] = useState(0);
    const [weekday, setWeekday] = useState(0);
    const [copied, setCopied] = useState(false);

    // Convert Gregorian -> Hijri whenever gregorianDate changes
    useEffect(() => {
        try {
            const [y, m, d] = gregorianDate.split('-').map(Number);
            if (!y || !m || !d) return;
            const h = toHijri(y, m, d);
            setHijriYear(h.hy);
            setHijriMonth(h.hm);
            setHijriDay(h.hd);
            const date = new Date(y, m - 1, d);
            setWeekday(date.getDay());
        } catch {
            // Invalid date
        }
    }, [gregorianDate]);

    const handleHijriChange = (hy: number, hm: number, hd: number) => {
        try {
            const g = toGregorian(hy, hm, hd);
            setGregorianDate(`${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`);
            setHijriYear(hy);
            setHijriMonth(hm);
            setHijriDay(hd);
        } catch {
            // Invalid hijri date
        }
    };

    const getWeekdayName = () => {
        switch (settings.language) {
            case 'fr': return WEEKDAYS_FR[weekday];
            case 'ar': return WEEKDAYS_AR[weekday];
            case 'adlam': return WEEKDAYS_PULAAR[weekday];
            default: return WEEKDAYS_EN[weekday];
        }
    };

    const getHijriMonthName = () => {
        if (hijriMonth < 1 || hijriMonth > 12) return '';
        return settings.language === 'ar'
            ? HIJRI_MONTHS_AR[hijriMonth - 1]
            : HIJRI_MONTHS_EN[hijriMonth - 1];
    };

    const gregorianFormatted = (() => {
        const [y, m, d] = gregorianDate.split('-').map(Number);
        if (!y || !m || !d) return '';
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString(
            settings.language === 'fr' ? 'fr-FR' : settings.language === 'ar' ? 'ar' : 'en-US',
            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        );
    })();

    const hijriFormatted = hijriYear
        ? `${hijriDay} ${getHijriMonthName()} ${hijriYear}`
        : '';

    const adlamFormatted = hijriYear
        ? toAdlamDigits(`${hijriDay} ${getHijriMonthName()} ${hijriYear}`)
        : '';

    const handleCopy = async () => {
        const text = `${gregorianFormatted}\n${hijriFormatted}\n${getWeekdayName()}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const setToday = () => {
        const now = new Date();
        setGregorianDate(
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        );
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                        {t(settings.language, 'converter.title')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t(settings.language, 'converter.desc')}
                    </p>
                </div>

                {/* Converter Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Gregorian Input */}
                    <Card className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t(settings.language, 'converter.gregorian')}
                            </h3>
                        </div>
                        <input
                            type="date"
                            value={gregorianDate}
                            onChange={(e) => setGregorianDate(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {gregorianFormatted}
                        </p>
                    </Card>

                    {/* Hijri Input */}
                    <Card className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t(settings.language, 'converter.hijri')}
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">{t(settings.language, 'converter.day')}</label>
                                <input
                                    type="number"
                                    min={1} max={30}
                                    value={hijriDay || ''}
                                    onChange={(e) => handleHijriChange(hijriYear, hijriMonth, Number(e.target.value))}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">{t(settings.language, 'converter.month')}</label>
                                <select
                                    value={hijriMonth}
                                    onChange={(e) => handleHijriChange(hijriYear, Number(e.target.value), hijriDay)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {HIJRI_MONTHS_EN.map((m, i) => (
                                        <option key={i} value={i + 1}>
                                            {settings.language === 'ar' ? HIJRI_MONTHS_AR[i] : m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 mb-1 block">{t(settings.language, 'converter.year')}</label>
                                <input
                                    type="number"
                                    min={1} max={1500}
                                    value={hijriYear || ''}
                                    onChange={(e) => handleHijriChange(Number(e.target.value), hijriMonth, hijriDay)}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 text-lg font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hijriFormatted}
                        </p>
                    </Card>
                </div>

                {/* Result Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                    <div className="text-center space-y-4">
                        <ArrowLeftRight className="w-8 h-8 mx-auto text-blue-500" />

                        <div className="space-y-2">
                            {/* Weekday */}
                            <p className="text-2xl font-black text-gray-900 dark:text-white">
                                {getWeekdayName()}
                            </p>

                            {/* Gregorian */}
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                {gregorianFormatted}
                            </p>

                            {/* Hijri */}
                            <p className="text-lg text-emerald-700 dark:text-emerald-400 font-semibold">
                                {hijriFormatted}
                            </p>

                            {/* Adlam */}
                            <p className="text-xl font-adlam text-amber-700 dark:text-amber-400" dir="rtl">
                                {adlamFormatted}
                            </p>
                        </div>

                        <div className="flex justify-center gap-3 pt-2">
                            <Button variant="outline" size="sm" onClick={setToday}>
                                <Calendar className="w-4 h-4 mr-1" />
                                {t(settings.language, 'converter.today')}
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleCopy}>
                                <Copy className="w-4 h-4 mr-1" />
                                {copied ? t(settings.language, 'editor.copied') : t(settings.language, 'editor.copy')}
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}

export default DateConverterScreen;

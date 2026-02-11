import { useEffect, useState, memo } from 'react';
import { toAdlamDigits } from '../../../utils/adlamDigits';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { getLocale } from '../../../utils/i18n';

interface DigitalClockProps {
    size?: 'default' | 'large';
}

export const DigitalClock = memo(function DigitalClock({ size = 'default' }: DigitalClockProps) {
    const [time, setTime] = useState(new Date());
    const { settings } = useSettingsStore();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = settings.hourFormat === 12
        ? time.getHours() % 12 || 12
        : time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const period = time.getHours() >= 12 ? 'PM' : 'AM';

    const timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    const displayTime = settings.script === 'adlam' ? toAdlamDigits(timeString) : timeString;

    const locale = getLocale(settings.language);
    const date = time.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const textSize = size === 'large'
        ? 'text-8xl md:text-[10rem]'
        : 'text-7xl md:text-9xl';

    return (
        <div className="text-center">
            <div className="relative inline-block">
                <div
                    className={`${textSize} font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent leading-none`}
                    style={{ fontFamily: settings.script === 'adlam' ? 'Noto Sans Adlam' : 'inherit' }}
                >
                    {displayTime}
                </div>
                {settings.hourFormat === 12 && (
                    <span className="absolute -right-12 top-4 text-2xl font-bold text-amber-600">
                        {period}
                    </span>
                )}
            </div>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 capitalize">
                {date}
            </p>
        </div>
    );
});

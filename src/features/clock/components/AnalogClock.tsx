import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { toAdlamDigits } from '../../../utils/adlamDigits';
import { useSettingsStore } from '../../../store/useSettingsStore';
import { getClockSkin } from '../../../utils/clockSkins';
import type { ClockSkin } from '../../../types/settings';

interface AnalogClockProps {
    skinOverride?: ClockSkin;
}

export const AnalogClock = memo(function AnalogClock({ skinOverride }: AnalogClockProps) {
    const [time, setTime] = useState(new Date());
    const { settings } = useSettingsStore();
    const skin = getClockSkin(skinOverride ?? (settings.clockSkin as ClockSkin));
    const isDark = settings.colorMode === 'dark' || (settings.colorMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours() % 12;
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourAngle = (hours + minutes / 60) * 30;
    const minuteAngle = (minutes + seconds / 60) * 6;
    const secondAngle = seconds * 6;

    const c = skin.colors;

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square">
            {/* Clock Face */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${isDark ? c.faceDark : c.face} shadow-2xl border-8 ${isDark ? c.borderDark : c.border}`}>
                {/* Tick Marks */}
                {[...Array(12)].map((_, i) => {
                    const angle = (i + 1) * 30;
                    const isMainHour = (i + 1) % 3 === 0;
                    return (
                        <div
                            key={`tick-${i}`}
                            className="absolute left-1/2 top-0"
                            style={{
                                width: '4px',
                                marginLeft: '-2px',
                                height: '50%',
                                transformOrigin: 'bottom center',
                                transform: `rotate(${angle}deg)`,
                            }}
                        >
                            <div className={`w-1 mx-auto ${isMainHour ? `h-4 ${c.hourMarkerMajor}` : `h-2 ${c.hourMarker}`} rounded-full mt-2`} />
                        </div>
                    );
                })}

                {/* Hour Numbers */}
                {[...Array(12)].map((_, i) => {
                    const hour = i + 1;
                    const angleRad = ((hour * 30) - 90) * (Math.PI / 180);
                    const radius = 38; // percentage from center
                    const x = 50 + radius * Math.cos(angleRad);
                    const y = 50 + radius * Math.sin(angleRad);
                    return (
                        <div
                            key={`num-${i}`}
                            className={`absolute font-adlam text-lg font-bold ${isDark ? c.numeralsDark : c.numerals}`}
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {settings.script === 'adlam' ? toAdlamDigits(String(hour)) : String(hour)}
                        </div>
                    );
                })}

                {/* Hour Hand */}
                <motion.div
                    className="absolute top-1/2 left-1/2 origin-bottom"
                    style={{
                        width: '8px',
                        height: '25%',
                        marginLeft: '-4px',
                        marginTop: '-25%',
                        backgroundColor: c.hourHand,
                        borderRadius: '4px',
                    }}
                    animate={{ rotate: hourAngle }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />

                {/* Minute Hand */}
                <motion.div
                    className="absolute top-1/2 left-1/2 origin-bottom"
                    style={{
                        width: '6px',
                        height: '35%',
                        marginLeft: '-3px',
                        marginTop: '-35%',
                        backgroundColor: c.minuteHand,
                        borderRadius: '3px',
                    }}
                    animate={{ rotate: minuteAngle }}
                    transition={{ type: 'spring', stiffness: 50 }}
                />

                {/* Second Hand */}
                <motion.div
                    className="absolute top-1/2 left-1/2 origin-bottom"
                    style={{
                        width: '2px',
                        height: '40%',
                        marginLeft: '-1px',
                        marginTop: '-40%',
                        backgroundColor: c.secondHand,
                        borderRadius: '1px',
                    }}
                    animate={{ rotate: secondAngle }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />

                {/* Center Dot */}
                <div className={`absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 ${c.centerDot} rounded-full shadow-lg`} />
            </div>
        </div>
    );
});

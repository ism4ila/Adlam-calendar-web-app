import React, { useEffect, useState } from 'react';
import { convertTimeToPulaar } from '../utils/pulaarTimeConverter';
import { convertTimeInFrench } from '../utils/timeTextConverter';
import type { SupportedLanguage } from '../types/settings';
import { getLocale } from '../utils/i18n';
import { toAdlamDigits } from '../utils/adlamDigits';

interface ClockProps {
  language: SupportedLanguage;
  secondaryLanguage: SupportedLanguage;
  showSecondary: boolean;
  hourFormat: 12 | 24;
}

const Clock: React.FC<ClockProps> = ({ language, secondaryLanguage, showSecondary, hourFormat }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  const useAdlamScript = language === 'adlam';
  const showFrenchLine = showSecondary && secondaryLanguage === 'fr';
  const locale = getLocale(language);

  return (
    <div className="flex flex-col items-center p-4 md:p-8 acc-surface rounded-3xl shadow-xl w-full max-w-lg mx-auto transition-all">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 border-8 rounded-full mb-8 acc-border flex items-center justify-center shadow-inner bg-opacity-50">
        {[...Array(12)].map((_, i) => {
          const num = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][i];
          const displayNum = useAdlamScript ? toAdlamDigits(num.toString()) : num.toString();
          return (
            <div
              key={i}
              className="absolute font-bold acc-text text-sm sm:text-base md:text-xl"
              style={{
                transform: `rotate(${i * 30}deg) translateY(-40%) rotate(-${i * 30}deg)`,
                top: '40%',
                fontFamily: useAdlamScript ? 'Noto Sans Adlam' : 'inherit'
              }}
            >
              {displayNum}
            </div>
          );
        })}

        {/* Hour Hand */}
        <div
          className="absolute w-1.5 h-[25%] rounded-full origin-bottom acc-text transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${hourAngle}deg) translateY(-50%)`, top: '25%' }}
        />
        {/* Minute Hand */}
        <div
          className="absolute w-1 h-[35%] rounded-full origin-bottom acc-muted transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${minAngle}deg) translateY(-50%)`, top: '15%' }}
        />
        {/* Second Hand */}
        <div
          className="absolute w-0.5 h-[40%] rounded-full origin-bottom transition-transform duration-100 linear"
          style={{ 
            transform: `rotate(${secAngle}deg) translateY(-50%)`, 
            top: '10%',
            background: 'var(--acc-accent)' 
          }}
        />
        {/* Center Dot */}
        <div className="absolute w-3 h-3 rounded-full shadow-md z-10" style={{ background: 'var(--acc-primary)' }} />
      </div>

      <div className="text-center space-y-4 w-full">
        <div className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold acc-primary-text tracking-tighter">
          {time.toLocaleTimeString(locale, { hour12: hourFormat === 12 })}
        </div>

        <div className="p-4 rounded-2xl w-full" style={{ background: 'color-mix(in srgb, var(--acc-primary) 8%, transparent)' }}>
          <p className="text-lg md:text-xl font-medium acc-text leading-relaxed" style={{ fontFamily: useAdlamScript ? 'Noto Sans Adlam' : 'inherit' }}>
            {convertTimeToPulaar(time, useAdlamScript, hourFormat)}
          </p>
          {showFrenchLine && (
            <p className="text-sm md:text-base acc-muted italic mt-2 border-t acc-border pt-2">
              {convertTimeInFrench(time, hourFormat)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clock;
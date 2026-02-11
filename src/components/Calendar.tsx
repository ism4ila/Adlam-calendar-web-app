import React, { useMemo } from 'react';
import type { SupportedLanguage } from '../types/settings';
import { getLocale, t } from '../utils/i18n';
import { getTraditionalEventsForMonth } from '../data/traditionalEvents';
import { toAdlamDigits } from '../utils/adlamDigits';

interface CalendarProps {
  language: SupportedLanguage;
}

const Calendar: React.FC<CalendarProps> = ({ language }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const daysEn = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const daysFr = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];
  const daysAr = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysAdlam = ['𞤉𞤩𞤭𞤲𞤢𞥄𞤲𞤣𞤵', '𞤀𞤩𞤭𞤲𞤢𞥄𞤲𞤣𞤵', '𞤃𞤢𞤱𞤦𞤢𞥄𞤪𞤫', '𞤐𞤫𞤧𞤤𞤢𞥄𞤪𞤫', '𞤐𞤢𞥄𞤲𞤫𞥅𞤪𞤫', '𞤃𞤢𞤱𞤦𞤫𞥅𞤪𞤫', '𞤖𞤮𞤪𞤦𞤭𞤲𞤢𞥄𞤲𞤣𞤵'];

  const useAdlamScript = language === 'adlam';
  const locale = getLocale(language);

  const dayLabels = useMemo(() => {
    if (useAdlamScript) return daysAdlam;
    if (language === 'fr') return daysFr;
    if (language === 'ar') return daysAr;
    return daysEn;
  }, [language, useAdlamScript]);

  const events = getTraditionalEventsForMonth(currentMonth);
  const eventDays = new Set(events.map((event) => event.day));

  const changeMonth = (offset: number) => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + offset);
    setCurrentDate(next);
  };

  const renderDays = () => {
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      const hasEvent = eventDays.has(day);
      calendarDays.push(
        <div
          key={day}
          className={`relative aspect-square flex flex-col items-center justify-center rounded-2xl text-sm md:text-base font-medium transition-all cursor-pointer
            ${isToday ? 'acc-primary-bg scale-105 shadow-md' : 'acc-surface acc-text hover:acc-primary-text border acc-border'}`}
          style={{ fontFamily: useAdlamScript ? 'Noto Sans Adlam' : 'inherit' }}
        >
          {useAdlamScript ? toAdlamDigits(day.toString()) : day}
          {hasEvent && (
            <span
              className="absolute bottom-2 h-1.5 w-1.5 rounded-full"
              style={{ background: isToday ? 'var(--acc-on-primary)' : 'var(--acc-accent)' }}
            />
          )}
        </div>
      );
    }
    return calendarDays;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="acc-surface p-4 md:p-8 rounded-3xl shadow-xl border acc-border">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
             <h2 className="text-2xl md:text-3xl font-black acc-text" style={{ fontFamily: useAdlamScript ? 'Noto Sans Adlam' : 'inherit' }}>
              {currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
            </h2>
            <p className="acc-muted text-sm md:text-base">
              {t(language, 'calendar.today')}: {today.toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 md:p-3 rounded-xl acc-surface border acc-border acc-text hover:acc-primary-bg transition-colors">
              &larr;
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 rounded-xl acc-surface border acc-border acc-text hover:acc-primary-bg transition-colors font-bold text-sm">
              {t(language, 'calendar.today')}
            </button>
            <button onClick={() => changeMonth(1)} className="p-2 md:p-3 rounded-xl acc-surface border acc-border acc-text hover:acc-primary-bg transition-colors">
              &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
          {dayLabels.map((day) => (
            <div
              key={day}
              className="text-[10px] md:text-xs font-black acc-muted uppercase tracking-tighter text-center"
              style={{ fontFamily: useAdlamScript ? 'Noto Sans Adlam' : 'inherit' }}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {renderDays()}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="acc-surface p-6 rounded-3xl border acc-border shadow-lg">
          <h3 className="text-lg font-black acc-text flex items-center gap-2">
            <span className="h-2 w-2 rounded-full acc-accent-bg"></span>
            {t(language, 'calendar.eventsTitle')}
          </h3>
          <div className="mt-4 space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {events.length === 0 ? (
              <p className="text-sm acc-muted italic">{t(language, 'calendar.eventsEmpty')}</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="p-4 rounded-2xl border acc-border acc-surface hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 rounded-lg acc-primary-bg text-[10px] font-bold">
                      {useAdlamScript ? toAdlamDigits(event.day.toString()) : event.day}
                    </span>
                  </div>
                  <h4 className="font-bold acc-text">{event.title[language] || event.title.en}</h4>
                  <p className="text-sm acc-muted mt-1 leading-relaxed">
                    {event.description[language] || event.description.en}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="acc-surface p-6 rounded-3xl border acc-border shadow-lg flex flex-col justify-center items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full acc-primary-bg grid place-items-center text-2xl">📅</div>
            <div>
              <h3 className="font-black text-xl">{t(language, 'calendar.sync')}</h3>
              <p className="acc-muted text-sm mt-2">
                {t(language, 'calendar.syncDesc')}
              </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
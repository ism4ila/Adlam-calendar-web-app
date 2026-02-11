/**
 * Calculate the moon phase for a given date.
 * Returns a value 0-29.53 representing the lunar day.
 * Based on a simplified synodic month calculation.
 */
export function getMoonPhase(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Conway's algorithm
  let r = year % 100;
  r %= 19;
  if (r > 9) r -= 19;
  r = ((r * 11) % 30) + month + day;
  if (month < 3) r += 2;
  r -= (year < 2000 ? 4 : 8.3);
  r = Math.floor(r + 0.5) % 30;
  return r < 0 ? r + 30 : r;
}

export function getMoonPhaseName(phase: number, language: string): string {
  const names: Record<string, string[]> = {
    en: ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'],
    fr: ['Nouvelle Lune', 'Premier Croissant', 'Premier Quartier', 'Gibbeuse Croissante', 'Pleine Lune', 'Gibbeuse Décroissante', 'Dernier Quartier', 'Dernier Croissant'],
    ar: ['محاق', 'هلال متزايد', 'تربيع أول', 'أحدب متزايد', 'بدر', 'أحدب متناقص', 'تربيع أخير', 'هلال متناقص'],
    adlam: ['𞤂𞤫𞤱𞤪𞤵 𞤑𞤫𞤧𞤮', '𞤂𞤫𞤱𞤪𞤵 𞤊𞤫𞤱𞤲𞤣𞤮', '𞤚𞤢𞤼𞤢𞤢𞤲𞤣𞤫 𞤁', '𞤂𞤫𞤱𞤪𞤵 𞤃𞤢𞤱𞤲𞤣𞤮', '𞤂𞤫𞤱𞤪𞤵 𞤖𞤫𞤫𞤱𞤭', '𞤂𞤫𞤱𞤪𞤵 𞤔𞤢𞤢𞤧𞤭', '𞤚𞤢𞤼𞤢𞤢𞤲𞤣𞤫 𞤒', '𞤂𞤫𞤱𞤪𞤵 𞤚𞤭𞤥𞥆𞤢'],
  };
  const lang = names[language] ?? names.en;

  if (phase <= 1 || phase >= 29) return lang[0]; // New Moon
  if (phase < 7) return lang[1]; // Waxing Crescent
  if (phase <= 8) return lang[2]; // First Quarter
  if (phase < 14) return lang[3]; // Waxing Gibbous
  if (phase <= 16) return lang[4]; // Full Moon
  if (phase < 22) return lang[5]; // Waning Gibbous
  if (phase <= 23) return lang[6]; // Last Quarter
  return lang[7]; // Waning Crescent
}

export function getMoonEmoji(phase: number): string {
  if (phase <= 1 || phase >= 29) return '🌑';
  if (phase < 7) return '🌒';
  if (phase <= 8) return '🌓';
  if (phase < 14) return '🌔';
  if (phase <= 16) return '🌕';
  if (phase < 22) return '🌖';
  if (phase <= 23) return '🌗';
  return '🌘';
}

export type SupportedLanguage = 'en' | 'fr' | 'ar' | 'adlam';

export type CulturalTheme =
  | 'harmattan' | 'hivernage' | 'sahel' | 'pastoral'
  | 'fouta' | 'royal' | 'nomad'
  | 'hootonde' | 'nagge' | 'lewru' | 'naange'
  | 'maayo' | 'ladde' | 'wuro' | 'pulaaku'
  | 'kosam' | 'dental' | 'gorgal' | 'fooyre' | 'hiirde';

export type ClockSkin = 'classic' | 'nomad' | 'royal' | 'lewru' | 'metal' | 'minimal' | 'sahel' | 'fouta' | 'digital_adlam';

export interface AppSettings {
  language: SupportedLanguage;
  secondaryLanguage: SupportedLanguage;
  showSecondary: boolean;
  isDarkMode: boolean;
  hourFormat: 12 | 24;
  culturalTheme: CulturalTheme;
  clockSkin: ClockSkin;
  useAdlamScript: boolean;
}

export const defaultSettings: AppSettings = {
  language: 'fr',
  secondaryLanguage: 'en',
  showSecondary: true,
  isDarkMode: false,
  hourFormat: 24,
  culturalTheme: 'sahel',
  clockSkin: 'classic',
  useAdlamScript: false,
};

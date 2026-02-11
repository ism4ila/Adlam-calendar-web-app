import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CulturalTheme =
  | 'harmattan' | 'hivernage' | 'sahel' | 'pastoral'
  | 'fouta' | 'royal' | 'nomad'
  | 'hootonde' | 'nagge' | 'lewru' | 'naange'
  | 'maayo' | 'ladde' | 'wuro' | 'pulaaku'
  | 'kosam' | 'dental' | 'gorgal' | 'fooyre' | 'hiirde';
export type AppScript = 'adlam' | 'latin';
export type SupportedLanguage = 'adlam' | 'fr' | 'en' | 'ar';
export type ColorMode = 'light' | 'dark' | 'auto' | 'amoled';

export interface AppSettings {
  // Language & Script
  language: SupportedLanguage;
  secondaryLanguage: SupportedLanguage;
  showSecondary: boolean;
  script: AppScript;
  
  // Theme
  culturalTheme: CulturalTheme;
  colorMode: ColorMode;
  
  // Clock
  hourFormat: 12 | 24;
  clockSkin: string;
  
  // Location (for prayers)
  location?: {
    city: string;
    latitude: number;
    longitude: number;
  };
  
  // Prayer settings
  prayerMethod: string;
  prayerNotifications: boolean;
  
  // Preferences
  showAnimations: boolean;
  playSound: boolean;
}

const defaultSettings: AppSettings = {
  language: 'adlam',
  secondaryLanguage: 'fr',
  showSecondary: true,
  script: 'adlam',
  culturalTheme: 'harmattan',
  colorMode: 'auto',
  hourFormat: 24,
  clockSkin: 'classic',
  prayerMethod: 'MWL',
  prayerNotifications: true,
  showAnimations: true,
  playSound: true,
};

interface SettingsStore {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: 'acc-settings',
    }
  )
);

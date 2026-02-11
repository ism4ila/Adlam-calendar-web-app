import { useEffect } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { isRtlLanguage } from '../../utils/i18n';
import { FREE_THEME_IDS } from '../../utils/themes';
import type { CulturalTheme } from '../../store/useSettingsStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { settings, updateSettings } = useSettingsStore();
    const isPremium = useAuthStore((s) => s.isPremium);

    useEffect(() => {
        const root = document.documentElement;
        let { culturalTheme, colorMode } = settings;
        const { language } = settings;

        // Gate AMOLED mode behind premium
        if (colorMode === 'amoled' && !isPremium) {
            colorMode = 'dark';
        }

        // Gate premium themes
        if (!isPremium && !FREE_THEME_IDS.has(culturalTheme as CulturalTheme)) {
            culturalTheme = 'harmattan';
            updateSettings({ culturalTheme: 'harmattan' });
        }

        // Apply theme class
        root.setAttribute('data-theme', culturalTheme);

        // Apply RTL support
        root.setAttribute('dir', isRtlLanguage(language) ? 'rtl' : 'ltr');

        // Apply color mode
        if (colorMode === 'amoled') {
            root.classList.add('dark');
            root.setAttribute('data-amoled', 'true');
        } else if (colorMode === 'dark' || (colorMode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark');
            root.removeAttribute('data-amoled');
        } else {
            root.classList.remove('dark');
            root.removeAttribute('data-amoled');
        }
    }, [settings, isPremium, updateSettings]);

    return <>{children}</>;
}

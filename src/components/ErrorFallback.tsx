import { Link } from 'react-router-dom';
import { useSettingsStore } from '../store/useSettingsStore';
import { t } from '../utils/i18n';

export function ErrorFallback({ error, onReset }: { error?: Error; onReset: () => void }) {
    const { settings } = useSettingsStore();
    const { language } = settings;

    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">&#x26A0;</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t(language, 'error.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {error?.message || t(language, 'error.fallback')}
                </p>
                <Link
                    to="/"
                    onClick={onReset}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:opacity-90 transition-opacity inline-block"
                >
                    {t(language, 'error.returnHome')}
                </Link>
            </div>
        </div>
    );
}

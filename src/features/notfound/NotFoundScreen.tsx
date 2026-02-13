import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

function NotFoundScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                <div className="text-8xl mb-6">404</div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    {t(language, 'notFound.title')}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {t(language, 'notFound.desc')}
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                    {t(language, 'notFound.returnHome')}
                </Link>
            </motion.div>
        </div>
    );
}

export default NotFoundScreen;

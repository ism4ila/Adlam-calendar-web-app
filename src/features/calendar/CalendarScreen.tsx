import { motion } from 'framer-motion';
import Calendar from '../../components/Calendar';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

function CalendarScreen() {
    const { settings } = useSettingsStore();

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                        {t(settings.language, 'nav.calendar')}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Calendrier culturel et événements traditionnels
                    </p>
                </div>

                <Calendar language={settings.language} />
            </motion.div>
        </div>
    );
}

export default CalendarScreen;
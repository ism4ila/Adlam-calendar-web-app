import { motion } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ExternalLink, Heart, Globe, Smartphone, Mail } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

function AboutScreen() {
    const { settings } = useSettingsStore();

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <span className="text-4xl font-black text-white">AC</span>
                    </div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                        Adlam Calendar Clock
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t(settings.language, 'about.tagline')}
                    </p>
                    <p className="text-sm text-gray-500">v2.3 — Web Edition</p>
                </div>

                {/* Adlam History */}
                <Card>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                        {t(settings.language, 'about.historyTitle')}
                    </h2>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p>{t(settings.language, 'about.history1')}</p>
                        <p>{t(settings.language, 'about.history2')}</p>
                        <p>{t(settings.language, 'about.history3')}</p>
                    </div>
                </Card>

                {/* Mission */}
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-4">
                        <Heart className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                {t(settings.language, 'about.missionTitle')}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {t(settings.language, 'about.mission')}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <Globe className="w-8 h-8 text-blue-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {t(settings.language, 'about.webTitle')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t(settings.language, 'about.webDesc')}
                        </p>
                    </Card>
                    <Card>
                        <Smartphone className="w-8 h-8 text-green-500 mb-3" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {t(settings.language, 'about.mobileTitle')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t(settings.language, 'about.mobileDesc')}
                        </p>
                        <a
                            href="https://play.google.com/store/apps/details?id=com.adlam.fulfulde.calendarclock"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-green-600 hover:text-green-700"
                        >
                            Google Play Store <ExternalLink className="w-3 h-3" />
                        </a>
                    </Card>
                </div>

                {/* Contact & Credits */}
                <Card>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                        {t(settings.language, 'about.contactTitle')}
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <a href="mailto:adlamclock@gmail.com">
                            <Button variant="outline" size="sm">
                                <Mail className="w-4 h-4 mr-2" /> adlamclock@gmail.com
                            </Button>
                        </a>
                        <a
                            href="https://play.google.com/store/apps/details?id=com.adlam.fulfulde.calendarclock"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline" size="sm">
                                <Smartphone className="w-4 h-4 mr-2" /> Google Play
                            </Button>
                        </a>
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-500 space-y-1">
                    <p>{t(settings.language, 'about.credits')}</p>
                    <p className="font-adlam text-amber-600" dir="rtl">
                        𞤀𞤣𞤤𞤢𞤥 𞤑𞤢𞤤𞤫𞤲𞤣𞤢𞤪 𞤑𞤤𞤮𞤳
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default AboutScreen;

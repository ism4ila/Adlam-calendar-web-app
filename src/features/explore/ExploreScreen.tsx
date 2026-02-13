import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import {
    Clock, Calendar, Compass, Keyboard, Grid3x3, GraduationCap,
    PenTool, FileText, ArrowLeftRight,
    FileEdit, Gamepad2, Calculator, Palette, Share2, Type, Languages, Banana
} from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';
import type { LucideIcon } from 'lucide-react';

interface Feature {
    name: string;
    icon: LucideIcon;
    path: string;
    color: string;
    description: string;
}

interface Category {
    label: string;
    features: Feature[];
}

function ExploreScreen() {
    const { settings } = useSettingsStore();
    const { language } = settings;

    const categories: Category[] = [
        {
            label: t(language, 'home.category.time'),
            features: [
                { name: t(language, 'feature.clock.name'), icon: Clock, path: '/clock', color: 'from-amber-500 to-orange-600', description: t(language, 'feature.clock.desc') },
                { name: t(language, 'feature.calendar.name'), icon: Calendar, path: '/calendar', color: 'from-blue-500 to-cyan-600', description: t(language, 'feature.calendar.desc') },
                { name: t(language, 'feature.prayer.name'), icon: Compass, path: '/prayer', color: 'from-green-500 to-emerald-600', description: t(language, 'feature.prayer.desc') },
                { name: t(language, 'feature.converter.name'), icon: ArrowLeftRight, path: '/converter', color: 'from-blue-500 to-indigo-600', description: t(language, 'feature.converter.desc') },
            ],
        },
        {
            label: t(language, 'home.category.writing'),
            features: [
                { name: t(language, 'feature.editor.name'), icon: PenTool, path: '/editor', color: 'from-violet-500 to-purple-600', description: t(language, 'feature.editor.desc') },
                { name: t(language, 'feature.keyboard.name'), icon: Keyboard, path: '/keyboard', color: 'from-indigo-500 to-blue-600', description: t(language, 'feature.keyboard.desc') },
            ],
        },
        {
            label: t(language, 'home.category.learning'),
            features: [
                { name: t(language, 'feature.learning.name'), icon: GraduationCap, path: '/learning', color: 'from-teal-500 to-cyan-600', description: t(language, 'feature.learning.desc') },
            ],
        },
        {
            label: t(language, 'home.category.tools'),
            features: [
                { name: t(language, 'feature.dashboard.name'), icon: Grid3x3, path: '/dashboard', color: 'from-yellow-500 to-amber-600', description: t(language, 'feature.dashboard.desc') },
                { name: t(language, 'feature.prayerpdf.name'), icon: FileText, path: '/prayer-pdf', color: 'from-emerald-500 to-green-600', description: t(language, 'feature.prayerpdf.desc') },
            ],
        },
        {
            label: t(language, 'home.category.writing') + ' +',
            features: [
                { name: t(language, 'feature.word.name'), icon: FileEdit, path: '/word', color: 'from-orange-500 to-red-600', description: t(language, 'feature.word.desc') },
                { name: t(language, 'feature.translator.name'), icon: Languages, path: '/translator', color: 'from-cyan-500 to-blue-600', description: t(language, 'feature.translator.desc') },
                { name: t(language, 'feature.fonts.name'), icon: Type, path: '/fonts', color: 'from-slate-500 to-gray-600', description: t(language, 'feature.fonts.desc') },
            ],
        },
        {
            label: t(language, 'feature.design.name') + ' & ' + t(language, 'feature.socialcards.name'),
            features: [
                { name: t(language, 'feature.design.name'), icon: Palette, path: '/design', color: 'from-pink-500 to-rose-600', description: t(language, 'feature.design.desc') },
                { name: t(language, 'feature.socialcards.name'), icon: Share2, path: '/social-cards', color: 'from-fuchsia-500 to-purple-600', description: t(language, 'feature.socialcards.desc') },
            ],
        },
        {
            label: t(language, 'feature.games.name') + ' & ' + t(language, 'feature.calculator.name'),
            features: [
                { name: t(language, 'feature.games.name'), icon: Gamepad2, path: '/games', color: 'from-lime-500 to-green-600', description: t(language, 'feature.games.desc') },
                { name: t(language, 'feature.calculator.name'), icon: Calculator, path: '/calculator', color: 'from-sky-500 to-blue-600', description: t(language, 'feature.calculator.desc') },
                { name: t(language, 'feature.nanobanana.name'), icon: Banana, path: '/nanobanana', color: 'from-yellow-400 to-amber-500', description: t(language, 'feature.nanobanana.desc') },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-10"
                >
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                            {t(language, 'nav.explore')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">{t(language, 'home.hero.tagline')}</p>
                    </div>

                    {categories.map((cat) => (
                        <div key={cat.label}>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                                {cat.label}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {cat.features.map((feature, index) => (
                                    <motion.div
                                        key={feature.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link to={feature.path}>
                                            <Card hover className="h-full text-center group">
                                                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                                    <feature.icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                                                    {feature.name}
                                                </h3>
                                                {feature.description && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {feature.description}
                                                    </p>
                                                )}
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}

export default ExploreScreen;

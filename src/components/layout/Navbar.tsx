import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Moon, Sun, Settings, Menu, X, Info, Crown } from 'lucide-react';
import { t } from '../../utils/i18n';
import { AuthButton } from '../ui/AuthButton';

export function Navbar() {
    const location = useLocation();
    const { settings, updateSettings } = useSettingsStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen, closeMobileMenu]);

    const mainNav = [
        { name: t(settings.language, 'nav.home'), path: '/' },
        { name: t(settings.language, 'nav.clock'), path: '/clock' },
        { name: t(settings.language, 'nav.calendar'), path: '/calendar' },
        { name: t(settings.language, 'nav.prayer'), path: '/prayer' },
    ];

    const toolsNav = [
        { name: t(settings.language, 'nav.editor'), path: '/editor' },
        { name: t(settings.language, 'nav.prayerpdf'), path: '/prayer-pdf' },
        { name: t(settings.language, 'nav.converter'), path: '/converter' },
        { name: t(settings.language, 'nav.learning'), path: '/learning' },
        { name: t(settings.language, 'nav.dashboard'), path: '/dashboard' },
    ];

    const allNav = [...mainNav, ...toolsNav];

    const toggleDarkMode = () => {
        const modes: Array<typeof settings.colorMode> = ['light', 'dark', 'auto'];
        const currentIndex = modes.indexOf(settings.colorMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        updateSettings({ colorMode: nextMode });
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/icons/ic_launcher_round.webp" alt="Adlam Clock" className="h-10 w-10 rounded-xl" />
                        <span className="text-xl font-black tracking-tight hidden sm:block">
                            ADLAM<span className="text-amber-600">CLOCK</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {mainNav.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive(item.path)
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
                        {toolsNav.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive(item.path)
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <AuthButton />
                        <Link
                            to="/premium"
                            className={`p-2 rounded-lg transition-colors ${isActive('/premium')
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                                : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-amber-500'
                            }`}
                            aria-label={t(settings.language, 'nav.premium')}
                        >
                            <Crown className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {settings.colorMode === 'dark' ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                        <Link
                            to="/about"
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors hidden sm:flex"
                            aria-label={t(settings.language, 'nav.about')}
                        >
                            <Info className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/settings"
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={t(settings.language, 'nav.settings')}
                        >
                            <Settings className="w-5 h-5" />
                        </Link>
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Menu"
                            aria-expanded={mobileMenuOpen}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <div className="px-4 py-3 space-y-1">
                        {allNav.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive(item.path)
                                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/about')
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {t(settings.language, 'nav.about')}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

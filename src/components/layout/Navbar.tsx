import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Moon, Sun, Settings, Menu, X, Info, Crown, ChevronDown } from 'lucide-react';
import { t } from '../../utils/i18n';
import { AuthButton } from '../ui/AuthButton';

interface NavCategory {
    label: string;
    items: { name: string; path: string }[];
}

export function Navbar() {
    const location = useLocation();
    const { settings, updateSettings } = useSettingsStore();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (mobileMenuOpen) closeMobileMenu();
                if (openDropdown) setOpenDropdown(null);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [mobileMenuOpen, closeMobileMenu, openDropdown]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const categories: NavCategory[] = useMemo(() => [
        {
            label: t(settings.language, 'home.category.time'),
            items: [
                { name: t(settings.language, 'nav.clock'), path: '/clock' },
                { name: t(settings.language, 'nav.calendar'), path: '/calendar' },
                { name: t(settings.language, 'nav.prayer'), path: '/prayer' },
                { name: t(settings.language, 'nav.converter'), path: '/converter' },
            ],
        },
        {
            label: t(settings.language, 'home.category.writing'),
            items: [
                { name: t(settings.language, 'nav.editor'), path: '/editor' },
                { name: t(settings.language, 'feature.keyboard.name'), path: '/keyboard' },
                { name: t(settings.language, 'feature.word.name'), path: '/word' },
                { name: t(settings.language, 'feature.translator.name'), path: '/translator' },
            ],
        },
        {
            label: t(settings.language, 'home.category.learning'),
            items: [
                { name: t(settings.language, 'nav.learning'), path: '/learning' },
                { name: t(settings.language, 'feature.games.name'), path: '/games' },
                { name: t(settings.language, 'feature.nanobanana.name'), path: '/nanobanana' },
            ],
        },
        {
            label: t(settings.language, 'home.category.tools'),
            items: [
                { name: t(settings.language, 'nav.dashboard'), path: '/dashboard' },
                { name: t(settings.language, 'nav.prayerpdf'), path: '/prayer-pdf' },
                { name: t(settings.language, 'feature.calculator.name'), path: '/calculator' },
                { name: t(settings.language, 'feature.design.name'), path: '/design' },
                { name: t(settings.language, 'feature.socialcards.name'), path: '/social-cards' },
                { name: t(settings.language, 'feature.fonts.name'), path: '/fonts' },
            ],
        },
    ], [settings.language]);

    const toggleDarkMode = useCallback(() => {
        const modes: Array<typeof settings.colorMode> = ['light', 'dark', 'auto'];
        const currentIndex = modes.indexOf(settings.colorMode);
        const nextMode = modes[(currentIndex + 1) % modes.length];
        updateSettings({ colorMode: nextMode });
    }, [settings, updateSettings]);

    const isActive = (path: string) => location.pathname === path;

    const isCategoryActive = (cat: NavCategory) =>
        cat.items.some((item) => location.pathname === item.path);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src="/icons/ic_launcher_round.webp" alt="Adlam Tech Space" className="h-10 w-10 rounded-xl" />
                        <span className="text-xl font-black tracking-tight hidden sm:block">
                            ADLAM<span className="text-amber-600">TECH</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation with Dropdowns */}
                    <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/')
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {t(settings.language, 'nav.home')}
                        </Link>
                        {categories.map((cat) => (
                            <div key={cat.label} className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === cat.label ? null : cat.label)}
                                    aria-haspopup="true"
                                    aria-expanded={openDropdown === cat.label}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${isCategoryActive(cat)
                                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {cat.label}
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === cat.label ? 'rotate-180' : ''}`} />
                                </button>
                                {openDropdown === cat.label && (
                                    <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 min-w-[180px] z-50">
                                        {cat.items.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setOpenDropdown(null)}
                                                className={`block px-4 py-2 text-sm font-medium transition-colors ${isActive(item.path)
                                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
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

            {/* Mobile Menu - grouped by categories */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[70vh] overflow-y-auto">
                    <div className="px-4 py-3 space-y-1">
                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive('/')
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {t(settings.language, 'nav.home')}
                        </Link>
                        {categories.map((cat) => (
                            <div key={cat.label}>
                                <div className="px-4 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    {cat.label}
                                </div>
                                {cat.items.map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={closeMobileMenu}
                                        className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${isActive(item.path)
                                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-900 dark:text-amber-100'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        ))}
                        <Link
                            to="/about"
                            onClick={closeMobileMenu}
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

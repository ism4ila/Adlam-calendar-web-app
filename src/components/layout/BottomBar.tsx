import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, LayoutGrid, Crown } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { t } from '../../utils/i18n';

export function BottomBar() {
    const location = useLocation();
    const { settings } = useSettingsStore();

    const navigation = [
        { name: t(settings.language, 'nav.home'), path: '/', icon: Home },
        { name: t(settings.language, 'nav.explore'), path: '/explore', icon: LayoutGrid },
        { name: t(settings.language, 'nav.clock'), path: '/clock', icon: Clock },
        { name: t(settings.language, 'nav.premium'), path: '/premium', icon: Crown },
    ];

    return (
        <nav className="sticky bottom-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-bottom print:hidden" aria-label="Bottom navigation">
            <div className="flex items-center justify-around h-16 px-2">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${isActive
                                    ? 'text-amber-600 dark:text-amber-500'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

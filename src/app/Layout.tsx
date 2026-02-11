import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { BottomBar } from '../components/layout/BottomBar';
import { useMediaQuery } from '../hooks/useMediaQuery';

export function Layout() {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className="min-h-screen flex flex-col">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Content */}
            <main id="main-content" className="flex-1 overflow-x-hidden">
                <Outlet />
            </main>

            {/* Mobile Bottom Navigation */}
            {isMobile && <BottomBar />}
        </div>
    );
}

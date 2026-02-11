import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './Layout';
import { lazy, Suspense } from 'react';

const HomeScreen = lazy(() => import('../features/home/HomeScreen'));
const ClockScreen = lazy(() => import('../features/clock/ClockScreen'));
const CalendarScreen = lazy(() => import('../features/calendar/CalendarScreen'));
const PrayerScreen = lazy(() => import('../features/prayer/PrayerScreen'));
const KeyboardScreen = lazy(() => import('../features/keyboard/KeyboardScreen'));
const DashboardScreen = lazy(() => import('../features/dashboard/DashboardScreen'));
const LearningScreen = lazy(() => import('../features/learning/LearningScreen'));
const SettingsScreen = lazy(() => import('../features/settings/SettingsScreen'));
const AdlamEditorScreen = lazy(() => import('../features/editor/AdlamEditorScreen'));
const PrayerPdfScreen = lazy(() => import('../features/prayer-pdf/PrayerPdfScreen'));
const DateConverterScreen = lazy(() => import('../features/converter/DateConverterScreen'));
const AboutScreen = lazy(() => import('../features/about/AboutScreen'));
const PremiumScreen = lazy(() => import('../features/premium/PremiumScreen'));

const LoadingScreen = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
    </div>
);

export function Router() {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomeScreen />} />
                        <Route path="clock" element={<ClockScreen />} />
                        <Route path="calendar" element={<CalendarScreen />} />
                        <Route path="prayer" element={<PrayerScreen />} />
                        <Route path="keyboard" element={<KeyboardScreen />} />
                        <Route path="dashboard" element={<DashboardScreen />} />
                        <Route path="learning" element={<LearningScreen />} />
                        <Route path="settings" element={<SettingsScreen />} />
                        <Route path="editor" element={<AdlamEditorScreen />} />
                        <Route path="prayer-pdf" element={<PrayerPdfScreen />} />
                        <Route path="converter" element={<DateConverterScreen />} />
                        <Route path="about" element={<AboutScreen />} />
                        <Route path="premium" element={<PremiumScreen />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

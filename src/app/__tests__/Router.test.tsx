import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'

// Mock all stores
vi.mock('../../store/useSettingsStore', () => ({
    useSettingsStore: Object.assign(
        () => ({
            settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
            updateSettings: vi.fn(),
        }),
        { getState: () => ({ settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 } }) }
    ),
}))

vi.mock('../../store/useAuthStore', () => ({
    useAuthStore: () => ({
        user: null,
        signInWithGoogle: vi.fn(),
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => {
            const { whileTap, whileHover, initial, animate, exit, transition, ...rest } = props
            return <button {...rest}>{children}</button>
        },
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('../../hooks/useMediaQuery', () => ({
    useMediaQuery: () => false,
}))

// Mock canvas for Design/SocialCards
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    fillStyle: '',
    font: '',
    textAlign: '',
    textBaseline: '',
    direction: '',
})

// Import Layout that wraps all routes
import { Layout } from '../Layout'

// Lazy imports matching the real router
const TranslatorScreen = lazy(() => import('../../features/translator/TranslatorScreen'))
const CalculatorScreen = lazy(() => import('../../features/calculator/CalculatorScreen'))
const GamesScreen = lazy(() => import('../../features/games/GamesScreen'))
const NanoBananaScreen = lazy(() => import('../../features/nanobanana/NanoBananaScreen'))
const FontsScreen = lazy(() => import('../../features/fonts/FontsScreen'))
const DesignStudioScreen = lazy(() => import('../../features/design/DesignStudioScreen'))
const SocialCardsScreen = lazy(() => import('../../features/socialcards/SocialCardsScreen'))
const WordScreen = lazy(() => import('../../features/word/WordScreen'))
const NotFoundScreen = lazy(() => import('../../features/notfound/NotFoundScreen'))

function renderRoute(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="translator" element={<TranslatorScreen />} />
                        <Route path="calculator" element={<CalculatorScreen />} />
                        <Route path="games" element={<GamesScreen />} />
                        <Route path="nanobanana" element={<NanoBananaScreen />} />
                        <Route path="fonts" element={<FontsScreen />} />
                        <Route path="design" element={<DesignStudioScreen />} />
                        <Route path="social-cards" element={<SocialCardsScreen />} />
                        <Route path="word" element={<WordScreen />} />
                        <Route path="*" element={<NotFoundScreen />} />
                    </Route>
                </Routes>
            </Suspense>
        </MemoryRouter>
    )
}

describe('Router', () => {
    it('renders TranslatorScreen at /translator', async () => {
        renderRoute('/translator')
        await waitFor(() => expect(screen.getByText('Adlam Translator')).toBeTruthy())
    })

    it('renders CalculatorScreen at /calculator', async () => {
        renderRoute('/calculator')
        await waitFor(() => expect(screen.getByText('Adlam Calculator')).toBeTruthy())
    })

    it('renders GamesScreen at /games', async () => {
        renderRoute('/games')
        await waitFor(() => expect(screen.getByText('Adlam Games')).toBeTruthy())
    })

    it('renders NanoBananaScreen at /nanobanana', async () => {
        renderRoute('/nanobanana')
        await waitFor(() => expect(screen.getByText('NanoBanana')).toBeTruthy())
    })

    it('renders FontsScreen at /fonts', async () => {
        renderRoute('/fonts')
        await waitFor(() => expect(screen.getByText('Adlam Fonts')).toBeTruthy())
    })

    it('renders DesignStudioScreen at /design', async () => {
        renderRoute('/design')
        await waitFor(() => expect(screen.getByText('Design Studio')).toBeTruthy())
    })

    it('renders SocialCardsScreen at /social-cards', async () => {
        renderRoute('/social-cards')
        await waitFor(() => expect(screen.getByText('Social Cards')).toBeTruthy())
    })

    it('renders WordScreen at /word', async () => {
        renderRoute('/word')
        await waitFor(() => expect(screen.getByText('Adlam Word')).toBeTruthy())
    })

    it('renders NotFoundScreen for unknown routes', async () => {
        renderRoute('/this-does-not-exist')
        await waitFor(() => expect(screen.getByText('Page not found')).toBeTruthy())
    })
})

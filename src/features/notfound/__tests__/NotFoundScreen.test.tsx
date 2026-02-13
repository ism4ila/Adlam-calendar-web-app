import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
        updateSettings: vi.fn(),
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}))

import NotFoundScreen from '../NotFoundScreen'

describe('NotFoundScreen', () => {
    it('renders the 404 title', () => {
        render(
            <MemoryRouter>
                <NotFoundScreen />
            </MemoryRouter>
        )
        expect(screen.getByText('Page not found')).toBeTruthy()
    })

    it('renders description text', () => {
        render(
            <MemoryRouter>
                <NotFoundScreen />
            </MemoryRouter>
        )
        expect(screen.getByText("The page you're looking for doesn't exist.")).toBeTruthy()
    })

    it('renders a link back to home', () => {
        render(
            <MemoryRouter>
                <NotFoundScreen />
            </MemoryRouter>
        )
        const link = screen.getByText('Return Home')
        expect(link.closest('a')).toBeTruthy()
        expect(link.closest('a')?.getAttribute('href')).toBe('/')
    })
})

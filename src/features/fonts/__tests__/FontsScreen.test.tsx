import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import FontsScreen from '../FontsScreen'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, whileHover, whileTap, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
    },
}))

describe('FontsScreen', () => {
    it('renders with title', () => {
        render(<FontsScreen />)
        expect(screen.getByText('Adlam Fonts')).toBeTruthy()
    })

    it('displays Adlam sample text', () => {
        render(<FontsScreen />)
        // The default sample text includes Adlam uppercase characters
        expect(screen.getAllByText(/𞤀𞤁𞤂/).length).toBeGreaterThan(0)
    })

    it('renders 5 font style cards', () => {
        render(<FontsScreen />)
        expect(screen.getByText('Noto Sans Adlam')).toBeTruthy()
        expect(screen.getByText('Noto Sans Adlam Bold')).toBeTruthy()
        expect(screen.getByText('System Fallback')).toBeTruthy()
        expect(screen.getByText('Serif Style')).toBeTruthy()
        expect(screen.getByText('Monospace')).toBeTruthy()
    })
})

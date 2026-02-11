import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DigitalClock } from '../DigitalClock'

// Mock zustand store
vi.mock('../../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: {
            hourFormat: 12,
            script: 'latin',
            language: 'en',
            colorMode: 'light',
        },
    }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}))

describe('DigitalClock', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2024, 0, 15, 14, 30, 45)) // 2:30:45 PM
    })

    it('renders without crashing', () => {
        render(<DigitalClock />)
        // Should display time and date
        expect(screen.getByText(/02:30:45/)).toBeTruthy()
    })

    it('shows the date', () => {
        render(<DigitalClock />)
        // Date should contain "January" and "15"
        expect(screen.getByText(/january/i)).toBeTruthy()
    })

    it('renders with large size', () => {
        render(<DigitalClock size="large" />)
        expect(screen.getByText(/02:30:45/)).toBeTruthy()
    })
})

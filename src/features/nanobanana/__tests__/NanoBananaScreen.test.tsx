import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import NanoBananaScreen from '../NanoBananaScreen'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => {
            const { initial, animate, exit, transition, whileTap, whileHover, ...rest } = props
            return <div {...rest}>{children}</div>
        },
        button: ({ children, ...props }: any) => {
            const { initial, animate, exit, transition, whileTap, whileHover, ...rest } = props
            return <button {...rest}>{children}</button>
        },
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('NanoBananaScreen', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('renders idle screen with Start button', () => {
        render(<NanoBananaScreen />)
        expect(screen.getByText('NanoBanana')).toBeTruthy()
        expect(screen.getByText(/Start/)).toBeTruthy()
    })

    it('starts game when Start is clicked', () => {
        render(<NanoBananaScreen />)
        fireEvent.click(screen.getByText(/Start/))
        // Should show score and timer
        expect(screen.getByText(/Score/)).toBeTruthy()
        expect(screen.getByText(/Time/)).toBeTruthy()
    })

    it('shows 4 options when playing', () => {
        render(<NanoBananaScreen />)
        fireEvent.click(screen.getByText(/Start/))
        // There should be 4 option buttons in the grid
        const buttons = screen.getAllByRole('button')
        // Filter for option buttons (those with adlam chars, styled as options)
        // At minimum we should have more than just the start button
        expect(buttons.length).toBeGreaterThanOrEqual(4)
    })

    it('shows game over when timer expires', () => {
        render(<NanoBananaScreen />)
        fireEvent.click(screen.getByText(/Start/))
        // Advance 30 seconds
        act(() => { vi.advanceTimersByTime(31000) })
        expect(screen.getByText(/Game Over/)).toBeTruthy()
    })
})

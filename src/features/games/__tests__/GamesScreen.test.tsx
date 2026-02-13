import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import GamesScreen from '../GamesScreen'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => {
            const { whileTap, whileHover, initial, animate, exit, ...rest } = props
            return <button {...rest}>{children}</button>
        },
    },
}))

describe('GamesScreen', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    it('renders with title', () => {
        render(<GamesScreen />)
        expect(screen.getByText('Adlam Games')).toBeTruthy()
    })

    it('renders 12 cards (6 pairs)', () => {
        render(<GamesScreen />)
        // Each unflipped card shows '?'
        const questionMarks = screen.getAllByText('?')
        expect(questionMarks.length).toBe(12)
    })

    it('flips a card when clicked', () => {
        render(<GamesScreen />)
        const cards = screen.getAllByText('?')
        fireEvent.click(cards[0])
        // After click, the card should show its content (not '?')
        // The number of '?' should decrease
        const remaining = screen.getAllByText('?')
        expect(remaining.length).toBe(11)
    })

    it('increments moves counter after two cards are flipped', () => {
        render(<GamesScreen />)
        // Initially moves = 0
        expect(screen.getByText('0')).toBeTruthy()
        const cards = screen.getAllByText('?')
        fireEvent.click(cards[0])
        fireEvent.click(cards[1])
        // Moves should be 1
        expect(screen.getByText('1')).toBeTruthy()
    })

    it('has a reset button', () => {
        render(<GamesScreen />)
        expect(screen.getByText(/Play Again/)).toBeTruthy()
    })

    it('resets game when reset button is clicked', () => {
        render(<GamesScreen />)
        const cards = screen.getAllByText('?')
        fireEvent.click(cards[0])
        fireEvent.click(cards[1])
        // Wait for mismatch timeout
        act(() => { vi.advanceTimersByTime(1000) })
        const resetBtn = screen.getByText(/Play Again/)
        fireEvent.click(resetBtn)
        expect(screen.getByText('0')).toBeTruthy()
        expect(screen.getAllByText('?').length).toBe(12)
    })
})

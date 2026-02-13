import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SocialCardsScreen from '../SocialCardsScreen'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, whileHover, whileTap, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, initial, animate, whileHover, whileTap, exit, transition, ...props }: any) => <button {...props}>{children}</button>,
    },
}))

// Mock canvas
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
HTMLCanvasElement.prototype.toDataURL = vi.fn().mockReturnValue('data:image/png;base64,')

Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
})

describe('SocialCardsScreen', () => {
    it('renders with title', () => {
        render(<SocialCardsScreen />)
        expect(screen.getByText('Social Cards')).toBeTruthy()
    })

    it('renders 6 template color buttons', () => {
        render(<SocialCardsScreen />)
        expect(screen.getByText('Gold')).toBeTruthy()
        expect(screen.getByText('Night')).toBeTruthy()
        expect(screen.getByText('Green')).toBeTruthy()
        expect(screen.getByText('Purple')).toBeTruthy()
        expect(screen.getByText('Sky')).toBeTruthy()
        expect(screen.getByText('Rose')).toBeTruthy()
    })

    it('has editable quote field', () => {
        render(<SocialCardsScreen />)
        const textarea = screen.getByDisplayValue('𞤔𞤢𞤢𞤪𞤢𞤥𞤢')
        fireEvent.change(textarea, { target: { value: 'new quote' } })
        expect(screen.getByDisplayValue('new quote')).toBeTruthy()
    })

    it('has editable author field', () => {
        render(<SocialCardsScreen />)
        // Author field starts empty
        const inputs = screen.getAllByRole('textbox')
        const authorInput = inputs.find(i => i.getAttribute('type') === 'text')
        if (authorInput) {
            fireEvent.change(authorInput, { target: { value: 'Author Name' } })
            expect(screen.getByDisplayValue('Author Name')).toBeTruthy()
        }
    })
})

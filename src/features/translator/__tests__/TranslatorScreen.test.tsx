import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TranslatorScreen from '../TranslatorScreen'

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

Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
})

describe('TranslatorScreen', () => {
    it('renders with title', () => {
        render(<TranslatorScreen />)
        expect(screen.getByText('Adlam Translator')).toBeTruthy()
    })

    it('translates input text', () => {
        render(<TranslatorScreen />)
        const textarea = screen.getByPlaceholderText('...')
        fireEvent.change(textarea, { target: { value: 'abc' } })
        expect(screen.getByText('𞤢𞤦𞤷')).toBeTruthy()
    })

    it('swaps direction when swap button is clicked', () => {
        render(<TranslatorScreen />)
        const textarea = screen.getByPlaceholderText('...')
        fireEvent.change(textarea, { target: { value: 'abc' } })
        // After swap, the output (adlam) becomes input and direction reverses
        const swapBtn = screen.getByRole('button', { name: 'Swap direction' })
        fireEvent.click(swapBtn)
    })

    it('copies output to clipboard', () => {
        render(<TranslatorScreen />)
        const textarea = screen.getByPlaceholderText('...')
        fireEvent.change(textarea, { target: { value: 'a' } })
        const copyBtn = screen.getByText('Copy')
        fireEvent.click(copyBtn)
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('𞤢')
    })
})

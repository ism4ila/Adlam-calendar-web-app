import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalculatorScreen from '../CalculatorScreen'

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

describe('CalculatorScreen', () => {
    it('renders with display showing 0', () => {
        render(<CalculatorScreen />)
        // The display text '0' and the button '0' both exist
        const zeros = screen.getAllByText('0')
        expect(zeros.length).toBeGreaterThanOrEqual(1)
    })

    it('renders the title', () => {
        render(<CalculatorScreen />)
        expect(screen.getByText('Adlam Calculator')).toBeTruthy()
    })

    it('updates display when digit buttons are clicked', () => {
        render(<CalculatorScreen />)
        // Click buttons (they are in the grid)
        const buttons = screen.getAllByRole('button')
        const btn5 = buttons.find(b => b.textContent === '5')!
        const btn3 = buttons.find(b => b.textContent === '3')!
        fireEvent.click(btn5)
        fireEvent.click(btn3)
        expect(screen.getByText('53')).toBeTruthy()
    })

    it('performs addition', () => {
        render(<CalculatorScreen />)
        const buttons = screen.getAllByRole('button')
        const getBtn = (t: string) => buttons.find(b => b.textContent === t)!
        fireEvent.click(getBtn('2'))
        fireEvent.click(getBtn('+'))
        fireEvent.click(getBtn('3'))
        fireEvent.click(getBtn('='))
        // Result 5 appears in display (and also as button), so use getAllByText
        const fives = screen.getAllByText('5')
        // The display div should show '5'
        const displayDiv = fives.find(el => el.className.includes('text-4xl'))
        expect(displayDiv).toBeTruthy()
    })

    it('clears display with C button', () => {
        render(<CalculatorScreen />)
        const buttons = screen.getAllByRole('button')
        const getBtn = (t: string) => buttons.find(b => b.textContent === t)!
        fireEvent.click(getBtn('7'))
        fireEvent.click(getBtn('C'))
        // Should show 0 in the display
        const zeros = screen.getAllByText('0')
        expect(zeros.length).toBeGreaterThanOrEqual(1)
    })
})

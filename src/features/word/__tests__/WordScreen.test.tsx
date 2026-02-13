import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import WordScreen from '../WordScreen'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
    }),
}))

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => {
            const { whileTap, whileHover, ...rest } = props
            return <button {...rest}>{children}</button>
        },
    },
}))

describe('WordScreen', () => {
    it('renders with title', () => {
        render(<WordScreen />)
        expect(screen.getByText('Adlam Word')).toBeTruthy()
    })

    it('renders formatting toolbar buttons', () => {
        render(<WordScreen />)
        // Bold, Italic, Underline buttons have title attributes
        expect(screen.getByTitle('Bold')).toBeTruthy()
        expect(screen.getByTitle('Italic')).toBeTruthy()
        expect(screen.getByTitle('Underline')).toBeTruthy()
    })

    it('renders alignment buttons', () => {
        render(<WordScreen />)
        expect(screen.getByTitle('Align left')).toBeTruthy()
        expect(screen.getByTitle('Center')).toBeTruthy()
        expect(screen.getByTitle('Align right')).toBeTruthy()
    })

    it('has Adlam mode toggle', () => {
        render(<WordScreen />)
        const adlamBtn = screen.getByText('𞤀 Adlam')
        expect(adlamBtn).toBeTruthy()
    })

    it('toggles Adlam mode on click', () => {
        render(<WordScreen />)
        const adlamBtn = screen.getByText('𞤀 Adlam')
        // Initially active (amber bg)
        expect(adlamBtn.className).toContain('bg-amber-500')
        fireEvent.click(adlamBtn)
        // After click, should be inactive
        expect(adlamBtn.className).not.toContain('bg-amber-500')
    })
})

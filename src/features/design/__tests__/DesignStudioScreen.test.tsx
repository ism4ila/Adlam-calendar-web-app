import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DesignStudioScreen from '../DesignStudioScreen'

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

describe('DesignStudioScreen', () => {
    it('renders with title', () => {
        render(<DesignStudioScreen />)
        expect(screen.getByText('Design Studio')).toBeTruthy()
    })

    it('renders 8 gradient buttons', () => {
        render(<DesignStudioScreen />)
        // 8 gradients each has a button with a title
        expect(screen.getByTitle('Sunset')).toBeTruthy()
        expect(screen.getByTitle('Ocean')).toBeTruthy()
        expect(screen.getByTitle('Forest')).toBeTruthy()
        expect(screen.getByTitle('Purple')).toBeTruthy()
        expect(screen.getByTitle('Rose')).toBeTruthy()
        expect(screen.getByTitle('Night')).toBeTruthy()
        expect(screen.getByTitle('Gold')).toBeTruthy()
        expect(screen.getByTitle('Teal')).toBeTruthy()
    })

    it('has editable text field', () => {
        render(<DesignStudioScreen />)
        const textarea = screen.getByDisplayValue('𞤀𞤣𞤤𞤢𞤥')
        fireEvent.change(textarea, { target: { value: 'test' } })
        expect(screen.getByDisplayValue('test')).toBeTruthy()
    })
})

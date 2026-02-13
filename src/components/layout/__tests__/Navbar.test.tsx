import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from '../Navbar'

vi.mock('../../../store/useSettingsStore', () => ({
    useSettingsStore: () => ({
        settings: { language: 'en', colorMode: 'light', script: 'latin', hourFormat: 12 },
        updateSettings: vi.fn(),
    }),
}))

vi.mock('../../../store/useAuthStore', () => ({
    useAuthStore: () => ({
        user: null,
        signInWithGoogle: vi.fn(),
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

function renderNavbar() {
    return render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    )
}

describe('Navbar', () => {
    it('renders 4 category dropdowns', () => {
        renderNavbar()
        expect(screen.getByText('Time & Calendar')).toBeTruthy()
        expect(screen.getByText('Writing & Text')).toBeTruthy()
        // Learning appears multiple times (category + nav item), use getAllByText
        expect(screen.getAllByText('Learning').length).toBeGreaterThan(0)
        expect(screen.getByText('Tools')).toBeTruthy()
    })

    it('opens dropdown when category is clicked', () => {
        renderNavbar()
        const toolsBtn = screen.getByText('Tools')
        fireEvent.click(toolsBtn)
        // Should show items in Tools category
        expect(screen.getByText('Calculator')).toBeTruthy()
        expect(screen.getByText('Design Studio')).toBeTruthy()
    })

    it('shows correct items in Writing category', () => {
        renderNavbar()
        fireEvent.click(screen.getByText('Writing & Text'))
        expect(screen.getByText('Editor')).toBeTruthy()
        expect(screen.getByText('Adlam Word')).toBeTruthy()
        expect(screen.getByText('Translator')).toBeTruthy()
    })

    it('shows correct items in Learning category', () => {
        renderNavbar()
        // Click the Learning category button (not the nav link)
        const learningButtons = screen.getAllByText('Learning')
        // The category button is the one with ChevronDown icon
        fireEvent.click(learningButtons[0])
        expect(screen.getByText('Games')).toBeTruthy()
        expect(screen.getByText('NanoBanana')).toBeTruthy()
    })

    it('closes dropdown when an item is clicked', () => {
        renderNavbar()
        fireEvent.click(screen.getByText('Tools'))
        const calcLink = screen.getByText('Calculator')
        fireEvent.click(calcLink)
        // Dropdown should close - Design Studio should no longer be visible
        expect(screen.queryByText('Design Studio')).toBeNull()
    })
})

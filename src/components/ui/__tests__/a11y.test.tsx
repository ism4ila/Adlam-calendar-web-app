import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { Input } from '../Input'
import { Modal } from '../Modal'
import { Button } from '../Button'

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, initial, animate, whileHover, whileTap, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, initial, animate, whileHover, whileTap, exit, transition, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('a11y - Input', () => {
    it('has no a11y violations with label', async () => {
        const { container } = render(<Input label="Name" placeholder="Enter name" />)
        const results = await axe(container)
        expect(results.violations).toEqual([])
    })

    it('associates label with input via htmlFor/id', () => {
        const { container } = render(<Input label="Email" />)
        const label = container.querySelector('label')
        const input = container.querySelector('input')
        expect(label?.getAttribute('for')).toBe(input?.getAttribute('id'))
    })

    it('sets aria-invalid and aria-describedby when error', () => {
        const { container } = render(<Input label="Name" error="Required" />)
        const input = container.querySelector('input')
        expect(input?.getAttribute('aria-invalid')).toBe('true')
        expect(input?.getAttribute('aria-describedby')).toBeTruthy()
        const errorId = input?.getAttribute('aria-describedby')!
        const errorEl = container.querySelector(`#${CSS.escape(errorId)}`)
        expect(errorEl?.textContent).toBe('Required')
    })

    it('has no aria-invalid when no error', () => {
        const { container } = render(<Input label="Name" />)
        const input = container.querySelector('input')
        expect(input?.hasAttribute('aria-invalid')).toBe(false)
    })
})

describe('a11y - Modal', () => {
    it('has no a11y violations when open with title', async () => {
        const { container } = render(
            <Modal isOpen={true} onClose={() => {}} title="Test Modal">
                <p>Content</p>
            </Modal>
        )
        const results = await axe(container)
        expect(results.violations).toEqual([])
    })

    it('has role=dialog and aria-modal', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={() => {}} title="Test">
                <p>Content</p>
            </Modal>
        )
        const dialog = container.querySelector('[role="dialog"]')
        expect(dialog).toBeTruthy()
        expect(dialog?.getAttribute('aria-modal')).toBe('true')
    })

    it('connects title via aria-labelledby', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={() => {}} title="My Title">
                <p>Content</p>
            </Modal>
        )
        const dialog = container.querySelector('[role="dialog"]')
        const labelledBy = dialog?.getAttribute('aria-labelledby')
        expect(labelledBy).toBeTruthy()
        const titleEl = container.querySelector(`#${CSS.escape(labelledBy!)}`)
        expect(titleEl?.textContent).toBe('My Title')
    })

    it('close button has aria-label', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={() => {}} title="Test">
                <p>Content</p>
            </Modal>
        )
        const closeBtn = container.querySelector('button[aria-label="Close"]')
        expect(closeBtn).toBeTruthy()
    })

    it('backdrop has aria-hidden', () => {
        const { container } = render(
            <Modal isOpen={true} onClose={() => {}} title="Test">
                <p>Content</p>
            </Modal>
        )
        const backdrop = container.querySelector('[aria-hidden="true"]')
        expect(backdrop).toBeTruthy()
    })
})

describe('a11y - Button', () => {
    it('has no a11y violations', async () => {
        const { container } = render(<Button>Click me</Button>)
        const results = await axe(container)
        expect(results.violations).toEqual([])
    })

    it('sets aria-busy when loading', () => {
        const { container } = render(<Button isLoading>Save</Button>)
        const button = container.querySelector('button')
        expect(button?.getAttribute('aria-busy')).toBe('true')
    })

    it('has sr-only loading text when loading', () => {
        const { container } = render(<Button isLoading>Save</Button>)
        const srOnly = container.querySelector('.sr-only')
        expect(srOnly?.textContent).toBe('Loading')
    })

    it('does not have aria-busy when not loading', () => {
        const { container } = render(<Button>Save</Button>)
        const button = container.querySelector('button')
        expect(button?.hasAttribute('aria-busy')).toBe(false)
    })
})

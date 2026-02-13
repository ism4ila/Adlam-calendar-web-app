import { describe, it, expect } from 'vitest'
import {
    initialState, inputDigit, inputDot, clear, backspace,
    performOperation, toggleSign, percent
} from '../calcEngine'

describe('calcEngine', () => {
    describe('initialState', () => {
        it('returns display 0 with no operator', () => {
            const s = initialState()
            expect(s.display).toBe('0')
            expect(s.prevValue).toBeNull()
            expect(s.operator).toBeNull()
            expect(s.waitingForOperand).toBe(false)
        })
    })

    describe('inputDigit', () => {
        it('replaces initial 0', () => {
            const s = inputDigit(initialState(), '5')
            expect(s.display).toBe('5')
        })

        it('appends to existing digits', () => {
            const s = inputDigit({ ...initialState(), display: '12' }, '3')
            expect(s.display).toBe('123')
        })

        it('starts fresh when waiting for operand', () => {
            const s = inputDigit({ ...initialState(), waitingForOperand: true }, '7')
            expect(s.display).toBe('7')
            expect(s.waitingForOperand).toBe(false)
        })
    })

    describe('inputDot', () => {
        it('appends dot to display', () => {
            const s = inputDot(initialState())
            expect(s.display).toBe('0.')
        })

        it('does not add second dot', () => {
            const s = inputDot({ ...initialState(), display: '3.14' })
            expect(s.display).toBe('3.14')
        })

        it('starts 0. when waiting for operand', () => {
            const s = inputDot({ ...initialState(), waitingForOperand: true })
            expect(s.display).toBe('0.')
            expect(s.waitingForOperand).toBe(false)
        })
    })

    describe('clear', () => {
        it('resets to initial state', () => {
            expect(clear()).toEqual(initialState())
        })
    })

    describe('backspace', () => {
        it('removes last character', () => {
            const s = backspace({ ...initialState(), display: '123' })
            expect(s.display).toBe('12')
        })

        it('resets to 0 when single digit', () => {
            const s = backspace({ ...initialState(), display: '5' })
            expect(s.display).toBe('0')
        })
    })

    describe('performOperation', () => {
        it('performs addition', () => {
            let s = initialState()
            s = inputDigit(s, '5')
            s = performOperation(s, '+')
            s = inputDigit(s, '3')
            s = performOperation(s, '=')
            expect(s.display).toBe('8')
        })

        it('performs subtraction', () => {
            let s = initialState()
            s = inputDigit(s, '9')
            s = performOperation(s, '-')
            s = inputDigit(s, '4')
            s = performOperation(s, '=')
            expect(s.display).toBe('5')
        })

        it('performs multiplication', () => {
            let s = initialState()
            s = inputDigit(s, '6')
            s = performOperation(s, '×')
            s = inputDigit(s, '7')
            s = performOperation(s, '=')
            expect(s.display).toBe('42')
        })

        it('performs division', () => {
            let s = initialState()
            s = inputDigit(s, '8')
            s = performOperation(s, '÷')
            s = inputDigit(s, '2')
            s = performOperation(s, '=')
            expect(s.display).toBe('4')
        })

        it('handles division by zero', () => {
            let s = initialState()
            s = inputDigit(s, '5')
            s = performOperation(s, '÷')
            // display is still '5' but waitingForOperand is true, so inputDigit('0') replaces
            s = inputDigit(s, '0')
            s = performOperation(s, '=')
            expect(s.display).toBe('0')
        })

        it('chains operations', () => {
            let s = initialState()
            s = inputDigit(s, '2')
            s = performOperation(s, '+')
            s = inputDigit(s, '3')
            s = performOperation(s, '+') // should compute 2+3=5 and wait
            expect(s.display).toBe('5')
            s = inputDigit(s, '4')
            s = performOperation(s, '=') // 5+4=9
            expect(s.display).toBe('9')
        })
    })

    describe('toggleSign', () => {
        it('negates positive number', () => {
            const s = toggleSign({ ...initialState(), display: '5' })
            expect(s.display).toBe('-5')
        })

        it('makes negative number positive', () => {
            const s = toggleSign({ ...initialState(), display: '-5' })
            expect(s.display).toBe('5')
        })
    })

    describe('percent', () => {
        it('divides by 100', () => {
            const s = percent({ ...initialState(), display: '50' })
            expect(s.display).toBe('0.5')
        })
    })
})

import { describe, it, expect } from 'vitest'
import { transliterate, LATIN_TO_ADLAM, ADLAM_TO_LATIN } from '../transliterate'

describe('transliterate', () => {
    describe('latin -> adlam', () => {
        it('converts lowercase letters', () => {
            expect(transliterate('abc', 'latinToAdlam')).toBe('𞤢𞤦𞤷')
        })

        it('converts uppercase letters', () => {
            expect(transliterate('ABC', 'latinToAdlam')).toBe('𞤀𞤄𞤇')
        })

        it('converts digits', () => {
            expect(transliterate('0123456789', 'latinToAdlam')).toBe('𞥐𞥑𞥒𞥓𞥔𞥕𞥖𞥗𞥘𞥙')
        })

        it('preserves unmapped characters', () => {
            expect(transliterate('a.b!c', 'latinToAdlam')).toBe('𞤢.𞤦!𞤷')
        })

        it('handles empty string', () => {
            expect(transliterate('', 'latinToAdlam')).toBe('')
        })

        it('handles mixed case', () => {
            expect(transliterate('Hello', 'latinToAdlam')).toBe('𞤋𞤫𞤤𞤤𞤮')
        })
    })

    describe('adlam -> latin', () => {
        it('converts adlam lowercase to latin', () => {
            expect(transliterate('𞤢𞤦𞤷', 'adlamToLatin')).toBe('abc')
        })

        it('converts adlam uppercase to latin', () => {
            expect(transliterate('𞤀𞤄𞤇', 'adlamToLatin')).toBe('ABC')
        })

        it('converts adlam digits to latin', () => {
            expect(transliterate('𞥐𞥑𞥒', 'adlamToLatin')).toBe('012')
        })

        it('preserves unmapped characters', () => {
            expect(transliterate('𞤢 𞤦', 'adlamToLatin')).toBe('a b')
        })
    })

    describe('round-trip', () => {
        it('latin -> adlam -> latin preserves text', () => {
            const original = 'Hello World 123'
            const adlam = transliterate(original, 'latinToAdlam')
            const back = transliterate(adlam, 'adlamToLatin')
            expect(back).toBe(original)
        })
    })

    describe('maps', () => {
        it('LATIN_TO_ADLAM has 62 entries (26 lower + 26 upper + 10 digits)', () => {
            expect(Object.keys(LATIN_TO_ADLAM).length).toBe(62)
        })

        it('ADLAM_TO_LATIN has same count', () => {
            expect(Object.keys(ADLAM_TO_LATIN).length).toBe(62)
        })
    })
})

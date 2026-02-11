import { describe, it, expect } from 'vitest'
import { toAdlamDigits, fromAdlamDigits } from '../adlamDigits'

describe('toAdlamDigits', () => {
  it('converts single digits', () => {
    expect(toAdlamDigits('0')).toBe('𞥐')
    expect(toAdlamDigits('1')).toBe('𞥑')
    expect(toAdlamDigits('9')).toBe('𞥙')
  })

  it('converts multi-digit numbers', () => {
    expect(toAdlamDigits('12')).toBe('𞥑𞥒')
    expect(toAdlamDigits('59')).toBe('𞥕𞥙')
  })

  it('converts time strings', () => {
    expect(toAdlamDigits('14:30')).toBe('𞥑𞥔:𞥓𞥐')
    expect(toAdlamDigits('08:05')).toBe('𞥐𞥘:𞥐𞥕')
  })

  it('leaves non-digit characters unchanged', () => {
    expect(toAdlamDigits('abc')).toBe('abc')
    expect(toAdlamDigits('hello 42 world')).toBe('hello 𞥔𞥒 world')
  })

  it('handles empty string', () => {
    expect(toAdlamDigits('')).toBe('')
  })
})

describe('fromAdlamDigits', () => {
  it('converts single Adlam digits', () => {
    expect(fromAdlamDigits('𞥐')).toBe('0')
    expect(fromAdlamDigits('𞥑')).toBe('1')
    expect(fromAdlamDigits('𞥙')).toBe('9')
  })

  it('converts multi-digit Adlam numbers', () => {
    expect(fromAdlamDigits('𞥑𞥒')).toBe('12')
    expect(fromAdlamDigits('𞥕𞥙')).toBe('59')
  })

  it('round-trips correctly', () => {
    const original = '14:30'
    expect(fromAdlamDigits(toAdlamDigits(original))).toBe(original)
  })

  it('leaves non-Adlam characters unchanged', () => {
    expect(fromAdlamDigits('abc')).toBe('abc')
  })

  it('handles empty string', () => {
    expect(fromAdlamDigits('')).toBe('')
  })
})

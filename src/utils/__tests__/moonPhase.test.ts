import { describe, it, expect } from 'vitest'
import { getMoonPhase, getMoonPhaseName, getMoonEmoji } from '../moonPhase'

describe('getMoonPhase', () => {
  it('returns a value between 0 and 29', () => {
    const phase = getMoonPhase(new Date(2024, 0, 15))
    expect(phase).toBeGreaterThanOrEqual(0)
    expect(phase).toBeLessThanOrEqual(30)
  })

  it('returns different values for different dates', () => {
    const phase1 = getMoonPhase(new Date(2024, 0, 1))
    const phase2 = getMoonPhase(new Date(2024, 0, 15))
    expect(phase1).not.toBe(phase2)
  })

  it('returns consistent results for the same date', () => {
    const date = new Date(2024, 5, 22)
    expect(getMoonPhase(date)).toBe(getMoonPhase(date))
  })
})

describe('getMoonPhaseName', () => {
  it('returns English name', () => {
    const name = getMoonPhaseName(0, 'en')
    expect(name).toBe('New Moon')
  })

  it('returns French name', () => {
    const name = getMoonPhaseName(0, 'fr')
    expect(name).toBe('Nouvelle Lune')
  })

  it('returns Full Moon for phase ~15', () => {
    const name = getMoonPhaseName(15, 'en')
    expect(name).toBe('Full Moon')
  })

  it('returns First Quarter for phase ~7', () => {
    const name = getMoonPhaseName(7, 'en')
    expect(name).toBe('First Quarter')
  })

  it('falls back to English for unknown language', () => {
    const name = getMoonPhaseName(0, 'unknown')
    expect(name).toBe('New Moon')
  })
})

describe('getMoonEmoji', () => {
  it('returns new moon emoji for phase 0', () => {
    expect(getMoonEmoji(0)).toBe('🌑')
  })

  it('returns full moon emoji for phase 15', () => {
    expect(getMoonEmoji(15)).toBe('🌕')
  })

  it('returns waxing crescent for phase 3', () => {
    expect(getMoonEmoji(3)).toBe('🌒')
  })
})

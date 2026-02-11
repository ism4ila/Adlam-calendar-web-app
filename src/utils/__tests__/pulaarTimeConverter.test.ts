import { describe, it, expect } from 'vitest'
import {
  convertNumberToPulaar,
  convertNumberToAdlam,
  convertTimeToPulaar,
} from '../pulaarTimeConverter'

describe('convertNumberToPulaar', () => {
  it('converts 0', () => {
    expect(convertNumberToPulaar(0)).toBe('hoore')
  })

  it('converts units 1-10', () => {
    expect(convertNumberToPulaar(1)).toBe("go'o")
    expect(convertNumberToPulaar(5)).toBe('joy')
    expect(convertNumberToPulaar(10)).toBe('sappo')
  })

  it('converts teens 11-19', () => {
    expect(convertNumberToPulaar(11)).toBe("sappo e go'o")
    expect(convertNumberToPulaar(15)).toBe('sappo e joy')
    expect(convertNumberToPulaar(19)).toBe('sappo e jeenay')
  })

  it('converts 20', () => {
    expect(convertNumberToPulaar(20)).toBe('noogas')
  })

  it('converts 21-29', () => {
    expect(convertNumberToPulaar(21)).toBe("noogas e go'o")
    expect(convertNumberToPulaar(25)).toBe('noogas e joy')
  })

  it('converts tens 30-60', () => {
    expect(convertNumberToPulaar(30)).toBe('cappandee tati')
    expect(convertNumberToPulaar(40)).toBe('cappandee nay')
    expect(convertNumberToPulaar(50)).toBe('cappandee joy')
    expect(convertNumberToPulaar(60)).toBe('cappandee jeegom')
  })

  it('converts tens with units', () => {
    expect(convertNumberToPulaar(35)).toBe('cappandee tati e joy')
    expect(convertNumberToPulaar(42)).toBe("cappandee nay e ɗiɗi")
  })
})

describe('convertNumberToAdlam', () => {
  it('converts 0', () => {
    expect(convertNumberToAdlam(0)).toBe('𞤸𞤮𞥅𞤪𞤫')
  })

  it('converts units 1-10', () => {
    expect(convertNumberToAdlam(1)).toBe('𞤘𞤮𞥅𞤮')
    expect(convertNumberToAdlam(10)).toBe('𞤅𞤢𞤨𞥆𞤮')
  })

  it('converts teens', () => {
    const result = convertNumberToAdlam(11)
    expect(result).toContain('𞤅𞤢𞤨𞥆𞤮') // Sappo
    expect(result).toContain('𞤘𞤮𞥅𞤮') // Go'o
  })

  it('converts 20', () => {
    expect(convertNumberToAdlam(20)).toBe('𞤐𞤮𞥅𞤺𞤢𞤧')
  })
})

describe('convertTimeToPulaar', () => {
  it('converts exact hour in Latin script', () => {
    const date = new Date(2024, 0, 1, 15, 0) // 3:00 PM
    const result = convertTimeToPulaar(date, false, 12)
    expect(result).toBe('Waktu tati')
  })

  it('converts hour with minutes in Latin script', () => {
    const date = new Date(2024, 0, 1, 14, 30) // 2:30 PM
    const result = convertTimeToPulaar(date, false, 12)
    expect(result).toBe('Waktu ɗiɗi e cappandee tati')
  })

  it('converts time in Adlam script', () => {
    const date = new Date(2024, 0, 1, 15, 0) // 3:00 PM
    const result = convertTimeToPulaar(date, true, 12)
    expect(result).toContain('𞤏𞤢𞤳𞤼𞤵') // Waktu in Adlam
    expect(result).toContain('𞤚𞤢𞤼𞤭') // Tati in Adlam
  })

  it('uses 24h format when specified', () => {
    const date = new Date(2024, 0, 1, 15, 0) // 15:00
    const result = convertTimeToPulaar(date, false, 24)
    expect(result).toBe('Waktu sappo e joy') // 15 = sappo e joy
  })

  it('handles midnight in 12h format', () => {
    const date = new Date(2024, 0, 1, 0, 0) // midnight
    const result = convertTimeToPulaar(date, false, 12)
    expect(result).toContain('sappo e ɗiɗi') // 12
  })
})

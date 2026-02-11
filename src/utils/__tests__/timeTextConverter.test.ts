import { describe, it, expect } from 'vitest'
import { convertTimeInFrench } from '../timeTextConverter'

describe('convertTimeInFrench', () => {
  it('converts exact hour', () => {
    const date = new Date(2024, 0, 1, 14, 0) // 2:00 PM
    expect(convertTimeInFrench(date, 12)).toBe('deux heures')
  })

  it('converts midnight', () => {
    const date = new Date(2024, 0, 1, 0, 0)
    expect(convertTimeInFrench(date, 12)).toBe('minuit heures')
  })

  it('converts noon', () => {
    const date = new Date(2024, 0, 1, 12, 0)
    expect(convertTimeInFrench(date, 12)).toBe('midi heures')
  })

  it('converts quarter past', () => {
    const date = new Date(2024, 0, 1, 14, 15)
    expect(convertTimeInFrench(date, 12)).toBe('deux et quart')
  })

  it('converts half past', () => {
    const date = new Date(2024, 0, 1, 14, 30)
    expect(convertTimeInFrench(date, 12)).toBe('deux et demie')
  })

  it('converts quarter to', () => {
    const date = new Date(2024, 0, 1, 14, 45)
    expect(convertTimeInFrench(date, 12)).toBe('trois moins le quart')
  })

  it('converts arbitrary minutes', () => {
    const date = new Date(2024, 0, 1, 14, 25)
    expect(convertTimeInFrench(date, 12)).toBe('deux heures vingt-cinq')
  })

  it('handles 24h format', () => {
    const date = new Date(2024, 0, 1, 15, 0) // 15:00
    expect(convertTimeInFrench(date, 24)).toBe('quinze heures')
  })

  it('handles 23:45 quarter to midnight', () => {
    const date = new Date(2024, 0, 1, 23, 45)
    expect(convertTimeInFrench(date, 12)).toBe('minuit moins le quart')
  })
})

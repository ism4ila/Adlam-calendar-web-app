import { describe, it, expect } from 'vitest'
import { t, getGreetingKey, isRtlLanguage, getLocale, translations } from '../i18n'

describe('t (translation)', () => {
  it('returns English translation', () => {
    expect(t('en', 'nav.home')).toBe('Home')
  })

  it('returns French translation', () => {
    expect(t('fr', 'nav.home')).toBe('Accueil')
  })

  it('falls back to English for missing keys', () => {
    expect(t('ar', 'nav.home')).toBeDefined()
  })

  it('returns the key itself when not found in any language', () => {
    expect(t('en', 'nonexistent.key.xyz')).toBe('nonexistent.key.xyz')
  })

  it('has translations for all 4 languages', () => {
    expect(Object.keys(translations)).toEqual(['en', 'fr', 'ar', 'adlam'])
  })

  it('all languages have nav.home defined', () => {
    for (const lang of ['en', 'fr', 'ar', 'adlam'] as const) {
      expect(t(lang, 'nav.home')).not.toBe('nav.home')
    }
  })
})

describe('getGreetingKey', () => {
  it('returns night for late hours', () => {
    expect(getGreetingKey(0)).toBe('greeting.night')
    expect(getGreetingKey(3)).toBe('greeting.night')
    expect(getGreetingKey(22)).toBe('greeting.night')
    expect(getGreetingKey(23)).toBe('greeting.night')
  })

  it('returns morning for early hours', () => {
    expect(getGreetingKey(5)).toBe('greeting.morning')
    expect(getGreetingKey(8)).toBe('greeting.morning')
    expect(getGreetingKey(11)).toBe('greeting.morning')
  })

  it('returns afternoon for midday', () => {
    expect(getGreetingKey(12)).toBe('greeting.afternoon')
    expect(getGreetingKey(14)).toBe('greeting.afternoon')
    expect(getGreetingKey(16)).toBe('greeting.afternoon')
  })

  it('returns evening for late afternoon', () => {
    expect(getGreetingKey(17)).toBe('greeting.evening')
    expect(getGreetingKey(19)).toBe('greeting.evening')
    expect(getGreetingKey(20)).toBe('greeting.evening')
  })
})

describe('isRtlLanguage', () => {
  it('returns true for Arabic', () => {
    expect(isRtlLanguage('ar')).toBe(true)
  })

  it('returns true for Adlam', () => {
    expect(isRtlLanguage('adlam')).toBe(true)
  })

  it('returns false for English', () => {
    expect(isRtlLanguage('en')).toBe(false)
  })

  it('returns false for French', () => {
    expect(isRtlLanguage('fr')).toBe(false)
  })
})

describe('getLocale', () => {
  it('returns fr for French', () => {
    expect(getLocale('fr')).toBe('fr')
  })

  it('returns ar for Arabic', () => {
    expect(getLocale('ar')).toBe('ar')
  })

  it('returns en for English', () => {
    expect(getLocale('en')).toBe('en')
  })

  it('returns en for Adlam', () => {
    expect(getLocale('adlam')).toBe('en')
  })
})

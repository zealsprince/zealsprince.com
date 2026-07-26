import type { Level } from './proficiency'

export type LanguageLevel = 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic'

export interface Language {
  name: string
  level: LanguageLevel
  /** Optional emoji flag. */
  flag?: string
}

export const LANGUAGE_LEVELS: Record<LanguageLevel, Level> = {
  native: { label: 'Native', tier: 5 },
  fluent: { label: 'Fluent', tier: 4 },
  advanced: { label: 'Advanced', tier: 3 },
  intermediate: { label: 'Intermediate', tier: 2 },
  basic: { label: 'Basic', tier: 1 },
}

export const LANGUAGES: Language[] = [
  { name: 'German', level: 'native', flag: '🇩🇪' },
  { name: 'English', level: 'native', flag: '🇨🇦' },
  { name: 'French', level: 'fluent', flag: '🇫🇷' },
  { name: 'Dutch', level: 'basic', flag: '🇳🇱' },
  { name: 'Czech', level: 'basic', flag: '🇨🇿' },
]

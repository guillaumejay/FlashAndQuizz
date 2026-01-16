export interface AnswerOption {
  text: string
  isCorrect: boolean
  rationale: string
}

export interface Question {
  question: string
  hint: string
  answerOptions: AnswerOption[]
}

export interface Flashcard {
  f: string  // front (question)
  b: string  // back (answer)
}

export type GameMode = 'menu' | 'gameSelection' | 'quiz' | 'flashcard'
export type QuizState = 'start' | 'playing' | 'finished'
export type FlashcardMode = 'partial' | 'full'

export type { ContentType } from './inventory'

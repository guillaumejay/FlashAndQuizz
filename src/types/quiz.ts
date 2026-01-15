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

export type QuizState = 'start' | 'playing' | 'finished'

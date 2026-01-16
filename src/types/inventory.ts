import type { Question, Flashcard } from './quiz'

export type ContentType = 'Flash' | 'Quizz'

export interface InventoryItem {
  titre: string
  type: ContentType
  jeux: string
  url: string
}

export interface GroupedInventory {
  [jeux: string]: InventoryItem[]
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
  version: string
}

export interface CacheData {
  inventory: CacheEntry<InventoryItem[]> | null
  content: {
    [url: string]: CacheEntry<Question[] | { flashcards: Flashcard[] }>
  }
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

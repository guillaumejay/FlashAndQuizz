import type { InventoryItem, CacheEntry, CacheData } from '../types/inventory'
import type { Question, Flashcard } from '../types/quiz'

const CACHE_KEY = 'flashandquizz_cache'
const CACHE_VERSION = '1.0.0'
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

function getCache(): CacheData {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      return JSON.parse(cached)
    }
  } catch {
    // Invalid cache, return empty
  }
  return { inventory: null, content: {} }
}

function setCache(cache: CacheData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // Storage full or unavailable, silently fail
  }
}

function isExpired(entry: CacheEntry<unknown>): boolean {
  const now = Date.now()
  return now - entry.timestamp > TTL_MS || entry.version !== CACHE_VERSION
}

export function getInventory(): InventoryItem[] | null {
  const cache = getCache()
  if (cache.inventory && !isExpired(cache.inventory)) {
    return cache.inventory.data
  }
  return null
}

function isValidInventoryItem(item: unknown): item is InventoryItem {
  if (typeof item !== 'object' || item === null) return false
  const obj = item as Record<string, unknown>
  return (
    typeof obj.titre === 'string' &&
    typeof obj.type === 'string' &&
    (obj.type === 'Flash' || obj.type === 'Quizz') &&
    typeof obj.jeux === 'string' &&
    typeof obj.url === 'string' &&
    obj.url.length > 0
  )
}

export function isValidInventory(data: unknown): data is InventoryItem[] {
  if (!Array.isArray(data)) return false
  if (data.length === 0) return false
  return data.every(isValidInventoryItem)
}

export function setInventory(data: InventoryItem[]): boolean {
  if (!isValidInventory(data)) {
    return false
  }
  const cache = getCache()
  cache.inventory = {
    data,
    timestamp: Date.now(),
    version: CACHE_VERSION
  }
  setCache(cache)
  return true
}

export function getContent(url: string): Question[] | { flashcards: Flashcard[] } | null {
  const cache = getCache()
  const entry = cache.content[url]
  if (entry && !isExpired(entry)) {
    return entry.data
  }
  return null
}

export function setContent(url: string, data: Question[] | { flashcards: Flashcard[] }): void {
  const cache = getCache()
  cache.content[url] = {
    data,
    timestamp: Date.now(),
    version: CACHE_VERSION
  }
  setCache(cache)
}

export function clearAll(): void {
  try {
    localStorage.removeItem(CACHE_KEY)
  } catch {
    // Storage unavailable, silently fail
  }
}

export function getCacheTimestamp(): number | null {
  const cache = getCache()
  if (cache.inventory) {
    return cache.inventory.timestamp
  }
  return null
}

import { ref, computed } from 'vue'
import type { InventoryItem, GroupedInventory, LoadingState } from '../types/inventory'
import type { Question, Flashcard } from '../types/quiz'
import { fetchInventory, fetchContent, clearCache } from '../services/fetchService'

// State
const inventory = ref<InventoryItem[]>([])
const loadingState = ref<LoadingState>('idle')
const error = ref<string | null>(null)
const selectedGame = ref<string | null>(null)
const selectedItem = ref<InventoryItem | null>(null)
const selectedContent = ref<Question[] | Flashcard[] | null>(null)
const contentLoadingState = ref<LoadingState>('idle')
const contentError = ref<string | null>(null)

// Computed
const groupedInventory = computed<GroupedInventory>(() => {
  const grouped: GroupedInventory = {}
  for (const item of inventory.value) {
    if (!grouped[item.jeux]) {
      grouped[item.jeux] = []
    }
    grouped[item.jeux].push(item)
  }
  return grouped
})

const games = computed(() => Object.keys(groupedInventory.value).sort())

const selectedGameItems = computed(() => {
  if (!selectedGame.value) return []
  return groupedInventory.value[selectedGame.value] || []
})

// Methods
async function loadInventory(forceRefresh = false): Promise<void> {
  loadingState.value = 'loading'
  error.value = null

  const result = await fetchInventory(forceRefresh)

  if (result.data) {
    inventory.value = result.data
    loadingState.value = 'success'
    if (result.error) {
      // Partial error (using stale cache)
      error.value = result.error
    }
  } else {
    loadingState.value = 'error'
    error.value = result.error || 'Erreur inconnue'
  }
}

async function loadContent(item: InventoryItem, forceRefresh = false): Promise<void> {
  selectedItem.value = item
  contentLoadingState.value = 'loading'
  contentError.value = null

  const result = await fetchContent(item, forceRefresh)

  if (result.data) {
    // Handle both Quiz and Flashcard formats
    if (item.type === 'Flash' && 'flashcards' in result.data) {
      selectedContent.value = (result.data as { flashcards: Flashcard[] }).flashcards
    } else if (item.type === 'Quizz' && Array.isArray(result.data)) {
      selectedContent.value = result.data as Question[]
    } else {
      selectedContent.value = null
      contentError.value = 'Format de données invalide'
      contentLoadingState.value = 'error'
      return
    }
    contentLoadingState.value = 'success'
    if (result.error) {
      contentError.value = result.error
    }
  } else {
    selectedContent.value = null
    contentLoadingState.value = 'error'
    contentError.value = result.error || 'Erreur inconnue'
  }
}

function selectGame(game: string): void {
  selectedGame.value = game
  selectedItem.value = null
  selectedContent.value = null
}

function clearSelection(): void {
  selectedGame.value = null
  selectedItem.value = null
  selectedContent.value = null
  contentError.value = null
  contentLoadingState.value = 'idle'
}

function clearGameSelection(): void {
  selectedItem.value = null
  selectedContent.value = null
  contentError.value = null
  contentLoadingState.value = 'idle'
}

async function refreshAll(): Promise<void> {
  clearCache()
  selectedContent.value = null
  contentError.value = null
  contentLoadingState.value = 'idle'
  await loadInventory(true)
}

function findItemByTitle(game: string, title: string): InventoryItem | null {
  const items = groupedInventory.value[game]
  if (!items) return null
  return items.find(item => item.titre === title) || null
}

async function loadContentByTitle(game: string, title: string): Promise<boolean> {
  const item = findItemByTitle(game, title)
  if (!item) return false
  await loadContent(item)
  return contentLoadingState.value === 'success'
}

export function useGameContent() {
  return {
    // State
    inventory,
    loadingState,
    error,
    selectedGame,
    selectedItem,
    selectedContent,
    contentLoadingState,
    contentError,
    // Computed
    groupedInventory,
    games,
    selectedGameItems,
    // Methods
    loadInventory,
    loadContent,
    selectGame,
    clearSelection,
    clearGameSelection,
    refreshAll,
    findItemByTitle,
    loadContentByTitle
  }
}

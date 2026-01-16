<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { QuizState, Question, Flashcard, GameMode, FlashcardMode } from './types/quiz'
import type { InventoryItem } from './types/inventory'
import { useGameContent } from './composables/useGameContent'
import QuizQuestion from './components/QuizQuestion.vue'
import QuizResult from './components/QuizResult.vue'
import FlashcardGame from './components/FlashcardGame.vue'
import FlashcardResult from './components/FlashcardResult.vue'
import GameMenu from './components/GameMenu.vue'
import ContentMenu from './components/ContentMenu.vue'

// Game content composable
const {
  loadingState,
  error,
  selectedGame,
  selectedItem,
  selectedContent,
  contentLoadingState,
  contentError,
  games,
  selectedGameItems,
  loadInventory,
  loadContent,
  selectGame,
  clearSelection,
  clearGameSelection,
  refreshAll
} = useGameContent()

// State
const gameMode = ref<GameMode>('menu')
const quizState = ref<QuizState>('start')
const flashcardMode = ref<FlashcardMode>('full')

// Quiz state
const shuffledQuestions = ref<Question[]>([])
const currentQuestionIndex = ref(0)
const score = ref(0)

// Flashcard state
const shuffledFlashcards = ref<Flashcard[]>([])
const flashcardKnown = ref(0)
const flashcardTotal = ref(0)

// Computed
const currentQuestion = computed(() => shuffledQuestions.value[currentQuestionIndex.value])
const totalQuizQuestions = computed(() => shuffledQuestions.value.length)
// totalFlashcards computed removed - not used in template

const headerTitle = computed(() => {
  if (selectedItem.value) {
    return selectedItem.value.titre
  }
  if (selectedGame.value) {
    return selectedGame.value
  }
  return 'Flash & Quizz'
})

// Utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Game selection handlers
function handleSelectGame(game: string) {
  selectGame(game)
  gameMode.value = 'gameSelection'
}

async function handleSelectItem(item: InventoryItem) {
  await loadContent(item)
  if (contentLoadingState.value === 'success' && selectedContent.value) {
    gameMode.value = 'contentSelection'
  }
}

// Quiz functions
function startQuiz() {
  if (!selectedContent.value || selectedItem.value?.type !== 'Quizz') return
  shuffledQuestions.value = shuffleArray(selectedContent.value as Question[])
  quizState.value = 'playing'
  currentQuestionIndex.value = 0
  score.value = 0
  gameMode.value = 'quiz'
}

function handleAnswer(isCorrect: boolean) {
  if (isCorrect) {
    score.value++
  }

  if (currentQuestionIndex.value < shuffledQuestions.value.length - 1) {
    currentQuestionIndex.value++
  } else {
    quizState.value = 'finished'
  }
}

function restartQuiz() {
  if (!selectedContent.value) return
  shuffledQuestions.value = shuffleArray(selectedContent.value as Question[])
  quizState.value = 'playing'
  currentQuestionIndex.value = 0
  score.value = 0
}

// Flashcard functions
function startFlashcards(mode: FlashcardMode) {
  if (!selectedContent.value || selectedItem.value?.type !== 'Flash') return
  flashcardMode.value = mode
  const shuffled = shuffleArray(selectedContent.value as Flashcard[])
  shuffledFlashcards.value = mode === 'partial' ? shuffled.slice(0, 30) : shuffled
  flashcardKnown.value = 0
  flashcardTotal.value = shuffledFlashcards.value.length
  gameMode.value = 'flashcard'
  quizState.value = 'playing'
}

function handleFlashcardFinish(known: number, total: number) {
  flashcardKnown.value = known
  flashcardTotal.value = total
  quizState.value = 'finished'
}

function restartFlashcards() {
  startFlashcards(flashcardMode.value)
}

// Navigation
function goToMenu() {
  gameMode.value = 'menu'
  quizState.value = 'start'
  clearSelection()
}

function goToGameSelection() {
  gameMode.value = 'gameSelection'
  quizState.value = 'start'
  clearGameSelection()
}

function goToContentSelection() {
  gameMode.value = 'contentSelection'
  quizState.value = 'start'
}

async function handleRefresh() {
  await refreshAll()
}

// Load inventory on mount
onMounted(() => {
  loadInventory()
})
</script>

<template>
  <div class="min-h-screen bg-dungeon-dark text-parchment">
    <!-- Header -->
    <header class="py-6 border-b border-gold/20">
      <div class="container mx-auto px-4">
        <h1
          class="text-2xl md:text-3xl font-bold text-center cursor-pointer"
          @click="goToMenu"
        >
          <span class="text-gold">⚔️</span>
          <span class="mx-2">{{ headerTitle }}</span>
          <span class="text-gold">⚔️</span>
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">

      <!-- ==================== MAIN MENU (Game Selection) ==================== -->
      <GameMenu
        v-if="gameMode === 'menu'"
        :games="games"
        :loading-state="loadingState"
        :error="error"
        @select-game="handleSelectGame"
        @refresh="handleRefresh"
      />

      <!-- ==================== GAME SELECTION (Content List) ==================== -->
      <ContentMenu
        v-else-if="gameMode === 'gameSelection'"
        :game-name="selectedGame || ''"
        :items="selectedGameItems"
        :content-loading-state="contentLoadingState"
        :content-error="contentError"
        @select-item="handleSelectItem"
        @back="goToMenu"
      />

      <!-- ==================== CONTENT SELECTION (Start Game) ==================== -->
      <div v-else-if="gameMode === 'contentSelection'" class="max-w-2xl mx-auto text-center py-8">
        <button
          @click="goToGameSelection"
          class="text-gold hover:text-gold-light transition-colors mb-6 inline-flex items-center gap-2"
        >
          ← Retour à {{ selectedGame }}
        </button>

        <!-- Quiz Content -->
        <div v-if="selectedItem?.type === 'Quizz'" class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-8">
          <div class="text-6xl mb-4">📝</div>
          <h2 class="text-2xl font-bold text-gold mb-2">{{ selectedItem.titre }}</h2>
          <p class="text-parchment/60 text-sm mb-4">
            Questions à choix multiples avec feedback immédiat
          </p>
          <div class="bg-dungeon-dark/50 rounded-lg p-3 mb-6">
            <span class="text-gold font-bold">{{ (selectedContent as Question[])?.length || 0 }}</span>
            <span class="text-parchment/60 text-sm"> questions</span>
          </div>
          <button
            @click="startQuiz"
            class="w-full px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
          >
            🎲 Lancer le quiz
          </button>
        </div>

        <!-- Flashcard Content -->
        <div v-else-if="selectedItem?.type === 'Flash'" class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-8">
          <div class="text-6xl mb-4">🃏</div>
          <h2 class="text-2xl font-bold text-gold mb-2">{{ selectedItem.titre }}</h2>
          <p class="text-parchment/60 text-sm mb-4">
            Cartes recto-verso pour réviser
          </p>
          <div class="bg-dungeon-dark/50 rounded-lg p-3 mb-6">
            <span class="text-gold font-bold">{{ (selectedContent as Flashcard[])?.length || 0 }}</span>
            <span class="text-parchment/60 text-sm"> cartes disponibles</span>
          </div>
          <div class="space-y-2">
            <button
              v-if="(selectedContent as Flashcard[])?.length > 30"
              @click="startFlashcards('partial')"
              class="w-full px-6 py-2 bg-dungeon-light border border-gold/50 text-gold font-semibold rounded-lg transition-all duration-300 hover:bg-gold/20"
            >
              ⚡ Mode rapide (30 cartes)
            </button>
            <button
              @click="startFlashcards('full')"
              class="w-full px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
            >
              📚 Mode complet ({{ (selectedContent as Flashcard[])?.length || 0 }} cartes)
            </button>
          </div>
        </div>
      </div>

      <!-- ==================== QUIZ MODE ==================== -->
      <template v-else-if="gameMode === 'quiz'">
        <!-- Quiz Questions -->
        <QuizQuestion
          v-if="quizState === 'playing'"
          :key="currentQuestionIndex"
          :question="currentQuestion"
          :question-number="currentQuestionIndex + 1"
          :total-questions="totalQuizQuestions"
          @answer="handleAnswer"
        />

        <!-- Quiz Results -->
        <QuizResult
          v-else-if="quizState === 'finished'"
          :score="score"
          :total-questions="totalQuizQuestions"
          @restart="restartQuiz"
          @menu="goToContentSelection"
        />
      </template>

      <!-- ==================== FLASHCARD MODE ==================== -->
      <template v-else-if="gameMode === 'flashcard'">
        <!-- Flashcard Game -->
        <FlashcardGame
          v-if="quizState === 'playing'"
          :flashcards="shuffledFlashcards"
          @finish="handleFlashcardFinish"
          @quit="goToContentSelection"
        />

        <!-- Flashcard Results -->
        <FlashcardResult
          v-else-if="quizState === 'finished'"
          :known="flashcardKnown"
          :total="flashcardTotal"
          @restart="restartFlashcards"
          @menu="goToContentSelection"
        />
      </template>

    </main>

    <!-- Footer -->
    <footer class="py-4 border-t border-gold/20 mt-auto">
      <div class="container mx-auto px-4 text-center text-parchment/40 text-sm">
        Flash & Quizz - Apprentissage interactif
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QuizState, Question, Flashcard, GameMode, FlashcardMode } from './types/quiz'
import quizData from './data/quiz.json'
import flashcardData from './data/flashcards.json'
import QuizQuestion from './components/QuizQuestion.vue'
import QuizResult from './components/QuizResult.vue'
import FlashcardGame from './components/FlashcardGame.vue'
import FlashcardResult from './components/FlashcardResult.vue'

// Data
const originalQuestions = quizData as Question[]
const originalFlashcards = flashcardData as Flashcard[]

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
const totalQuizQuestions = computed(() => originalQuestions.length)
const totalFlashcards = computed(() => originalFlashcards.length)

// Utility
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Quiz functions
function startQuiz() {
  shuffledQuestions.value = shuffleArray(originalQuestions)
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
  shuffledQuestions.value = shuffleArray(originalQuestions)
  quizState.value = 'playing'
  currentQuestionIndex.value = 0
  score.value = 0
}

// Flashcard functions
function startFlashcards(mode: FlashcardMode) {
  flashcardMode.value = mode
  const shuffled = shuffleArray(originalFlashcards)
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
}
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
          <span class="mx-2">Donjon & Cie</span>
          <span class="text-gold">⚔️</span>
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">

      <!-- ==================== MAIN MENU ==================== -->
      <div v-if="gameMode === 'menu'" class="max-w-2xl mx-auto text-center py-8">
        <div class="mb-8">
          <div class="text-7xl mb-6">🏰</div>
          <h2 class="text-3xl md:text-4xl font-bold text-gold mb-4">
            Bienvenue, employé !
          </h2>
          <p class="text-lg text-parchment/70 mb-2">
            Testez vos connaissances sur le jeu de rôle
          </p>
          <p class="text-2xl font-bold text-gold-light">
            Donjon & Compagnie
          </p>
        </div>

        <p class="text-parchment/60 mb-8">
          Choisissez votre mode d'entraînement :
        </p>

        <!-- Mode Selection -->
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Quiz Card -->
          <div class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-6 hover:border-gold/60 transition-all">
            <div class="text-5xl mb-4">📝</div>
            <h3 class="text-2xl font-bold text-gold mb-2">Quiz</h3>
            <p class="text-parchment/60 text-sm mb-4">
              Questions à choix multiples avec feedback immédiat
            </p>
            <div class="bg-dungeon-dark/50 rounded-lg p-3 mb-4">
              <span class="text-gold font-bold">{{ totalQuizQuestions }}</span>
              <span class="text-parchment/60 text-sm"> questions</span>
            </div>
            <button
              @click="startQuiz"
              class="w-full px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
            >
              🎲 Lancer le quiz
            </button>
          </div>

          <!-- Flashcards Card -->
          <div class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-6 hover:border-gold/60 transition-all">
            <div class="text-5xl mb-4">🃏</div>
            <h3 class="text-2xl font-bold text-gold mb-2">Flashcards</h3>
            <p class="text-parchment/60 text-sm mb-4">
              Cartes recto-verso pour réviser les règles
            </p>
            <div class="bg-dungeon-dark/50 rounded-lg p-3 mb-4">
              <span class="text-gold font-bold">{{ totalFlashcards }}</span>
              <span class="text-parchment/60 text-sm"> cartes disponibles</span>
            </div>
            <div class="space-y-2">
              <button
                @click="startFlashcards('partial')"
                class="w-full px-6 py-2 bg-dungeon-light border border-gold/50 text-gold font-semibold rounded-lg transition-all duration-300 hover:bg-gold/20"
              >
                ⚡ Mode rapide (30 cartes)
              </button>
              <button
                @click="startFlashcards('full')"
                class="w-full px-6 py-2 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
              >
                📚 Mode complet ({{ totalFlashcards }} cartes)
              </button>
            </div>
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
          @menu="goToMenu"
        />
      </template>

      <!-- ==================== FLASHCARD MODE ==================== -->
      <template v-else-if="gameMode === 'flashcard'">
        <!-- Flashcard Game -->
        <FlashcardGame
          v-if="quizState === 'playing'"
          :flashcards="shuffledFlashcards"
          @finish="handleFlashcardFinish"
          @quit="goToMenu"
        />

        <!-- Flashcard Results -->
        <FlashcardResult
          v-else-if="quizState === 'finished'"
          :known="flashcardKnown"
          :total="flashcardTotal"
          @restart="restartFlashcards"
          @menu="goToMenu"
        />
      </template>

    </main>

    <!-- Footer -->
    <footer class="py-4 border-t border-gold/20 mt-auto">
      <div class="container mx-auto px-4 text-center text-parchment/40 text-sm">
        Basé sur le jeu de rôle Donjon & Cie
      </div>
    </footer>
  </div>
</template>

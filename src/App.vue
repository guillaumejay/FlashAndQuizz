<script setup lang="ts">
import { ref, computed } from 'vue'
import type { QuizState, Question } from './types/quiz'
import quizData from './data/quiz.json'
import QuizQuestion from './components/QuizQuestion.vue'
import QuizResult from './components/QuizResult.vue'

const originalQuestions = quizData as Question[]
const shuffledQuestions = ref<Question[]>([])

const quizState = ref<QuizState>('start')
const currentQuestionIndex = ref(0)
const score = ref(0)

const currentQuestion = computed(() => shuffledQuestions.value[currentQuestionIndex.value])
const totalQuestions = computed(() => originalQuestions.length)

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function startQuiz() {
  shuffledQuestions.value = shuffleArray(originalQuestions)
  quizState.value = 'playing'
  currentQuestionIndex.value = 0
  score.value = 0
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
  quizState.value = 'start'
  currentQuestionIndex.value = 0
  score.value = 0
}
</script>

<template>
  <div class="min-h-screen bg-dungeon-dark text-parchment">
    <!-- Header -->
    <header class="py-6 border-b border-gold/20">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl md:text-3xl font-bold text-center">
          <span class="text-gold">⚔️</span>
          <span class="mx-2">Quiz Donjon & Cie</span>
          <span class="text-gold">⚔️</span>
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <!-- Start Screen -->
      <div v-if="quizState === 'start'" class="max-w-2xl mx-auto text-center py-12">
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

        <div class="bg-dungeon-medium border border-gold/30 rounded-lg p-6 mb-8">
          <div class="grid grid-cols-2 gap-4 text-center">
            <div>
              <div class="text-3xl font-bold text-gold">{{ totalQuestions }}</div>
              <div class="text-sm text-parchment/60">Questions</div>
            </div>
            <div>
              <div class="text-3xl font-bold text-gold">4</div>
              <div class="text-sm text-parchment/60">Choix par question</div>
            </div>
          </div>
        </div>

        <p class="text-parchment/60 text-sm mb-8">
          Répondez aux questions pour prouver que vous êtes un véritable hôte d'accueil !
        </p>

        <button
          @click="startQuiz"
          class="px-10 py-4 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 hover:scale-105"
        >
          🎲 Commencer le quiz
        </button>
      </div>

      <!-- Quiz Questions -->
      <QuizQuestion
        v-else-if="quizState === 'playing'"
        :key="currentQuestionIndex"
        :question="currentQuestion"
        :question-number="currentQuestionIndex + 1"
        :total-questions="totalQuestions"
        @answer="handleAnswer"
      />

      <!-- Results -->
      <QuizResult
        v-else-if="quizState === 'finished'"
        :score="score"
        :total-questions="totalQuestions"
        @restart="restartQuiz"
      />
    </main>

    <!-- Footer -->
    <footer class="py-4 border-t border-gold/20 mt-auto">
      <div class="container mx-auto px-4 text-center text-parchment/40 text-sm">
        Quiz basé sur le jeu de rôle Donjon & Cie
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Question, AnswerOption } from '../types/quiz'

const props = defineProps<{
  question: Question
  questionNumber: number
  totalQuestions: number
}>()

const emit = defineEmits<{
  answer: [isCorrect: boolean]
}>()

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const shuffledOptions = shuffleArray(props.question.answerOptions)
const selectedAnswer = ref<AnswerOption | null>(null)
const showHint = ref(false)

const hasAnswered = computed(() => selectedAnswer.value !== null)

function selectAnswer(option: AnswerOption) {
  if (hasAnswered.value) return
  selectedAnswer.value = option
}

function submitAnswer() {
  if (selectedAnswer.value) {
    emit('answer', selectedAnswer.value.isCorrect)
  }
}

function getOptionClass(option: AnswerOption) {
  if (!hasAnswered.value) {
    return 'bg-dungeon-medium hover:bg-dungeon-light hover:border-gold cursor-pointer'
  }
  if (option.isCorrect) {
    return 'bg-emerald/20 border-emerald'
  }
  if (selectedAnswer.value === option && !option.isCorrect) {
    return 'bg-blood/20 border-blood'
  }
  return 'bg-dungeon-medium/50 opacity-60'
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto">
    <!-- Progress -->
    <div class="mb-6 text-center">
      <span class="text-gold font-semibold">Question {{ questionNumber }} / {{ totalQuestions }}</span>
      <div class="mt-2 h-2 bg-dungeon-medium rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
          :style="{ width: `${(questionNumber / totalQuestions) * 100}%` }"
        ></div>
      </div>
    </div>

    <!-- Question -->
    <div class="bg-dungeon-medium border-2 border-gold/30 rounded-lg p-6 mb-6 shadow-lg">
      <h2 class="text-xl md:text-2xl text-parchment font-semibold leading-relaxed">
        {{ question.question }}
      </h2>
    </div>

    <!-- Hint Button -->
    <div class="mb-6 text-center" v-if="!showHint">
      <button
        @click="showHint = true"
        class="text-gold/70 hover:text-gold text-sm underline underline-offset-4 transition-colors"
      >
        Afficher l'indice
      </button>
    </div>

    <!-- Hint -->
    <div
      v-if="showHint"
      class="mb-6 bg-gold/10 border border-gold/30 rounded-lg p-4 text-gold-light text-sm italic"
    >
      💡 {{ question.hint }}
    </div>

    <!-- Options -->
    <div class="space-y-3 mb-6">
      <button
        v-for="(option, index) in shuffledOptions"
        :key="index"
        @click="selectAnswer(option)"
        :disabled="hasAnswered"
        :class="[
          'w-full text-left p-4 rounded-lg border-2 transition-all duration-300',
          getOptionClass(option),
          selectedAnswer === option && !hasAnswered ? 'border-gold ring-2 ring-gold/50' : 'border-transparent'
        ]"
      >
        <div class="flex items-start gap-3">
          <span class="flex-shrink-0 w-8 h-8 rounded-full bg-dungeon-dark flex items-center justify-center text-gold font-bold text-sm">
            {{ String.fromCharCode(65 + index) }}
          </span>
          <span class="text-parchment">{{ option.text }}</span>
        </div>
      </button>
    </div>

    <!-- Rationale -->
    <div
      v-if="hasAnswered && selectedAnswer"
      class="mb-6 p-4 rounded-lg border-2"
      :class="selectedAnswer.isCorrect ? 'bg-emerald/10 border-emerald/50' : 'bg-blood/10 border-blood/50'"
    >
      <div class="flex items-center gap-2 mb-2">
        <span v-if="selectedAnswer.isCorrect" class="text-emerald font-bold">✓ Bonne réponse !</span>
        <span v-else class="text-red-400 font-bold">✗ Mauvaise réponse</span>
      </div>
      <p class="text-parchment/80 text-sm">{{ selectedAnswer.rationale }}</p>
    </div>

    <!-- Next Button -->
    <div class="text-center">
      <button
        v-if="!hasAnswered"
        @click="submitAnswer"
        :disabled="!selectedAnswer"
        class="px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/30"
      >
        Valider
      </button>
      <button
        v-else
        @click="$emit('answer', selectedAnswer!.isCorrect)"
        class="px-8 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
      >
        Question suivante →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  score: number
  totalQuestions: number
}>()

defineEmits<{
  restart: []
}>()

const percentage = computed(() => Math.round((props.score / props.totalQuestions) * 100))

const resultMessage = computed(() => {
  if (percentage.value === 100) return { title: 'Parfait !', subtitle: 'Vous êtes un expert de Donjon & Cie !' }
  if (percentage.value >= 80) return { title: 'Excellent !', subtitle: 'Vous connaissez très bien le jeu.' }
  if (percentage.value >= 60) return { title: 'Bien joué !', subtitle: 'Vous avez de bonnes connaissances.' }
  if (percentage.value >= 40) return { title: 'Pas mal !', subtitle: 'Il y a encore des choses à apprendre.' }
  return { title: 'Courage !', subtitle: 'Relisez le livre et réessayez !' }
})

const resultEmoji = computed(() => {
  if (percentage.value === 100) return '🏆'
  if (percentage.value >= 80) return '🎯'
  if (percentage.value >= 60) return '👍'
  if (percentage.value >= 40) return '📚'
  return '💪'
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto text-center">
    <!-- Trophy/Result Icon -->
    <div class="mb-8">
      <div class="text-8xl mb-4">{{ resultEmoji }}</div>
      <h2 class="text-3xl md:text-4xl font-bold text-gold mb-2">{{ resultMessage.title }}</h2>
      <p class="text-parchment/70 text-lg">{{ resultMessage.subtitle }}</p>
    </div>

    <!-- Score Display -->
    <div class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-8 mb-8 shadow-xl">
      <div class="text-6xl md:text-7xl font-bold text-gold mb-4">
        {{ score }}<span class="text-parchment/50">/</span>{{ totalQuestions }}
      </div>

      <!-- Progress Ring -->
      <div class="relative w-32 h-32 mx-auto mb-4">
        <svg class="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            stroke-width="8"
            fill="none"
            class="text-dungeon-dark"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            stroke-width="8"
            fill="none"
            :stroke-dasharray="`${percentage * 3.52} 352`"
            stroke-linecap="round"
            class="text-gold transition-all duration-1000"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-2xl font-bold text-parchment">{{ percentage }}%</span>
        </div>
      </div>

      <p class="text-parchment/60">
        Vous avez répondu correctement à {{ score }} question{{ score > 1 ? 's' : '' }} sur {{ totalQuestions }}.
      </p>
    </div>

    <!-- Restart Button -->
    <button
      @click="$emit('restart')"
      class="px-10 py-4 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-gold/30 hover:scale-105"
    >
      🔄 Recommencer le quiz
    </button>
  </div>
</template>

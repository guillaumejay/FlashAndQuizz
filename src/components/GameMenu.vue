<script setup lang="ts">
import type { LoadingState } from '../types/inventory'

defineProps<{
  games: string[]
  loadingState: LoadingState
  error: string | null
}>()

const emit = defineEmits<{
  selectGame: [game: string]
  refresh: []
}>()

function getGameIcon(game: string): string {
  // Map game names to emojis
  const icons: Record<string, string> = {
    'Donjon&Cie': '🏰',
    'default': '🎮'
  }
  return icons[game] || icons['default']
}
</script>

<template>
  <div class="max-w-2xl mx-auto text-center py-8">
    <!-- Loading State -->
    <div v-if="loadingState === 'loading'" class="py-12">
      <div class="text-5xl mb-4 animate-pulse">🎲</div>
      <p class="text-parchment/70">Chargement des jeux...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="loadingState === 'error'" class="py-8">
      <div class="text-5xl mb-4">❌</div>
      <h2 class="text-2xl font-bold text-red-400 mb-4">Erreur de chargement</h2>
      <p class="text-parchment/70 mb-6">{{ error }}</p>
      <button
        @click="emit('refresh')"
        class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
      >
        🔄 Réessayer
      </button>
    </div>

    <!-- Games List -->
    <div v-else-if="games.length > 0">
      <div class="mb-8">
        <div class="text-7xl mb-6">🎮</div>
        <h2 class="text-3xl md:text-4xl font-bold text-gold mb-4">
          Choisissez un jeu
        </h2>
        <p class="text-parchment/60">
          Sélectionnez un univers pour commencer
        </p>
      </div>

      <!-- Warning if using cache -->
      <div
        v-if="error"
        class="mb-6 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg text-yellow-200 text-sm"
      >
        ⚠️ {{ error }}
      </div>

      <!-- Games Grid -->
      <div class="grid gap-4 mb-6">
        <button
          v-for="game in games"
          :key="game"
          @click="emit('selectGame', game)"
          class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-6 hover:border-gold/60 transition-all text-left flex items-center gap-4"
        >
          <span class="text-4xl">{{ getGameIcon(game) }}</span>
          <div>
            <h3 class="text-xl font-bold text-gold">{{ game }}</h3>
            <p class="text-parchment/60 text-sm">Cliquez pour voir les contenus</p>
          </div>
        </button>
      </div>

      <!-- Refresh Button -->
      <button
        @click="emit('refresh')"
        class="px-4 py-2 text-parchment/60 hover:text-gold transition-colors text-sm"
      >
        🔄 Rafraîchir la liste
      </button>
    </div>

    <!-- Empty State -->
    <div v-else class="py-12">
      <div class="text-5xl mb-4">📭</div>
      <h2 class="text-2xl font-bold text-parchment/70 mb-4">Aucun jeu disponible</h2>
      <button
        @click="emit('refresh')"
        class="px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-dungeon-dark font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/30"
      >
        🔄 Rafraîchir
      </button>
    </div>
  </div>
</template>

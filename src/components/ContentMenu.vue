<script setup lang="ts">
import type { InventoryItem, LoadingState } from '../types/inventory'

defineProps<{
  gameName: string
  items: InventoryItem[]
  contentLoadingState: LoadingState
  contentError: string | null
}>()

const emit = defineEmits<{
  selectItem: [item: InventoryItem]
  back: []
}>()

function getTypeIcon(type: string): string {
  return type === 'Quizz' ? '📝' : '🃏'
}

function getTypeLabel(type: string): string {
  return type === 'Quizz' ? 'Quiz' : 'Flashcards'
}
</script>

<template>
  <div class="max-w-2xl mx-auto text-center py-8">
    <!-- Loading Content -->
    <div v-if="contentLoadingState === 'loading'" class="py-12">
      <div class="text-5xl mb-4 animate-pulse">📥</div>
      <p class="text-parchment/70">Chargement du contenu...</p>
    </div>

    <!-- Content List -->
    <div v-else>
      <div class="mb-8">
        <button
          @click="emit('back')"
          class="text-gold hover:text-gold-light transition-colors mb-4 inline-flex items-center gap-2"
        >
          ← Retour aux jeux
        </button>
        <h2 class="text-3xl md:text-4xl font-bold text-gold mb-2">
          {{ gameName }}
        </h2>
        <p class="text-parchment/60">
          Choisissez un contenu
        </p>
      </div>

      <!-- Error message -->
      <div
        v-if="contentError"
        class="mb-6 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-200 text-sm"
      >
        ❌ {{ contentError }}
      </div>

      <!-- Items Grid -->
      <div class="grid md:grid-cols-2 gap-4">
        <button
          v-for="item in items"
          :key="item.url"
          @click="emit('selectItem', item)"
          class="bg-dungeon-medium border-2 border-gold/30 rounded-xl p-6 hover:border-gold/60 transition-all text-left"
        >
          <div class="text-4xl mb-3">{{ getTypeIcon(item.type) }}</div>
          <h3 class="text-lg font-bold text-gold mb-1">{{ item.titre }}</h3>
          <span class="inline-block px-2 py-1 bg-dungeon-dark/50 rounded text-xs text-parchment/60">
            {{ getTypeLabel(item.type) }}
          </span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="items.length === 0" class="py-8">
        <div class="text-5xl mb-4">📭</div>
        <p class="text-parchment/60">Aucun contenu disponible pour ce jeu</p>
      </div>
    </div>
  </div>
</template>
